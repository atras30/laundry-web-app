<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\SubOrder;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function getAllOrders()
    {
        $page = request("page");

        $orders = Order::whereHas("customer", function ($query) {
            $filter = request("filter");
            $query->where("name", "like", "%{$filter}%");
        })
            ->with(["customer", "sub_orders"])
            ->skip(10 * $page)
            ->take(10)
            ->get()
            ->sortByDesc("created_at");

        foreach ($orders as $order) {
            foreach ($order->sub_orders as $sub_order) {
                $priceText = "";
                $category = Category::firstWhere("title", $sub_order->type);

                $priceText = "Rp " . number_format((int)$category->price, 0, ',', '.');

                if ($category->price_per_multiplied_kg) {
                    $priceText .= " / {$category->price_per_multiplied_kg} KG";
                } else if ($category->is_price_per_unit) {
                    $priceText .= " / Unit";
                } else if ($category->is_price_per_set) {
                    $priceText .= " / Set";
                } else {
                    $priceText .= " / KG";
                }

                $sub_order->price_text = $priceText;
                $sub_order->total_text = "Rp " . number_format($sub_order->total, 0, ',', '.');
            }

            // dd($order);
        }

        return Response()->json([
            "message" => "Successfully fetched orders.",
            "count" => $orders->count(),
            "isNextPageAvailable" => Order::count() > ($page + 1) * 10 ? true : false,
            "orders" => $orders
        ], Response::HTTP_OK);
    }

    public function getOrderById($id)
    {
        $order = Order::with("customer", "sub_orders")->where("id", $id)->get()->first();

        foreach ($order->sub_orders as $sub_order) {
            $priceText = "";
            $category = Category::firstWhere("title", $sub_order->type);
            $priceText = "Rp " . number_format($category->price, 0, ',', '.');

            if ($category->price_per_multiplied_kg) {
                $priceText .= " / {$category->price_per_multiplied_kg} KG";
            } else if ($category->is_price_per_unit) {
                $priceText .= " / Unit";
            } else if ($category->is_price_per_set) {
                $priceText .= " / Set";
            } else {
                $priceText .= " / KG";
            }

            $sub_order->price_text = $priceText;
            $sub_order->total_text = "Rp " . number_format($sub_order->total, 0, ',', '.');
        }


        return Response()->json([
            "message" => "Berhasil mengambil order.",
            "order" => $order
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

    public function updateNotes(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $notes = $request->notes;

        if (!$notes) {
            $notes = "";
        }

        $order->notes = $notes;
        $order->save();

        return Response()->json([
            "message" => "Berhasil mengubah catatan.",
        ], Response::HTTP_CREATED);
    }
    public function updateCreatedAt(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            "created_at" => "required"
        ]);

        $order->created_at = $request->created_at;
        $order->save();

        return Response()->json([
            "message" => "Berhasil mengubah Tanggal Masuk.",
        ], Response::HTTP_CREATED);
    }

    public function updateDoneAt(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            "done_at" => "required"
        ]);

        $order->done_at = Carbon::parse($request->done_at, "Asia/Jakarta");
        $order->save();

        return Response()->json([
            "message" => "Berhasil mengubah Tanggal Selesai.",
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
                "price_per_multiplied_kg" => Category::firstWhere("title", $validated['jenisLaundry'])->price_per_multiplied_kg,
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
