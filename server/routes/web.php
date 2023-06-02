<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\QrisController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return abort(404);
});

Route::get("/auth/login/google", [AuthenticationController::class, "loginByGooglePage"]);
Route::get("/auth/login/google/redirect", [AuthenticationController::class, "loginByGoogle"]);
Route::get("/download/qris-cinta-laundry", [QrisController::class, "download"]);
