<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $customerIds = Customer::all()->pluck("id")->toArray();
        $statusOptions = ["Sedang dikerjakan", "Menunggu diambil", "Sudah diantar", "Selesai"];
        $paymentStatus = ["Belum bayar", "Lunas"];

        return [
            "customer_id" => $customerIds[array_rand($customerIds)],
            "price" => fake()->randomNumber(5),
            "status" => $statusOptions[array_rand($statusOptions)],
            "notes" => fake()->words(3, true),
            "payment_status" => $paymentStatus[array_rand($paymentStatus)]
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
