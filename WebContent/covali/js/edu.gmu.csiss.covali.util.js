edu.gmu.csiss.covali.util = {
    setUrlParameterByName: function(url, name, value){

        if (!url) url = window.location.href;

        name = name.replace(/[\[\]]/g, '\\$&');

        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),

            results = regex.exec(url);

        if (!results){

            url += "&" + name + "=" + value;

        }else if(!results[2]){

            url = url.replace(name+"=", name+"="+value);

        }else{

            url = url.replace(name+"="+results[2], name+"="+value);

        }

        return url;

    },

    getUrlParameterByName: function (url, name) {

        if (!url) url = window.location.href;

        name = name.replace(/[\[\]]/g, '\\$&');

        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),

            results = regex.exec(url);

        if (!results) return null;

        if (!results[2]) return '';

        return decodeURIComponent(results[2].replace(/\+/g, ' '));

    },
}