<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * POST /api/auth/register
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.email' => 'Email is invalid',
            'email.unique' => 'Email is already taken',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.confirmed' => 'Password confirmation does not match',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'], 
            'password' => Hash::make($validated['password']), 
            'role' => 'buyer',
            'is_active' => true,        
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 201);
    }

    /**
     * POST /api/auth/login
     * Login user and return Bearer token
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ], [
            'email.required' => 'Email is required',
            'password.required' => 'Password is required',
        ]);
        
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email or Password is wrong',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Account is deactivated. Please contact support.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User logged in successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    /**
     * POST /api/auth/logout
     * Logout user (invalidate current token)
     */
    public function logout(Request $request): JsonResponse
    {
        //hapus token saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'User logged out successfully',
        ], 200);
    }

    /**
     * GET /api/auth/me
     * Get authenticated user data
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'User data retrieved',
            'data' => $request->user(),
        ]);
    }
}
