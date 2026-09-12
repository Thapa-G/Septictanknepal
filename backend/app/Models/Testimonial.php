<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'rating',
        'comment',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'order' => 'integer',
        ];
    }
}
