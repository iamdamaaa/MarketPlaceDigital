<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is a seller
     */
    public function isSeller(): bool
    {
        return $this->role === 'seller';
    }

    /**
     * Get the orders for the user
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the products listed by the seller
     */
    public function products()
    {
        return $this->hasMany(Product::class, 'seller_id');
    }

    /**
     * Get the notifications for the user
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get the wallet for the user
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }
}
