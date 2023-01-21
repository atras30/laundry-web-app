<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get("/auth/users", [AuthenticationController::class, "getUser"]);
    Route::get("/customers", [CustomerController::class, "getAllCustomers"]);
    Route::get("/customers/{id}", [CustomerController::class, "getCustomerById"]);
    Route::put("/customers/{id}", [CustomerController::class, "editCustomerById"]);
    Route::delete("/customers/{id}", [CustomerController::class, "deleteCustomerById"]);
    Route::post("/customers", [CustomerController::class, "store"]);
    Route::post("/auth/logout", [AuthenticationController::class, "logout"]);
    Route::post("/orders", [OrderController::class, "order"]);
    Route::delete("/orders/{id}", [OrderController::class, "delete"]);
    Route::put("/orders/status/{id}", [OrderController::class, "updateStatus"]);
    Route::put("/orders/payment_status/{id}", [OrderController::class, "updatePaymentStatus"]);
    Route::put("/orders/notes/{id}", [OrderController::class, "updateNotes"]);
    Route::get("/expenses", [ExpenseController::class, "index"]);
    Route::post("/expenses", [ExpenseController::class, "store"]);
});

Route::post("/auth/login", [AuthenticationController::class, "login"]);
Route::get("/orders", [OrderController::class, "getAllOrders"]);
Route::get("/orders/{id}", [OrderController::class, "getOrderById"]);
Route::get("/categories", [CategoryController::class, "getAllCategory"]);
