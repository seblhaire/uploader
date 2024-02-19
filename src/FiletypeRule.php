<?php

namespace Seblhaire\Uploader;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FiletypeRule implements Rule {

    protected $request;
    protected $mimes;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(FormRequest $request) {
        $this->request = $request;
        if ($this->request->has('mimes')) {
            $this->mimes = explode(',', $this->request->input('mimes'));
        } else if (is_null(config('uploader.acceptable_mimes'))) {
            $this->mimes = null;
        } else {
            $this->mimes = explode(',', config('uploader.acceptable_mimes'));
        }
        if (in_array('jpg', $this->mimes) || in_array('jpeg', $this->mimes)) {
            $this->mimes = array_unique(array_merge($this->mimes, ['jpg', 'jpeg']));
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
        if (is_null($this->mimes))
            return true;
        foreach ($value as $val) {
            if (!$val instanceof UploadedFile || !$val->isValid()) {
                $returnval = false;
            }
            if ($val->getPath() == '' || !in_array($val->guessExtension(), $this->mimes)) {
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
        return __('uploader::messages.filetype');
    }
}
