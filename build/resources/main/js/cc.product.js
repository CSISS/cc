/**
*
* Product list selector page
*
* @author Ziheng Sun
* @createtime 10/30/2015
*
*/

cc.product = {
		/**
		 * The origin of this array is edu.gmu.laits.wmd.desktop.ParameterFormatType.java
		 * If the types in the Java file change, this array will change as well.
		 * commented by Ziheng Sun on 11/4/2015
		 */
		paramType: {
			t1: "date_julian", 
			t2: "date_georgia", 
			t3: "timestamp", 
			t4: "year", 
			t5: "month", 
			t6: "day_in_year", 
			t7: "day_in_month", 
			t8: "hour", 
			t9: "yearlist",
			t10: "datelist", 
			t11: "hourlist",
			t12: "projection_in_epsg", 
			t13: "projection_in_wkt", 
			t14: "projection_in_proj4", 
			t15: "boundingbox",
			t16: "x", 
			t17: "y", 
			t18: "latitude",
			t19: "longitude", 
			t20: "point_coordinate", 
			t21: "polygon", 
			t22: "polyline", 
			t23: "fileurl", 
			t24: "urllist", 
			t25: "stationid", 
			t26: "station_name", 
			t27: "place_name", 
			t28: "place_id", 
			t29: "river_name", 
			t30: "river_id",
			t31: "bool", 
			t32: "integer", 
			t33: "string", 
			t34: "double_number"
		},

        current_data_url : null,
        
        fileinputnum : 0,
		
		selected_productname : null,
		
		selected_productid : null,
		
		init: function(){
			
			cc.product.initSelector();
		
		},
		
		reset: function(){
			
			//call after dialog close
			
			current_data_url = null;
	        
	        fileinputnum = 0;
			
			selected_productname = null;
			
			selected_productid = null;
			
		},
		
		initSelector4Dialog: function(){
			
			var productlist = $("#product_list");
			
			if(productlist.length){
			
				//get product list from server
				
				cc.product.requestProductList();
				
				//add listener to the select change event
				
				$('#product_list').on('change', function(){
				
					var sdiv = $(this).find("option:selected");
				    
					var selected = sdiv.val();
					
				    if(selected != ""){
				    	
				    	$('#product_list').prop('disabled', true);
				    	
				    	$("#otherparams").empty();
				    	
				    	$("#otherparams").append("<img src=\"../images/loading.gif\" width=\"20\" height=\"20\" />");
		            
				    	cc.product.generateANewInputDialogForTheSelectedProduct(selected);
		            	
				    	cc.product.selected_productname = sdiv.text();
		            	
				    	cc.product.selected_productid = selected;
				    	
				    }
	            	
				});
			
			}
		
		},
		
		initSelector: function(){
			var productlist = $("#product_list");
			if(productlist.length){
				//get product list from server
				cc.product.requestProductList();
				 
				
				//add listener to the select change event
				$('#product_list').on('change', function(){
					var sdiv = $(this).find("option:selected");
				    var selected = sdiv.val();
//				    alert(selected);
				    if(selected != ""){
				    	cc.product.clearFormArea();
		            	cc.product.generateANewInputFormForTheSelectedProduct(selected);
		            	cc.product.selected_productname = sdiv.text();
		            	cc.product.selected_productid = selected;
				    }
	            	
				});
			}
		},
		
		
		/**
		 * Clear the form area
		 */
		clearFormArea: function(){
			
			$("#form_area").html('');
			
		},
		/**
		 * Generate a new input form for the selected product
		 * @param productid
		 */
		generateANewInputFormForTheSelectedProduct: function(productid){
			
			console.log("Get inputs of product" + productid);
			
			//get the details about the model inputs
			
			var req = "action=getinputdetails&productid="+productid;
			
			cc.util.sendPostRequest(cc.util.getServletURL(7), req, cc.product.inputdone, cc.product.inputfail);
		
		},
		
		generateANewInputDialogForTheSelectedProduct: function(productid){
			
			//get the details about the model inputs
			
			var req = "action=getinputdetails&productid="+productid;
			
			cc.util.sendPostRequest(cc.util.getServletURL(7), req, cc.product.inputdone4dialog, cc.product.inputfail);
		
		},
		
		inputdone4dialog: function(result,status, xhr){
			
			if(typeof result == "object"){
				
				var map = result.inputparametermap;
				
				var selectparam = $("#asinput");  //select the parameter which the data will be used as
				
				selectparam.find('option').remove();
				
	            var formarea = $("#otherparams"); //enter the values for other parameters
	            
	            formarea.empty();
	            
	            cc.product.fileinputnum = 0;

				$.each(map, function(k,v) {
		            
					// k is either an array index or object key
		            
					var key = v.key;
		            
		            var name = v.name;
		            
		            var datatype = v.datatype; //this is usually the same as the input parameter name - useless - Ziheng Sun 7/4/2016
		            
		            var dataformat = v.format;
		            
		            //add a input field for each parameter
		            
		            var pid = "p"+k;
		            
		            var ksplit = key.split("/");
		            
		            var partname = ksplit[2]+":"+ksplit[3];
		            
//		            selectparam.append('<option value="'+key+'">'+name+'</option>');
		            
		            var newrow = "<div class=\"row\" style=\"margin-left:0px;margin-right:0px; margin-bottom:5px;\">"; 
		            
		            newrow += "<label class=\"col-md-4 control-label pull-left\">"+name+" : </label>";
		        	
		            newrow += "<input class=\"col-md-5\" type=\"text\"  class=\"form-control\" key=\""+key+"\" id=\""+pid+"\"  />";
		            
		            if(dataformat==cc.product.paramType.t23||dataformat==cc.product.paramType.t24){
		            	
		            	newrow += "<label class=\"col-md-3\"><input  type=\"checkbox\"  id=\"asinput_"+pid+"\"  /> use this</label>";
		            	
		            	cc.product.fileinputnum++;
		            	
		            }else{
		            	
		            	//disable the checkbox if the parameter is not a file
		            	
		            	newrow += "<label class=\"col-md-3\"><input  type=\"checkbox\"  id=\"asinput_"+pid+"\" disabled=\"disabled\"  /> use this</label>";
		            	
		            }
		            
		            newrow += "</div>";
		        	
		            formarea.append(newrow);
		            
		            $("#asinput_" + pid).change(function() {
		                
		            	if(this.checked) {
		                
		            		$("#"+pid).val(cc.product.current_data_url);
			            	
			            	$("#"+pid).prop('disabled', true);
			            	
			            	cc.product.fileinputnum++;
			            	
		                }else{
		                	
		                	$("#"+pid).val("");
			            	
			            	$("#"+pid).prop('disabled', false);
		                	
		                }
		            	
		            });
		            
				});
				
				formarea.append("<div class=\"row\" style=\"padding-left:15px; padding-right:15px; margin-left:0px;margin-right:0px; margin-bottom:5px;\">If the \"use this\" checkbox is disabled, it means the parameter is not a file and cannot use the data as its value.</div>"); //add an explanation
				
				if(cc.product.fileinputnum==0){

					alert("Warning: there are no file parameters in this VDP to use the searched data as input!!!");
					
				}
				
			}else{
				
				console.err("The result is not a json object.");
		    	
		    	alert("Fail to get the details of the product inputs. Try again or contact administrator.");
		    	
			}
			
			$('#product_list').prop('disabled', false);
			
		},
		/**
		 * 
		 * @param result
		 * @param status
		 * @param xhr
		 */
		inputdone: function(result,status,xhr){
			//assign different input form components to the inputs according to their data types
			if(typeof result == "object"){
//				{
//				   "inputparametermap":[
//				                        {
//				                           "datatype":"year",
//				                           "key":"/T_S_condition_fvcom_inputRequest/RequestGenerate_HYCOM_links_af2b3850-581b-1033-80f8-4d06c0a80002_0/year"
//				                        },
//				                        {
//				                           "datatype":"hour",
//				                           "key":"/T_S_condition_fvcom_inputRequest/RequestGenerate_HYCOM_links_af2b3850-581b-1033-80f8-4d06c0a80002_0/hour"
//				                        },
//				                        {
//				                           "datatype":"day",
//				                           "key":"/T_S_condition_fvcom_inputRequest/RequestGenerate_HYCOM_links_af2b3850-581b-1033-80f8-4d06c0a80002_0/day"
//				                        }
//				                     ]
//			  }
				var map = result.inputparametermap;
	            //clear the form first
	            cc.product.clearFormArea();
	            var formarea = $("#form_area");

	            //add a title for the input form
	            formarea.append("<p class=\"red\">All the following parameters are required.</p><br><br>");
	            
	            formarea.append("<table class=\"table table-bordered\">"+
			    "<thead class=\"text-center\">"+
			    "  <tr>"+
			    "    <th>Parameter</th>"+
			    "    <th>DataFormat</th>"+
			    "    <th>Value</th>"+
			    "  </tr>"+
			    "</thead>"+
			    "<tbody id=\"formbody\"></tbody>");
				$.each(map, function(k,v) {
		            // k is either an array index or object key
		            var key = v.key;
		            var name = v.name;
		            var datatype = v.datatype; //this is usually the same as the input parameter name - useless - Ziheng Sun 7/4/2016
		            var dataformat = v.format;
		            //add a input field for each parameter
		            var pid = "p"+k;
		            var ksplit = key.split("/");
		            var partname = ksplit[2]+":"+ksplit[3];
		            
		            var newrow = "<tr><td><p id=\""+pid+"\" class=\"largelinespace category\" \">"+name+"</p></td><td>"+dataformat+"</td><td>";
		            //add a input form for the variable
		            var inputformstr = null;
		            if(dataformat==cc.product.paramType.t1){
		            	
		            }else if(dataformat==cc.product.paramType.t2){
		            	
		            }else if(dataformat==cc.product.paramType.t3){
		            	
		            }else if(dataformat==cc.product.paramType.t4){
		            	
		            }else if(dataformat==cc.product.paramType.t5){
		            	
		            }else if(dataformat==cc.product.paramType.t6){
		            	
		            }else if(dataformat==cc.product.paramType.t7){
		            	
		            }else if(dataformat==cc.product.paramType.t8){
		            	
		            }else if(dataformat==cc.product.paramType.t9){
		            	
		            }else if(dataformat==cc.product.paramType.t15){
		            	inputformstr = "<p  class=\"mapselector\">"+
						"	<table>"+
						"		<tr>"+
						"			<td colspan=2>"+
						"				<div class=\"googlemapcontainer\" id=\"gmap\"></div>"+
						"				<button id=\"delete\" type=\'button\'>Delete All Rectangles</button>"+
						"			</td>"+
						"		</tr>"+
						"		<tr>"+
						"			<td colspan=2><input type=\"text\" id=\"south\" class=\"form-control\" name=\"south\" value=\"\" placeholder=\"=180,-90,180,90\"></td>"+
						"		</tr>"+
						"	</table>"+
						"</p>";
		            }else if(dataformat==cc.product.paramType.t23){
		            	//fileurl
		            	inputformstr = "<p>"+
						"		Input an image URL: <input class=\"form-control\" type=\"text\" value=\"\" id=\"in"+k+"\" name=\""+key+"\"  >"+
						"	</p>"+
						"	<p>" +
						"<font color=\"red\">Or</font> Upload an image: <input id=\"upload\" class=\"upload\" onclick=\"cc.upload.loadLocalImage();\" type=\"button\" value=\"Upload\">" +
						"</p>";
		            }else if(inputformstr==null){
		            	console.log("Cannot find the corresponding form of the input type. Use default input field.");
		            	//default input form 
		            	inputformstr = "<input id=\"in"+k+"\" type=\"text\" class=\"form-control\" name=\""+key+"\" type=\"text\" >";
		            }
		            newrow += inputformstr + "</td></tr>";
		            //$("#"+pid).append(inputformstr);
		            $("#formbody").append(newrow);
				});
				
				//add a email text field
				formarea.append("<p id=\"emailfield\"  class=\"largelinespace category\" >" +
						"<form class=\"form-inline\" id=\"form1\">"+
						"<div class=\"form-group text-center\">"+
						"<label for=\"email\">Email </label> "+
						"<input type=\"text\"class=\"form-control\" value=\"\" id=\"email\" placeholder=\"abc@example.com\"> <font color=\"red\">*</font>" +
						"</div>"+
						"</form>"+
						"</p>");
				//finally add a button to submit the request
	            formarea.append("<p class=\"largelinespace category\"><button type=\"button\" class=\"btn btn-primary\" value=\"Reset\" id=\"reset\" >Reset</button>  <button type=\"button\" class=\"btn btn-primary\" value=\"Retrieve data\" id=\"retrievedata\" >Place Order</button></p>");
	            $("#retrievedata").click(function(){
	            	if(cc.product.checkInputConsistency(map)){
	            		var req = [];
		            	for(var i = 0; i < map.length; i++) {
		            	    var obj = map[i];
		            	    var k = obj.key;
		            	    var val = $("#in"+i).val();
		            	    if(i!=0){
		            	    	req.push("&");
		            	    }
		            	    req.push(k);
		            	    req.push("=");
		            	    req.push(val);
		            	}
		            	req.push("&productid=");
		            	req.push(cc.product.selected_productid);
		            	req.push("&");
		            	req.push("email=");
		            	req.push($("#email").val());
		            	cc.product.retrievedata(req);
	            	}
	            	
	            });
	            //reset the form
	            $("#reset").click(function(){
	            	$("#form1")[0].reset();
	            });
			}else{
				// jsonOb is a number or string
		    	console.err("The result is not a json object.");
		    	alert("Fail to get the details of the product inputs. Try again or contact system administrator.");
			}
		},
		
		disablebutton: function(){
			$("#retrievedata").attr('disabled','disabled');
			$("#reset").attr('disabled','disabled');
		},
		
		enablebutton: function(){
			$("#retrievedata").removeAttr('disabled');
			$("#reset").removeAttr('disabled');
		},
		
		checkInputConsistency: function(map){
			for(var i=0;i<map.length;i++){
				if(cc.util.isNull($("#in"+i).val())){
					alert(map[i].key+" cannot be null!");
					return false;
				}
			}
			if(cc.util.isNull($("#email").val())){
				alert("Email cannot be null!");
				return false;
			}
			return true;
		},
		
		retrievedata: function(req){
			
			cc.util.sendPostRequest(cc.util.getServletURL(1), req.join(""), cc.product.datadone, cc.product.datafail);
			
		},
		
		datadone: function(result,status,xhr){
			
			if(result.indexOf("Failure")==0){
				
				console.error("The order is failed in submission. Reason:"+ result);
				
				alert("The order is failed in submission. Reason:"+ result);
			
			}else{
				
				console.log("Success");
				
				alert("Your order is successfully submitted. The order id is "+ result+". An email of notice is also sent to the email account you provided.");
				
			}
		},
		
		datafail: function(xhr, status, error){
			
			console.error("The order is failed to be placed. Reason:"+ error);
			
			alert("Fail to place your order. Try again or contact administrator.");
			
		},
		
		inputfail: function(xhr, status, error){
			
			alert("Fail to get the details of the product inputs. Try again or contact system administrator.");
		
		},
		
		listdone: function(result,status,xhr){
			
			//parse the response and put the content into the selector list
			if( typeof result == "object" ) {
		        $.each(result, function(k,v) {
		            // k is either an array index or object key
		            var id = v.id;
		            var name = v.name;
		          
		            var newoption = $('<option>', {
						value: id,
						text: name
					});
		          //add listener to every option in the selector
		            //useless - removed by Ziheng Sun on 7/4/2016
//		            newoption.click(function(){
//		            	alert("pop up a list of input value entries."+id);
//		            	cc.product.clearFormArea();
//		            	cc.product.generateANewInputFormForTheSelectedProduct(id);
//		            });
		            $("#product_list").append(newoption);
		        });
		        
	            //for the current select product, unfold its input parameter form
		        //the default value is null
//	            cc.product.generateANewInputFormForTheSelectedProduct(result[0].id);
		    }
		    else {
		        // jsonOb is a number or string
		    	console.err("The result is not a json object.");
		    	alert("Fail to fetch the product list from the server. Refresh the page to try again. If still not successful, contact system administrator.");
		    }
		},
		
		listfail: function(xhr, status, error){
			alert("Fail to fetch the product list from the server. Refresh the page to try again. If still not successful, contact system administrator.");
		},
		
		requestProductList: function(){
			var req  = "action=getplist";
			cc.util.sendPostRequest(cc.util.getServletURL(6), req,cc.product.listdone, cc.product.listfail);
		}
		
};