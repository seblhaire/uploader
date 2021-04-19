<?php
namespace Seblhaire\Uploader;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Description of HomeController
 *
 * @author seb
 */
class FileuploadController extends \Illuminate\Routing\Controller{
    //put your code here
    public function index(Request $request){
        $validator = \Validator::make($request->all(), [
            'file' => 'required|mimes:' . config('uploader.acceptable_mimes'),
            'path' => 'required|string',
            'filename' => 'string|nullable',
            'storagename' => 'string|nullable',
        ]);
        if ($validator->fails()) {
          $erreurs = '';
          foreach ($validator->errors()->all() as $message) {
              $erreurs .= $message;
          }
          return response()->json(['ok' => false, 'msg' => $erreurs]);
        }else{
            $additionalParams = $request->except(['file', 'path', 'filename', 'storagename', '/fileupload']);
            if ($request->file('file')->isValid()) {
                $path = $request->input('path');
                $pathlen = strlen($path) - 1;
                if ($request->has('storagename') && strlen($request->input('storagename')) > 0){
                    $disk = $request->input('storagename');
                }else{
                    $disk = config('filesystems.default');
                }
                if ($path[$pathlen] != '/'){
                    $path .= "/";
                }
                $file = $request->file('file');
                $canOverwrite = ($request->has('filename') && strlen($request->input('filename')) > 0);
                $filename = $canOverwrite ?
                        $request->input('filename') : $file->getClientOriginalName();
                if (!Storage::disk($disk)->exists($path)){
                    Storage::disk($disk)->makeDirectory($path);
                }
                $sections = explode('.', $filename);
                $sectionsize = count($sections);
                if ($sectionsize == 1){
                    $name = $filename;
                    $ext = '';
                }else{
                    $ext = array_pop($sections);
                    $name = implode('.', $sections);
                }
                if (!$canOverwrite){
                    $i = 1;
                    while (Storage::disk($disk)->exists($path . $name . '.' . $ext)){
                        $name .= '-' . $i;
                        $i++;
                    }
                    if ($ext != ''){
                      $filename = $name . '.' . $ext;
                    }else{
                      $filename = $name;
                    }
                }
                $filepath = $request->file('file')->storeAs($path, $filename, $disk);
                return response()->json(array_merge([
                  'ok' => true,
                  'filepath' => $path,
                  'filename' => $filename,
                  'storagename' => $disk,
                  'ext' => $ext,
                  'mimetype' => $file->getMimeType(),
                  'size' =>  $file->getSize()
                ], $additionalParams));
            }else{
                return response()->json(['ok' => true, 'msg' => 'invalid file']);
            }
        }
    }
}
