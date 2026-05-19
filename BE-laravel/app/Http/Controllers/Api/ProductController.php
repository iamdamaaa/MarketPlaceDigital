<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\ApiResponse;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/products
     * List all products with search, filter, and pagination
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'seller']);

        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status (default: only published for non-admin)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            // If not admin, only show published products
            if (!$request->user() || !$request->user()->isAdmin()) {
                $query->where('status', 'published');
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSorts = ['title', 'price', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = min($request->get('per_page', 12), 50);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'List of products',
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
    }

    /**
     * POST /api/products
     * Create a new product (admin only)
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['seller_id'] = $request->user()->id;
        $data['slug'] = Str::slug($data['title']);

        // Ensure unique slug
        $slugCount = Product::where('slug', $data['slug'])->count();
        if ($slugCount > 0) {
            $data['slug'] = $data['slug'] . '-' . ($slugCount + 1);
        }

        if (!isset($data['status'])) {
            $data['status'] = 'published';
        }

        $product = Product::create($data);
        $product->load(['category', 'seller']);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product,
        ], 201);
    }

    /**
     * GET /api/products/{id}
     * Show a single product
     */
    public function show($id): JsonResponse
    {
        $product = Product::with(['category', 'seller', 'reviews'])->find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product detail',
            'data' => $product,
        ]);
    }

    /**
     * PUT /api/products/{id}
     * Update a product (admin only)
     */
    public function update(UpdateProductRequest $request, $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $data = $request->validated();

        // Regenerate slug if title changed
        if (isset($data['title']) && $data['title'] !== $product->title) {
            $data['slug'] = Str::slug($data['title']);
            $slugCount = Product::where('slug', $data['slug'])->where('id', '!=', $product->id)->count();
            if ($slugCount > 0) {
                $data['slug'] = $data['slug'] . '-' . ($slugCount + 1);
            }
        }

        $product->update($data);
        $product->load(['category', 'seller']);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product,
        ]);
    }

    /**
     * DELETE /api/products/{id}
     * Delete a product (admin only)
     */
    public function destroy($id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $productTitle = $product->title;
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => "Product '{$productTitle}' deleted successfully",
            'data' => null,
        ]);
    }
}
