<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::create([
            "title" => "Cuci Kering Setrika",
            "price" => 7000,
        ]);
        Category::create([
            "title" => "Cuci Kering",
            "price" => 22000,
            "price_per_multiplied_kg" => 6,
        ]);
        Category::create([
            "title" => "Cuci Kering Lipat",
            "price" => 25000,
            "price_per_multiplied_kg" => 6,
        ]);
        Category::create([
            "title" => "Setrika",
            "price" => 4500,
        ]);
        Category::create([
            "title" => "Cuci",
            "price" => 12000,
            "price_per_multiplied_kg" => 6,
        ]);
        Category::create([
            "title" => "Dryer",
            "price" => 12000,
            "price_per_multiplied_kg" => 6,
        ]);
        Category::create([
            "title" => "Bed Cover Kecil",
            "price" => 17000,
            "is_price_per_unit" => true
        ]);
        Category::create([
            "title" => "Bed Cover Besar",
            "price" => 22000,
            "is_price_per_unit" => true
        ]);
        Category::create([
            "title" => "Selimut",
            "price" => 10000,
            "is_price_per_unit" => true
        ]);
        Category::create([
            "title" => "Selimut Kecil",
            "price" => 5000,
            "is_price_per_unit" => true
        ]);
        Category::create([
            "title" => "Seprei",
            "price" => 5000,
            "is_price_per_unit" => true
        ]);
        Category::create([
            "title" => "Seprei + sarban",
            "price" => 10000,
            "is_price_per_set" => true
        ]);
        Category::create([
            "title" => "Sprei besar",
            "price" => 10000,
            "is_price_per_unit" => true
        ]);
    }
}
