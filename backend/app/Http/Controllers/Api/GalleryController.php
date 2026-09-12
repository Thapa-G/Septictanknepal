<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Display a listing of gallery photos.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Gallery::query();

        // Category filter
        if ($request->filled('category') && strtolower($request->category) !== 'all') {
            $query->where('category', $request->category);
        }

        // Featured filter
        if ($request->has('is_featured')) {
            $query->where('is_featured', filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN));
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('alt_text', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Ordering: order ASC, created_at DESC
        $query->orderBy('order', 'asc')->orderBy('created_at', 'desc');

        if ($request->filled('per_page')) {
            $perPage = (int) $request->per_page;
            $galleries = $query->paginate($perPage);
            return response()->json($galleries);
        }

        $galleries = $query->get();
        return response()->json([
            'success' => true,
            'data' => $galleries,
        ]);
    }

    /**
     * Display the specified gallery photo.
     */
    public function show(string $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $gallery,
        ]);
    }

    /**
     * Store a newly created gallery photo in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Enforce maximum 20 photos limit in gallery
        $currentCount = Gallery::count();
        if ($currentCount >= 20) {
            return response()->json([
                'message' => 'Gallery photo limit reached. A maximum of 20 photos can be stored. Please delete existing photos before uploading new ones.',
            ], 422);
        }

        $validated = $request->validate([
            'image_url' => 'required|string|max:2048',
            'title' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
        ]);

        if (empty($validated['category'])) {
            $validated['category'] = 'General';
        }

        $gallery = Gallery::create($validated);

        return response()->json([
            'message' => 'Photo added to gallery successfully',
            'data' => $gallery,
        ], 201);
    }

    /**
     * Update the specified gallery photo in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);

        $validated = $request->validate([
            'image_url' => 'sometimes|required|string|max:2048',
            'title' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:2000',
            'order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
        ]);

        if (array_key_exists('category', $validated) && empty($validated['category'])) {
            $validated['category'] = 'General';
        }

        $gallery->update($validated);

        return response()->json([
            'message' => 'Gallery photo updated successfully',
            'data' => $gallery,
        ]);
    }

    /**
     * Remove the specified gallery photo from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);
        $gallery->delete();

        return response()->json([
            'message' => 'Gallery photo deleted successfully',
        ]);
    }
}
