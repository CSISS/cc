/**
 * Register a WSDL into database
 * cc.register
 * Requires cc.js cc.util.js cc.button.js
 * @author ZihengSun
 * @date 8/19/2015
 */
cc.register = {
		
		init: function(){
			if($("#regser").length){
				$("#regser").click(function(){
					var url = $("#wsdluri").val();
					cc.register.clearInformationArea();
					cc.register.registerWSDL(url);
				});
			}
			if($("#unregser").length){
				$("#unregser").click(function(){
					var url = $("#wsdluri").val();
					cc.register.clearInformationArea();
					cc.register.unregisterWSDL(url);
				});
			}
			//for the submit button in regser.html
//			if($("#regser").length){
//				$("#regser").click(function(){
//					if(cc.button.parameterCheck2()){
//						cc.button.submit2();
//					}
//				});
//			}
//			if($("#unregser").length){
//				$("#unregser").click(function(){
//					if(cc.button.parameterCheck3()){
//						cc.button.submit3();
//					}
//				});
//			}
		},
		
		clearInformationArea: function(){
			
			$("#contentdiv").html("");
			
		},
		/**
		 * callback function if success
		 * @param result
		 * @param status
		 * @param xhr
		 */
		done: function(result,status,xhr){
			console.log("The request is processed.");
			if(result){
				result = result.trim();
			}
			$("#contentdiv").html("<p class=\"green\">The service is successfully registered. Click <a href=\"index.html\">here</a> to return to the home page.</p><table class=\"blankunderneathcover\"></table>");
			cc.button.pageRecover();
		},
		done2: function(result,status,xhr){
			console.log("The request is processed.");
			if(result){
				result = result.trim();
			}
			$("#contentdiv").html("<p class=\"green\">The service is successfully unregistered. Click <a href=\"index.html\">here</a> to return to the home page.</p>");
			cc.button.pageRecover();
		},
		/**
		 * Callback function if failure
		 * @param xhr
		 * @param status
		 * @param error
		 */
		fail: function(xhr, status, error){
			console.log("The request is failed.");
			if(error){
				error = error.trim();
			}
			$("#contentdiv").html("<p><img src=\"/CyberConnector/images/wrong.png\" class=\"noticeimage\">Something went wrong. Click <a href=\"regser.html\">here</a> to try again or contact <a href=\"mailto:zsun@gmu.edu\">the Webmaster</a>.</p><p>"+status+" </p><p>"+error+"</p>");
			cc.button.pageRecover();
		},
		
		fail2: function(xhr, status, error){
			console.log("The request is failed.");
			if(error){
				error = error.trim();
			}
			$("#contentdiv").html("<p><img src=\"/CyberConnector/images/wrong.png\" class=\"noticeimage\">Something went wrong. Click <a href=\"regser.html\">here</a> to try again or contact <a href=\"mailto:zsun@gmu.edu\">the Webmaster</a>.</p><p>"+status+" </p><p>"+error+"</p>");
			cc.button.pageRecover();
		},
		/**
		 * Register service by WSDL
		 * @param wsdlurl
		 */
		registerWSDL: function(wsdlurl){
			var req = "wsdl="+wsdlurl;
			cc.util.sendPostRequest(cc.util.getServletURL(3), req,cc.register.done, cc.register.fail, null, "application/x-www-form-urlencoded");
//	        sendAsynchronRequest2(getServletURLByNO(10),req,"",loadCallBack);
		},
		
		unregisterWSDL: function(wsdlurl){
			var req = "wsdl="+wsdlurl;
			cc.util.sendPostRequest(cc.util.getServletURL(4), req,cc.register.done2, cc.register.fail2, null, "application/x-www-form-urlencoded");
//	        sendAsynchronRequest2(getServletURLByNO(10),req,"",loadCallBack);
		}
		
}