<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * App\Models\OrderUpload
 *
 * @property int $id
 * @property string $order_id
 * @property string $upload_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Order $order
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload query()
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload whereOrderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|OrderUpload whereUploadPath($value)
 * @mixin \Eloquent
 */
class OrderUpload extends Model
{
    use HasFactory;

    protected $guarded = [
        "id",
    ];

    public function order() {
        return $this->belongsTo(Order::class);
    }
}
