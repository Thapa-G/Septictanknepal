<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\CompanyDetail;
use App\Models\ContactMessage;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $totalServices = Service::count();
        $totalBlogs = Blog::count();
        $totalInquiries = ContactMessage::count();
        $unreadInquiries = ContactMessage::where('is_read', false)->count();
        $company = CompanyDetail::first();

        return response()->json([
            'total_services' => $totalServices,
            'total_blogs' => $totalBlogs,
            'total_inquiries' => $totalInquiries,
            'unread_inquiries' => $unreadInquiries,
            'company' => $company,
        ]);
    }
}
