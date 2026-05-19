<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'price' => ['sometimes', 'integer', 'min:0'],
            'category_id' => ['sometimes', 'integer', 'exists:categories,id'],
            'status' => ['sometimes', 'in:draft,pending_review,published,rejected'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'price.integer' => 'Harga harus berupa angka',
            'price.min' => 'Harga tidak boleh negatif',
            'category_id.exists' => 'Kategori tidak ditemukan',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $validator->errors(),
        ], 422));
    }
}
