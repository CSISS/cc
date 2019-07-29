edu.gmu.csiss.covali.filebrowser = {
	
    currentPath: '/',
    
    selectedCallback: function() {},
    
    fileListHtml: function(path, files) {
        var parentPath = path.substring(0, path.lastIndexOf('/'));
        
        var fileList = '';
        
        fileList += '<ul class="list-group">';
        
        if(path != '') {
            fileList += '<li class="list-group-item file-browser-item file-browser-directory" data-path="' + parentPath + '">';
            fileList += '<span class="glyphicon glyphicon-folder-close text-primary"></span>';
            fileList += '<a href="javascript:void(0)"> ..</a>';
            fileList += '</li>';
        }
        
        files.forEach(function(f){
            var icon = f.type == 'file' ? 'glyphicon-file' : 'glyphicon-folder-open';

            var localName = f.name.substring(f.name.lastIndexOf('/') + 1);
            fileList += '<li class="list-group-item file-browser-item file-browser-'+ f.type + '" data-path="' + f.name + '">';
            fileList += '<span class="glyphicon ' + icon + ' text-primary"></span>';
            fileList += '<a href="javascript:void(0)"> ' + localName +'</a>';
            fileList += '</li>';
        });
        
        fileList += '</ul>';
        
        return $(fileList)
        
    },
    
    updateBrowserContents: function(path, files) {
        $('#filebrowser').html(edu.gmu.csiss.covali.filebrowser.fileListHtml(path, files));

        // folder click event
        $('.file-browser-directory').each(function(e){
            var folder = $(this).data('path');
            $(this).click(function(){
                edu.gmu.csiss.covali.filebrowser.loadPath(folder);
            });
        });

        // file click event
        $('.file-browser-file').each(function(e){
            $(this).click(function(){
                console.log($(this));
                edu.gmu.csiss.covali.filebrowser.selectedCallback($(this).data('path'));
                $('.dialog-close-button').click();

            });
        });


        edu.gmu.csiss.covali.filebrowser.currentPath = path;
    },

    loadPath: function(path) {

        $.ajax({
            contentType: "application/x-www-form-urlencoded",

            type: "POST",

            url: "../web/localfilelist",

            data: "root=" + path,

            success: function (obj, text, jxhr) {
                var obj = jQuery.parseJSON(obj);

                if (obj.ret == "login") {
                    edu.gmu.csiss.covali.login.loginDialog(edu.gmu.csiss.covali.filebrowser.loadPath, path);
                } else {
                    edu.gmu.csiss.covali.filebrowser.updateBrowserContents(path, obj);

                }
            }
        });

    },

    init: function() {
        BootstrapDialog.show({
            title: "Local Files",

            cssClass: 'dialog-vertical-center dialog-local-file-list',

            message: function(dialog) {
                return($('<div id="filebrowser"></div>'));

            },

            onshown: function() {
                edu.gmu.csiss.covali.filebrowser.loadPath('');

            },

            buttons: [
                {
                    label: 'Cancel',
                    cssClass: 'btn-default dialog-close-button',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
        });


    }
}