<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
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
        $amount = fake()->numberBetween(1, 20);
        $amountText = $amount;

        if (!$category->is_price_per_unit && !$category->is_price_per_set) {
            $amountText = $amountText . " KG";
        } else if ($category->is_price_per_unit) {
            $amountText = $amountText . " Unit";
        } else if ($category->is_price_per_set) {
            $amountText = $amountText . " Set";
        }

        return [
            "order_id" => Order::first()->id,
            "type" => $category->title,
            "price_per_kg" => $category->price,
            "amount" => $amountText,
            "total" => $category->price_per_multiplied_kg != null ? $category->price * ceil($amount / $category->price_per_multiplied_kg) : $category->price * $amount
        ];
    }
}
