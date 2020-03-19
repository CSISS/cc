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

    sortDictionaryBasedOnValues: function(obj) {
        items = Object.keys(obj).map(function(key) {
            return [key, obj[key]];
        });
        items.sort(function(first, second) {
            return first[1] - second[1];
        });
        sorted_obj={}
        $.each(items, function(k, v) {
            use_key = v[0]
            use_value = v[1]
            sorted_obj[use_key] = use_value
        })
        return(sorted_obj)
    }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
