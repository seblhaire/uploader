<?php

return [
    'draggable' => true,
    'hidden' => false,
    'hiddenuploader' => false,
    'multiple' => false,
    'maindiv' => 'mb-3',
    'uploadzoneclass' => 'uploadzone',
    'acceptable_mimes' => 'png,jpg,jpeg,gif,doc,rtf,docx,doc,pdf,txt,htm,html,odt,ogg,mp3,aac,raw,flac,au,zip,gz,xls,ods,csv,ppt,odp,avi,mov,mpg,mpeg,mpa,asf,wma,mp2',
    'droptext' => '#uploader::messages.droptext#',
    'droptextclass' => 'form-text',
    'labelclass' => 'form-label',
    'buttonclass' => 'btn btn-dark',
    'uploadicon' => "fas fa-upload",
    'uploadtext' => "#uploader::messages.uploadtext#",
    'progbarmainclass' => "progress uploaderprogress",
    "progressbar" => "progress-bar progress-bar-striped progress-bar-animated",
    'failmessage' => "#uploader::messages.failmessage#",
    'invalid-feedback' => "#uploader::messages.noupload#",
    'valid-feedback' => "",
    'alerterrorclass' => 'alert alert-danger',
    'alertsuccessclass' => 'alert alert-success',
    'alerttimeout' => 10000,
    'path' => "/",
    'filepattern' => '',
    'storagename' => '',
    'rename' => false,
    'maxfilesizek' => 0,
    'resultprocessor' => 'UploadresultProcessor',
    'filecontainer' => 'UploadedFileContainer',
    'filecontainerclass' => 'd-flex uploadres',
    'errorfn' => null,
    'resultdivclass' => 'uploadresdiv',
    'delurl' => null,
    'resultbaseurl' => null,
    'additionalparamsfn' => null,
    'delete' => "#uploader::messages.delete#",
    'afteruploadfn' => null,
];
