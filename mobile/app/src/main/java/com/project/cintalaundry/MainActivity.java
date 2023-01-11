package com.project.cintalaundry;

import android.Manifest;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.dantsu.escposprinter.EscPosPrinter;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothConnection;
import com.dantsu.escposprinter.connection.bluetooth.BluetoothPrintersConnections;
import com.dantsu.escposprinter.textparser.PrinterTextParserImg;
import com.google.gson.Gson;
import com.project.cintalaundry.model.Order;
import com.project.cintalaundry.model.SubOrder;
import com.project.cintalaundry.retrofit.ApiService;

import java.io.IOException;
import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity {
    public static final int PERMISSION_BLUETOOTH = 1;
    private static final int PERMISSION_ACCESS_FINE_LOCATION = 4;
    private static final int PERMISSION_ACCESS_COARSE_LOCATION = 5;

    private final Locale locale = new Locale("id", "ID");
    private final DateFormat df = new SimpleDateFormat("dd-MMM-yyyy hh:mm:ss a", locale);
    private final NumberFormat nf = NumberFormat.getCurrencyInstance(locale);
    private Order order = null;
    public String orderId = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

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
                        if(response.isSuccessful()) {
                            order = response.body().getOrder();

                            if(order == null) {
                                Toast.makeText(MainActivity.this, "Order dengan id "+orderId+"tidak ditemukan", Toast.LENGTH_LONG).show();
                                return;
                            }

                            Log.i("order", order.toString());

                            TextView id, customerName;
                            id = findViewById(R.id.id);
                            customerName = findViewById(R.id.customer_name);

                            id.setText("ID : " + order.getId());
                            customerName.setText("Nama : " + order.getCustomer().getName());

                            Button printButton = findViewById(R.id.printButton);
                            printButton.setOnClickListener(v -> {
                                doPrint();
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

    public void doPrint() {
        Toast.makeText(this, "Mengecek ketersediaan printer...", Toast.LENGTH_SHORT).show();

        try {
            if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_DENIED) {
                    ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.BLUETOOTH_CONNECT}, 2);
                    return;
            } else if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_DENIED) {
                    ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.BLUETOOTH_SCAN}, 3);
                    return;
            } else if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.BLUETOOTH}, MainActivity.PERMISSION_BLUETOOTH);
            } else if(ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, MainActivity.PERMISSION_ACCESS_FINE_LOCATION);
            } else if(ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, MainActivity.PERMISSION_ACCESS_COARSE_LOCATION);
            } else {
                BluetoothConnection connection = BluetoothPrintersConnections.selectFirstPaired();
                if (connection != null && order != null) {
                    String subOrdersFormattedText = "";
                    for (SubOrder subOrder:order.getSub_orders()) {
                        String price = nf.format(subOrder.getPrice_per_kg());

                        if(subOrder.getIs_price_per_unit()) {
                            price += " / Unit";
                        } else if(subOrder.getPrice_per_multiplied_kg() != 0) {
                            price += " / "+subOrder.getPrice_per_multiplied_kg()+" KG";
                        } else {
                            price += " / KG";
                        }


                        subOrdersFormattedText +=
                                "[L]<b>Layanan : </b>"+subOrder.getType()+"\n" +
                                "[L]<b>Harga : </b>"+price+"\n" +
                                "[L]<b>Jumlah : </b>"+subOrder.getAmount()+"\n" +
                                "[L]<b>Sub Total : </b>"+nf.format(subOrder.getTotal())+"\n" +
                                "[C]================================\n"
                        ;
                    }

                    Log.i("Formatted Text", subOrdersFormattedText);
                    EscPosPrinter printer = new EscPosPrinter(connection, 203, 48f, 32);
                    final String text = "[C]<img>" + PrinterTextParserImg.bitmapToHexadecimalString(printer,
                            this.getApplicationContext().getResources().getDrawableForDensity(R.drawable.logo,
                                    DisplayMetrics.DENSITY_LOW, getTheme())) + "</img>\n" +
                            "[L]\n" +
                            "[L]" + df.format(new Date()) + "\n" +
                            "[C]================================\n" +
                            "[L]<b>Nama : </b>"+order.getCustomer().getName()+"\n" +
                            "[L]<b>Nomor Antrian : </b>"+order.getId()+"\n\n" +
                            "[C]================================\n" +
                            subOrdersFormattedText+"\n" +
                            "[L]<b>Total Harga : </b>"+nf.format(order.getPrice())+"\n\n" +
                            "[C]--------------------------------\n" +
                            "[C]Terimakasih telah mempercayai Cinta Laundry sebagai layanan laundry kamu ^-^\n" +
                            "[C]Untuk info lebih lanjut silahkan di cek di website kami : https://cintalaundry.atras.my.id";

                    Toast.makeText(this, "Proses print sedang berjalan, harap menunggu...", Toast.LENGTH_SHORT).show();
                    printer.printFormattedText(text);
                } else {
                    Toast.makeText(this, "No printer was connected!", Toast.LENGTH_SHORT).show();
                }
            }
        } catch (Exception e) {
            Log.e("APP", "Can't print", e);
        }
    }
}
