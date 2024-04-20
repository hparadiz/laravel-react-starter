<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID as primary key
            $table->string('Handle')->nullable();
            $table->timestamp('LastRequest')->nullable();
            $table->binary('LastIP', 16)->nullable();
            $table->unsignedBigInteger('UserID')->nullable();
            $table->enum('Type', ['web', 'mobile'])->nullable();
            $table->timestamps(); // Created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
