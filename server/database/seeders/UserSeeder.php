<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
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
    }
}
