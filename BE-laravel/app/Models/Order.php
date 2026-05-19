<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
        'total_price',
        'status',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'total_price' => 'integer',
    ];

    /**
     * Status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * Get all available statuses
     */
    public static function statuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_PROCESSING,
            self::STATUS_SHIPPED,
            self::STATUS_DELIVERED,
            self::STATUS_CANCELLED,
        ];
    }

    /**
     * Get the user who placed the order
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that was ordered
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
