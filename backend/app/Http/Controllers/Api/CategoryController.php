<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * List all categories.
     */
    public function index(): JsonResponse
    {
        // If table is empty, seed defaults
        if (Category::count() === 0) {
            $defaults = [
                'Maintenance',
                'Emergency Tips',
                'News & Updates',
                'Commercial',
                'Plumbing Guides',
            ];

            foreach ($defaults as $name) {
                Category::firstOrCreate(
                    ['name' => $name],
                    ['slug' => Str::slug($name)]
                );
            }
        }

        $categories = Category::orderBy('name', 'asc')->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created category (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:categories,name',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug ?: 'category';
        $counter = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $category = Category::create([
            'name' => trim($validated['name']),
            'slug' => $slug,
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }

    /**
     * Remove the specified category (Admin only).
     * All associated blog posts will become category-less (category = null).
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $categoryName = $category->name;

        // When a category is deleted, all posts become category-less
        Blog::where('category', $categoryName)->update(['category' => null]);

        $category->delete();

        return response()->json([
            'message' => "Category '{$categoryName}' deleted successfully. Associated blogs are now category-less.",
        ]);
    }
}
