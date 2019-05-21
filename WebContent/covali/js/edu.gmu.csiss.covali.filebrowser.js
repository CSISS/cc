
edu.gmu.csiss.covali.filebrowser = {
    selectedFiles: [],
    currentPath: '/',
    selectedCallback: function() {},

    toggleSelect: function(e) {
        var file = e.data('path');

        if(e.hasClass('selected')) {
            // remove selection
            edu.gmu.csiss.covali.filebrowser.selectedFiles.splice($.inArray(file), 1);
        } else {
            edu.gmu.csiss.covali.filebrowser.selectedFiles.push(file);
        }

        e.toggleClass('selected');

        console.log(edu.gmu.csiss.covali.filebrowser.selectedFiles);
    },

    updateBrowserContents: function(path, files) {
        console.log(path);
        console.log(files);

        var parentPath = path.substring(0, path.lastIndexOf('/'));
        if(parentPath == "") {
            parentPath = '/';
        }

        // add trailing slash to folders
        if(path.lastIndexOf('/') != path.length - 1) {
            path = path + '/'
        }


        var fileList = '';

        fileList += '<ul class="list-group">';

        if(path != '/') {
            fileList += '<li class="list-group-item file-browser-item file-browser-directory" data-path="' + parentPath + '">';
            fileList += '<span class="glyphicon glyphicon-folder-close text-primary"></span>';
            fileList += '<a href="javascript:void(0)"> ..</a>';
            fileList += '</li>';
        }

        files.forEach(function(f){
            var icon = f.type == 'file' ? 'glyphicon-file' : 'glyphicon-folder-open';
            var fullPath = path + f.name;
            if(f.type == 'file') {
                // remove leading slash from file paths
                fullPath = fullPath.substring(1)
            }
            var selected = edu.gmu.csiss.covali.filebrowser.selectedFiles.includes(fullPath) ? 'selected' : '';
            fileList += '<li class="' + selected + ' list-group-item file-browser-item file-browser-'+ f.type + '" data-path="' + fullPath + '">';
            fileList += '<span class="glyphicon ' + icon + ' text-primary"></span>';
            fileList += '<a href="javascript:void(0)"> ' + f.name +'</a>';
            fileList += '</li>';
        });

        fileList += '</ul>';

        $('#filebrowser').html($(fileList));

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
                edu.gmu.csiss.covali.filebrowser.toggleSelect($(this));
            });
        });


        // $('.file-browser-item').




        // $('a.file-browser-folder').data('path')

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
                edu.gmu.csiss.covali.filebrowser.loadPath('/');

            },


            buttons: [
                {
                    label: 'Select All',
                    action: function() {
                        $('.file-browser-file').not('.selected').each(function(){
                            edu.gmu.csiss.covali.filebrowser.toggleSelect($(this));
                        });
                    }
                },
                {
                    label: 'Select None',
                    action: function () {
                        $('.file-browser-item.selected').each(function(){
                            edu.gmu.csiss.covali.filebrowser.toggleSelect($(this));
                            edu.gmu.csiss.covali.filebrowser.selectedFiles = [];
                        });
                    }
                },
                {
                    label: 'Ok',
                    cssClass: 'btn-warning',
                    action: function(dialogItself) {
                        edu.gmu.csiss.covali.filebrowser.selectedCallback(edu.gmu.csiss.covali.filebrowser.selectedFiles);
                        dialogItself.close();
                    }
                },
                {
                    label: 'Cancel',
                    action: function(dialogItself){
                        this.selectedFiles = ['/whaat'];
                        dialogItself.close();
                    }
                }]
        });


    }
}