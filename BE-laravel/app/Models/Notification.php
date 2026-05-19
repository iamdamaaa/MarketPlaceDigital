<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Notification extends Model
{
    protected $fillable = [
        'id',
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    // Use UUID as primary key
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($notification) {
            if (empty($notification->id)) {
                $notification->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Scope for unread notifications
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Scope for read notifications
     */
    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    /**
     * Mark notification as read
     */
    public function markAsRead()
    {
        $this->update(['read_at' => now()]);
    }

    /**
     * Get the user that owns the notification
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
