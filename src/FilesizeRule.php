<?php

namespace Seblhaire\Uploader;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FilesizeRule implements Rule {

    protected $request;
    protected $maxsize;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(FormRequest $request) {
        $this->request = $request;
        if ($this->request->has('maxsize')) {
            $this->maxsize = $this->request->input('maxsize');
        } else if (is_null(config('uploader.maxfilesizek'))) {
            $this->maxsize = null;
        } else {
            $this->maxsize = config('uploader.maxfilesizek');
        }
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value) {
        if (!is_array($value))
            return false;
        $returnval = true;
        if ($this->maxsize == 0)
            return true;
        foreach ($value as $val) {
            if (!$val instanceof UploadedFile || !$val->isValid()) {
                $returnval = false;
            }
            $size = $val->getSize() / 1024;
            if ($size > $this->maxsize) {
                $returnval = false;
            }
        }
        return $returnval;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message() {
        return __('uploader::messages.maxsize', ['MAX' => $this->maxsize]);
    }
}
