UploadedFileContainerExt = {
  build: function(file, info){
    url = this.buildurl(file, info);
    thumbnail = this.dothumbnail(file.ext, url);
    content = this.docontent(file, this.idx);
    return this.builddiv(this.idx)
        .append(thumbnail)
        .append(content);
  },
  dothumbnail: function(ext, url){
    // builds a thumbnail with Fontawesome icons or a file
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
  docontent: function(fileobj, i){ //prepares data to diplay in result div
    var id = this.processor.uploader.divid;
    if (fileobj.file_id !=  undefined){
      id += '_' + fileobj.file_id;
    }else{
      id += '_' + i;
    }
    // copy button
    var cpbtn = jQuery('<i></i>')
       .attr('title', 'Copy')
       .addClass('far fa-copy uploaderresultbtn copybtn')
       .attr('id', id + '_copy')
       .attr('data-clipboard-text', url);
   var clip = new Clipboard('#' + id + '_copy', {
       text: function(trigger) {
           return jQuery(trigger).attr('data-clipboard-text');
       }
   });
    //delete button
    var delbtn = jQuery('<i></i>')
          .attr('title', 'Delete')
          .addClass('far fa-trash-alt uploaderresultbtn')
          .attr('id', id + '_del')
          .on('click', {uploader: this.processor.uploader, filecont: this}, function(e){
            if (confirm(e.data.uploader.options.delmessage)){
              jQuery.ajax({
                url: e.data.uploader.options.delurl,
                type: 'POST',
                data: {
                  id : fileobj.file_id
                },
                dataType :'json',
                headers: {
                  'X-CSRF-Token': e.data.uploader.options.csrf
                },
              })
              .done(function(result){ //send upload results to result processor
                jQuery('#' + id + '_del').parents('div.uploadres').remove();
                e.data.filecont.processor.removefile(e.data.filecont.idx);
                if (!e.data.uploader.options.multiple){
                  e.data.uploader.showall();
                }
              });
            }
          });
    var p = jQuery('<p></p>');
    if (fileobj.file_id !=  undefined){
      var returnid =  fileobj.file_id;
      p.html('#id: ' + fileobj.file_id);
    }else{
      var returnid = i;
    }
    p.append(cpbtn)
        .append(delbtn)
    var input = jQuery('<input/>').attr('type', 'hidden').attr('name', this.processor.uploader.divid + "[" + i + "]").val(returnid);
    return jQuery('<div></div>')
        .append(jQuery('<h5></h5>').addClass('mt-0 mb-1').html(fileobj.filename))
        .append(input)
        .append(p);
  }
}
// extend base result object
UploadedFileContainerExt = jQuery.extend({}, UploadedFileContainer, UploadedFileContainerExt);
