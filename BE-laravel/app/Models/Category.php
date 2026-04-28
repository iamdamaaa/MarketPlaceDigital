<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id'
    ];

    protected static function boot()

    {
        parent::boot();

        static::creating(function ($category) {
           if (empty($category->slug)){
               $category->slug = Str::slug($category->name);
            };
        });

        static::updating(function ($category) {
            if($category->isDirty('name') && empty($category->slug)){
                $category->slug = Str::slug($category->name);               
            };
        });
    }

    //relasi:category memiliki banyak porduct

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // accessor: hitung jumlah product
    public function getProductscountAttribute()
    {
        return $this->products ()->count();
    }
}
