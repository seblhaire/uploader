<?php

namespace Seblhaire\Uploader;

use Illuminate\Foundation\Http\FormRequest;

class FileuploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
          'file' => ['required', new FiletypeRule($this), new FilesizeRule($this)],
          'path' => 'string|nullable',
          'storagename' => 'string|nullable',
          'filepattern' => 'string|nullable',
          'rename' => 'boolean',
          'maxsize' =>  'integer',
          'mimes' => 'string'
        ];
    }
}
