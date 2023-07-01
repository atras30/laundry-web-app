<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Category
 *
 * @property int $id
 * @property string $title
 * @property int $price
 * @property int|null $price_per_multiplied_kg
 * @property int $is_price_per_unit
 * @property int $is_price_per_set
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $type
 * @method static \Illuminate\Database\Eloquent\Builder|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Category newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Category query()
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereIsPricePerSet($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereIsPricePerUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category wherePricePerMultipliedKg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Category extends Model
{
    use HasFactory;

    protected $guarded = [
        "created_at",
        "id"
    ];
}
