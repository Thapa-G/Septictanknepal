<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\p{L}\p{N}\s]+$/u',
            ],
            'phone' => [
                'required',
                'string',
                'max:25',
                'regex:/^\+?[0-9\s\-]+$/',
            ],
            'location' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[\p{L}\p{N}\s,.\-]+$/u',
            ],
            'service_needed' => 'nullable|string|max:100',
            'message' => [
                'nullable',
                'string',
                'max:3000',
                'regex:/^[\p{L}\p{N}\s,.\-!?()\'"\r\n]+$/u',
            ],
        ], [
            'name.regex' => 'The name may only contain letters, numbers, and spaces.',
            'phone.regex' => 'The phone number may only contain numbers.',
            'location.regex' => 'The location may only contain letters, numbers, and spaces.',
            'message.regex' => 'The message may only contain letters, numbers, and basic punctuation.',
        ]);

        $message = ContactMessage::create($validated);

        return response()->json([
            'message' => 'Thank you! Your request has been submitted successfully. Our team will contact you shortly.',
            'data' => $message,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->paginate(20);
        return response()->json($messages);
    }

    public function markAsRead(int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => true]);

        return response()->json([
            'message' => 'Message marked as read',
            'data' => $message,
        ]);
    }
}
