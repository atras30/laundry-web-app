<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
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
        Customer::factory(10)->create();
    }
}
