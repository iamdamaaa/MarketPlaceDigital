<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use App\Exceptions\BusinessException;
use App\Http\Controllers\Traits\ApiResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    //get/api/v1/categories
    public function index(Request $request): JsonResponse
    {
        $query = Category::query();

        //search by name
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        //include products count
        $query->withCount('products');

        //sorting
        $sortBy = $request->get('sortBy', 'name');
        $sortOrder = $request->get('sortOrder', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        //pagination atau all
        if ($request->boolean('all')) {
            $category = $query->get();
            return $this->paginatedResponse($category, 'List all of categories');
        }

        $categories = $query->paginate($request->get('perPage', 10));
        return $this->paginatedResponse($categories, 'List of categories');
    }

    //get/api/v1/categories/{id}
    public function show(Category $category): JsonResponse
    {
        $category->loadCount('products');
        return $this->successResponse($category, 'Detail of category');
    }

    //post/api/v1/categories
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:categories'],
            'description' => ['required', 'string', 'max:255'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = Category::create($validated);
        return $this->createdResponse($category, 'Category created successfully');
    }

    //put/api/v1/categories/{id}
    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:categories, slug,' . $category->id,
            'description' => 'nullable|string|max:255',
        ]);
    }

    //delete/api/v1/categories/{id}
    public function destroy(Category $category): JsonResponse
    {
        //cek apakah category memiliki post 
        if ($category->products()->count >0) {
            throw new BusinessException('Category has posts, cannot be deleted', 422);
        }

        $categoryName = $category->name;
        $category->delete();

        return $this->successResponse(null, 'Category ' . $categoryName . ' deleted successfully');
    }



}
