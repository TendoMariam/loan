<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLoanApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'number' => ['prohibited'],
            'amount' => ['required', 'numeric', 'min:0'],
            'application_date' => ['required', 'date'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'interest_rate' => ['required', 'numeric', 'min:0'],
            'net_amount' => ['prohibited'],
            'loan_type' => ['required', 'in:new,top-up'],
            'status' => ['required', 'in:pending,approved,rejected'],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'loan_product_id' => ['required', 'integer', 'exists:loan_products,id'],
        ];
    }
}
