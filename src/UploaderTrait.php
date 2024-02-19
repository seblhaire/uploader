<?php

namespace Seblhaire\Uploader;

use Illuminate\Support\Facades\Storage;
use Stringy\Stringy as S;

trait UploaderTrait {

    /**
     * Builds object from filename to be used in trait
     * @return Stdclass
     */
    protected function buildFileObj($filename) {
        $sections = explode('.', $filename);
        $sectionsize = count($sections);
        $file = new \stdClass;
        if ($sectionsize == 1) {
            $file->name = $filename;
            $file->ext = '';
        } else {
            $file->ext = array_pop($sections);
            $file->name = implode('.', $sections);
        }
        return $file;
    }

    /**
     * builds unique file name in upload directory
     * @return string
     */
    protected function buildUniqueFileName($disk, $path, $fileobj, $separator = '-') {
        $i = 1;
        $filename = $fileobj->name . ((strlen($fileobj->ext) > 0) ? '.' . $fileobj->ext : '');
        while (Storage::disk($disk)->exists($path . $filename)) {
            $filename = $fileobj->name . $separator . $i . ((strlen($fileobj->ext) > 0) ? '.' . $fileobj->ext : '');
            $i++;
        }
        return $filename;
    }

    /**
     * remove accentuated characters abd white spaces from file name
     * @return string
     */
    protected function cleanFileName($filename) {
        return S::create($filename)->toAscii()->stripWhitespace()->replace("'", '');
    }

    /**
     * Returns file path defined from default config files or from uploader parameters.
     *  @return string
     */
    protected function getPath($request) {
        $path = $request->has('path') ? $request->input('path') : config('uploader.defaultpath');
        $pathlen = strlen($path) - 1;
        if ($path[$pathlen] != '/') {
            $path .= "/";
        }
        if ($path[0] != '/') {
            $path = $path . "/";
        }
        return $path;
    }

    /**
     * return storage name either from default config files or from uploder parameters and
     * creates directory from path 
     * @return string
     */
    protected function getDisk($request, $path) {
        if ($request->has('storagename') && strlen($request->input('storagename')) > 0) {
            $disk = $request->input('storagename');
        } else {
            $disk = config('filesystems.default');
        }
        if (!Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->makeDirectory($path);
        }
        return $disk;
    }
}
