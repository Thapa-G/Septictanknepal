<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('meta_title')->nullable()->after('order');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('meta_keywords', 500)->nullable()->after('meta_description');
            $table->string('canonical_url', 500)->nullable()->after('meta_keywords');
            $table->text('og_image')->nullable()->after('canonical_url');
            $table->string('og_image_alt')->nullable()->after('og_image');
            $table->json('custom_metadata')->nullable()->after('og_image_alt');
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->string('meta_title')->nullable()->after('published_at');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->string('meta_keywords', 500)->nullable()->after('meta_description');
            $table->string('canonical_url', 500)->nullable()->after('meta_keywords');
            $table->text('og_image')->nullable()->after('canonical_url');
            $table->string('og_image_alt')->nullable()->after('og_image');
            $table->json('custom_metadata')->nullable()->after('og_image_alt');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'meta_title',
                'meta_description',
                'meta_keywords',
                'canonical_url',
                'og_image',
                'og_image_alt',
                'custom_metadata',
            ]);
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn([
                'meta_title',
                'meta_description',
                'meta_keywords',
                'canonical_url',
                'og_image',
                'og_image_alt',
                'custom_metadata',
            ]);
        });
    }
};
