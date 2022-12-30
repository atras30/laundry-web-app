<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function getAllCategory()
    {
        return response()->json([
            "message" => "Berhasil mengambil semua data kategori",
            "categories" => Category::all()
        ], Response::HTTP_OK);
    }
}
