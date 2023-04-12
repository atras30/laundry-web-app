<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\SubOrder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
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

        foreach (Order::all() as $order) {
            for ($i = 0; $i < 3; $i++) {
                $subOrder = SubOrder::factory()->create();

                $subOrder->order_id = $order->id;
                $subOrder->save();
            }
        }
    }
}
