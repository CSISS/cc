

cc.profile={
		
		sameordifferent: 0, //0:same; 1:different
		
		refresh:function (){
			
			console.log("Refresh the order table.");
			
			//get active tab
			
			var tid = $('.tab-pane.active').attr('id');
			
			console.log("current tab is : " + tid);
	
			if(tid == "tab2"){
				
				//if the current tab is order table, refresh. If not, don't.
				
			    location = "user_profile?show=tab2";
				
			}else{
				
				setTimeout(cc.profile.refresh, 600000);
				
			}
		    
		},
		
		startRefresh: function(){
			
			//refresh every 10 minutes
			
			setTimeout(cc.profile.refresh, 600000); 
			
		},
		
		 restoreAllBtn:function(){
			
			$("#orderbtn").removeClass( "myClass noClass" ).addClass( "yourClass" );
			
		},
		
		showSpecifiedTab: function(tabtag){
			
			console.log("The specified tab : " + tabtag);
			
			if(typeof tabtag != 'undefined'){
				
				if(tabtag == "tab2"){
					
					$("#orderbtn").trigger( "click" );
					
					$("#infobtn").removeClass("btn-primary").addClass("btn-default");
					
					$("#orderbtn").removeClass("btn-default").addClass("btn-primary");
					
				}else if(tabtag == "tab3"){
					
					$("#resourcebtn").trigger( "click" );
					
					$("#infobtn").removeClass("btn-primary").addClass("btn-default");
					
					$("#resourcebtn").removeClass("btn-default").addClass("btn-primary");
					
				}
				
			}
			
		},
		
		initProducts: function(productlist){
			
			for(var i=0; i<productlist.length; i++){
				
				var product = productlist[i];
				
				console.log("product id" + product.id);
				
				$("#delproduct_" + product.id).click(function(ele){
					
					var id = this.id;
					
					var pid = id.split("_")[1];
					
					BootstrapDialog.show({
	        			
	    				title: 'Alert',
	    			    
	    				message: 'Are you sure to delete this service? Once deleted, you will no longer able to see anything about this service, including its derived products.',
	    			    
	    				buttons: [{
	    			        
	    			    	id: 'btn-cancel',   
	    			        
	    			        icon: 'glyphicon glyphicon-remove',       
	    			        
	    			        label: 'NO',
	    			        
	    			        cssClass: 'btn-primary', 
	    			        
	    			        autospin: false,
	    			        
	    			        action: function(dialogRef){    
	    			        
	    			        	dialogRef.close();
	    			        
	    			        }
	    			    
	    			    },{
	    			    
	    					id: 'btn-ok',   
	    			        
	    					icon: 'glyphicon glyphicon-check',       
	    			        
	    					label: 'YES',
	    			        
	    					cssClass: 'btn-primary', 
	    			        
	    					autospin: false,
	    			        
	    					action: function(dialogRef){    
	    			        
	    						dialogRef.close();
	    						
	    						var method = "post"; // Set method to post by default if not specified.
								
	    					    // The rest of this code assumes you are not using a library.
	    					    // It can be made less wordy if you use one.
	    					    
	    					    var form = document.createElement("form");
	    					    
	    			        	form.setAttribute("method", method);
	    					    
	    					    form.setAttribute("action", "deleteproduct");
	    					    
	    					    //add productid and user id
	    					    
	    					    var inputele = document.createElement("input");
	        					    
						    	inputele.type = "hidden";
	    		                
						    	inputele.name = "productid";
	    		                
						    	inputele.value = pid;
						    	
						    	console.log("Final value for productid is : " + inputele.value);
	    		                
	    		                form.appendChild(inputele);
	    		                
	    		                //the form is ready
	    					    
	    					    document.body.appendChild(form);
	    					    
	    					    form.submit();
	    			    
	    					}
	    				
	    			    }]
	    			
	    			});
					
				});
				
			}
			
		},
		
		initServices: function(servicelist){
			
			for(var i=0; i < servicelist.length; i++){
				
				var service = servicelist[i];
				
				var newid = service.id.replace(/\:/g, '__');
				
//				console.log("new service id" + newid);
				
				//update service
				
				$("#updateservice_" + newid).click(function(ele){
					
					var id = this.id;
					
					id = id.replace(/\__/g, ':');
					
					var sid = id.split("_")[1];
					
					$.ajax({ 
						
						async: true, 
						
						type : "POST", 
						
						url : "updateservice", 
						
						dataType : 'json', 
						
						data: {"serviceid" : sid},
						
						success : function(data) {
							 
							console.log("Get response" + data.likes);
							
							console.log("likes_" + cid);
							
							$("#likes_" + cid).html(data.likes);
							
						},
						
						error: function(xhr, msg, e){
							
							console.error("get wrong response" + msg + " " + e);
							
							BootstrapDialog.show({
								
								title: 'Alert',
			    			    
			    				message: "Sorry you are unable to like this product right now",
			    			    
			    				buttons: [{
			    			        
			    			    	id: 'btn-cancel',   
			    			        
			    			        icon: 'glyphicon glyphicon-remove',       
			    			        
			    			        label: 'CANCEL',
			    			        
			    			        cssClass: 'btn-primary', 
			    			        
			    			        autospin: false,
			    			        
			    			        action: function(dialogRef){    
			    			        
			    			        	dialogRef.close();
			    			        
			    			        }
			    			    
			    			    },{
			    			    
			    					id: 'btn-ok',   
			    			        
			    					icon: 'glyphicon glyphicon-check',       
			    			        
			    					label: 'OK',
			    			        
			    					cssClass: 'btn-primary', 
			    			        
			    					autospin: false,
			    			        
			    					action: function(dialogRef){    
			    			        
			    						dialogRef.close();
			    						
			    					}
			    				
			    			    }]
								
							});
							
							
						}
						
					});
					
				});
				
				//delete service
				
				$("#delservice_" + newid).click(function(ele){
					
					var id = this.id;
					
					id = id.replace(/\__/g, ':');
					
					var sid = id.split("_")[1];
					
					BootstrapDialog.show({
	        			
	    				title: 'Alert',
	    			    
	    				message: 'Are you sure to delete this service? Once deleted, you will no longer able to see anything about this service, including its derived products.',
	    			    
	    				buttons: [{
	    			        
	    			    	id: 'btn-cancel',   
	    			        
	    			        icon: 'glyphicon glyphicon-remove',       
	    			        
	    			        label: 'NO',
	    			        
	    			        cssClass: 'btn-primary', 
	    			        
	    			        autospin: false,
	    			        
	    			        action: function(dialogRef){    
	    			        
	    			        	dialogRef.close();
	    			        
	    			        }
	    			    
	    			    },{
	    			    
	    					id: 'btn-ok',   
	    			        
	    					icon: 'glyphicon glyphicon-check',       
	    			        
	    					label: 'YES',
	    			        
	    					cssClass: 'btn-primary', 
	    			        
	    					autospin: false,
	    			        
	    					action: function(dialogRef){    
	    			        
	    						dialogRef.close();
	    						
	    						var method = "post"; // Set method to post by default if not specified.
								
	    					    // The rest of this code assumes you are not using a library.
	    					    // It can be made less wordy if you use one.
	    					    
	    					    var form = document.createElement("form");
	    					    
	    			        	form.setAttribute("method", method);
	    					    
	    					    form.setAttribute("action", "deleteservice");
	    					    
	    					    //add productid and user id
	    					    
	    					    var inputele = document.createElement("input");
	        					    
						    	inputele.type = "hidden";
	    		                
						    	inputele.name = "serviceid";
	    		                
						    	inputele.value = sid;
						    	
						    	console.log("The service to be deleted is : " + inputele.value);
	    		                
	    		                form.appendChild(inputele);
	    		                
	    		                //the form is ready
	    					    
	    					    document.body.appendChild(form);
	    					    
	    					    form.submit();
	    			    
	    					}
	    				
	    			    }]
	    			
	    			});
					
				});
			
			}
			
		},
		
		listenViewOrderBtn: function(order){
			
			/**
			* listener for the view button in the order table
			*/
			$("#view_" + order.orderid).click(function(ele){
				
				//send an async request to get details of the order   
				
				var id = this.id;
				
				var oid = id.split("_")[1];
				
				//alert("View Order Id: " + oid);
				
				$.ajax({ 
					
					async: true, 
					
					type : "POST", 
					
					url : "vieworder", 
					
					dataType : 'json', 
					
					data: {"orderid" : oid},
					
					success : function(data) { 
						
//						console.log("Get response");
						
						//pop up a dialog and render the data into it
						
						var temp=data; 
						
						var tablecontent = "<div>";
						
						tablecontent += "<div class=\"row\" >";
				    	
						tablecontent += "		<div class=\"col-md-1\"></div>";
				    	
						tablecontent += "		<div class=\"form-group col-md-10 \" style=\"margin-left:0px;margin-right:0px; margin-bottom:0px;\"><h3 class=\"col-md-12 text-center control-label\" >order metadata</h3></div>";
						
						tablecontent += "		<div class=\"col-md-1\"></div>";
					    
						tablecontent += "</div>";
						
						tablecontent += "<hr/>";
						
						var paramcontent = "";
						
						$.each(temp, function(key, value){
							
						    if(key!= "parametermap"){
						    	
						    	tablecontent += "<div class=\"row\" >";
						    	
						    	tablecontent += "	<div class=\"col-md-1\"></div>";
						    	
						    	tablecontent += "	<div class=\"form-group col-md-10\" style=\"margin-left:0px;margin-right:0px; margin-bottom:0px;\">";
							    
							    tablecontent += "  		<label class=\"col-md-5 control-label\" style=\"word-wrap: break-word;word-break: break-all;\">"+key+"</label>";
							    
							    tablecontent += "  		<label class=\"col-md-7 control-content\" style=\"word-wrap: break-word;word-break: break-all;\">"+value+"</label>";
							    
							    tablecontent += "	</div>";
							    
							    tablecontent += "	<div class=\"col-md-1\"></div>";
							    
							    tablecontent += "</div>";
						    	
						    }else{
								
						    	paramcontent += "<div class=\"row\" >";
						    	
						    	paramcontent += "		<div class=\"col-md-1\"></div>";
						    	
						    	paramcontent += "		<div class=\"form-group col-md-10 \" style=\"margin-left:0px;margin-right:0px; margin-bottom:0px;\"><h3 class=\"col-md-12 text-center control-label\" >input parameters</h3><hr/></div>";
								
						    	paramcontent += "		<div class=\"col-md-1\"></div>";
							    
						    	paramcontent += "</div>";
						    	
						    	paramcontent += "<hr/>";
						    	
						    	$.each(value, function(index, data){
						    		
						    		paramcontent += "<div class=\"row\" >";
							    	
							    	paramcontent += "		<div class=\"col-md-1\"></div>";
						    		
						    		paramcontent += "		<div class=\"form-group col-md-10\" style=\"margin-left:0px;margin-right:0px; margin-bottom:0px;\">\n";
						    		
						    		var param = data.key.split("/");
						    		
						    		paramcontent += "  		<label class=\"col-md-4 control-label\" style=\"word-wrap: break-word;word-break: break-all;\">"+param[param.length-1]+"</label>";
								    
						    		paramcontent += "  		<label class=\"col-md-8 control-content\" style=\"word-wrap: break-word;word-break: break-all;\" >"+data.value+" </label>";
								    
						    		paramcontent += "		</div>";
						    		
						    		paramcontent += "		<div class=\"col-md-1\"></div>";
								    
							    	paramcontent += "</div>";
						    		
						    	});
								
						    }
						    
						});
						
						tablecontent += paramcontent;
						
						tablecontent += "</div>";
						
						BootstrapDialog.show({
							
							title: 'Information',
		    			    
		    				message: $(tablecontent),
		    			    
		    				buttons: [{
		    			        
		    			    	id: 'btn-cancel',   
		    			        
		    			        icon: 'glyphicon glyphicon-remove',       
		    			        
		    			        label: 'CANCEL',
		    			        
		    			        cssClass: 'btn-primary', 
		    			        
		    			        autospin: false,
		    			        
		    			        action: function(dialogRef){    
		    			        
		    			        	dialogRef.close();
		    			        
		    			        }
		    			    
		    			    },{
		    			    
		    					id: 'btn-ok',   
		    			        
		    					icon: 'glyphicon glyphicon-check',       
		    			        
		    					label: 'OK',
		    			        
		    					cssClass: 'btn-primary', 
		    			        
		    					autospin: false,
		    			        
		    					action: function(dialogRef){    
		    			        
		    						dialogRef.close();
		    						
		    					}
		    				
		    			    }]
							
						});
					
					},
					
					error: function(xhr, msg, e){
						
						console.error("get wrong response" + msg + " " + e);
						
						BootstrapDialog.show({
							
							title: 'Alert',
		    			    
		    				message: msg,
		    			    
		    				buttons: [{
		    			        
		    			    	id: 'btn-cancel',   
		    			        
		    			        icon: 'glyphicon glyphicon-remove',       
		    			        
		    			        label: 'CANCEL',
		    			        
		    			        cssClass: 'btn-primary', 
		    			        
		    			        autospin: false,
		    			        
		    			        action: function(dialogRef){    
		    			        
		    			        	dialogRef.close();
		    			        
		    			        }
		    			    
		    			    },{
		    			    
		    					id: 'btn-ok',   
		    			        
		    					icon: 'glyphicon glyphicon-check',       
		    			        
		    					label: 'OK',
		    			        
		    					cssClass: 'btn-primary', 
		    			        
		    					autospin: false,
		    			        
		    					action: function(dialogRef){    
		    			        
		    						dialogRef.close();
		    						
		    					}
		    				
		    			    }]
							
						});
						
					}
					
				}); 
				
			});
			
		},
		
		listenRepeatOrderBtn: function(order){
			
			$("#repeat_" + order.orderid).click(function(){
				
				//pop up two options: exactly same or slightly change
				
				var content = '<div class="row"><div class="col-md-6">'+
				
				 '<div class=\"\" data-toggle=\"buttons\">'+
		         '   <label class="selectbtn btn btn-lg btn-success active col-md-12" id="same1">'+
		         '       <input type="radio" name="same" id="option1"  value="option1" autocomplete="off" checked="checked">'+
		         '       <i class="glyphicon glyphicon-check"></i> Exactly same'+
		         '   </label>'+
		         '   <label class="selectbtn btn btn-lg btn-warning col-md-12" id="same2">'+
		         '       <input type="radio" name="same" id="option2"   value="option2" autocomplete="off">'+
		        '        <i class="glyphicon glyphicon-warning-sign"></i> Exactly same'+
		        '    </label>          '+
		        '</div>'+
				
				'</div><div class=\"col-md-6\">'+
				
				'<div class=\"\" data-toggle=\"buttons\">'+
		         '   <label class="selectbtn btn btn-lg btn-success active col-md-12" id="different1">'+
		         '       <input type="radio" name="different" id="option3"   value="option3" autocomplete="off" checked="checked">'+
		         '       <i class="glyphicon glyphicon-check"></i> With Different Parameters'+
		         '   </label>'+
		         '   <label class="selectbtn btn btn-lg btn-warning col-md-12" id="different2">'+
		         '       <input type="radio" name="different" id="option4"   value="option4" autocomplete="off">'+
		        '        <i class="glyphicon glyphicon-warning-sign"></i> With Different Parameters'+
		        '    </label>          '+
		        '</div>'+
				
				'</div></div>';
				
				BootstrapDialog.show({
        			
    				title: 'Options',
    			    
    				message: content,
    				
    				onshown: function(dialogref){
    					
    					$("#same1, #same2").click(function() {
    						
    						console.log("change is detected on same button." + this.value);
    						
    						//disable the different button
    						
    						if($(this).attr("id")=="same2"){
    							
    							cc.profile.sameordifferent = 0;
    							
    						}else if(!$("#different2").hasClass("active")){
    							
    							cc.profile.sameordifferent = -1;
    							
    						}
    						
    						if(!$("#different1").hasClass("active")){
								
								$("#different1").addClass("active")
								
							}
							
							if($("#different2").hasClass("active")){
								
								$("#different2").removeClass("active");
								
							}
    						
    				    });
    					
    					$("#different1, #different2").click(function() {
    						
    						console.log("change is detected on different button." + this.value);
    						
    						//disable the different button
    						
    						if($(this).attr("id")=="different2"){
    							
    							cc.profile.sameordifferent = 1;
    							
    						}else if(!$("#same2").hasClass("active")){
    							
    							cc.profile.sameordifferent = -1;
    							
    						}
    						
    						if(!$("#same1").hasClass("active")){
								
								$("#same1").addClass("active")
								
							}
							
							if($("#same2").hasClass("active")){
								
								$("#same2").removeClass("active");
								
							}
    						
    				    });
    					
    				},
    			    
    				buttons: [{
    			        
    			    	id: 'btn-cancel',   
    			        
    			        icon: 'glyphicon glyphicon-remove',       
    			        
    			        label: 'CANCEL',
    			        
    			        cssClass: 'btn-primary', 
    			        
    			        autospin: false,
    			        
    			        action: function(dialogRef){    
    			        
    			        	dialogRef.close();
    			        
    			        }
    			    
    			    },{
    			    
    					id: 'btn-ok', 
    			        
    					icon: 'glyphicon glyphicon-check',       
    			        
    					label: 'GO',
    			        
    					cssClass: 'btn-primary', 
    			        
    					autospin: false,
    			        
    					action: function(dialogRef){    
    						
    						this.prop("disabled", true); //prevent multiple times of submit
    						
    						if(cc.profile.sameordifferent==0){
    							
    							//use the same order
    							
    							cc.util.sendPostRequest("reorder", "oid=" + order.orderid, cc.profile.orderdone, cc.profile.orderfail);
    							
    							dialogRef.close();
    							
    						}else if(cc.profile.sameordifferent==1){
    							
    							//enter different parameters
    							//first get the original parameters
    							//open the order page with the old parameters
    							
    							$.ajax({ 
    								
    								async: true, 
    								
    								type : "POST", 
    								
    								url : "vieworder", 
    								
    								dataType : 'json', 
    								
    								data: {"orderid" :  order.orderid},
    								
    								success : function(data) { 
    									
    									//pop up a dialog and render the data into it
    									
    									var temp=data; 
    									
    									var pmap = temp.parametermap;
    									
    									var pid;
    									
    									var keylist = [], valuelist = []; 
    									
    									for(var i=0, len=pmap.length;i<len;i++){
    										
    										var pair = pmap[i];
    										
    										if(pair.key=="productid"){
    											
    											pid = pair.value;
    											
    										}else{
    											
    											keylist.push(pair.key);
    											
    											valuelist.push(pair.value);
    											
    										}
    										
    									}
    									
    									var loc = "productorder?pid="+pid;
    						        	
    									//construct a hidden order URL 
    									
    						        	for(var i = 0, len = keylist.length; i < len; i++) {
    						        	    
    						        		var k = keylist[i];
    						        	    
    						        		var val = valuelist[i];
    						        	    
    						        		loc += "&" + k + "=" + val;
    						        	
    						        	}
    						        	
    						        	window.open(loc, '_self');
    									
    								},
    								
    								always: function(){
    									
    									dialogRef.close();
    									
    								}
    								
    							});
    							
    						}else{
    							
    							alert("You must select one option!");
    							
    							return;
    							
    						}
    						    						
    						
    						
    					}
    				
    			    }]
    			
    			});
				
			});
			
		},
		
		orderdone: function(data){
			
			var obj = $.parseJSON( data );
			
			if(typeof obj.error != "undefined" ){
				
				alert("Fail to replace the order.");
				
			}else{
				
				alert("Success. The new order id is: " + obj.oid);
				
			}
			
		},
		
		orderfail: function(data){
			
			alert("Fail to replace the order.");
			
		},
		
		listenDelOrderBtn: function(order){
			
			/**
			* listener for the delete button in the order table
			*/
			$("#delete_" + order.orderid).click(function(){
				
				var id = this.id;
				
				var oid = id.split("_")[1];
				
				BootstrapDialog.show({
        			
    				title: 'Alert',
    			    
    				message: 'Are you sure to delete this order? Once deleted, you will no longer able to retrieve anything of this order, including its derived products.',
    			    
    				buttons: [{
    			        
    			    	id: 'btn-cancel',   
    			        
    			        icon: 'glyphicon glyphicon-remove',       
    			        
    			        label: 'NO',
    			        
    			        cssClass: 'btn-primary', 
    			        
    			        autospin: false,
    			        
    			        action: function(dialogRef){    
    			        
    			        	dialogRef.close();
    			        
    			        }
    			    
    			    },{
    			    
    					id: 'btn-ok',   
    			        
    					icon: 'glyphicon glyphicon-check',       
    			        
    					label: 'YES',
    			        
    					cssClass: 'btn-primary', 
    			        
    					autospin: false,
    			        
    					action: function(dialogRef){    
    			        
    						dialogRef.close();
    						
    						var method = "post"; // Set method to post by default if not specified.
							
    					    // The rest of this code assumes you are not using a library.
    					    // It can be made less wordy if you use one.
    					    
    					    var form = document.createElement("form");
    					    
    			        	form.setAttribute("method", method);
    					    
    					    form.setAttribute("action", "deleteorder");
    					    
    					    //add productid and user id
    					    
    					    var inputele = document.createElement("input");
        					    
					    	inputele.type = "hidden";
    		                
					    	inputele.name = "orderid";
    		                
					    	inputele.value = oid;
					    	
					    	console.log("Final value for productid is : " + inputele.value);
    		                
    		                form.appendChild(inputele);
    		                
    		                //the form is ready
    					    
    					    document.body.appendChild(form);
    					    
    					    form.submit();
    			    
    					}
    				
    			    }]
    			
    			});
				
			});
			
		},
		
		initOrders: function(orderlist){
			
			/**
			*	add listeners to the buttons on the order tab
			*/
			
			for(var i=0; i < orderlist.length; i++){
				
				var order = orderlist[i];
				
				console.log("Adding listener for order view button : " + order.orderid);
				
				cc.profile.listenViewOrderBtn(order);
				
				cc.profile.listenRepeatOrderBtn(order);
				
				cc.profile.listenDelOrderBtn(order);
				
			}
			
		},
		
		initTab: function(){
			
			//for the main tab button
			$(document).ready(function() {
				
			    $('[data-toggle="tooltip"]').tooltip();
				
				$(".btn-pref .btn").click(function () {
				    
					$(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
				    // $(".tab").addClass("active"); // instead of this do the below 
				    
				    $(this).removeClass("btn-default").addClass("btn-primary");
				    
				});
				
			    $('.btn-filter').on('click', function () {
			        
			    	var $target = $(this).data('target');
			        
			    	if ($target != 'all') {
			        
			    		$('.table tbody tr').css('display', 'none');
			            
			    		$('.table tr[data-status="' + $target + '"]').fadeIn('slow');
			        
			    	} else {
			        
			    		$('.table tbody tr').css('display', 'none').fadeIn('slow');
			        
			    	}
			    
			    });

			    $('#checkall').on('click', function () {
			    
			    	if ($("#mytable #checkall").is(':checked')) {
			        
			    		$("#mytable input[type=checkbox]").each(function () {
			            
			    			$(this).prop("checked", true);
			            
			    		});

			        } else {
			            
			        	$("#mytable input[type=checkbox]").each(function () {
			            
			        		$(this).prop("checked", false);
			            
			        	});
			        
			        }
			    
			    });
			    
			    //initialize the order table
			    
			    $('#ordertable').DataTable({
			        order: [[ 2, 'desc' ]]
			    });
			    
			    $("#mytable").DataTable({
			        order: [[ 2, 'desc' ]]
			    });
			    
			});
			
		}


		
}
