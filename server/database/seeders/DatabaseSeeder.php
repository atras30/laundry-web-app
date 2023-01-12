<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\SubOrder;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::create([
            "name" => "Cinta Laundry Admin",
            "email" => "cintalaundry@gmail.com",
            "password" => bcrypt("testing12345")
        ]);
        User::create([
            "name" => "Atras Shalhan Admin",
            "email" => "atrasshalhan@gmail.com",
            "password" => bcrypt("testing12345")
        ]);

        Customer::create([
            "name" => "Atras Shalhan",
            "address" => "Kota Sutera B7/20",
            "phone_number" => "6281287318166",
            "balance" => 50000,
        ]);
        Customer::create([
            "name" => "Pak Jusia",
            "address" => "Kota Sutera B6/22",
            "phone_number" => "6281287318166",
            "balance" => 20000,
        ]);
        Customer::create([
            "name" => "Bu Nuri",
            "address" => "Kota Sutera B5/28",
            "phone_number" => "6281287318166",
            "balance" => 10000,
        ]);

        Order::create([
            "id" => 1,
            "customer_id" => 1,
            "price" => 26000,
            "status" => "Sedang dikerjakan",
            "notes" => "Ambil besok",
            "payment_status" => "Belum bayar"
        ]);
        SubOrder::create([
            "order_id" => 1,
            "type" => "Cuci Kering",
            "price_per_kg" => "4000",
            "amount" => "4 KG",
            "total" => "16000",
        ]);
        SubOrder::create([
            "order_id" => 1,
            "type" => "Cuci Kering Setrika",
            "price_per_kg" => "6000",
            "amount" => "4 KG",
            "total" => "6000",
        ]);

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
