/**
 * Button.js
 * @author Ziheng Sun
 * @date 2015.8.11
 * 
 */
cc.button = {
		/**
		 * Initialize the click listener function of the Query button
		 */
		init: function(){
			//for the submit button in index.html
			if($("#query").length){
				$("#query").click(function(){
					if(cc.button.parameterCheck()){
						cc.button.submit();
					};
				});
			}
			
			if($("#selectdate1").length){
				$("#selectdate1").click(function(){
					javascript:NewCal('bdtv','yyyymmdd',true,24, cc.button.beginTimeTextChangeCallBack);
				});
			}
			if($("#selectdate2").length){
				$("#selectdate2").click(function(){
					javascript:NewCal('edtv','yyyymmdd',true,24, cc.button.endTimeTextChangeCallBack);
				});
			}

			//for the submit button in newservice.html
			if($("#newservice").length){
				$("#newservice").click(function(){
					if(cc.button.parameterCheck4()){
						cc.button.submit4();
					}
				});
			}
			
			
			
			  
		},
		
		beginTimeTextChangeCallBack: function(){
//			if($("#bdtv").length){
//				document.getElementById("bdtv").onchange=function(){
					
					console.log($("#bdtv").val());
					var begindate = $("#bdtv").val();
					var ymd = begindate.split(" ")[0];
					var time = begindate.split(" ")[1];
					var ymds = ymd.split("-");
					var bd = new Date(ymds[0],Number(ymds[1])-1,ymds[2]);
//					myDate.setDate(myDate.getDate() + AddDaysHere);
//					var begindate = Date.parse($("#bdtv").val());
					var ed = new Date(ymds[0],Number(ymds[1])-1,ymds[2]);
					var numberOfDaysToAdd = 15;
					ed.setDate(ed.getDate() + numberOfDaysToAdd); 
					console.log(ed.getFullYear()+" "+ed.getUTCMonth()+" "+ ed.getUTCDate());
					var month = ed.getUTCMonth()+1;
					if(month<10){
						month = "0"+month;
					}
					var day = ed.getUTCDate();
					if(day<10){
						day = "0"+day;
					}
					var edstr = ed.getFullYear()+"-"+month+"-"+ day+" "+time;
					$("#edtv").val(edstr);
//				};
//			}
		},
		
		endTimeTextChangeCallBack:function(){
//			if($("#edtv").length){
//				$("#edtv").bind("onchange",function(){
					console.log($("#edtv").val());
					var enddate = $("#edtv").val();
					var ymd = enddate.split(" ")[0];
					var time = enddate.split(" ")[1];
					var ymds = ymd.split("-");
					var bd = new Date(ymds[0],Number(ymds[1])-1,ymds[2]);
//					myDate.setDate(myDate.getDate() + AddDaysHere);
//					var begindate = Date.parse($("#bdtv").val());
					var bd = new Date(ymds[0],Number(ymds[1])-1,ymds[2]);
					var numberOfDaysToAdd = 15;
					bd.setDate(bd.getDate() - numberOfDaysToAdd); 
					console.log(bd.getFullYear()+" "+bd.getUTCMonth()+" "+ bd.getUTCDate());
					var month = bd.getUTCMonth()+1;
					if(month<10){
						month = "0"+month;
					}
					var day = bd.getUTCDate();
					if(day<10){
						day = "0"+day;
					}
					var bdstr = bd.getFullYear()+"-"+month+"-"+ day+" "+time;
					$("#bdtv").val(bdstr);
//				});
//			}
		},
		
		inputChange: function(){
			
		},
		/**
		 * Check the correctness of the inputted parameter values
		 * @returns {Boolean}
		 */
		parameterCheck3:function(){
			var o = true;
			if($("#wsdluri").val().length==0){
				alert("WSDL URI cannot be null.");
				o = false;
			}
			return o;
		},
		/**
		 * Check the correctness of the inputted parameter values
		 * @returns {Boolean}
		 */
		parameterCheck2:function(){
			var o = true;
			if($("#wsdluri").val().length==0){
				alert("WSDL URI cannot be null.");
				o = false;
			}
			return o;
		},
		/**
		 * Check the correctness of the inputted parameter values
		 * @returns {Boolean}
		 */
		parameterCheck: function(){
			var o = true;
			if($("#category").val().length==0){
				alert("Product category cannot be null.");
				o = false;
			}else if($("#proj").val().length==0){
				alert("Projection cann't be null.");
				o = false;
			}else if($("#north").val().length==0){
				alert("North cann't be null.");
				o = false;
			}else if($("#south").val().length==0){
				alert("South cann't be null.");
				o = false;
			}else if($("#east").val().length==0){
				alert("East cann't be null.");
				o = false;
			}else if($("#west").val().length==0){
				alert("West cann't be null.");
				o = false;
			}else if($("#bdtv").val().length==0){
				alert("Begin time cann't be null.")
				o = false;
			}else if($("#edtv").val().length==0){
				alert("End time cann't  be null.");
				o = false;
			}else if($("#mailaddress").val().length==0){
				alert("Mail cann't  be null.");
				o = false;
			}
			return o;
		},
		/**
		 * Recover the page construction which may be destroyed by the replacement of the content in the CyberConnector Div.
		 */
		pageRecover: function(){
			$('html, body').animate({ scrollTop: 0 }, 'fast');
			$("#contentdiv").append("<p>Go back to previous page, click <a href=\"javascript:window.location.href=window.location.href\">here</a>.</p>");
		},
		/**
		 * When the request is process, display the response message.
		 * @param result
		 * @param status
		 * @param xhr
		 */
		done: function(result,status,xhr){
			console.log("The request is processed.");
			if(result){
				result = result.trim();
			}
			if(result.indexOf("Failure")==0){
				//failed
				$("#contentdiv").html("<p><img src=\"images/wrong.png\" class=\"noticeimage\">Something went wrong and the order is failed to be placed. Try another time or contact <a href=\"mailto:zsun@gmu.edu\">the Webmaster</a>.</p><p>error</p><p>"+result+"</p></table>");
			}else{
				//real success
				$("#contentdiv").html("<p><img src=\"images/check.png\" class=\"noticeimage\">Congratulations! Your request has been received by the server and will be processed as soon as possible. The order id of your request is <font class=\"orderid\">"+result+"</font>. The results will be sent to the E-mail address you provided on the last page. You can also check the status of the processing <a href=\"\">here</a> by entering the order number.</p></table>");
			}
			
			cc.button.pageRecover();
		},
		
		fail: function(xhr, status, error){
			console.log("The request is failed.");
			if(error){
				error = error.trim();
			}
			$("#contentdiv").html("<p><img src=\"images/wrong.png\" class=\"noticeimage\">Something went wrong and the order is failed to be placed. Try another time or contact <a href=\"mailto:zsun@gmu.edu\">the Webmaster</a>.</p><p>"+status+"</p><p>"+error+"</p></table>");
			cc.button.pageRecover();
		},
		
		submit: function(){
			
			//compose the request
		
			var request = ["category=", $("#category").val(),"&boundingbbox=",$("#east").val(),",",$("#south").val(),",",$("#west").val(),",",$("#north").val(),"&proj=",$("#proj").val(),"&begintime=",$("#bdtv").val(),"&endtime=",$("#edtv").val(),"&mail=",$("#mailaddress").val()];
			
			cc.util.sendPostRequest(cc.util.getServletURL(1), request.join(""),cc.button.done, cc.button.fail);
			
		},
		
		submit2: function(){
			
			cc.register.registerWSDL($("#wsdluri").val());
			
		},
		
		submit3: function(){
			
			cc.register.unregisterWSDL($("#wsdluri2").val());
			
		},

		submit4: function(){
			
			console.log("testestest");
			
		}
		
};