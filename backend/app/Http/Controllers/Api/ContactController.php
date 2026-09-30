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
                'regex:/^[\p{L}0-9,\s]+$/u',
            ],
            'phone' => [
                'required',
                'string',
                'max:50',
                'regex:/^[0-9,+\s\-]+$/',
            ],
            'location' => [
                'nullable',
                'string',
                'max:255',
                'regex:/^[\p{L}0-9,\s]+$/u',
            ],
            'service_needed' => [
                'nullable',
                'string',
                'max:100',
            ],
            'message' => [
                'nullable',
                'string',
                'regex:/^[\p{L}0-9,\s]+$/u',
            ],
        ], [
            'name.regex' => 'Name can only contain letters, numbers, and commas.',
            'phone.regex' => 'Phone can only contain numbers, commas, and spaces.',
            'location.regex' => 'Location can only contain letters, numbers, and commas.',
            'message.regex' => 'Message can only contain letters, numbers, and commas.',
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
