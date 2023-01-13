package com.dantsu.thermalprinter;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.dantsu.escposprinter.connection.DeviceConnection;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothConnection;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothPrintersConnections;
import com.dantsu.thermalprinter.model.Order;
import com.dantsu.thermalprinter.model.SubOrder;
import com.dantsu.thermalprinter.retrofit.ApiService;
import com.dantsu.escposprinter.textparser.PrinterTextParserImg;
import com.dantsu.thermalprinter.async.AsyncBluetoothEscPosPrint;
import com.dantsu.thermalprinter.async.AsyncEscPosPrint;
import com.dantsu.thermalprinter.async.AsyncEscPosPrinter;

import java.io.IOException;
import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {
    EditText inputCustomerName = null;
    private final Locale locale = new Locale("id", "ID");
    private final DateFormat df = new SimpleDateFormat("dd-MMM-yyyy hh:mm:ss a", locale);
    private final NumberFormat nf = NumberFormat.getCurrencyInstance(locale);
    private Order order = null;
    public String orderId = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button bluetoothBrowseButton = (Button) this.findViewById(R.id.button_bluetooth_browse);
        bluetoothBrowseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                browseBluetoothDevice();
            }
        });

        inputCustomerName = findViewById(R.id.input_customer_name);

        Button printLabelButton = findViewById(R.id.print_label_button);

        printLabelButton.setOnClickListener(v -> {
            printBluetooth("label");
        });

        Button printBluetoothButton = (Button) findViewById(R.id.button_bluetooth);
        printBluetoothButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(MainActivity.this, "Pengambilan data belum selesai, harap menunggu...", Toast.LENGTH_SHORT).show();
            }
        });

        Uri data = this.getIntent().getData();
        if (data != null && data.isHierarchical()) {
            if (data.getQueryParameter("url_param") != null) {
                orderId = data.getQueryParameter("url_param");

                orderId = orderId.substring(0, orderId.length() - 1);

                ((TextView) findViewById(R.id.id)).setText("ID : " + orderId);

//                Fetch data via Retrofit
                ApiService.endpoint().getOrder(orderId).enqueue(new Callback<Order>() {
                    @Override
                    public void onResponse(Call<Order> call, Response<Order> response) {
                        if (response.isSuccessful()) {
                            order = response.body().getOrder();

                            if (order == null) {
                                Toast.makeText(MainActivity.this, "Order dengan id " + orderId + "tidak ditemukan", Toast.LENGTH_LONG).show();
                                return;
                            }

                            Log.i("order", order.toString());

                            TextView id, customerName;
                            id = findViewById(R.id.id);
                            customerName = findViewById(R.id.customer_name);

                            id.setText("ID : " + order.getId());
                            customerName.setText("Nama Customer : " + order.getCustomer().getName());
                            inputCustomerName.setText(order.getCustomer().getName());

                            Button printBluetoothButton = (Button) findViewById(R.id.button_bluetooth);
                            printBluetoothButton.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View view) {
                                    printBluetooth("detail");
                                }
                            });
                        } else {
                            try {
                                Log.i("Error Response", response.errorBody().string());
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<Order> call, Throwable t) {
                        Toast.makeText(MainActivity.this, "Error : " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
            }
        }
    }


    /*==============================================================================================
    ======================================BLUETOOTH PART============================================
    ==============================================================================================*/

    public static final int PERMISSION_BLUETOOTH = 1;
    public static final int PERMISSION_BLUETOOTH_ADMIN = 2;
    public static final int PERMISSION_BLUETOOTH_CONNECT = 3;
    public static final int PERMISSION_BLUETOOTH_SCAN = 4;

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            switch (requestCode) {
                case MainActivity.PERMISSION_BLUETOOTH:
                case MainActivity.PERMISSION_BLUETOOTH_ADMIN:
                case MainActivity.PERMISSION_BLUETOOTH_CONNECT:
                case MainActivity.PERMISSION_BLUETOOTH_SCAN:
//                    this.printBluetooth();
                    break;
            }
        }
    }

    private BluetoothConnection selectedDevice;

    public void browseBluetoothDevice() {
        final BluetoothConnection[] bluetoothDevicesList = (new BluetoothPrintersConnections()).getList();

        if (bluetoothDevicesList != null) {
            final String[] items = new String[bluetoothDevicesList.length + 1];
            items[0] = "Default printer";
            int i = 0;
            for (BluetoothConnection device : bluetoothDevicesList) {
                if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.BLUETOOTH_CONNECT}, PERMISSION_BLUETOOTH_CONNECT);
                    return;
                }
                items[++i] = device.getDevice().getName();
            }

            AlertDialog.Builder alertDialog = new AlertDialog.Builder(MainActivity.this);
            alertDialog.setTitle("Bluetooth printer selection");
            alertDialog.setItems(items, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    int index = i - 1;
                    if (index == -1) {
                        selectedDevice = null;
                    } else {
                        selectedDevice = bluetoothDevicesList[index];
                    }
                    Button button = (Button) findViewById(R.id.button_bluetooth_browse);
                    button.setText(items[i]);
                }
            });

            AlertDialog alert = alertDialog.create();
            alert.setCanceledOnTouchOutside(false);
            alert.show();

        }
    }

    public void printBluetooth(String action) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.BLUETOOTH}, MainActivity.PERMISSION_BLUETOOTH);
        } else if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_ADMIN) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.BLUETOOTH_ADMIN}, MainActivity.PERMISSION_BLUETOOTH_ADMIN);
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.BLUETOOTH_CONNECT}, MainActivity.PERMISSION_BLUETOOTH_CONNECT);
        } else if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S && ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.BLUETOOTH_SCAN}, MainActivity.PERMISSION_BLUETOOTH_SCAN);
        } else {
            switch(action) {
                case "label" :
                    if(inputCustomerName.getText().toString().length() == 0) {
                        Toast.makeText(this, "Nama customer belum diisi.", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    new AsyncBluetoothEscPosPrint(
                            this,
                            new AsyncEscPosPrint.OnPrintFinished() {
                                @Override
                                public void onError(AsyncEscPosPrinter asyncEscPosPrinter, int codeException) {
                                    Log.e("Async.OnPrintFinished", "AsyncEscPosPrint.OnPrintFinished : An error occurred !");
                                }

                                @Override
                                public void onSuccess(AsyncEscPosPrinter asyncEscPosPrinter) {
                                    Log.i("Async.OnPrintFinished", "AsyncEscPosPrint.OnPrintFinished : Print is finished !");
                                }
                            }
                    ).execute(this.printLabel(selectedDevice));
                    break;
                case "detail" :
                    new AsyncBluetoothEscPosPrint(
                            this,
                            new AsyncEscPosPrint.OnPrintFinished() {
                                @Override
                                public void onError(AsyncEscPosPrinter asyncEscPosPrinter, int codeException) {
                                    Log.e("Async.OnPrintFinished", "AsyncEscPosPrint.OnPrintFinished : An error occurred !");
                                }

                                @Override
                                public void onSuccess(AsyncEscPosPrinter asyncEscPosPrinter) {
                                    Log.i("Async.OnPrintFinished", "AsyncEscPosPrint.OnPrintFinished : Print is finished !");
                                }
                            }
                    ).execute(this.getAsyncEscPosPrinter(selectedDevice));
                    break;
                default:
                    Toast.makeText(this, "Unknown action", Toast.LENGTH_SHORT).show();;
                    return;
            }
        }
    }

    /*==============================================================================================
    ===================================ESC/POS PRINTER PART=========================================
    ==============================================================================================*/

    public AsyncEscPosPrinter printLabel(DeviceConnection printerConnection) {
        AsyncEscPosPrinter printer = new AsyncEscPosPrinter(printerConnection, 203, 48f, 32);

        return printer.addTextToPrint(
                        "[L]" + df.format(new Date()) + "\n" +
                        "[C]================================\n" +
                        "[C]<font size='big-2'>" + inputCustomerName.getText().toString() + "</font>\n" +
                        "[C]================================\n"
        );
    }

    /**
     * Asynchronous printing
     */
    @SuppressLint("SimpleDateFormat")
    public AsyncEscPosPrinter getAsyncEscPosPrinter(DeviceConnection printerConnection) {
        SimpleDateFormat format = new SimpleDateFormat("'on' yyyy-MM-dd 'at' HH:mm:ss");
        AsyncEscPosPrinter printer = new AsyncEscPosPrinter(printerConnection, 203, 48f, 32);

        String subOrdersFormattedText = "";
        for (SubOrder subOrder : order.getSub_orders()) {
            String price = nf.format(subOrder.getPrice_per_kg());

            if (subOrder.getIs_price_per_unit()) {
                price += " / Unit";
            } else if (subOrder.getPrice_per_multiplied_kg() != 0) {
                price += " / " + subOrder.getPrice_per_multiplied_kg() + " KG";
            } else {
                price += " / KG";
            }

            subOrdersFormattedText +=
                    "[L]<b>Layanan : </b>" + subOrder.getType() + "\n" +
                            "[L]<b>Harga : </b>" + price + "\n" +
                            "[L]<b>Jumlah : </b>" + subOrder.getAmount() + "\n" +
                            "[L]<b>Sub Total : </b>" + nf.format(subOrder.getTotal()) + "\n" +
                            "[C]================================\n"
            ;
        }

        return printer.addTextToPrint(
                "[C]<img>" + PrinterTextParserImg.bitmapToHexadecimalString(printer, this.getApplicationContext().getResources().getDrawableForDensity(R.drawable.logo, DisplayMetrics.DENSITY_MEDIUM)) + "</img>\n" +
                        "[L]\n" +
                        "[L]" + df.format(new Date()) + "\n" +
                        "[C]================================\n" +
                        "[L]<b>Nama : </b>" + order.getCustomer().getName() + "\n" +
                        "[L]<b>Alamat : </b>" + order.getCustomer().getAddress() + "\n" +
                        "[L]<b>Nomor Antrian : </b>" + order.getId() + "\n\n" +
                        "[C]================================\n" +
                        subOrdersFormattedText + "\n" +
                        "[L]<b>Catatan : </b>" + order.getNotes() + "\n" +
                        "[L]<b>Total Harga : </b>" + nf.format(order.getPrice()) + "\n\n" +
                        "[C]--------------------------------\n" +
                        "[C]Terimakasih telah mempercayai Cinta Laundry sebagai layanan laundry kamu ^-^\n" +
                        "[C]Website : https://cintalaundry.atras.my.id"
        );
    }
}
