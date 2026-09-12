<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceFaq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Service::with('faqs')->orderBy('order', 'asc')->orderBy('id', 'desc');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('featured_only')) {
            $query->where('is_featured', true);
        }

        if ($request->has('per_page')) {
            $services = $query->paginate((int)$request->per_page);
        } else {
            $services = $query->get();
        }

        return response()->json($services);
    }

    public function show(string $idOrSlug): JsonResponse
    {
        $service = Service::with('faqs')
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        return response()->json($service);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'heading' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:services,slug',
            'short_description' => 'required|string',
            'full_description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'cover_image' => 'nullable|string',
            'cover_image_alt' => 'nullable|string|max:255',
            'video_url' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'order' => 'integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|string|max:500',
            'og_image' => 'nullable|string',
            'og_image_alt' => 'nullable|string|max:255',
            'custom_metadata' => 'nullable|array',
            'custom_metadata.*.type' => 'nullable|string|max:100',
            'custom_metadata.*.key' => 'nullable|string|max:255',
            'custom_metadata.*.value' => 'nullable|string',
            'faqs' => 'nullable|array',
            'faqs.*.question' => 'required|string',
            'faqs.*.answer' => 'required|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
            $count = Service::where('slug', 'like', "{$validated['slug']}%")->count();
            if ($count > 0) {
                $validated['slug'] .= '-' . ($count + 1);
            }
        }

        $service = Service::create($validated);

        if (!empty($validated['faqs'])) {
            foreach ($validated['faqs'] as $index => $faqData) {
                ServiceFaq::create([
                    'service_id' => $service->id,
                    'question' => $faqData['question'],
                    'answer' => $faqData['answer'],
                    'order' => $index,
                ]);
            }
        }

        return response()->json([
            'message' => 'Service created successfully',
            'data' => $service->load('faqs'),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'heading' => 'nullable|string|max:255',
            'slug' => "nullable|string|max:255|unique:services,slug,{$id}",
            'short_description' => 'required|string',
            'full_description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'cover_image' => 'nullable|string',
            'cover_image_alt' => 'nullable|string|max:255',
            'video_url' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
            'order' => 'integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string|max:500',
            'canonical_url' => 'nullable|string|max:500',
            'og_image' => 'nullable|string',
            'og_image_alt' => 'nullable|string|max:255',
            'custom_metadata' => 'nullable|array',
            'custom_metadata.*.type' => 'nullable|string|max:100',
            'custom_metadata.*.key' => 'nullable|string|max:255',
            'custom_metadata.*.value' => 'nullable|string',
            'faqs' => 'nullable|array',
            'faqs.*.question' => 'required|string',
            'faqs.*.answer' => 'required|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $service->update($validated);

        if (isset($validated['faqs'])) {
            $service->faqs()->delete();
            foreach ($validated['faqs'] as $index => $faqData) {
                ServiceFaq::create([
                    'service_id' => $service->id,
                    'question' => $faqData['question'],
                    'answer' => $faqData['answer'],
                    'order' => $index,
                ]);
            }
        }

        return response()->json([
            'message' => 'Service updated successfully',
            'data' => $service->load('faqs'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json([
            'message' => 'Service deleted successfully',
        ]);
    }
}
