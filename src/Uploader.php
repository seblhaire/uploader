<?php namespace Seblhaire\Uploader;

use Carbon\Carbon;

/**
* Uploader class to manage uploader
*/
class Uploader{
	private $uploaderElement = null;
  private $label = null;
  private $url = null;
	private $aOptions = array();
	private $additionalParams = array();

	public function __construct($uploaderElement, $label, $url,  $options = array(), $additionalParams = array()){
    $this->uploaderElement = $uploaderElement;
    $this->label = $label;
    $this->url = $url;
		$this->aOptions = array_merge(array_replace(config('uploader'), $options), [
			'csrf' => csrf_token()
		]);;
		$this->additionalParams = $additionalParams;
	}
	public function getUploader(){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader')";
	}

	public function reset(){
		return $this->getUploader() . ".reset();";
	}

	public function setPath($path, $is_string = true)
	{
			if ($is_string){
				return $this->getUploader() . ".setpath('" . $path . "');";
			}else{
				return $this->getUploader() . ".setpath(" . $path . ");";
			}
	}

  public function setstoragename($storagename){
		return $this->getUploader() . ".setstoragename('" . $storagename . "');";
	}

	public function setmaxsize($size){
		return $this->getUploader() . ".setmaxsize(". $size . ");";
	}

	public function setmimes($mimes){
		return $this->getUploader() . ".setmimes('". $mimes . "');";
	}

	public function setrename($val){
		if (is_string($val)){
			$val = $val  == 'true' ? true : false;
		}
		return $this->getUploader() . ".setrename(". (int)$val . ");";
	}

	public function setfilepattern($pattern){
		return $this->getUploader() . ".setfilepattern('". $pattern . "');";
	}

	public function showall(){
		return $this->getUploader() . ".showall();";
	}

	public function showuploader(){
		return $this->getUploader() . ".showuploader();";
	}

	public function hideall(){
		return $this->getUploader() . ".hideall();";
	}

	public function hideuploader(){
		return $this->getUploader() . ".hideuploader();";
	}

	public function toggleall(){
		return $this->getUploader() . ".toggleall();";
	}

	public function toggleuploader(){
		return $this->getUploader() . ".toggleuploader();";
	}

	public function getresultprocessor(){
		return $this->getUploader() . ".getresultprocessor();";
	}

	public function output(){
		$sStr =  '<div id="' . $this->uploaderElement . '" class="' . $this->aOptions['maindiv'] . '">' . PHP_EOL;
		$sStr .= '<label id="' . $this->uploaderElement . '-label" class="' .  $this->aOptions['labelclass']  . '">' . $this->label . '</label>' . PHP_EOL;
    $sStr .= '<div id="' . $this->uploaderElement . '-zone" class="' . $this->aOptions['uploadzoneclass'] . '"';
		$sStr .= '>';
		$sStr .= '</div>' . PHP_EOL;
		$sStr .= '</div>' . PHP_EOL;
		$sStr .= '<script type="text/javascript">' . "\n";
		$sStr .= "jQuery(document).ready(function(){\ntry{\n";
		$sStr .= "jQuery('#" . $this->uploaderElement . "').uploader('" . $this->url;
		$sStr .= "',{\nacceptable_mimes : '" . $this->aOptions['acceptable_mimes']. "',";
		$sStr .= "\nhidden : " . ($this->aOptions['hidden'] ? 'true' : 'false') . ",";
		$sStr .= "\nhiddenuploader : " . ($this->aOptions['hiddenuploader'] ? 'true' : 'false') . ",";
		$sStr .= "\ncsrf : '" . $this->aOptions['csrf']. "',";
		$sStr .= "\ncsrfrefreshroute: " . (is_null($this->aOptions['csrfrefreshroute']) ? 'null' : "'" . $this->aOptions['csrfrefreshroute'] . "'") . ",";
		$sStr .= "\ndelurl: " . (is_null($this->aOptions['delurl']) ? 'null' : "'" . $this->aOptions['delurl'] . "'") . ",";
		$sStr .= "\nresultbaseurl: " . (is_null($this->aOptions['resultbaseurl']) ? 'null' : "'" . $this->aOptions['resultbaseurl'] . "'") . ",";
		$sStr .= "\nmultiple : " . ($this->aOptions['multiple'] ? 'true' : 'false') . ",";
		$sStr .= "\nbuttonclass : '" . $this->aOptions['buttonclass']. "',";
		$sStr .= "\ndraggable : " . ($this->aOptions['draggable'] ? 'true' : 'false') . ",";
		$sStr .= "\nuploadicon : '" . $this->aOptions['uploadicon']. "',";
		$sStr .= "\ndroptext : '" . $this->translateOrPrint($this->aOptions['droptext']) . "',";
		$sStr .= "\ndroptextclass : '" . $this->translateOrPrint($this->aOptions['droptextclass']) . "',";
		$sStr .= "\nuploadtext : '" . $this->translateOrPrint($this->aOptions['uploadtext']) . "',";
		$sStr .= "\nprogbarmainclass : '" . $this->aOptions['progbarmainclass']. "',";
		$sStr .= "\nprogressbar : '" . $this->aOptions['progressbar']. "',";
		$sStr .= "\nresultdivclass : '" . $this->aOptions['resultdivclass']. "',";
		$sStr .= "\nadditionalparamsfn : " . (is_null($this->aOptions['additionalparamsfn']) ? 'null' : $this->aOptions['additionalparamsfn']) . ",";
		$sStr .= "\nafteruploadfn : " . (is_null($this->aOptions['afteruploadfn']) ? 'null' : $this->aOptions['afteruploadfn']) . ",";
		$sStr .= "\nvalidfeedback : '" . $this->translateOrPrint($this->aOptions['valid-feedback']) . "',";
		$sStr .= "\ninvalidfeedback : '" . $this->translateOrPrint($this->aOptions['invalid-feedback']) . "',";
		$sStr .= "\nalerterrorclass : '" . $this->aOptions['alerterrorclass']. "',";
		$sStr .= "\nalertsuccessclass : '" . $this->aOptions['alertsuccessclass']. "',";
		$sStr .= "\nalerttimeout : " . $this->aOptions['alerttimeout']. ",";
		$sStr .= "\npath : '" . $this->aOptions['path']. "',";
		$sStr .= "\nfilepattern: '" . $this->aOptions['filepattern']. "',";
	  $sStr .= "\nstoragename: '" . $this->aOptions['storagename']. "',";
	  $sStr .= "\nrename: " . ($this->aOptions['rename'] ? 'true' : 'false') . ",";
	  $sStr .= "\nmaxfilesizek: " . (is_null($this->aOptions['maxfilesizek']) ? 'null' : $this->aOptions['maxfilesizek']) . ",";
		$sStr .= "\nfailmessage : '" . $this->translateOrPrint($this->aOptions['failmessage']) . "',";
		$sStr .= "\ndelmessage : '" . $this->translateOrPrint($this->aOptions['delete']) . "',";
		$sStr .= "\nresultprocessor : " . $this->aOptions['resultprocessor'] . ",";// . "'";
		$sStr .= "\nfilecontainerclass : '" . $this->aOptions['filecontainerclass'] .  "',";
		$sStr .= "\nfilecontainer : " . $this->aOptions['filecontainer'];
		if (isset($this->aOptions['errorfn'])) {
				$sStr .= ",\nerrorfn : " . $this->aOptions['errorfn'];
		}
    $sStr .= "\n},{\n";
		$params = '';
		foreach($this->additionalParams as $key => $value){
			$params .= (strlen($params) > 0 ? ",\n" : '') . $key . " : ";
			if (is_numeric($value)){
				$params .= $value;
			}else{
				$params .= "'" . addslashes($value) . "'";
			}
		}
		$sStr .= $params . "\n});\n}catch(e){console.log(e)}\n});\n</script>\n";
    return $sStr;
	}

	/**
	 * returns a string or passes translation key to translation function
	 *
	 * @param string $key
	 *            normal string or translation key surrounded by #
	 * @return string text to display
	 */
	private function translateOrPrint($key)
	{
			if (preg_match('/^\#(.+)\#$/', $key, $matches)) {
					return addslashes(__($matches[1]));
			}
			return $key;
	}

	public function __toString(){
			return $this->output();
	}
}
