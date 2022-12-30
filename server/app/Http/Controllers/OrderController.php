<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
        $orders = Order::with("customer")->where("id", $id)->get()->first();

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
            "weight_in_kg" => "required|numeric",
            "category" => "required|string",
            "notes" => "present",
            "payment_status" => "required|string",
            "price" => "required|numeric"
        ]);

        if (!$validated['notes']) $validated['notes'] = "";

        $order = Order::create($validated);

        return Response()->json([
            "message" => "Pesanan berhasil dibuat.",
            "order" => $order
        ], Response::HTTP_CREATED);
    }
}
