<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


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
