<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Auth routes: /api/auth/*
| Product routes: /api/products/*
| Order routes: /api/orders/*
| Notification routes: /api/notifications/*
| Category routes: /api/categories/*
|
*/

// ============================================
// AUTH ROUTES
// ============================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// ============================================
// PUBLIC ROUTES
// ============================================
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// ============================================
// PROTECTED ROUTES (requires auth)
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // ----- ORDER ROUTES -----
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // ----- NOTIFICATION ROUTES -----
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read', [NotificationController::class, 'markAllRead']);

    // ----- ADMIN ROUTES -----
    Route::middleware(AdminMiddleware::class)->group(function () {
        // Product management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Order status management
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // Category management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::get('/categories/{category}', [CategoryController::class, 'show']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });
});