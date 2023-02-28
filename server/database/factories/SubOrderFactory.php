<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Customer;
use App\Models\SubOrder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class SubOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $category = Category::all()->random();

        return [
            "order_id" => 1,
            "type" => $category->title,
            "price_per_kg" => $category->price,
            "amount" => "4 KG",
            "total" => fake()->randomNumber()
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
