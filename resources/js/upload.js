/*Build a div for upload results*/
builduploadresultdiv = function(divid){
  return jQuery('<div></div>')
                  .attr('id', divid)
}

/*Processor to display upload results*/
UploadresultProcessor = {
  uploader: null, //uploader object
  init: function(uploader){
    this.uploader = uploader;
  },
  dothumbnail: function(ext, url){
    // builds a thumbnal with Fontawesome icons or a file
    var image = false;
    switch(ext){
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
          img = jQuery('<img></img>').addClass('uploadimg').attr('src', url);
          image = true;
          break;
      case 'pdf':
          img = jQuery('<i></i>').addClass('fas fa-file-pdf fa-5x');
          break;
      case 'doc':
      case 'rtf':
      case 'docx':
      case 'doc':
      case 'odt':
          img = jQuery('<i></i>').addClass('fas fa-file-word fa-5x');
          break;
      case 'txt':
          img = jQuery('<i></i>').addClass('far fa-file-alt fa-5x');
          break;
      case 'html':
      case 'htm':
      case 'xml':
          img = jQuery('<i></i>').addClass('fas fa-file-code fa-5x');
          break;
      case 'ogg':
      case 'mp3':
      case 'aac':
      case 'raw':
      case 'flac':
      case 'au':
          img = jQuery('<i></i>').addClass('fas fa-file-audio fa-5x');
          break;
      case 'zip':
      case 'gz':
          img = jQuery('<i></i>').addClass('far fa-file-archive fa-5x');
          break;
      case 'xls':
      case 'ods':
      case 'csv':
          img = jQuery('<i></i>').addClass('fas fa-file-excel fa-5x');
          break;
      case 'ppt':
      case 'odp':
          img = jQuery('<i></i>').addClass('far fa-file-powerpoint fa-5x');
          break;
      case 'avi':
      case 'mov':
      case 'mpg':
      case 'mpeg':
      case 'mpa':
      case 'asf':
      case 'wma':
      case 'mp2':
          img = jQuery('<i></i>').addClass('far fa-file-video fa-5x');
          break;
      default:
          img = jQuery('<i></i>').addClass('far fa-file fa-5x');
    }
    if (image){
     return jQuery('<div></div>')
        .addClass('flex-shrink-0 uploadicon')
        .tooltip({ html: true, boundary: 'window', title : "<img class=\"tooltip-img\" src=\"" + url + "\"/>" })
        .append(
          jQuery('<a></a>').attr('href', url).attr('target', '_blank').append(img)
        );
    }else{
      return jQuery('<div></div>')
         .addClass('flex-shrink-0 uploadicon')
         .append(
           jQuery('<a></a>').attr('href', url).attr('target', '_blank').append(img)
         );
    }
  },
  countFiles : function(){
    // counts uploaded files, can be used by form validation
    return jQuery('#' + this.uploader.filedivid).find('input').length;
  },
  addfiletolist: function(thumbnail, content){ // insert file in files list
    var div = jQuery('<div></div>').addClass('flex-grow-1 ms-3').append(content);
    jQuery('#' + this.uploader.filedivid).append(
      jQuery('<div></div>')
          .addClass('d-flex uploadres')
          .append(thumbnail)
          .append(div)
    ).show();
    if (!this.uploader.options.multiple){
      this.uploader.uploaddiv.hide()
    }
  },
  process: function(res){ //  process result of file uploader
    if (res.ok){
      filenames = '';
      jQuery.each(res.files, function(i, file) { //processes each uploaded file
        filenames += file.filename + ' ';
      });
      this.uploader.notify(
        this.uploader.options.alertsuccessclass,
        filenames + 'uploaded'
      );
      if (!this.uploader.options.multiple){
        this.uploader.uploaddiv.hide()
      }
    } else {
      this.uploader.notify(
        this.uploader.options.alerterrorclass,
        res.message
      );
    }
  }
}

/*builds uploader itself*/
var Uploader = {
  url: null, // url of function
  div: null,
  uploaddiv : null,
	divid: null, //id of table <div>
  filedivid: null,
  upform: null,
  alertdiv: null,
  button: null,
  input: null,
  pathinput: null,
  filepatterninput: null,
  storageinput: null,
  singleinput: null,
  overwriteinput: null,
  maxsizeinput: null,
  mimesinput: null,
  form: null,
  progressbar: null,
  progressdivmain: null,
  progressbarval: null,
  progressval: null,
  progressid: null,
  options: null,
  path: null,
  filepattern: null,
  storagename: null,
  overwrite:  null,
  maxsize: null,
  mimes: null,
  additionalParams: null,
  resultprocessor: null,
  init: function(element, url, options, additionalParams) { // init values
    this.url = url;
    this.div = jQuery(element);
    this.divid = this.div.attr('id');
    this.uploaddiv = jQuery('#' + this.divid + '-zone');
    this.filedivid = this.divid +'_filesdiv';
    this.upform = this.divid + '_uploadform';
    this.alertdivid = this.divid + '_alert';
    this.progressid = this.upform + '_progress';
    this.progressval = this.upform + '_progressval';
    this.options = options;
    this.path = this.options.path;
    this.filepattern = this.options.filepattern;
    this.storagename = this.options.storagename;
    this.overwrite = this.options.overwrite ? 1 : 0;
    this.maxsize = this.options.maxfilesizek;
    this.mimes = this.options.acceptable_mimes;
    this.additionalParams = additionalParams;
    this.build();
  },
  reset : function(){
    this.uploaddiv.show();
    jQuery('#' + this.filedivid).html('');
  },
  build: function(){ // builss uploader
    let self = this;
    this.progressbar = jQuery('<div></div>')
                    .addClass(this.options.progressbar)
                    .attr('id', this.progressid)
                    .attr('role', 'progressbar')
                    .attr('aria-valuenow', "0")
                    .attr('aria-valuemin', "0")
                    .attr('aria-valuemax', "100")
                    .css('width', '0%');
    this.progressdivmain = jQuery('<div></div>')
                    .css('display', 'none')
                    .addClass(this.options.progbarmainclass)
                    .append(this.progressbar);
    var zone = null;
    if (this.div.parents('form').length > 0){
      zone = this.uploaddiv
    }else{
      zone = jQuery('<form/>')
                    .attr('action', this.url)
                    .attr('method', 'post')
                    .attr('enctype', 'multipart/form-data')
                    .attr('id', this.upform);
        this.uploaddiv.append(zone);
    }
    this.input = jQuery('<input/>')
                    .attr('type', 'file')
                    .addClass('uploader')
                    .attr('name', this.upform + '_file')
                    .attr('style', 'display:none')
                    .attr('id', this.upform + '_file')
                    .val('')
                    .on('change', { self: this }, this.doupload);
    if (this.options.multiple){
      this.input.attr('multiple', 'multiple');
    }
    this.button = jQuery('<button></button>')
                    .addClass(this.options.buttonclass)
                    .attr('id', this.upform + '_uploadbtn')
                    .attr('type', 'submit')
                    .on('click', { self: this }, function(event) {
          						event.data.self.buttonclick(event)
          					}).html(
                      '<em class="' + this.options.uploadicon +'"></em> ' +
                      this.options.uploadtext
                    );
    zone.append(this.input)
      .append(this.button);
    this.alertdiv = jQuery('<div/>')
                    .attr('id', this.alertdivid)
                    .attr('style', 'display:none')
                    .attr('role', 'alert');
    if (this.options.draggable == true){
      this.uploaddiv.append(this.progressdivmain)
                    .append(
                      jQuery('<div/>')
                        .addClass(this.options.droptextclass)
                        .append(this.options.droptext)
                    )
                    .append(this.alertdiv);
    } else {
      this.uploaddiv.append(this.progressdivmain)
                    .append(this.alertdiv);
    }
    if (this.options.invalidfeedback.length > 0){
      this.uploaddiv.append(jQuery('<div/>').addClass('invalid-feedback').html(this.options.invalidfeedback));
    }
    if (this.options.validfeedback.length > 0){
      this.uploaddiv.append(jQuery('<div/>').addClass('valid-feedback').html(this.options.validfeedback));
    }
    if (this.options.buildresultdivfn != undefined){
      var filesdiv = this.options.buildresultdivfn(this.filedivid);
      filesdiv.insertAfter(this.uploaddiv);
    }
    if (this.options.draggable == true){
      jQuery("html").on("dragover, drop", function(e) { //prevent events
         e.preventDefault();
         e.stopPropagation();
      });
      this.uploaddiv
      .on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function() {
        self.div.addClass('targetted');
      })
      .on('dragleave dragend drop', function() {
        self.div.removeClass('targetted');
      })
      .on('drop', function(e) {
        self.progressdivmain.show();
        var formData = new FormData();
        jQuery.each(e.originalEvent.dataTransfer.files, function(i, file) {
          formData.append('file[]', file);
        });
        formData.append('path', self.path);
        formData.append('filepattern', self.filepattern);
        formData.append('storagename', self.storagename);
        formData.append('overwrite', self.overwrite);
        formData.append('maxsize', self.maxsize);
        formData.append('mimes', self.mimes);
        formData = self.setAdditionalData(formData);
        self.uploadaction(formData);
      });
    }
    this.resultprocessor = Object.create(self.options.resultclass);
    this.resultprocessor.init(this);
  },
  getresultprocessor: function(){ // gets result processor attached to uploader
    return this.resultprocessor;
  },
  updateProgress: function(percent){ // sets progress bar values
    //  this.progressbarval.val(percent);
      this.progressbar.attr('aria-valuenow', percent).css('width', percent +'%');
  },
  buttonclick: function(e){  // action for upload button
    e.preventDefault();
    var self = e.data.self;
    self.updateProgress(0);
    self.input.trigger('click');
  },
  notify: function(alertclass, message){ //notify results in alert div
    this.alertdiv
        .removeClass()
        .addClass(alertclass)
        .html(message)
        .show();
    var self = this;
    var to = setTimeout(function() { self.alertdiv.hide(); }, this.options.alerttimeout);
  },
  beforeUploadSubmit: function(){ //check browser functions
      if (!window.File || !window.FileReader || !window.FileList || !window.Blob){
          alert("Please upgrade your browser, because your current browser lacks some new features we need!");
      }
  },
  setpath: function(path){  //set path values where to upload file
    this.path = path;
  },
  setstoragename: function(storagename){ //set laravel storage name
    this.storagename = storagename;
  },
  setfilepattern : function(pattern){
    this.filepattern = pattern;
  },
  setoverwrite: function(val){
    this.overwrite = val;
  },
  setmaxsize: function(size){
    this.maxsize = size;
  },
  setmimes: function(mimes){
    this.mimes = mimes;
  },
  setAdditionalData: function(formData){ //sets data that can be sent to scripts
    if (this.additionalParams != null) {
      for (key in this.additionalParams){
        formData.append(key, this.additionalParams[key]);
      }
    }
    return formData;
  },
  doupload: function(e){ //prepares data to be sent to file uploader
    var self = e.data.self;
    e.stopPropagation(); // Stop stuff happening
    e.preventDefault(); // T
    self.progressdivmain.show();
    var formData = new FormData();
    jQuery.each(self.input[0].files, function(i, file) {
      formData.append('file[]', file);
    });
    formData.append('path', self.path);
    formData.append('filepattern', self.filepattern);
    formData.append('storagename', self.storagename);
    formData.append('overwrite', self.overwrite);
    formData.append('maxsize', self.maxsize);
    formData.append('mimes', self.mimes);
    formData = self.setAdditionalData(formData);
    self.uploadaction(formData);
  },
  refreshToken: function (){
		var self = this;
    if (self.options.csrfrefreshroute != null){
	    jQuery.get(self.options.csrfrefreshroute, function(data){
	        self.options.csrf = data;
	    });
    }
	},
  uploadaction: function(formdata){ //send file to upload route
    var self = this;
    jQuery.ajax({
      url: self.url,
      type: 'POST',
      data: formdata,
      dataType :'json',
      headers: {
        'X-CSRF-Token': self.options.csrf
      },
      xhr: function() { // xhr qui traite la barre de progression
        myXhr = jQuery.ajaxSettings.xhr();
        if(myXhr.upload){ // vérifie si l'upload existe
          myXhr.upload.addEventListener('progress',  function(e){
            if (e.lengthComputable){
              pc = (e.loaded / e.total) * 100;
              self.updateProgress(pc);
            }
          }, false);
        }
        return myXhr;
      },
      beforeSend: self.beforeUploadSubmit,
      //Options signifiant à jQuery de ne pas s'occuper du type de données
      cache: false,
      contentType: false,
      processData: false
    })
    .done(function(res){ //send upload results to result processor
      self.getresultprocessor().process(res);
    })
    .fail(function(jqXHR){ //error processing
      if (jqXHR.status == 419){
        self.refreshToken();
        self.uploadaction(formdata);
      }
      else if (self.options.errorfn != undefined){
        self.options.errorfn(self.options.failmessage);
      }else{
        self.notify(self.options.alerterrorclass, self.options.failmessage);
      }
    })
    .always(function(){ // resets progress bar
      self.updateProgress(0);
      var to = setTimeout(function() { self.progressdivmain.hide(); }, 2000);
    })
  }
}
if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		function F() { } // optionally move this outside the declaration and into a closure if you need more speed.
		F.prototype = o;
		return new F();
	};
}
// table builder function
(function(jQuery) {
	/* Create plugin
	@param string url url for uploader
	@param array cols table columns
	@params object options
	*/
	jQuery.fn.uploader = function(url, options, additionalParams)  {
		return this.each(function() {
			var element = jQuery(this);
			if (element.prop('tagName') != 'DIV') throw 'not a DIV';
			// Return early if this element already has a plugin instance
			if (element.data('uploader')) return element.data('uploader');
			var uploader = Object.create(Uploader);
			uploader.init(this, url, options, additionalParams);
			// pass options to plugin constructor
			element.data('uploader', uploader);
		});
	};
})(jQuery);
