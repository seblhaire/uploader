/*Build a div for upload results*/
builduploadresultdiv = function(divid, filelistid){
  var filelist = jQuery('<ul></ul>')
                  .attr('id', filelistid)
                  .addClass('list-unstyled');
  return jQuery('<div></div>')
                  .attr('id', divid)
                  .append(filelist);
}

/*Processor to display upload results*/
UploadresultProcessor = {
  uploader: null,
  init: function(uploader){
    this.uploader = uploader;
  },
  dothumbnail: function(ext, url){ // builds a thumbnal with Fontawesome icons or a file
    var image = false;
    switch(ext){
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
          img = jQuery('<img></img>').addClass('media-object').attr('src', url);
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
     return jQuery('<span></span>')
        .addClass('mediaspan align-self-start')
        .tooltip({ html: true, boundary: 'window', title : "<img class=\"tooltip-img\" src=\"" + url + "\"/>" })
        .append(
          jQuery('<a></a>').attr('href', url).attr('target', '_blank').append(img)
        );
    }else{
      return jQuery('<span></span>')
         .addClass('mediaspan align-self-start')
         .append(
           jQuery('<a></a>').attr('href', url).attr('target', '_blank').append(img)
         );
    }
  },
  addfiletolist: function(thumbnail, content){ // insert file in files list
    var div = jQuery('<div></div>').addClass('media-body').append(content);
    jQuery('#' + this.uploader.filelistid).append(
      jQuery('<li></li>')
          .addClass('media my-4')
          .append(thumbnail)
          .append(div)
    ).show();
  },
  process: function(res){ //  process result of file uploader
    if (res.ok){
      this.uploader.notify(
        this.uploader.options.alertsuccessclass,
        res.filename + ' uploaded'
      );
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
	divid: null, //id of table <div>
  filedivid: null,
  filelistid: null,
  upform: null,
  alertdiv: null,
  formdiv: null,
  button: null,
  input: null,
  pathinput: null,
  filenameinput: null,
  storageinput: null,
  form: null,
  progressbar: null,
  progressdivmain: null,
  progressbarval: null,
  progressval: null,
  progressid: null,
  options: null,
  label: null,
  additionalParams: null,
  resultprocessor: null,
  init: function(element, label, url, options, additionalParams) { // init values
    this.url = url;
    this.div = jQuery(element);
    this.divid = this.div.attr('id');
    this.filedivid = this.divid +'_filesdiv';
    this.filelistid = this.divid +'_filelist';
    this.upform = this.divid + '_uploadform';
    this.alertdivid = this.divid + '_alert';
    this.progressid = this.upform + '_progress';
    this.progressval = this.upform + '_progressval';
    this.options = options;
    this.label = label;
    this.additionalParams = additionalParams;
    this.build();
  },
  build: function(){ // builss uploader
    let self = this;
    let inputCsrf = jQuery('<input/>')
                    .attr('type', 'hidden')
                    .attr('name', '_token')
                    .attr('id', this.upform + '_csrf')
                    .val(this.options.csrf);
    this.input = jQuery('<input/>')
                    .attr('type', 'file')
                    .attr('name', 'file')
                    .attr('style', 'display:none')
                    .attr('id', this.upform + '_file')
                    .val('')
                    .on('change', { self: this }, this.doupload);
    this.pathinput = jQuery('<input/>')
                    .attr('type', 'text')
                    .attr('name', 'path')
                    .attr('style', 'display:none')
                    .attr('id', this.upform + '_path')
                    .val(this.options.defaultpath);
    this.filenameinput = jQuery('<input/>')
                    .attr('type', 'text')
                    .attr('name', 'filename')
                    .attr('style', 'display:none')
                    .attr('id', this.upform + '_filename');
    this.storageinput = jQuery('<input/>')
                    .attr('type', 'text')
                    .attr('name', 'storagename')
                    .attr('style', 'display:none')
                    .attr('id', this.upform + '_storagename');
    let label = jQuery('<label></label>')
                    .html(this.label)
                    .addClass(this.options.labelclass);
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
                    .css('width', this.options.progressbarwidth)
                    .addClass(this.options.progbarmainclass)
                    .append(this.progressbar);
    let labeldiv = jQuery('<div/>')
                    .addClass(this.options.divcol)
                    .append(label);
    let buttondiv = jQuery('<div/>')
                    .append(this.button);
    this.formdiv = jQuery('<div/>')
                    .addClass(this.options.divclass)
                    .append(labeldiv)
                    .append(buttondiv);
    this.form = jQuery('<form/>')
                    .attr('action', this.url)
                    .attr('method', 'post')
                    .attr('enctype', 'multipart/form-data')
                    .attr('id', this.upform)
                    .append(inputCsrf)
                    .append(this.input)
                    .append(this.pathinput)
                    .append(this.filenameinput)
                    .append(this.storageinput)
                    .append(this.formdiv);
    this.alertdiv = jQuery('<div/>')
                    .attr('id', this.alertdivid)
                    .attr('style', 'display:none')
                    .attr('role', 'alert');
    if (this.options.draggable){
      this.div.append(this.form)
                    .append(this.progressdivmain)
                    .append(jQuery('<p/>').append(this.options.droptext))
                    .append(this.alertdiv);
    } else {
      this.div.append(this.form)
                    .append(this.progressdivmain)
                    .append(this.alertdiv);
    }
    if (this.options.buildresultdivfn != undefined){
      var filesdiv = this.options.buildresultdivfn(this.filedivid, this.filelistid);
      filesdiv.insertAfter(this.div);
    }
    if (this.options.draggable){
      jQuery("html").on("dragover, drop", function(e) { //prevent events
         e.preventDefault();
         e.stopPropagation();
      });
      this.div
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
        formData.append('file', e.originalEvent.dataTransfer.files[0]); //starts onchange envent
        formData.append('_token', jQuery('#' + self.upform + '_csrf').val());
        formData.append('path', jQuery(self.pathinput[0]).val());
        formData.append('filename', jQuery(self.filenameinput[0]).val());
        formData.append('storagename', jQuery(self.storageinput[0]).val());
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
    jQuery(this.pathinput[0]).val(path);
  },
  setfilename: function(filename){ //sets new file name after upload
    jQuery(this.filenameinput[0]).val(filename);
  },
  setstoragename: function(storagename){ //set laravel storage name
    jQuery(this.storageinput[0]).val(storagename);
  },
  setAdditionalData: function(formData){ //sets data that can be sent to scripts
    if (self.additionalParams != null) {
      for (key in self.additionalParams){
        formData.append(key, self.additionalParams[key]);
      }
    }
    return formData;
  },
  doupload: function(e){ //prepares data to be sent to file uploader
    var self = e.data.self;
    e.stopPropagation(); // Stop stuff happening
    e.preventDefault(); // T
    self.progressdivmain.show();
    //files = event.target.files;
    var formData = new FormData(self.form[0]);
    formData = self.setAdditionalData(formData);
    self.uploadaction(formData);
  },
  uploadaction: function(formData){ //send file to upload route
    var self = this;
    jQuery.ajax({
      url: self.url,
      type: 'POST',
      dataType :'json',
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
      data: formData,
      //Options signifiant à jQuery de ne pas s'occuper du type de données
      cache: false,
      contentType: false,
      processData: false
    })
    .done(function(res){ //send upload results to result processor
      self.getresultprocessor().process(res);
    })
    .fail(function(jqXHR){ //error processing
      if (self.options.errorfn != undefined){
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
	jQuery.fn.uploader = function(label, url, options, additionalParams)  {
		return this.each(function() {
			var element = jQuery(this);
			if (element.prop('tagName') != 'DIV') throw 'not a DIV';
			// Return early if this element already has a plugin instance
			if (element.data('uploader')) return element.data('uploader');
			var uploader = Object.create(Uploader);
			uploader.init(this, label, url, options, additionalParams);
			// pass options to plugin constructor
			element.data('uploader', uploader);
		});
	};
})(jQuery);
