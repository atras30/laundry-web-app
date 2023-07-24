<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderUpload;
use App\Models\SubOrder;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class OrderController extends Controller
{
    public function getAllOrders(Request $request)
    {
        if ($request->currentPage == "" || $request->currentPage == null) throw new \InvalidArgumentException("Current page cannot be empty.");

        $paginationLimit = 50;

        // Init query
        $orders = Order::with("customer:id,name,address")->with("sub_orders")->select("id", "customer_id", "price", "notes", "status", "payment_status", "created_at", "done_at");

        // Search Query
        if (!empty($request->search)) $orders->whereHas("customer", function ($query) use ($request) {
            $query->where("name", "like", "%{$request->search}%");
        });

        // Status Query
        if (!empty($request->status)) $orders->where("status", $request->status);

        // Status Payment Query
        if (!empty($request->statusPayment)) $orders->where("payment_status", $request->statusPayment);

        // Pagination
        $totalData = $orders->count();
        $orders = $orders->offset($paginationLimit * ($request->currentPage - 1))->limit($paginationLimit)->orderBy("created_at", "DESC")->get();
        $recordCount = $orders->count();
        $hasNextPage = $request->currentPage * $paginationLimit < $totalData;
        $currentTotalData = $request->currentPage * $paginationLimit < $totalData ? $request->currentPage * $paginationLimit : ($request->currentPage - 1) * $paginationLimit + $recordCount;

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
        }

        return Response()->json([
            "message" => "Successfully fetched orders.",
            "total" => $totalData,
            "count" => $recordCount,
            "hasNextPage" => $hasNextPage,
            "currentTotalData" => $currentTotalData,
            "orders" => $orders,
        ], Response::HTTP_OK);
    }

    public function getOrderById($id)
    {
        $order = Order::with("customer", "sub_orders")->where("id", $id)->get()->first();

        if ($order === null) return Response()->json([
            "message" => "Order not found"
        ], Response::HTTP_NOT_FOUND);

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

        $order['image_path'] = url(asset("storage/" . $order->upload_path));

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

    public function getPhoto(Request $request, $orderId)
    {
        $request['orderId'] = $orderId;

        $request->validate([
            "orderId" => [
                "required",
                Rule::exists("orders", "id")
            ],
        ], [
            "orderId.exists" => "Order is not exists",
        ]);

        $s3BaseUrl = env("S3_ENDPOINT");
        if ($s3BaseUrl == null) return response()->json([
            "message" => "S3_ENDPOINT is not set yet"
        ], Response::HTTP_INTERNAL_SERVER_ERROR);

        $photo_path = OrderUpload::where("order_id", $orderId)
            ->get()
            ->map(function ($record) use ($s3BaseUrl) {
                return [
                    "upload_path" => $s3BaseUrl . $record->upload_path,
                    "id" => $record->id,
                    "description" => $record->description,
                    "created_at" =>
                    //Hari, tanggal bulan tahun jam:menit:detik
                    $record->created_at->locale('id')->dayName . ", " .
                        $record->created_at->day . " " .
                        $record->created_at->monthName . " " .
                        $record->created_at->year . " " .
                        sprintf('%02d', $record->created_at->hour) . ":" .
                        sprintf('%02d', $record->created_at->minute) . ":" .
                        sprintf('%02d', $record->created_at->second)
                ];
            });

        return $photo_path;
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            "photo" => 'required|mimes:png,jpg,jpeg|max:4096',
            "customerId" => [
                "required",
                Rule::exists("customers", "id")
            ],
            "orderId" => [
                "required",
                Rule::exists("orders", "id")
            ]
        ], [
            "customerId.exists" => "Customer is not exists",
            "orderId.exists" => "Order is not exists",
        ]);

        try {
            $this->storePhoto($request->file('photo'), $request->customerId, $request->orderId, $request->description);
        } catch (\Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json([
            "message" => "Add Photo Success"
        ], Response::HTTP_OK);
    }

    public function storePhoto($photo, $customerId, $orderId, $description)
    {
        // Validation
        $s3bucket = env("S3_BUCKET");
        $currentEnvirontment = env("APP_ENV");
        if ($s3bucket == null) throw new \Exception("S3_BUCKET is not configured.");
        if ($currentEnvirontment == null) throw new \Exception("APP_ENV is not configured.");

        // Store Photo to s3
        $uuid = Uuid::uuid4()->toString();
        $path = Storage::disk("s3")->putFileAs("{$currentEnvirontment}/order_uploads/photos", $photo, "customer_id_{$customerId}_order_id_{$orderId}_UUID_{$uuid}.jpg");
        $path = "{$s3bucket}/{$path}";

        try {
            // Store uploaded photo path to database
            OrderUpload::create([
                "order_id" => $orderId,
                "upload_path" => $path,
                "description" => $description ?? ""
            ]);
        } catch (\Exception $e) {
            throw $e;
        }

        return $path;
    }

    public function deletePhoto(Request $request, $id)
    {
        $request['id'] = $id;

        $request->validate([
            "id" => [
                "required",
                Rule::exists("order_uploads", "id")
            ],
        ], [
            "id.exists" => "Photo is not exists",
        ]);

        if (!$id) return response()->json([
            "message" => "ID must be filled."
        ], Response::HTTP_NOT_ACCEPTABLE);

        $orderUpload = OrderUpload::find($id);
        if (!$orderUpload) return response()->json([
            "message" => "Record not found."
        ], Response::HTTP_OK);

        try {
            $s3bucket = env("S3_BUCKET");
            if ($s3bucket == null) return response()->json([
                "message" => "S3_BUCKET is not configured yet."
            ], Response::HTTP_INTERNAL_SERVER_ERROR);

            $storagePath = str_replace($s3bucket, "", $orderUpload->upload_path);
            Storage::disk("s3")->delete($storagePath);

            $orderUpload->delete();
        } catch (\Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], Response::HTTP_OK);
        }

        return response()->json([
            "message" => "Delete Photo Success"
        ], Response::HTTP_OK);
    }

    public function order(Request $request)
    {
        $validated = $request->validate([
            "customer_id" => "required|numeric",
            "orders" => "required|string",
            "notes" => "present",
            "payment_status" => "required|string",
            "price" => "required|numeric",
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
