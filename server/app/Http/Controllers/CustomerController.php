<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CustomerController extends Controller
{
    public function getAllCustomers()
    {
        return response()->json([
            "message" => "Successfully fetched all customers",
            "customers" => Customer::all()
        ], Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "address" => "required|string",
            "phone_number" => "required|string",
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            "message" => "Berhasil mendaftarkan customer.",
            "customer" => $customer
        ], Response::HTTP_OK);
    }
}
