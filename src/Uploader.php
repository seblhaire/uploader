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

	public function setPath($path, $is_string = true)
	{
			if ($is_string){
				return "jQuery('#" . $this->uploaderElement . "').data('uploader').setpath('" . $path . "');";
			}else{
				return "jQuery('#" . $this->uploaderElement . "').data('uploader').setpath(" . $path . ");";
			}
	}

  public function setstoragename($storagename){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').setstoragename('" . $storagename . "');";
	}

	public function setmaxsize($size){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').setmaxsize(". $size . ");";
	}

	public function setmimes($mimes){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').setmimes('". $mimes . "');";
	}

	public function setoverwrite($val){
		if (is_string($val)){
			$val = $val  == 'true' ? true : false;
		}
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').setoverwrite(". (int)$val . ");";
	}

	public function setfilepattern($pattern){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').setfilepattern('". $pattern . "');";
	}

	public function getresultprocessor(){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').getresultprocessor();";
	}


	public function output(){
		$sStr =  '<div id="' . $this->uploaderElement . '" class="' . $this->aOptions['maindiv'] . '">' . PHP_EOL;
		$sStr .= '<label class="' .  $this->aOptions['labelclass']  . '">' . $this->label . '</label>' . PHP_EOL;
    $sStr .= '<div id="' . $this->uploaderElement . '-zone" class="' . $this->aOptions['uploadzoneclass'] . '"';
		if ($this->aOptions['hidden']){
			$sStr .= ' style="display:none"';
		}
		$sStr .= '>';
		$sStr .= '</div>' . PHP_EOL;
		$sStr .= '</div>' . PHP_EOL;
		$sStr .= '<script type="text/javascript">' . "\n";
		$sStr .= "jQuery(document).ready(function(){\ntry{\n";
		$sStr .= "jQuery('#" . $this->uploaderElement . "').uploader('" . $this->url;
		$sStr .= "',{\nacceptable_mimes : '" . $this->aOptions['acceptable_mimes']. "',";
		$sStr .= "\ncsrf : '" . $this->aOptions['csrf']. "',";
		$sStr .= "\ncsrfrefreshroute: '" . $this->aOptions['csrfrefreshroute']. "',";
		$sStr .= "\nmultiple : " . ($this->aOptions['multiple'] ? 'true' : 'false') . ",";
		$sStr .= "\nbuttonclass : '" . $this->aOptions['buttonclass']. "',";
		$sStr .= "\ndraggable : " . ($this->aOptions['draggable'] ? 'true' : 'false') . ",";
		$sStr .= "\nuploadicon : '" . $this->aOptions['uploadicon']. "',";
		$sStr .= "\ndroptext : '" . $this->translateOrPrint($this->aOptions['droptext']) . "',";
		$sStr .= "\ndroptextclass : '" . $this->translateOrPrint($this->aOptions['droptextclass']) . "',";
		$sStr .= "\nuploadtext : '" . $this->translateOrPrint($this->aOptions['uploadtext']) . "',";
		$sStr .= "\nprogbarmainclass : '" . $this->aOptions['progbarmainclass']. "',";
		$sStr .= "\nprogressbar : '" . $this->aOptions['progressbar']. "',";
		$sStr .= "\nbuildresultdivfn : " . $this->aOptions['buildresultdivfn']. ",";
		$sStr .= "\nvalidfeedback : '" . $this->translateOrPrint($this->aOptions['valid-feedback']) . "',";
		$sStr .= "\ninvalidfeedback : '" . $this->translateOrPrint($this->aOptions['invalid-feedback']) . "',";
		$sStr .= "\nalerterrorclass : '" . $this->aOptions['alerterrorclass']. "',";
		$sStr .= "\nalertsuccessclass : '" . $this->aOptions['alertsuccessclass']. "',";
		$sStr .= "\nalerttimeout : " . $this->aOptions['alerttimeout']. ",";
		$sStr .= "\npath : '" . $this->aOptions['path']. "',";
		$sStr .= "\nfilepattern: '" . $this->aOptions['filepattern']. "',";
	  $sStr .= "\nstoragename: '" . $this->aOptions['storagename']. "',";
	  $sStr .= "\noverwrite: " . ($this->aOptions['overwrite'] ? 'true' : 'false') . ",";
	  $sStr .= "\nmaxfilesizek: " . (is_null($this->aOptions['maxfilesizek']) ? 'null' : $this->aOptions['maxfilesizek']) . ",";
		$sStr .= "\nfailmessage : '" . $this->translateOrPrint($this->aOptions['failmessage']) . "',";
		$sStr .= "\nresultclass : " . $this->aOptions['resultclass'];// . "'";
		if (isset($this->aOptions['errorfn'])) {
				$sStr .= ",\nerrorfn : " . $this->aOptions['errorfn'];
		}
		if (isset($this->aOptions['buildresultdivfn'])) {
				$sStr .= ",\nbuildresultdivfn : " . $this->aOptions['buildresultdivfn'];
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
