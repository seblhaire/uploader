<?php namespace Seblhaire\Uploader;

use Carbon\Carbon;

class UploaderService implements UploaderServiceContract{
	private $uploaderElement = null;
  private $label = null;
  private $url = null;
	private $aOptions = array();


	public function init($uploaderElement, $label, $url,  $options = array(), $additionalParams = array()){
    return new Uploader($uploaderElement, $label, $url,  $options, $additionalParams);
	}
}
