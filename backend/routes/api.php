<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SitemapController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for Septic-Tank Nepal
|--------------------------------------------------------------------------
*/

// Public Authentication
Route::match(['get', 'post'], '/auth/login', [AuthController::class, 'login'])->name('login');

// Public Company & Metadata
Route::get('/company', [CompanyController::class, 'show']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

// Public Services
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{idOrSlug}', [ServiceController::class, 'show']);

// Public Blogs
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{idOrSlug}', [BlogController::class, 'show']);

// Public Photo Gallery
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/gallery/{id}', [GalleryController::class, 'show']);

// Public Sitemap
Route::get('/sitemap', [SitemapController::class, 'json']);
Route::get('/sitemap.xml', [SitemapController::class, 'xml']);

// Public Contact Inquiries
Route::post('/contact', [ContactController::class, 'store']);

// Protected Admin Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth Check & Logout
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Admin Dashboard Stats
    Route::get('/admin/stats', [StatsController::class, 'index']);

    // Company Details Update
    Route::put('/admin/company', [CompanyController::class, 'update']);

    // Categories Management
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

    // Services CRUD
    Route::post('/admin/services', [ServiceController::class, 'store']);
    Route::put('/admin/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/admin/services/{id}', [ServiceController::class, 'destroy']);

    // Blogs CRUD
    Route::post('/admin/blogs', [BlogController::class, 'store']);
    Route::put('/admin/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/admin/blogs/{id}', [BlogController::class, 'destroy']);

    // Photo Gallery CRUD
    Route::post('/admin/gallery', [GalleryController::class, 'store']);
    Route::put('/admin/gallery/{id}', [GalleryController::class, 'update']);
    Route::delete('/admin/gallery/{id}', [GalleryController::class, 'destroy']);

    // Contact Messages Viewing
    Route::get('/admin/contact-messages', [ContactController::class, 'index']);
    Route::patch('/admin/contact-messages/{id}/read', [ContactController::class, 'markAsRead']);

    // File Upload
    Route::post('/admin/upload', [UploadController::class, 'upload']);
});
