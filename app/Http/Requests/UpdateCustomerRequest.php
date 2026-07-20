<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('customers', 'email')->ignore($this->route('customer')),
            ],
            'phone' => [
                'required',
                'string',
                'max:255',
                Rule::unique('customers', 'phone')->ignore($this->route('customer')),
            ],
            'address' => ['required', 'string', 'max:255'],
            'nin' => [
                'required',
                'string',
                'max:255',
                Rule::unique('customers', 'nin')->ignore($this->route('customer')),
            ],
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
        ];
    }
}
