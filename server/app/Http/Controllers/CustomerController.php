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

    public function getCustomerById($id)
    {
        return response()->json([
            "message" => "Successfully fetched one customers",
            "customer" => Customer::findOrFail($id)
        ], Response::HTTP_OK);
    }

    public function deleteCustomerById($id)
    {
        Customer::firstWhere("id", $id)->delete();

        return response()->json([
            "message" => "Successfully deleted one customer",
        ], Response::HTTP_OK);
    }

    public function editCustomerById(Request $request, $id)
    {
        $validated = $request->validate([
            "name" => "required|string",
            "address" => "required|string",
            "phone_number" => "required|string",
        ]);

        $customer = Customer::findOrFail($id);

        $customer->update($validated);

        return response()->json([
            "message" => "Data customer berhasil diubah",
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
