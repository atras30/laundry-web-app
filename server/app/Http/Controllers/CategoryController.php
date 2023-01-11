<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function getAllCategory()
    {
        $categories = Category::all();

        foreach ($categories as $category) {
            $priceText = "";
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

            $category->price_text = $priceText;
        }

        return response()->json([
            "message" => "Berhasil mengambil semua data kategori",
            "categories" => $categories->sortBy("title")->values()
        ], Response::HTTP_OK);
    }
}
