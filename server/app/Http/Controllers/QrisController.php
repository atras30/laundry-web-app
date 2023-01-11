<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QrisController extends Controller
{
    public function download()
    {
        return response()->download(public_path("images/qris.jpg"), "qris_cinta_laundry.jpg");
    }
}
