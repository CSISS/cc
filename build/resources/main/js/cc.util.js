/**
 * CyberConnector Utility Functions
 * @author Ziheng Sun
 * @date 2015.8.6
 */
cc.util = {
		
		init: function(){
			cc.util.initServer();
		},
		
		initHeight: function(){
			//use css to solve this problem
//			var winheight = $(document).height();
			
		},
		
		isVisible: function(divid){
			var isVisible = $( "#"+divid ).is( ":visible" );
			return isVisible;
		},
		
		/**
		 * Initialize the server environment variables
		 */
		 initServer:function(){
//			serverURL = window.location.hostname;
//			serverPort = window.location.port;
			//console.log(window.location.protocol+"\n"+window.location.host+"\n"+window.location.pathname);
		},
		/**
		 * Get servlet URL
		 * @returns
		 */
		getServletURL:function(no){
			var path = window.location.pathname;
			var i = path.indexOf("/CyberConnector");
			var prepath = path.substring(0,i);
			//console.log("prefix path: " + prepath);
			var arr = [window.location.protocol, '//', window.location.host, prepath ];
			if(no==1){
				arr.push("/CyberConnector/VirtualProductQueryServlet");
			}else if(no==2){
				arr.push("/CyberConnector/MetadataQueryServlet");
			}else if(no==3){
				arr.push("/CyberConnector/ServiceRegisterServlet");
			}else if(no==4){
				arr.push("/CyberConnector/ServiceUnregistrationServlet");
			}else if(no==5){
				arr.push("/CyberConnector/OrderCheckingServlet");
			}else if(no==6){
				arr.push("/CyberConnector/FetchProductListServlet");
			}else if(no==7){
				arr.push("/CyberConnector/GetInputDetailsServlet");
			}
			//console.log(arr);
			return arr.join("");
		},
		/**
		 * Send post request to the servlet
		 * @param url
		 * @param success
		 * @param fail
		 * @param always
		 */
		sendPostRequest: function(url, data, success, fail, always, contenttype){
			if(typeof contenttype == "undefined"){
				contenttype = "application/x-www-form-urlencoded"; //by default
			}
			var posting = $.ajax({
//				contentType: "application/x-www-form-urlencoded", //this is by default
				type: "POST",
				url: url, 
				contentType: contenttype,
				data: data, 
				success: success, //success(result,status,xhr)
				error: fail, //error(xhr,status,error)
				complete: always //(xhr,status)
			});
		},
		
		sendAsynRequest: function(url, data, success, fail, always, contenttype){
			
		},
		
		//use with caution
		checklog: function(callback){
			
			var request = new XMLHttpRequest();  
			
			request.open('POST', 'checklog', false);
			
			request.send(null);  
			  
			var jsonResponse = null;
			
			if (request.status === 200) {  
				
				jsonResponse = JSON.parse(request.responseText);
				
			}  
			
			return jsonResponse;
			
		},
		
		getYearOfDate: function(d){
			
		},
		
		getJulianDay: function(d){
			
		},
		
		isNull: function(val){
			if(val==null || val.trim()==""){
				return true;
			}
			return false;
		}
		
}

/**
 * add by Z.S. on 3/31/2017
 * capture the before/after show event
 */

jQuery(function($) {

  var _oldShow = $.fn.show;

  $.fn.show = function(speed, oldCallback) {
    return $(this).each(function() {
      var obj         = $(this),
          newCallback = function() {
            if ($.isFunction(oldCallback)) {
              oldCallback.apply(obj);
            }
            obj.trigger('afterShow');
          };

      // you can trigger a before show if you want
      obj.trigger('beforeShow');

      // now use the old function to show the element passing the new callback
      _oldShow.apply(obj, [speed, newCallback]);
    });
  }
});
