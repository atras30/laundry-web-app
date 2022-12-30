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
        "created_at"
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function subOrders()
    {
        return $this->hasMany(SubOrder::class);
    }
}
