/**
 * list.js
 * @author Ziheng Sun
 * @date 2015.8.11
 * create a list of virtual product
 */
cc.list  = {
		
		init: function(){
			cc.list.queryListOfVirtualProducts();
		},
		
		done: function(result,status,xhr){
			console.log("The request is done.");
			
		},
		
		fail: function(){
			console.log("The request is failed.");
		},
		/**
		 * 
		 */
		queryListOfVirtualProducts: function(){
			var req = "action=productlist";
			cc.util.sendPostRequest(cc.util.getServletURL(2), req,cc.list.done, cc.list.fail);
			
		}
		
};