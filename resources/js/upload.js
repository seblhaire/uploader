/*Processor to display upload results*/
UploadedFileContainer = {
  processor: null,
  idx : null,
  init: function(processor){
    this.processor = processor;
    this.idx = this.processor.uploader.fileidx;
  },
  build: function(file, info){
    link = jQuery('<a></a>')
        .attr('href', this.buildurl(file, info))
        .attr('target', '_blank')
        .html(file.filename);
    return this.builddiv(this.idx)
        .html('#' + file.file_id + '&nbsp;')
        .append(link);
  },
  builddiv: function(idx){
    return jQuery('<div></div>')
        .attr('id', this.processor.uploader.filedivid + '_file_' + idx)
        .addClass(this.processor.uploader.options.filecontainerclass);
  },
  buildurl: function(file, info){
    if (file.url != undefined){
      return file.url;
    }else{
      if (info != undefined && info.baseurl != undefined && info.baseurl != null){
        return info.baseurl + file.filename;
      }else if (this.processor.baseurl != undefined && this.processor.baseurl != null){
        return this.processor.baseurl + file.filename;
      }else if (this.processor.uploader.options.resultbaseurl != undefined && this.processor.uploader.options.resultbaseurl != null){
        return this.processor.uploader.options.resultbaseurl + file.filename;
      }
    }
  }
}

UploadresultProcessor = {
  uploader: null, //uploader object
  filelist: null,
  init: function(uploader){
    this.uploader = uploader;
    this.filelist = [];
  },
  countFiles: function(){
    return this.filelist.length;
  },
  removefile: function(pos){
    this.filelist.splice(pos, 1);
  },
  process: function(res){ //  process result of file uploader
    if (res.ok){
      let self = this;
      jQuery.each(res.files, function(i, file) { //processes each uploaded file
        filecontainer = Object.create(self.uploader.options.filecontainer);
        filecontainer.init(self);
        if (res.info != undefined){
          info = res.info;
        }else{
          info = null;
        }
        self.filelist[self.uploader.fileidx] = file;
        jQuery('#' + self.uploader.filedivid).append(filecontainer.build(file, info));
        self.uploader.fileidx++;
      });
      if (!self.uploader.options.multiple){
        self.uploader.uploaddiv.hide();
      }
    } else {
      this.uploader.notify(
        this.uploader.options.alerterrorclass,
        res.message
      );
    }
  },
  buildresdiv: function(id, myclass){
    return jQuery('<div></div>')
                    .attr('id', id)
                    .addClass(myclass);
  }
}

/*builds uploader itself*/
var Uploader = {
  url: null, // url of function
  delurl: null,
  resultbaseurl: null,
  div: null,
  uploaddiv : null,
	divid: null, //id of table <div>
  filediv: null,
  filedivid: null,
  upform: null,
  alertdiv: null,
  button: null,
  input: null,
  pathinput: null,
  filepatterninput: null,
  storageinput: null,
  singleinput: null,
  renameinput: null,
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
  rename:  null,
  maxsize: null,
  mimes: null,
  additionalParams: null,
  resultprocessor: null,
  fileidx: 0,
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
    this.delurl = this.options.delurl;
    this.resultbaseurl = this.options.resultbaseurl;
    this.filepattern = this.options.filepattern;
    this.storagename = this.options.storagename;
    this.rename = this.options.rename ? 1 : 0;
    this.maxsize = this.options.maxfilesizek;
    this.mimes = this.options.acceptable_mimes;
    this.additionalParams = additionalParams;
    this.build();
  },
  reset : function(){
    this.uploaddiv.show();
    this.resultprocessor.filelist = [];
    jQuery('#' + this.filedivid).html('');
  },
  build: function(){ // builss uploader
    let self = this;
    this.resultprocessor = Object.create(this.options.resultprocessor);
    this.resultprocessor.init(this);
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
      zone = this.uploaddiv;
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
    this.filesdiv = this.resultprocessor.buildresdiv(this.filedivid, this.options.resultdivclass)
    this.filesdiv.insertAfter(this.uploaddiv);
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
        formData.append('rename', self.rename);
        formData.append('maxsize', self.maxsize);
        formData.append('mimes', self.mimes);
        formData = self.setAdditionalData(formData);
        self.uploadaction(formData);
      });
    }
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
    var to = setTimeout(function() {
      self.alertdiv.hide();
    }, this.options.alerttimeout);
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
  setrename: function(val){
    this.rename = val;
  },
  setmaxsize: function(size){
    this.maxsize = size;
  },
  setmimes: function(mimes){
    this.mimes = mimes;
  },
  setAdditionalData: function(formData){ //sets data that can be sent to scripts
    if (this.additionalParams != null) {
      if (this.options.additionalparamsfn != null) {
        let paramsFn = this.options.additionalparamsfn();
        myParams = jQuery.extend({}, this.additionalParams, paramsFn);
      } else {
        myParams = this.additionalParams;
      }
      for (key in myParams){
        formData.append(key, myParams[key]);
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
    formData.append('rename', self.rename);
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
      if (self.options.afteruploadfn != undefined){
        self.options.afteruploadfn(res);
      }
    })
    .fail(function(jqXHR){ //error processing
      if (jqXHR.responseJSON != undefined && jqXHR.responseJSON.message != ''){
        error = jqXHR.responseJSON.message;
      }else{
        error = self.options.failmessage;
      }
      if (jqXHR.status == 419){
        self.refreshToken();
        self.uploadaction(formdata);
      }
      else if (self.options.errorfn != undefined){
        self.options.errorfn(error);
      }else{
        self.notify(self.options.alerterrorclass, error);
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
