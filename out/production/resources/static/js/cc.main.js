/**
 * CyberConnector
 * Virtual Data Product Query Interface
 * Main Function
 * Entrance Function
 * First invoked Function
 * Require cc.js cc.util.js cc.button.js cc.map.js cc.list.js
 * @author Ziheng Sun
 * @date 2015.8.4
 */
cc.main = {
		/**
		 * Load CyberConnector
		 */
		load: function(){
			cc.util.init();
			if (typeof cc.map != 'undefined')
				cc.map.init();
			if (typeof cc.button != 'undefined')
				cc.button.init();
			if (typeof cc.list != 'undefined')
				cc.list.init();
			if(typeof cc.order != 'undefined'){
				cc.order.initStatusCheck();
			}
			if(typeof cc.fvcom != 'undefined'){
				cc.fvcom.init();
			}
			if(typeof cc.crm != 'undefined'){
				cc.crm.init();
			}
			if(typeof cc.product != 'undefined'){
				cc.product.init();
			}
			if(typeof cc.exhibitor != 'undefined'){
				cc.exhibitor.init();
			}
			if(typeof cc.user != 'undefined'){
				cc.user.init();
			}
			if(typeof cc.register != 'undefined'){
				cc.register.init();
			}
		}
};

cc.main.load();
