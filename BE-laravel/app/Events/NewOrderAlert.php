<?php

namespace App\Events;

use App\Models\Order;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrderAlert implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;
    public User $buyer;

    /**
     * Create a new event instance.
     */
    public function __construct(Order $order, User $buyer)
    {
        $this->order = $order;
        $this->buyer = $buyer;
    }

    /**
     * Get the channels the event should broadcast on.
     * Broadcast to the admin private channel.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'order.new';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
            'buyer_name' => $this->buyer->name,
            'product_title' => $this->order->product->title ?? null,
            'total_price' => $this->order->total_price,
            'message' => "Pesanan baru #{$this->order->id} dari {$this->buyer->name}",
        ];
    }
}
