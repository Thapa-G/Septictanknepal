<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'logo_url',
        'whatsapp_number',
        'emergency_phone',
        'email',
        'address',
        'latitude',
        'longitude',
        'operating_hours',
        'review_image_url',
        'review_image_alt',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }
}
