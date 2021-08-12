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

	public function getresultprocessor(){
		return "jQuery('#" . $this->uploaderElement . "').data('uploader').getresultprocessor();";
	}


	public function output(){
    $sStr =  '<div id="' . $this->uploaderElement . '" class="' . $this->aOptions['uploadzoneclass'] . '"';
		if ($this->aOptions['hidden']){
			$sStr .= ' style="display:none"';
		}
		$sStr .= '></div>' . "\n";
		$sStr .= '<script type="text/javascript">' . "\n";
		$sStr .= "jQuery(document).ready(function(){\ntry{\n";
		$sStr .= "jQuery('#" . $this->uploaderElement . "').uploader('" . $this->label . "','" . $this->url;
		$sStr .= "',{\nacceptable_mimes : '" . $this->aOptions['acceptable_mimes']. "',";
		$sStr .= "\ncsrf : '" . $this->aOptions['csrf']. "',";
		$sStr .= "\nformstyle : '" . $this->aOptions['formstyle']. "',";
		$sStr .= "\ndivclass : '" . $this->aOptions['divclass']. "',";
		$sStr .= "\ndivcol : '" . $this->aOptions['divcol']. "',";
		$sStr .= "\nlabelclass : '" . $this->aOptions['labelclass'] . "',";
		$sStr .= "\nbuttondivclass : '" . $this->aOptions['buttondivclass'] . "',";
		$sStr .= "\nbuttonclass : '" . $this->aOptions['buttonclass']. "',";
		$sStr .= "\ndraggable : " . ($this->aOptions['draggable'] ? 'true' : 'false') . ",";
		$sStr .= "\nuploadicon : '" . $this->aOptions['uploadicon']. "',";
		$sStr .= "\ndroptext : '" . $this->translateOrPrint($this->aOptions['droptext']) . "',";
		$sStr .= "\ndroptextclass : '" . $this->translateOrPrint($this->aOptions['droptextclass']) . "',";
		$sStr .= "\nuploadtext : '" . $this->translateOrPrint($this->aOptions['uploadtext']) . "',";
		$sStr .= "\nprogbarmainclass : '" . $this->aOptions['progbarmainclass']. "',";
		$sStr .= "\nprogressbarwidth : '" . $this->aOptions['progressbarwidth']. "',";
		$sStr .= "\nprogressbar : '" . $this->aOptions['progressbar']. "',";
		$sStr .= "\nbuildresultdivfn : " . $this->aOptions['buildresultdivfn']. ",";
		$sStr .= "\nalerterrorclass : '" . $this->aOptions['alerterrorclass']. "',";
		$sStr .= "\nalertsuccessclass : '" . $this->aOptions['alertsuccessclass']. "',";
		$sStr .= "\nalerttimeout : " . $this->aOptions['alerttimeout']. ",";
		$sStr .= "\ndefaultpath : '" . $this->aOptions['defaultpath']. "',";
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
