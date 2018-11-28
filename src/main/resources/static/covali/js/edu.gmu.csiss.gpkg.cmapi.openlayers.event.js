/**
* 
* Google Map External Event Controller - added for overlay
*
* Created by Ziheng Sun on 6/2/2016
* 
*/

edu.gmu.csiss.gpkg.cmapi.openlayers.event = {
		
	isSync: true,
		
	switchSync: function(checked){
		
		if(checked){
			
			edu.gmu.csiss.gpkg.cmapi.openlayers.event.isSync = true;
			
		}else{
			
			edu.gmu.csiss.gpkg.cmapi.openlayers.event.isSync = false;
			
		}
		
	},

	eventList: [
		{
			"name": "test",
			"listeners": []
		}
	],
	/**
	 * Get event object
	 */
	getEventObject: function(e){
		var thee = null;
		for(var i=0;i<this.eventList.length;i++){
			var ae = this.eventList[i];
			if(ae.name == e){
				console.log("Find the event in the list.");
				thee = ae;
				break;
			}
		}
		return thee;
	},
	/**
	 * trigger an event
	 */
	triggerEvent: function(e, obj){
		
		var eobj = this.getEventObject(e);
		
		if(edu.gmu.csiss.gpkg.cmapi.openlayers.event.isSync){
			
			console.log("isSync: " + edu.gmu.csiss.gpkg.cmapi.openlayers.event.isSync);
			
			for(var i=0;i<eobj.listeners.length;i++){
				
				eobj.listeners[i](obj); //execute the listeners
				
			}
			
		}
		
	},
	/**
	 * Register an Event 
	 */
	registerEvent: function(e){
		//check if the event exists
		for(var i=0;i<this.eventList.length;i++){
			var ae = this.eventList[i];
			if(ae.name == e){
				console.error("The event already exists in the list.");
				return;
			}
		}
		//push a new event
		this.eventList.push({
			"name": e,
			"listeners": []
		});
	},
	/**
	 * Add a listener
	 */
	addListener: function(e, listener){
		var eobj = this.getEventObject(e);
		if(typeof eobj == 'undefined'){
			//the event doesn't exist
		}else{
			eobj.listeners.push(listener);
		}
	}
};
