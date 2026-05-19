<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:' . implode(',', Order::statuses())],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status wajib diisi',
            'status.in' => 'Status tidak valid. Status yang tersedia: ' . implode(', ', Order::statuses()),
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
