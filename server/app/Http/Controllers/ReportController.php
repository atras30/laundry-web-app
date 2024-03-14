<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReportController extends Controller
{
    public function getExpenseReport(Request $request) {
        try {
            $orders = Order::with("customer")->whereMonth('created_at', $request->month)
            ->whereYear('created_at', $request->year)
            ->get();

            return response()->json([
                "message" => "Successfully get data",
                "total_data" => $orders->count(),
                "data" => $orders,
            ],Response::HTTP_OK);
        } catch(\Exception $exception) {
            return response()->json([
                "message" => $exception->getMessage()
            ],Response::HTTP_BAD_REQUEST);
        }
    }
}
