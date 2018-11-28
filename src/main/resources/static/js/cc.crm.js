/**
 * 
 * CRM page
 * 
 * @author Ziheng Sun
 * @date 2015.11.23
 * 
 */
cc.crm = {
	
		init : function(){
			var field = $("#field_file_url");
			var q1q2 = $("#q1q2_file_url");
			var fluxes = $("#fluxes_file_url");
			var button = $("#crm_btn");
			if(field.length && q1q2.length && fluxes.length && button.length){
				field.val("http://www3.csiss.gmu.edu/data/fields.lsan_v1");
				q1q2.val("http://www3.csiss.gmu.edu/data/q1q2.lsan_v1");
				fluxes.val("http://www3.csiss.gmu.edu/data/nsa.dfluxes");
				button.click(function(){
					cc.crm.placeOrder();
					//disable the button until the response is received
					//add by Ziheng Sun on 10/23/2015
					$("#crm_btn").attr('disabled','disabled');
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
			$("#crm_btn").removeAttr('disabled');
		},
		
		fail: function(xhr, status, error){
			console.error("The river order is failed to be processed.");
			console.error("The order is failed to be placed. Reason:"+ error);
			alert("The order is failed to be placed. Reason:"+ error);
			$("#crm_btn").removeAttr('disabled');
		},
		
		placeOrder : function(){
			if($("#field_file_url").val()==""){
				alert("Input a field file first.");
				return;
			}
			if($("#q1q2_file_url").val()==""){
				alert("Input a q1 q2 file first.");
				return;
			}
			if($("#fluxes_file_url").val()==""){
				alert("Input a fluxes file first.");
				return;
			}
			if($("#email").val()==""){
				alert("Enter an Email address.");
				return;
			}
			var crmfield = $("#field_file_url").val();
			var crmq1q2 = $("#q1q2_file_url").val();
			var crmfluxes = $("#fluxes_file_url").val();
			var request = ["productid=330j1mtkt6elfkud7anu2cnx9rrqrq&/CRM_array_averaged_analysis_modelRequest/RequestCRMService_47106420-7530-1033-95db-c4cf81aea662_0/fieldDataURL=", crmfield, "&/CRM_array_averaged_analysis_modelRequest/RequestCRMService_47106420-7530-1033-95db-c4cf81aea662_0/Q1Q2DataURL=", crmq1q2, "&/CRM_array_averaged_analysis_modelRequest/RequestCRMService_4a96a4b0-7530-1033-8d2c-713581aea662_2/fluxDataURL=", crmfluxes, "&email=", $("#email").val()];
			cc.util.sendPostRequest(cc.util.getServletURL(1), request.join(""),cc.crm.done, cc.crm.fail);
		}
		
}