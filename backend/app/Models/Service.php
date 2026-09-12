<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'heading',
        'slug',
        'short_description',
        'full_description',
        'icon',
        'cover_image',
        'cover_image_alt',
        'video_url',
        'category',
        'is_featured',
        'order',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'og_image',
        'og_image_alt',
        'custom_metadata',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'order' => 'integer',
            'custom_metadata' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Service $service) {
            if (empty($service->slug)) {
                $service->slug = Str::slug($service->title);
            }
        });
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(ServiceFaq::class)->orderBy('order', 'asc');
    }
}
