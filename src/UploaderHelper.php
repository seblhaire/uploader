<?php

namespace Seblhaire\Uploader;

use Illuminate\Support\Facades\Facade;

class UploaderHelper extends Facade {

    /**
     * Builds a facade
     *
     * @return [type] [description]
     */
    protected static function getFacadeAccessor() {
        return 'UploaderService';
    }
}
