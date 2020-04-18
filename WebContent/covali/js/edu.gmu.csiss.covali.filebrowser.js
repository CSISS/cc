edu.gmu.csiss.covali.filebrowser = {
	
    currentPath: '/',
    
    selectedCallback: function() {},
    
    fileListHtml: function(path, files) {
        var fileList = '';
        
        fileList += '<ul class="list-group">';

        if(files[0].name == '..') {
            fileList += '<li class="list-group-item file-browser-item file-browser-directory" data-path="' + files[0].path + '">';
            fileList += '<span class="glyphicon glyphicon-folder-close text-primary"></span>';
            fileList += '<a href="javascript:void(0)"> ..</a>';
            fileList += '</li>';

            files.shift();
        }
        
        files.forEach(function(f){
            var icon = f.type == 'file' ? 'glyphicon-file' : 'glyphicon-folder-open';

            fileList += '<li class="list-group-item file-browser-item file-browser-'+ f.type + '" data-path="' + f.path + '">';
            fileList += '<span class="glyphicon ' + icon + ' text-primary"></span>';
            fileList += '<a href="javascript:void(0)"> ' + f.name +'</a>';
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

            data: "location=" + path,

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

    close: function() {
        edu.gmu.csiss.covali.menu.closeDialog('edu.gmu.csiss.covali.filebrowser.jsframe.LocalFiles');
    },

    init: function() {
    	
    	var dialogName = 'edu.gmu.csiss.covali.filebrowser.jsframe.LocalFiles';
		
    	var dialogTitle = 'Local Files';
		
		var content = "<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
					 '<div id="filebrowser"></div>'+
		
					 "<div class=\"modal-footer\">" +
					 "<p><span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Cancel</span></p>"+
					 "</div>";
		
		edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, content, 600);
		
		edu.gmu.csiss.covali.filebrowser.loadPath('');



    }
}