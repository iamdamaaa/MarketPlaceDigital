<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/notifications
     * List notifications for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc');

        // Filter by read/unread
        if ($request->filled('unread') && $request->boolean('unread')) {
            $query->unread();
        }

        $perPage = min($request->get('per_page', 20), 50);
        $notifications = $query->paginate($perPage);

        // Get unread count
        $unreadCount = Notification::where('user_id', $user->id)->unread()->count();

        return response()->json([
            'success' => true,
            'message' => 'List of notifications',
            'data' => $notifications->items(),
            'unread_count' => $unreadCount,
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ]
        ]);
    }

    /**
     * POST /api/notifications/read
     * Mark all notifications as read
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $user = $request->user();

        Notification::where('user_id', $user->id)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
            'data' => null,
        ]);
    }
}
