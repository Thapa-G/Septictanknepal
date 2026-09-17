<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_details', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->default('Septic-Tank Nepal');
            $table->text('logo_url')->nullable();
            $table->string('whatsapp_number')->default('9841169351');
            $table->string('emergency_phone')->default('+977 9841169351');
            $table->string('email')->nullable()->default('nepalseptictank@gmail.com');
            $table->text('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable()->default(27.7172000);
            $table->decimal('longitude', 10, 7)->nullable()->default(85.3240000);
            $table->string('operating_hours')->default('4:00 AM – 9:00 PM, 365 days a year');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_details');
    }
};
