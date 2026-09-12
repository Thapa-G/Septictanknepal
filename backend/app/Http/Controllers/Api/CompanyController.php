<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompanyDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function show(): JsonResponse
    {
        $company = CompanyDetail::firstOrCreate(
            ['id' => 1],
            [
                'company_name' => 'Septic-Tank Nepal',
                'whatsapp_number' => '9800000000',
                'emergency_phone' => '+977 976-5355755',
                'email' => 'info@drainexpert.com',
                'address' => '',
                'latitude' => 27.7172000,
                'longitude' => 85.3240000,
                'operating_hours' => '4:00 AM – 9:00 PM, 365 days a year',
            ]
        );

        return response()->json($company);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'logo_url' => 'nullable|string',
            'whatsapp_number' => 'required|string|max:50',
            'emergency_phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'operating_hours' => 'nullable|string|max:255',
            'review_image_url' => 'nullable|string',
            'review_image_alt' => 'nullable|string|max:255',
        ]);

        $company = CompanyDetail::firstOrCreate(['id' => 1]);
        $company->update($validated);

        return response()->json([
            'message' => 'Company details updated successfully',
            'data' => $company,
        ]);
    }
}
