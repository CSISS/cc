/**
 * 
 * FVCOM page
 * 
 * @author Ziheng Sun
 * @date 2015.10.13
 * 
 */
cc.fvcom = {
	
		init : function(){
			cc.fvcom.initTS();
			cc.fvcom.initRiver();
			cc.fvcom.initWind();
		},
		
		initTS: function(){
			var year = $("#hycom_year");
			var day = $("#hycom_day");
			var hour = $("#hycom_hour");
			var button = $("#hycom_btn");
			if(year.length && day.length && hour.length && button.length){
				//add content to the three select elements
				var yeararray = [2009, 2010,2011,2012,2013,2014];
				for(var i=0;i<yeararray.length;i++){
					year.append($('<option>', {
					    value: yeararray[i],
					    text: yeararray[i]
					}));
				}
				//add onchange event listener to year				
				year.on("change", function(){
					//remove all the options
					day.find("option").remove().end();
					//add new options
					var bd = 1;
					var ed = 365;
					if(year.val() == 2009){
						console.log("It is a incomplete year");
						bd = 91;
					}else if(year.val() == 2012){
						console.log("It is a leap year");
						ed = 366;
					}else{
						console.log("It is a non leap year");
					}
					
					for(var i=bd; i<=ed; i++){
						var val;
						if(i<10){
							val = "00"+i.toString();
						}else if(i<100){
							val = "0"+i.toString()
						}else{
							val = i.toString();
						}
						day.append($('<option>', {
							value: val,
							text: val
						}));
					}
					
				});

				//add default options to day
				for(var i=91; i<=365; i++){
					var val;
					if(i<10){
						val = "00"+i.toString();
					}else if(i<100){
						val = "0"+i.toString()
					}else{
						val = i.toString();
					}
					day.append($('<option>', {
						value: val,
						text: val
					}));
				}
				
				day.on("change", function(){
					//remove all the options
					hour.find("option").remove().end();
					for(var i=1;i<24;i++){
						if(i<10){
							hour.append($('<option>',{
								value: "0"+i.toString(),
								text: "0"+i.toString()
							}));
						}else{
							hour.append($('<option>',{
								value: i.toString(),
								text: i.toString()
							}));
						}
					}
				});
				//add default options to hour
				for(var i=19;i<24;i++){
					if(i<10){
						hour.append($('<option>',{
							value: "0"+i.toString(),
							text: "0"+i.toString()
						}));
					}else{
						hour.append($('<option>',{
							value: i.toString(),
							text: i.toString()
						}));
					}
				}
				$("#hycom_btn").click(function(){
					cc.fvcom.placeTSOrder();
					//disable the button until the response is received
					//add by Ziheng Sun on 10/23/2015
					$("#hycom_btn").attr('disabled','disabled');
				});
			}else{
				console.error("The page doesn't have correct element name.");
			}
		},
		
		initRiver: function(){
			var year = $("#river_year");
			if(year.length){
				//add content to the three select elements
				var yeararray = [2010,2011,2012,2013,2014];
				for(var i=0;i<yeararray.length;i++){
					year.append($('<option>', {
					    value: yeararray[i],
					    text: yeararray[i]
					}));
				}
				//add click function to the place order button
				$("#river_btn").click(function(){
					cc.fvcom.placeRiverOrder();
					//disable the button until the response is received
					//add by Ziheng Sun on 10/23/2015
					$("#river_btn").attr('disabled','disabled');
				});
			}else{
				console.error("The page doesn't have correct element name.");
			}
		},
		
		done: function(result,status,xhr){
			console.log("Your order is processed. ");
			if(result.indexOf("Failure")==0){
				console.error("The order is failed to be placed. Reason:"+ result);
				alert("The order is failed to be placed. Reason:"+ result);
			}else{
				console.log("Success");
				alert("Your order is successfully submitted. The order id is "+ result+". An email of notice is also sent to the email account you provided.");
			}
		},
		
		fail: function(xhr, status, error){
			console.error("The river order is failed to be processed.");
			console.error("The order is failed to be placed. Reason:"+ error);
			alert("The order is failed to be placed. Reason:"+ error);
		},
		
		riverdone: function(result,status,xhr){
			cc.fvcom.done(result, status, xhr);
			$("#river_btn").removeAttr('disabled');
		},
		
		riverfail : function(xhr, status, error){
			cc.fvcom.fail(xhr, status, error);
			$("#river_btn").removeAttr('disabled');
		},
		
		hycomdone: function(result,status,xhr){
			cc.fvcom.done(result, status, xhr);
			$("#hycom_btn").removeAttr('disabled');
		},
		
		hycomfail : function(xhr, status, error){
			cc.fvcom.fail(xhr, status, error);
			$("#hycom_btn").removeAttr('disabled');
		},
		
		winddone: function(result,status,xhr){
			cc.fvcom.done(result, status, xhr);
			$("#wind_btn").removeAttr('disabled');
		},
		
		windfail: function(xhr, status, error){
			cc.fvcom.fail(xhr, status, error);
			$("#wind_btn").removeAttr('disabled');
		},
		
		initWind: function(){
			$("#bdtv");
			$("#edtv");
			if($("#selectdate1").length){
				$("#selectdate1").click(function(){
					dtToday = new Date(2014, 9, 2); //the maximum date is 2014-10-2
					beginDate = new Date(1979,0,1);
					endDate = new Date(2014,9,2);
					NewCal('bdtv','yyyymmdd',false,24);
				});
			}
			if($("#selectdate2").length){
				$("#selectdate2").click(function(){
					dtToday = new Date(2014, 9, 2); //the maximum date is 2014-10-2
					beginDate = new Date(1979,0,1);
					endDate = new Date(2014,9,2);
					NewCal('edtv','yyyymmdd',false,24);
				});
			}
			if($("#wind_btn").length){
				$("#wind_btn").click(function(){
					cc.fvcom.placeWindOrder();
					//disable the button until the response is received
					//add by Ziheng Sun on 10/23/2015
					$("#wind_btn").attr('disabled','disabled');
				});
			}
		},
		
		beginTimeTextChangeCallBack: function(){
			console.log($("#bdtv").val());
			var begindate = $("#bdtv").val();
			var ymd = begindate.split(" ")[0];
			var time = begindate.split(" ")[1];
			var ymds = ymd.split("-");
			var bd = new Date(ymds[0],Number(ymds[1])-1,ymds[2]);
//			myDate.setDate(myDate.getDate() + AddDaysHere);
//			var begindate = Date.parse($("#bdtv").val());
			var ed = new Date(ymds[0],Number(ymds[1])-1,ymds[2]);
			var numberOfDaysToAdd = 0;
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
			var edstr = ed.getFullYear()+"-"+month+"-"+ day;
			$("#edtv").val(edstr);
		},
		
		endTimeTextChangeCallBack: function(){
			console.log($("#edtv").val());
			//judge if the end date is larger than the begin date
			//if not, alert user and remove the new value
			var enddate = $("#edtv").val();
			var ymds = enddate.split("-");
			var ed = new Date(ymds[0],Number(ymds[1])-1,ymds[2]);
			
			var begindate = $("#bdtv").val();
			if(begindate != ''){
				var ymds0 = begindate.split("-");
				var bd = new Date(ymds0[0], Number(ymds0[1])-1, ymds0[2]);
				
				if(ed<bd){
					
					alert("The end date cannot be before the begin date.");
					$("#edtv").val('');
					return;
				}
			}
		},
		
		placeTSOrder : function(){
			if($("#hycom_year").val()==""){
				alert("Choose a year first.");
				return;
			}
			if($("#email_1").val()==""){
				alert("Enter an Email address.");
				return;
			}
			var hycomyear = $("#hycom_year").val();
			var hycomday = $("#hycom_day").val();
			var hycomhour = $("#hycom_hour").val();
			var request = ["productid=iqm44atsu71ximwas0dv3w88ua4pcf&/T_S_condition_fvcom_inputRequest/RequestFVCOMService_af2b3850-581b-1033-80f8-4d06c0a80002_0/year=",hycomyear, "&/T_S_condition_fvcom_inputRequest/RequestFVCOMService_af2b3850-581b-1033-80f8-4d06c0a80002_0/day=", hycomday, "&/T_S_condition_fvcom_inputRequest/RequestFVCOMService_af2b3850-581b-1033-80f8-4d06c0a80002_0/hour=", hycomhour, "&email=", $("#email_1").val()];
			cc.util.sendPostRequest(cc.util.getServletURL(1), request.join(""),cc.fvcom.hycomdone, cc.fvcom.hycomfail);
		},
		
		placeRiverOrder : function(){
			if($("#river_year").val()==""){
				alert("Choose a year first.");
				return;
			}
			if($("#email_2").val()==""){
				alert("Enter an Email address.");
				return;
			}
			var cyear = Number($("#river_year").val());
			var lyear = cyear - 1;
			
			var request = ["productid=9t1o2kjwpkrgcvchxueutiiz1ftkvj&/FVCOM_River_inputRequest/RequestFVCOMService_6f027550-56a8-1033-8166-87a181aea662_0/year=",cyear, "&/FVCOM_River_inputRequest/RequestFVCOMService_6da55650-56a8-1033-b499-2f0c81aea662_0/year=", lyear,"&email=", $("#email_2").val()];
			cc.util.sendPostRequest(cc.util.getServletURL(1), request.join(""),cc.fvcom.riverdone, cc.fvcom.riverfail);
		},
		
		placeWindOrder : function(){
			if($("#bdtv").val()==""){
				alert("Select begin date.");
				return;
			}
			if($("#edtv").val()==""){
				alert("Select end date");
				return;
			}
			if($("#email_3").val()==""){
				alert("Enter an Email address");
				return;
			}
			var begindate = $("#bdtv").val();
			var ymds1 = begindate.split("-");
			var start_year = ymds1[0];
			var start_month = ymds1[1];
			var start_day = ymds1[2];
			
			var enddate = $("#edtv").val();
			var ymds2 = enddate.split("-");
			var end_year = ymds2[0];
			var end_month = ymds2[1];
			var end_day = ymds2[2];
			var fullmonth = true;
			if(start_month==end_month&&start_year==end_year){
				fullmonth = false;
			}
			var request = ["productid=823q83eltkardidwgbn3c6cvfmsg07&/wind_forcing_fvcom_inputRequest/RequestFVCOMService_03e23120-5865-1033-a7b1-002bc0a80002_0/year_start=",start_year, "&/wind_forcing_fvcom_inputRequest/RequestFVCOMService_03e23120-5865-1033-a7b1-002bc0a80002_0/month_start=", start_month,  "&/wind_forcing_fvcom_inputRequest/RequestFVCOMService_03e23120-5865-1033-a7b1-002bc0a80002_0/day_start=", start_day,  "&/wind_forcing_fvcom_inputRequest/RequestFVCOMService_03e23120-5865-1033-a7b1-002bc0a80002_0/year_end=", end_year,  "&/wind_forcing_fvcom_inputRequest/RequestFVCOMService_03e23120-5865-1033-a7b1-002bc0a80002_0/month_end=", end_month, "&/wind_forcing_fvcom_inputRequest/RequestFVCOMService_03e23120-5865-1033-a7b1-002bc0a80002_0/day_end=", end_day,  "&/wind_forcing_fvcom_inputRequest/RequestFVCOMService_03e23120-5865-1033-a7b1-002bc0a80002_0/full_month=", fullmonth, "&/wind_forcing_fvcom_inputRequest/RequestFVCOMService_0aa8cfa0-5865-1033-8e09-20acc0a80002_2/month_end=", end_month, "&email=", $("#email_3").val()];
			
			cc.util.sendPostRequest(cc.util.getServletURL(1), request.join(""),cc.fvcom.winddone, cc.fvcom.windfail);
			
//			var ed = new Date(ymds[0],Number(ymds[1])-1,ymds[2]);
			
//			823q83eltkardidwgbn3c6cvfmsg07
//			/wind_forcing_fvcom_inputRequest/RequestFVCOMService_03e23120-5865-1033-a7b1-002bc0a80002_0/month_start
		}
		
}