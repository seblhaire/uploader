<?php

namespace Seblhaire\Uploader;

use Illuminate\Support\ServiceProvider;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use \Illuminate\Support\Facades\Validator;

class UploaderServiceProvider extends ServiceProvider
{
     protected $defer = true;
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
       $this->loadTranslationsFrom(__DIR__ . '/../resources/lang', 'uploader');
       $this->publishes([
           __DIR__ . '/../config/uploader.php' => config_path('uploader.php'),
           __DIR__ . '/../resources/lang' => resource_path('lang/vendor/uploader'),
           __DIR__ . '/../resources/js/upload.js' => resource_path('js/vendor/seblhaire/uploader/upload.js'),
           __DIR__ . '/../resources/css/upload.css' => resource_path('css/vendor/seblhaire/uploader/upload.css'),
       ]);
    }

    /**
     * Register the application services.
     *
     * @return void
     */

    public function register()
    {
      $this->mergeConfigFrom(__DIR__ . '/../config/uploader.php', 'uploader');
      $this->app->singleton('UploaderService', function ($app) {
          return new UploaderService();
      });
    }

    public function provides() {
        return [UploaderServiceContract::class];
    }
}
