<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\OrderController;
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

//Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentications
    Route::prefix("/auth")->group(function () {
        Route::get("/users", [AuthenticationController::class, "getUser"]);
        Route::post("/logout", [AuthenticationController::class, "logout"]);
    });

    // Customers
    Route::prefix("/customers")->group(function () {
        Route::get("/", [CustomerController::class, "getAllCustomers"]);
        Route::post("/", [CustomerController::class, "store"]);

        Route::get("/{id}", [CustomerController::class, "getCustomerById"]);
        Route::put("/{id}", [CustomerController::class, "editCustomerById"]);
        Route::delete("/{id}", [CustomerController::class, "deleteCustomerById"]);
    });

    // Orders
    Route::prefix("/orders")->group(function () {
        // GET
        Route::get("/", [OrderController::class, "getAllOrders"]);

        // POST
        Route::post("/", [OrderController::class, "order"]);

        // PUT
        Route::put("/status/{id}", [OrderController::class, "updateStatus"]);
        Route::put("/payment_status/{id}", [OrderController::class, "updatePaymentStatus"]);
        Route::put("/notes/{id}", [OrderController::class, "updateNotes"]);
        Route::put("/created_at/{id}", [OrderController::class, "updateCreatedAt"]);
        Route::put("/done_at/{id}", [OrderController::class, "updateDoneAt"]);

        // DELETE
        Route::delete("/{id}", [OrderController::class, "delete"]);
    });

    // Order Photos
    Route::prefix("/orders/photos")->group(function () {
        // Get route is public.
        Route::post("/", [OrderController::class, "uploadPhoto"]);
        Route::delete("/{id}", [OrderController::class, "deletePhoto"]);
    });

    // Expenses
    Route::prefix("/expenses")->group(function () {
        Route::get("/", [ExpenseController::class, "index"]);
        Route::post("/", [ExpenseController::class, "store"]);
        Route::delete("/{id}", [ExpenseController::class, "destroy"]);
    });
});

//Public Routes
Route::prefix("/auth")->group(function () {
    Route::post("login", [AuthenticationController::class, "login"]);
});

Route::prefix("/orders")->group(function () {
    Route::get("/{id}", [OrderController::class, "getOrderById"]);
});

Route::prefix("/orders/photos")->group(function () {
    Route::get("/{orderId}", [OrderController::class, "getPhoto"]);
});

Route::prefix("/categories")->group(function () {
    Route::get("/", [CategoryController::class, "getAllCategory"]);
});
