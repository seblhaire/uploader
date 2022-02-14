<?php namespace Seblhaire\Uploader;

interface UploaderServiceContract{

	public function init($uploaderElement, $label, $url,  $options = array(), $additionalParams = array());

}
