<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'image_url',
        'alt_text',
        'description',
        'order',
        'is_featured',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'is_featured' => 'boolean',
        ];
    }
}
