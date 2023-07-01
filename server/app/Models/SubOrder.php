<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Order;

/**
 * App\Models\SubOrder
 *
 * @property int $id
 * @property string $order_id
 * @property string $type
 * @property int $price_per_kg
 * @property string $amount
 * @property int $is_price_per_unit
 * @property int|null $price_per_multiplied_kg
 * @property int $total
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Order $order
 * @method static \Database\Factories\SubOrderFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder query()
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereIsPricePerUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder wherePricePerKg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder wherePricePerMultipliedKg($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SubOrder whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class SubOrder extends Model
{
    use HasFactory;

    protected $guarded = [
        "id",
        "created_at",
        "updated_at"
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
