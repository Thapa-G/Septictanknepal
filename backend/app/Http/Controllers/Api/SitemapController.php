<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Return dynamic sitemap as XML.
     */
    public function xml(): Response
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

        $staticUrls = [
            [
                'loc' => $frontendUrl,
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '1.0',
            ],
            [
                'loc' => "{$frontendUrl}/services",
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '0.9',
            ],
            [
                'loc' => "{$frontendUrl}/blog",
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'daily',
                'priority' => '0.8',
            ],
            [
                'loc' => "{$frontendUrl}/gallery",
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7',
            ],
            [
                'loc' => "{$frontendUrl}/contact",
                'lastmod' => now()->toAtomString(),
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ],
        ];

        $services = Service::select('slug', 'id', 'updated_at', 'created_at')
            ->orderBy('order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        $serviceUrls = $services->map(function ($service) use ($frontendUrl) {
            $identifier = $service->slug ?: $service->id;
            $lastmod = ($service->updated_at ?: $service->created_at ?: now())->toAtomString();
            return [
                'loc' => "{$frontendUrl}/services/{$identifier}",
                'lastmod' => $lastmod,
                'changefreq' => 'weekly',
                'priority' => '0.85',
            ];
        })->toArray();

        $blogs = Blog::select('slug', 'id', 'updated_at', 'published_at', 'created_at')
            ->orderBy('published_at', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $blogUrls = $blogs->map(function ($blog) use ($frontendUrl) {
            $identifier = $blog->slug ?: $blog->id;
            $lastmod = ($blog->updated_at ?: $blog->published_at ?: $blog->created_at ?: now())->toAtomString();
            return [
                'loc' => "{$frontendUrl}/blog/{$identifier}",
                'lastmod' => $lastmod,
                'changefreq' => 'weekly',
                'priority' => '0.75',
            ];
        })->toArray();

        $allUrls = array_merge($staticUrls, $serviceUrls, $blogUrls);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($allUrls as $url) {
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . htmlspecialchars($url['loc'], ENT_XML1, 'UTF-8') . '</loc>' . "\n";
            $xml .= '    <lastmod>' . htmlspecialchars($url['lastmod'], ENT_XML1, 'UTF-8') . '</lastmod>' . "\n";
            $xml .= '    <changefreq>' . htmlspecialchars($url['changefreq'], ENT_XML1, 'UTF-8') . '</changefreq>' . "\n";
            $xml .= '    <priority>' . htmlspecialchars($url['priority'], ENT_XML1, 'UTF-8') . '</priority>' . "\n";
            $xml .= '  </url>' . "\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=utf-8',
        ]);
    }

    /**
     * Return dynamic sitemap data as JSON.
     */
    public function json(): JsonResponse
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');

        $services = Service::select('title', 'slug', 'id', 'updated_at', 'created_at')->get();
        $blogs = Blog::select('title', 'slug', 'id', 'updated_at', 'published_at', 'created_at')->get();

        return response()->json([
            'static_routes' => [
                "{$frontendUrl}",
                "{$frontendUrl}/services",
                "{$frontendUrl}/blog",
                "{$frontendUrl}/gallery",
                "{$frontendUrl}/contact",
            ],
            'services' => $services->map(fn($s) => [
                'url' => "{$frontendUrl}/services/" . ($s->slug ?: $s->id),
                'title' => $s->title,
                'lastmod' => $s->updated_at ?: $s->created_at,
            ]),
            'blogs' => $blogs->map(fn($b) => [
                'url' => "{$frontendUrl}/blog/" . ($b->slug ?: $b->id),
                'title' => $b->title,
                'lastmod' => $b->updated_at ?: $b->published_at ?: $b->created_at,
            ]),
        ]);
    }
}
