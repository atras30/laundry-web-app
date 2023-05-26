<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Order extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [
        "id",
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function sub_orders()
    {
        return $this->hasMany(SubOrder::class);
    }

    public function order_uploads()
    {
        return $this->hasMany(OrderUpload::class);
    }
}
