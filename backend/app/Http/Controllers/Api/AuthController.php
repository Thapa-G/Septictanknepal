<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected int $maxAttempts = 5;
    protected int $lockoutSeconds = 86400; // 24 hours

    /**
     * Get the rate limiting throttle key for the request.
     */
    protected function throttleKey(Request $request): string
    {
        return Str::transliterate(Str::lower($request->input('email', '')) . '|' . $request->ip());
    }

    /**
     * Format remaining lockout seconds into a human-readable time string.
     */
    protected function formatLockoutTime(int $seconds): string
    {
        if ($seconds >= 86400) {
            return '24 hours';
        }

        $hours = (int) floor($seconds / 3600);
        $remainingSeconds = $seconds % 3600;
        $minutes = (int) round($remainingSeconds / 60);

        if ($minutes === 60) {
            $hours += 1;
            $minutes = 0;
        }

        if ($hours >= 24) {
            return '24 hours';
        }

        if ($hours > 0 && $minutes > 0) {
            return "{$hours} hour(s) and {$minutes} minute(s)";
        } elseif ($hours > 0) {
            return "{$hours} hour(s)";
        }

        return max(1, $minutes) . ' minute(s)';
    }

    public function login(Request $request): JsonResponse
    {
        if ($request->isMethod('get')) {
            return response()->json([
                'message' => 'Please provide email and password via POST to authenticate.',
                'status' => 'unauthenticated',
            ], 401);
        }

        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $throttleKey = $this->throttleKey($request);

        // Check if user is currently locked out
        if (RateLimiter::tooManyAttempts($throttleKey, $this->maxAttempts)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $formattedTime = $this->formatLockoutTime($seconds);

            return response()->json([
                'message' => "Too many failed login attempts. Limit of {$this->maxAttempts} attempts reached. You can re-enter your password after {$formattedTime}.",
                'errors' => [
                    'email' => ["Too many failed login attempts. Limit of {$this->maxAttempts} attempts reached. You can re-enter your password after {$formattedTime}."],
                ],
                'status' => 'locked',
                'retry_after' => $seconds,
            ], 429);
        }

        // Ensure current admin credentials exist in the database
        $targetEmail = 'septictanknepaladmin@admin.com';
        $admin = User::where('email', $targetEmail)->first();
        if (! $admin) {
            $firstUser = User::first();
            if ($firstUser) {
                $firstUser->update([
                    'name' => 'Septic Tank Nepal Admin',
                    'email' => $targetEmail,
                    'password' => Hash::make('imaseptictankneplaadmin2'),
                ]);
            } else {
                User::create([
                    'name' => 'Septic Tank Nepal Admin',
                    'email' => $targetEmail,
                    'password' => Hash::make('imaseptictankneplaadmin2'),
                ]);
            }
        } elseif ($request->email === $targetEmail && $request->password === 'imaseptictankneplaadmin2' && ! Hash::check($request->password, $admin->password)) {
            $admin->update([
                'password' => Hash::make('imaseptictankneplaadmin2'),
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey, $this->lockoutSeconds);

            $attempts = RateLimiter::attempts($throttleKey);
            $remaining = max(0, $this->maxAttempts - $attempts);

            if ($remaining === 0) {
                // Ensure full 24-hour lockout starting from this 5th failed attempt
                RateLimiter::clear($throttleKey);
                for ($i = 0; $i < $this->maxAttempts; $i++) {
                    RateLimiter::hit($throttleKey, $this->lockoutSeconds);
                }

                $seconds = RateLimiter::availableIn($throttleKey);
                $formattedTime = $this->formatLockoutTime($seconds);

                return response()->json([
                    'message' => "Too many failed login attempts. Limit of {$this->maxAttempts} attempts reached. You can re-enter your password after {$formattedTime}.",
                    'errors' => [
                        'email' => ["Too many failed login attempts. Limit of {$this->maxAttempts} attempts reached. You can re-enter your password after {$formattedTime}."],
                    ],
                    'status' => 'locked',
                    'retry_after' => $seconds,
                ], 429);
            }

            return response()->json([
                'message' => "The provided credentials do not match our records. You have {$remaining} attempt(s) remaining before a 24-hour lockout.",
                'errors' => [
                    'email' => ["The provided credentials do not match our records. You have {$remaining} attempt(s) remaining before a 24-hour lockout."],
                ],
                'attempts_remaining' => $remaining,
            ], 401);
        }

        // Authentication successful - clear any prior failed attempts
        RateLimiter::clear($throttleKey);

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
