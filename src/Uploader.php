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

	public function setfilename($filename){
    return "jQuery('#" . $this->uploaderElement . "').data('uploader').setfilename('" . $filename . "');";
  }

  public function setstoragename($storagename){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').setstoragename('" . $storagename . "');";
	}

	public function addfiletoresults($ext, $url, $content){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').addfiletoresults('" . $ext . "','" . $url . "','" . $content . "');";
	}


	public function output(){
    $sStr =  '<div id="' . $this->uploaderElement . '" class="' . $this->aOptions['uploadzoneclass'] . '"></div>' . "\n";
		$sStr .= '<script type="text/javascript">' . "\n";
		$sStr .= "jQuery(document).ready(function(){\ntry{\n";
		$sStr .= "jQuery('#" . $this->uploaderElement . "').uploader('" . $this->label . "','" . $this->url;
		$sStr .= "',{\nacceptable_mimes : '" . $this->aOptions['acceptable_mimes']. "',";
		$sStr .= "\nformclass : '" . $this->aOptions['formclass']. "',";
		$sStr .= "\ncsrf : '" . $this->aOptions['csrf']. "',";
		$sStr .= "\nformstyle : '" . $this->aOptions['formstyle']. "',";
		$sStr .= "\ndivclass : '" . $this->aOptions['divclass']. "',";
		$sStr .= "\ndivcol : '" . $this->aOptions['divcol']. "',";
		$sStr .= "\nlabelclass : '" . $this->aOptions['labelclass'] . "',";
		$sStr .= "\nbuttonclass : '" . $this->aOptions['buttonclass']. "',";
		$sStr .= "\ndraggable : " . ($this->aOptions['draggable'] ? 'true' : 'false') . ",";
		$sStr .= "\nuploadicon : '" . $this->aOptions['uploadicon']. "',";
		$sStr .= "\ndroptext : '" . $this->translateOrPrint($this->aOptions['droptext']) . "',";
		$sStr .= "\nuploadtext : '" . $this->translateOrPrint($this->aOptions['uploadtext']) . "',";
		$sStr .= "\nuploadcompletetext : '" . $this->translateOrPrint($this->aOptions['uploadcompletetext']) . "',";
		$sStr .= "\nprogbarmainclass : '" . $this->aOptions['progbarmainclass']. "',";
		$sStr .= "\nprogressbarwidth : '" . $this->aOptions['progressbarwidth']. "',";
		$sStr .= "\nprogressbar : '" . $this->aOptions['progressbar']. "',";
		$sStr .= "\nfilelistclass : '" . $this->aOptions['filelistclass']. "',";
		$sStr .= "\nfilelistitem : '" . $this->aOptions['filelistitem']. "',";
		$sStr .= "\nalerterrorclass : '" . $this->aOptions['alerterrorclass']. "',";
		$sStr .= "\nalertsuccessclass : '" . $this->aOptions['alertsuccessclass']. "',";
		$sStr .= "\nalerttimeout : " . $this->aOptions['alerttimeout']. ",";
		$sStr .= "\ndefaultpath : '" . $this->aOptions['defaultpath']. "',";
		$sStr .= "\nfailmessage : '" . $this->translateOrPrint($this->aOptions['failmessage']) . "',";
		$sStr .= "\nfileimagefunction : " . $this->aOptions['fileimagefunction']. ",";
		$sStr .= "\nfilelistimgspanclass : '" . $this->aOptions['filelistimgspanclass']. "',";
		$sStr .= "\nfilelistdivclass : '" . $this->aOptions['filelistdivclass']. "'";
		if (isset($this->aOptions['customresultprocess'])) {
				$sStr .= ",\ncustomresultprocess : " . $this->aOptions['customresultproces'];
		}
		if (isset($this->aOptions['processresultfn'])) {
				$sStr .= ",\nprocessresultfn : " . $this->aOptions['processresultfn'];
		}
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
