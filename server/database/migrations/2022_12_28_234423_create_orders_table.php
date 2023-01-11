<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            // $table->id();
            $table->uuid("id")->unique()->primary();
            $table->foreignId('customer_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string("status")->default("Sedang dikerjakan");
            $table->string("payment_status");
            $table->text("notes")->default("-");
            $table->unsignedInteger("price");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
