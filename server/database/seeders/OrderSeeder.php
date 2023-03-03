<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\SubOrder;
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
        // Order::create([
        //     "id" => 1,
        //     "customer_id" => 1,
        //     "price" => 26000,
        //     "status" => "Sedang dikerjakan",
        //     "notes" => "Ambil besok",
        //     "payment_status" => "Belum bayar"
        // ]);

        $this->createOrder(10);
    }

    function createOrder($amount)
    {
        for ($i = 0; $i < $amount; $i++) {
            $order = Order::factory()->create();
            $totalOrderPrice = 0;

            for ($j = 0; $j < 3; $j++) {
                $subOrder = SubOrder::factory()->create();
                $subOrder->order_id = $order->id;
                $subOrder->save();

                $totalOrderPrice += $subOrder->total;
            }

            $order->price = $totalOrderPrice;
        }
    }
}
