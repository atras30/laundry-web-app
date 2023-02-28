<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Order::create([
            "id" => 1,
            "customer_id" => 1,
            "price" => 26000,
            "status" => "Sedang dikerjakan",
            "notes" => "Ambil besok",
            "payment_status" => "Belum bayar"
        ]);

        Order::factory(10)->create();
    }
}
