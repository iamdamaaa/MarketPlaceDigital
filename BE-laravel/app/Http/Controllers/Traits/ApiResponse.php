<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Respon sukses standar (200)
     */
    public function successResponse($data, $message = null, $code = 200): JsonResponse
    {
        return response()->json([
            'status' => 'Success',
            'message' => $message,
            'data' => $data 
        ], $code);
    }

    /**
     * Respon untuk data yang baru dibuat (201)
     */
    public function createdResponse($data, $message = 'Resource created successfully'): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Respon untuk data dengan pagination (200)
     */
    public function paginatedResponse($data, $message = null): JsonResponse
    {
        return response()->json([
            'status' => 'Success',
            'message' => $message,
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ]
        ], 200);
    }
}