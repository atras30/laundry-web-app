<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\SubOrder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function getAllOrders()
    {
        $orders = Order::with("customer")->get()->sortByDesc("created_at")->values();

        // dd($orders);

        return Response()->json([
            "message" => "Successfully fetched orders.",
            "orders" => $orders
        ], Response::HTTP_OK);
    }

    public function getOrderById($id)
    {
        $orders = Order::with("customer", "subOrders")->where("id", $id)->get()->first();

        return Response()->json([
            "message" => "Berhasil mengambil order.",
            "order" => $orders
        ], Response::HTTP_OK);
    }

    public function delete($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return Response()->json([
            "message" => "Berhasil menghapus order.",
        ], Response::HTTP_OK);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $order->status = $request->status;
        $order->save();

        return Response()->json([
            "message" => "Berhasil mengubah status order.",
        ], Response::HTTP_CREATED);
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $order->payment_status = $request->payment_status;
        $order->save();

        return Response()->json([
            "message" => "Berhasil mengubah status pembayaran.",
        ], Response::HTTP_CREATED);
    }

    public function order(Request $request)
    {
        $validated = $request->validate([
            "customer_id" => "required|numeric",
            "orders" => "required|string",
            "notes" => "present",
            "payment_status" => "required|string",
            "price" => "required|numeric"
        ], [
            'customer_id.required' => 'Anda belum memilih Customer!',
        ]);

        $subOrders = json_decode($validated['orders']);
        if (count($subOrders) == 0) {
            return Response()->json([
                "message" => "Jenis layanan minimal harus ada satu",
            ], Response::HTTP_NOT_ACCEPTABLE);
        }

        if (!$validated['notes']) $validated['notes'] = "";
        $order = Order::create($validated);

        foreach ($subOrders as $subOrder) {
            $validator = Validator::make(collect($subOrder)->toArray(), [
                "jenisLaundry" => "required",
                "jumlah" => "required",
                "hargaPerKilo" => "present",
                "subTotal" => "present",
            ], [
                "jenisLaundry.required" => "Jenis Layanan dan Berat harus diisi",
                "jumlah.required" => "Jumlah harus diisi",
            ]);

            if ($validator->fails()) {
                return Response()->json([
                    "message" => $validator->errors()->first(),
                ], Response::HTTP_NOT_ACCEPTABLE);
            }

            $validated = $validator->validated();

            SubOrder::create([
                "order_id" => $order->id,
                "type" => $validated['jenisLaundry'],
                "price_per_kg" => $validated['hargaPerKilo'],
                "is_price_per_unit" => Category::firstWhere("title", $validated['jenisLaundry'])->is_price_per_unit,
                "amount" => $validated['jumlah'],
                "total" => $validated['subTotal'],
            ]);
        }

        return Response()->json([
            "message" => "Pesanan berhasil dibuat.",
            "order" => $order
        ], Response::HTTP_CREATED);
    }
}
