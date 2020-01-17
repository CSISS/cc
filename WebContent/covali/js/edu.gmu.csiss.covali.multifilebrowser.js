edu.gmu.csiss.covali.multifilebrowser = {
    selectedFiles: [],
    currentPath: '/',
    selectedCallback: function() {},

    toggleSelect: function(e) {
        var file = e.data('path');

        if(e.hasClass('selected')) {
            // remove selection
            edu.gmu.csiss.covali.multifilebrowser.selectedFiles.splice($.inArray(file), 1);
        } else {
            edu.gmu.csiss.covali.multifilebrowser.selectedFiles.push(file);
        }

        e.toggleClass('selected');

        console.log(edu.gmu.csiss.covali.multifilebrowser.selectedFiles);
    },

    updateBrowserContents: function(path, files) {
        // var parentPath = path.substring(0, path.lastIndexOf('/'));
        // if(parentPath == "") {
        //     parentPath = '/';
        // }
        //
        // // add trailing slash to folders
        // if(path.lastIndexOf('/') != path.length - 1) {
        //     path = path + '/'
        // }
        //
        //
        // var fileList = '';
        //
        // fileList += '<ul class="list-group">';
        //
        // if(path != '/') {
        //     fileList += '<li class="list-group-item file-browser-item file-browser-directory" data-path="' + parentPath + '">';
        //     fileList += '<span class="glyphicon glyphicon-folder-close text-primary"></span>';
        //     fileList += '<a href="javascript:void(0)"> ..</a>';
        //     fileList += '</li>';
        // }
        //
        // files.forEach(function(f){
        //     var icon = f.type == 'file' ? 'glyphicon-file' : 'glyphicon-folder-open';
        //     var fullPath = path + f.name;
        //     if(f.type == 'file') {
        //         // remove leading slash from file paths
        //         fullPath = fullPath.substring(1)
        //     }
        //     var selected = edu.gmu.csiss.covali.multifilebrowser.selectedFiles.includes(fullPath) ? 'selected' : '';
        //     fileList += '<li class="' + selected + ' list-group-item file-browser-item file-browser-'+ f.type + '" data-path="' + fullPath + '">';
        //     fileList += '<span class="glyphicon ' + icon + ' text-primary"></span>';
        //     fileList += '<a href="javascript:void(0)"> ' + f.name +'</a>';
        //     fileList += '</li>';
        // });
        //
        // fileList += '</ul>';

        $('#multifilebrowser').html(edu.gmu.csiss.covali.filebrowser.fileListHtml(path, files));



        // folder click event
        $('.file-browser-directory').each(function(e){
            var folder = $(this).data('path');
            $(this).click(function(){
                edu.gmu.csiss.covali.multifilebrowser.loadPath(folder);
            });
        });

        // file click event
        $('.file-browser-file').each(function(e){
            var path = $(this).data('path');
            if(edu.gmu.csiss.covali.multifilebrowser.selectedFiles.includes(path)) {
                $(this).addClass('selected');
            }

            $(this).click(function(){
                edu.gmu.csiss.covali.multifilebrowser.toggleSelect($(this));
            });
        });

        edu.gmu.csiss.covali.multifilebrowser.currentPath = path;
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
                    edu.gmu.csiss.covali.login.loginDialog(edu.gmu.csiss.covali.multifilebrowser.loadPath, path);
                } else {
                    edu.gmu.csiss.covali.multifilebrowser.updateBrowserContents(path, obj);

                }
            }
        });

    },
    
    init: function() {
    	
    	function selectAll(){
                $('.file-browser-file').not('.selected').each(function(){
                    edu.gmu.csiss.covali.multifilebrowser.toggleSelect($(this));
                });
    	};
    	
    	function selectNone(){
    		$('.file-browser-item.selected').each(function(){
                edu.gmu.csiss.covali.multifilebrowser.toggleSelect($(this));
                edu.gmu.csiss.covali.multifilebrowser.selectedFiles = [];
            });
    	};
    	
    	var dialogName = 'edu.gmu.csiss.covali.multifilebrowser.jsframe.LocalFiles';
		var dialogTitle = 'Local Files';
		$content = $("<div class=\"modal-body\"><dl class=\"row\" style=\"font-size: 12px; padding: 5px; margin:0px\">"+
				 '<div id="multifilebrowser"></div>'+
		
				"<div class=\"modal-footer\">" +
				"<p><span class=\"btn btn-primary\" onclick=\'this.selectAll();\'>Select All</span>"+
				"<span class=\"btn btn-primary\" onclick=\'this.selectNone();\'>Select None</span>"+
				"<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.multifilebrowser.selectedCallback(edu.gmu.csiss.covali.multifilebrowser.selectedFiles);edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\");\'>Ok</span>"+
				"<span class=\"btn btn-primary\" onclick=\'edu.gmu.csiss.covali.menu.closeDialog(\""+dialogName+"\")\'>Cancel</span></p>"+
				"</div>");
		
		edu.gmu.csiss.covali.menu.createDialog(dialogName, dialogTitle, $content);
		edu.gmu.csiss.covali.multifilebrowser.loadPath('');
		
//        BootstrapDialog.show({
//            title: "Local Files",
//
//            cssClass: 'dialog-vertical-center dialog-local-file-list',
//
//            message: function(dialog) {
//                return($('<div id="multifilebrowser"></div>'));
//
//            },
//
//            onshown: function() {
//                edu.gmu.csiss.covali.multifilebrowser.loadPath('');
//
//            },
//
//
//            buttons: [
//                {
//                    label: 'Select All',
//                    action: function() {
//                        $('.file-browser-file').not('.selected').each(function(){
//                            edu.gmu.csiss.covali.multifilebrowser.toggleSelect($(this));
//                        });
//                    }
//                },
//                {
//                    label: 'Select None',
//                    action: function () {
//                        $('.file-browser-item.selected').each(function(){
//                            edu.gmu.csiss.covali.multifilebrowser.toggleSelect($(this));
//                            edu.gmu.csiss.covali.multifilebrowser.selectedFiles = [];
//                        });
//                    }
//                },
//                {
//                    label: 'Ok',
//                    cssClass: 'btn-warning',
//                    action: function(dialogItself) {
//                        edu.gmu.csiss.covali.multifilebrowser.selectedCallback(edu.gmu.csiss.covali.multifilebrowser.selectedFiles);
//                        dialogItself.close();
//                    }
//                },
//                {
//                    label: 'Cancel',
//                    action: function(dialogItself){
//                        this.selectedFiles = [];
//                        dialogItself.close();
//                    }
//                }]
//        });


    }
}