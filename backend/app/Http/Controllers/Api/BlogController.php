<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Blog::orderBy('published_at', 'desc')->orderBy('id', 'desc');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->has('category') && $request->category != '') {
            $query->where('category', $request->category);
        }

        if ($request->boolean('featured_only')) {
            $query->where('is_featured', true);
        }

        $perPage = (int) $request->get('per_page', 9);
        $blogs = $query->paginate($perPage);

        return response()->json($blogs);
    }

    public function show(string $idOrSlug): JsonResponse
    {
        $blog = Blog::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        // Also fetch recent 3 other posts
        $recent = Blog::where('id', '!=', $blog->id)
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        return response()->json([
            'blog' => $blog,
            'recent_posts' => $recent,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'category' => 'required|string|max:100',
            'author' => 'nullable|string|max:100',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'icon' => 'nullable|string|max:50',
            'cover_image' => 'nullable|string',
            'cover_image_alt' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
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
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
            $count = Blog::where('slug', 'like', "{$validated['slug']}%")->count();
            if ($count > 0) {
                $validated['slug'] .= '-' . ($count + 1);
            }
        }

        if (empty($validated['author'])) {
            $validated['author'] = 'Admin';
        }

        $blog = Blog::create($validated);

        return response()->json([
            'message' => 'Blog post created successfully',
            'data' => $blog,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => "nullable|string|max:255|unique:blogs,slug,{$id}",
            'category' => 'required|string|max:100',
            'author' => 'nullable|string|max:100',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'icon' => 'nullable|string|max:50',
            'cover_image' => 'nullable|string',
            'cover_image_alt' => 'nullable|string|max:255',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
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
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $blog->update($validated);

        return response()->json([
            'message' => 'Blog post updated successfully',
            'data' => $blog,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();

        return response()->json([
            'message' => 'Blog post deleted successfully',
        ]);
    }
}
