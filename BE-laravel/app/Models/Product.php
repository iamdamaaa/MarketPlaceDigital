<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'seller_id',
        'category_id',
        'title', 
        'slug',
        'description',
        'price',
        'thumbnail',
        'status',
    ];

    protected $casts = [
        'price' => 'integer',
    ];

    // auto generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)){
                $product->slug = Str::slug($product->title);
            };
        });

        static::updating(function ($product) {
            if($product->isDirty('title') && empty($product->slug)){
                $product->slug = Str::slug($product->title);               
            };
        });
    }

    //relasi belongsTo
    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function seller(){
        return $this->belongsTo(User::class, 'seller_id');
    }

    //relasi hasMany
    public function productFiles(){
        return $this->hasMany(Product_File::class);
    }

    public function reviews(){
        return $this->hasMany(Review::class);
    }

    public function orders(){
        return $this->hasMany(Order::class);
    }

    //relasi oneToOne
    public function transaction(){
        return $this->hasOne(Transaction::class);
    }
}
