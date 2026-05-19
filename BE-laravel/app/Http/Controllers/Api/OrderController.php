<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\Notification;
use App\Models\User;
use App\Events\OrderStatusUpdated;
use App\Events\NewOrderAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/orders
     * List orders — users see their own orders, admin sees all
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $query = Order::with(['user', 'product']);
        } else {
            $query = Order::with(['product'])->where('user_id', $user->id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->orderBy('created_at', 'desc');
        $perPage = min($request->get('per_page', 10), 50);
        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'List of orders',
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ]
        ]);
    }

    /**
     * POST /api/orders
     * Create a new order
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $data = $request->validated();
        $user = $request->user();

        // Get product and calculate total
        $product = Product::find($data['product_id']);

        if (!$product || $product->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'Product not available',
            ], 404);
        }

        $totalPrice = $product->price * $data['quantity'];

        $order = Order::create([
            'user_id' => $user->id,
            'product_id' => $data['product_id'],
            'quantity' => $data['quantity'],
            'total_price' => $totalPrice,
            'status' => 'pending',
            'notes' => $data['notes'] ?? null,
        ]);

        $order->load('product');

        // Create notification for admins
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'new_order',
                'title' => 'Pesanan Baru',
                'message' => "Pesanan baru #{$order->id} dari {$user->name} untuk produk {$product->title}",
                'data' => [
                    'order_id' => $order->id,
                    'user_name' => $user->name,
                    'product_title' => $product->title,
                    'total_price' => $totalPrice,
                ],
            ]);
        }

        // Broadcast to admin channel
        try {
            event(new NewOrderAlert($order, $user));
        } catch (\Exception $e) {
            // Broadcasting may fail if not configured - continue silently
        }

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'data' => $order,
        ], 201);
    }

    /**
     * GET /api/orders/{id}
     * Show order detail — owner or admin only
     */
    public function show(Request $request, $id): JsonResponse
    {
        $order = Order::with(['product', 'user'])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        $user = $request->user();

        // Only allow owner or admin
        if ($order->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this order',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order detail',
            'data' => $order,
        ]);
    }

    /**
     * PUT /api/orders/{id}/status
     * Update order status — admin only
     */
    public function updateStatus(UpdateOrderStatusRequest $request, $id): JsonResponse
    {
        $order = Order::with('product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found',
            ], 404);
        }

        $oldStatus = $order->status;
        $newStatus = $request->validated()['status'];

        $order->update(['status' => $newStatus]);

        // Create notification for order owner
        Notification::create([
            'user_id' => $order->user_id,
            'type' => 'order_status_updated',
            'title' => 'Status Pesanan Diperbarui',
            'message' => "Status pesanan #{$order->id} berubah dari {$oldStatus} ke {$newStatus}",
            'data' => [
                'order_id' => $order->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'product_title' => $order->product->title ?? null,
            ],
        ]);

        // Broadcast to user channel
        try {
            event(new OrderStatusUpdated($order, $oldStatus, $newStatus));
        } catch (\Exception $e) {
            // Broadcasting may fail if not configured - continue silently
        }

        return response()->json([
            'success' => true,
            'message' => "Order status updated from {$oldStatus} to {$newStatus}",
            'data' => $order,
        ]);
    }
}
