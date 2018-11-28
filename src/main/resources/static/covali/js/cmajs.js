/*global window, cmapi */
// Declare cmajs into global namespace
// function wrapper provides a JavaScript closure so we can hide internal variables and functions while exposing a clean public interface
var cmajs = (function () {

  // private variables and functions here
  var initialized = false,
    listeners,
    runtimes,
    schemaLookup = {},
    readyCallbacks = [],
    cmajsInterface;

  function runReadyCallbacks() {
    var i,
      len = readyCallbacks.length;

    for (i = 0; i < len; i++) {
      readyCallbacks[i]();
    }
  }

  function handleMessageComplete(msg) {
  }

  function handleMessageProgress(msg) {
  }

  function getMessageContainer(args) {
    var mid,
      container;
    if (args.payload.hasOwnProperty("messageId")) {
      mid = args.payload.messageId;
    } else {
      mid = cmajsInterface.utils.getUUID();
    }

    function cancel() {
      cmajs.publish({
        channel: "map.message.cancel",
        payload: {
          messageId: messageId
        }
      });
    }
    container = {
      valid: false,
      errors: [],
      payload: args.payload,
      messageId: mid,
      channel: args.channel,
      cancel: cancel
    };
    return container;
  }

  runtimes = (function () {
    var runtimeLookup = {},
      runtimesInterface;

    runtimesInterface = {
      add: function (runtime) {
        runtimeLookup[runtime] = runtime;
      },
      remove: function (runtime) {
        delete runtimeLookup[runtime];
      },
      publish: function (args) {
        var rtKey,
          rt;
        for (rtKey in runtimeLookup) {
          if (runtimeLookup.hasOwnProperty(rtKey)) {
            rt = runtimeLookup[rtKey];
            if (rt !== undefined && rt !== null && rt.hasOwnProperty("publish")) {
              try {
                rt.publish(args);
              } catch (err) {
                cmajsInterface.utils.logError(err);
              }
            }
          }
        }
      },
      unsubscribe: function (args) {
        var rtKey,
          rt;

        for (rtKey in runtimeLookup) {
          if (runtimeLookup.hasOwnProperty(rtKey)) {
            rt = runtimeLookup[rtKey];
            if (rt !== undefined && rt !== null && rt.hasOwnProperty("unsubscribe")) {
              try {
                rt.unsubscribe(args);
              } catch (err) {
                cmajsInterface.utils.logError(err);
              }
            }
          }
        }
      },
      subscribe: function (args) {
        var rtKey,
          rt;
        for (rtKey in runtimeLookup) {
          if (runtimeLookup.hasOwnProperty(rtKey)) {
            rt = runtimeLookup[rtKey];
            if (rt !== undefined && rt !== null && rt.hasOwnProperty("subscribe")) {
              try {
                rt.subscribe(args);
              } catch (err) {
                cmajsInterface.utils.logError(err);
              }
            }
          }
        }
      }
    };
    return runtimesInterface;
  }());

  // define the public interface to the cmapi namespace
  cmajsInterface = {
    setup: {},
    utils: {},
    runtimes: {},
    channels: {
      MAP_DRAGDROP: "map.drag-drop",
      MAP_ERROR: "map.error",
      MAP_FEATURE_CLICKED: "map.feature.clicked",
      MAP_FEATURE_DESELECTED_BATCH: "map.feature.deselected.batch",
      MAP_FEATURE_DESELECTED: "map.feature.deselected",
      MAP_FEATURE_DRAW_PROGRESS: "map.feature.draw.progress",
      MAP_FEATURE_DRAW: "map.feature.draw",
      MAP_FEATURE_EDIT_PROGRESS: "map.feature.edit.progress",
      MAP_FEATURE_EDIT: "map.feature.edit",
      MAP_FEATURE_GET: "map.feature.get",
      MAP_FEATURE_HIDE: "map.feature.hide",
      MAP_FEATURE_MOUSEDOWN: "map.feature.mousedown",
      MAP_FEATURE_MOUSEUP: "map.feature.mouseup",
      MAP_FEATURE_PLOT_BATCH: "map.feature.plot.batch",
      MAP_FEATURE_PLOT: "map.feature.plot",
      MAP_FEATURE_PLOT_URL: "map.feature.plot.url",
      MAP_FEATURE_SELECTED_BATCH: "map.feature.selected.batch",
      MAP_FEATURE_SELECTED: "map.feature.selected",
      MAP_FEATURE_SHOW: "map.feature.show",
      MAP_FEATURE_UNPLOT_BATCH: "map.feature.unplot.batch",
      MAP_FEATURE_UNPLOT: "map.feature.unplot",
      MAP_FEATURE_UPDATE: "map.feature.update",
      MAP_GET: "map.get",
      MAP_MENU_CLICKED: "map.menu.clicked",
      MAP_MENU_CREATE: "map.menu.create",
      MAP_MENU_REMOVE: "map.menu.remove",
      MAP_MESSAGE_CANCEL: "map.message.cancel",
      MAP_MESSAGE_PROGRESS: "map.message.progress",
      MAP_OVERLAY_CLUSTER_ACTIVATE: "map.overlay.cluster.activate",
      MAP_OVERLAY_CLUSTER_DEACTIVATE: "map.overlay.cluster.deactivate",
      MAP_OVERLAY_CLUSTER_REMOVE: "map.overlay.cluster.remove",
      MAP_OVERLAY_CLUSTER_SET: "map.overlay.cluster.set",
      MAP_OVERLAY_CREATE: "map.overlay.create",
      MAP_OVERLAY_FEATURES_GET: "map.overlay.features.get",
      MAP_OVERLAY_GET: "map.overlay.get",
      MAP_OVERLAY_HIDE: "map.overlay.hide",
      MAP_OVERLAY_REMOVE: "map.overlay.remove",
      MAP_OVERLAY_SHOW: "map.overlay.show",
      MAP_OVERLAY_UPDATE: "map.overlay.update",
      MAP_STATUS_ABOUT: "map.status.about",
      MAP_STATUS_FORMAT: "map.status.format",
      MAP_STATUS_INITIALIZATION: "map.status.initialization",
      MAP_STATUS_REQUEST: "map.status.request",
      MAP_STATUS_SELECTED: "map.status.selected",
      MAP_STATUS_VIEW: "map.status.view",
      MAP_VIEW_AREA_SELECTED: "map.view.area.selected",
      MAP_VIEW_CENTER_BOUNDS: "map.view.center.bounds",
      MAP_VIEW_CENTER_FEATURE: "map.view.center.feature",
      MAP_VIEW_CENTER_LOCATION: "map.view.center.location",
      MAP_VIEW_CENTER_OVERLAY: "map.view.center.overlay",
      MAP_VIEW_CLICKED: "map.view.clicked",
      MAP_VIEW_MOUSEDOWN: "map.view.mousedown",
      MAP_VIEW_MOUSEUP: "map.view.mouseup",
      MAP_VIEW_ZOOM: "map.view.zoom"
    },
    schemas: {
      // register schemas at runtime.  This allows for adding new / custom schemas as needed
      append: function (schemas) {
        var key;
        for (key in schemas) {
          if (schemas.hasOwnProperty(key)) {
            schemaLookup[key] = schemas[key].schema;
          }
        }
      },
      retrieve: function (key) {
        return schemaLookup[key];
      }
    },
    ready: function (callback) {
      if (initialized === true) {
        callback();
      } else {
        readyCallback.push(callback);
      }
    },
    publish: function (args) {
      var messageContainer = {
          valid: false
        },
        schema;

      // Check if we will ban unknown properties in schema validation
      // JSON schema allows additional properties by default, but this can be set to strict in the tv4 JSON validator
      if (!args.hasOwnProperty("strict")) {
        args.strict = false;
      }
      schema = cmajsInterface.schemas.retrieve(args.channel);
      if (schema) {
        messageContainer = getMessageContainer(args);
        messageContainer = cmajsInterface.utils.validateMessage(messageContainer, args.strict, schema);
        if (messageContainer.valid === true) {
          if (args.hasOwnProperty("onComplete")) {
            listener.setItem(
              messageContainer.messageId, args.onComplete
            );
          }
          if (args.hasOwnProperty("onProgess")) {
            listener.setItem(messageContainer.messageId, args.onProgess);
          }
          runtimes.publish(messageContainer);
        }
      }
      return messageContainer;
    },
    subscribe: function (args) {
      var i,
        len;
      if (cmajsInterface.utils.isArray(args)) {
        len = args.length;
        for (i = 0; i < len; i++) {
          runtimes.subscribe(args[i]);
        }
      } else {
        runtimes.subscribe(args);
      }
    },
    unsubscribe: function (args) {
      var i,
        len;
      if (cmajsInterface.utils.isArray(args)) {
        len = args.length;
        for (i = 0; i < len; i++) {
          runtimes.unsubscribe(args[i]);
        }
      } else {
        runtimes.unsubscribe(args);
      }
    },
    init: function (args) {
      var i,
        len;
      if (cmapi && cmapi.hasOwnProperty("channel")) {
        cmajsInterface.schemas.append(cmapi.channel);
      }
      if (!initialized) {
        listeners = new cmajsInterface.utils.Hash();
        initialized = true;
        runReadyCallbacks();
        cmajsInterface.subscribe([{
          channel: "map.message.complete",
          callback: handleMessageComplete
        }, {
          channel: "map.message.progress",
          callback: handleMessageProgress
        }]);
      }
      if (args) {
        if (args.hasOwnProperty("runtimes")) {
          if (cmajsInterface.utils.isArray(args.runtimes)) {
            len = args.runtimes.length;
            for (i = 0; i < len; i++) {
              runtimes.add(args.runtimes[i]);
            }
          }
        }
      }
    }
  };
  /*
   * This retuns the public methods
   */
  return cmajsInterface;
}());
cmajs.utils.Hash = function () {
  var i;
  this.length = 0;
  this.items = [];
  for (i = 0; i < arguments.length; i += 2) {
    if (typeof (arguments[i + 1]) !== 'undefined') {
      this.items[arguments[i]] = arguments[i + 1];
      this.length += 1;
    }
  }
  /**
   * @method removeItem
   * @memberof emp.helpers
   * @return {object}
   */
  this.removeItem = function (in_key) {
    var tmp_previous;
    if (typeof (this.items[in_key]) !== 'undefined') {
      this.length -= 1;
      tmp_previous = this.items[in_key];
      delete this.items[in_key];
    }

    return tmp_previous;
  };
  /**
   * @method getItem
   * @memberof emp.helpers
   * @return {object}
   */
  this.getItem = function (in_key) {
    return this.items[in_key];
  };
  /**
   * @method setItem
   * @memberof emp.helpers
   * @return {object}
   */
  this.setItem = function (in_key, in_value) {
    var tmp_previous;
    if (typeof (in_value) !== 'undefined') {
      if (typeof (this.items[in_key]) === 'undefined') {
        this.length += 1;
      } else {
        tmp_previous = this.items[in_key];
      }

      this.items[in_key] = in_value;
    }

    return tmp_previous;
  };
  /**
   * @method hasItem
   * @memberof emp.helpers
   * @return {object}
   */
  this.hasItem = function (in_key) {
    return typeof (this.items[in_key]) !== 'undefined';
  };
  /**
   * @method clear
   * @memberof emp.helpers
   * @return {object}
   */
  this.clear = function () {
    var i;

    for (i in this.items) {
      if (this.items.hasOwnProperty(i)) {
        delete this.items[i];
      }
    }

    this.length = 0;
  };
};
/*global cmajs */
(function () {
  if (cmajs && cmajs.utils) {
    cmajs.utils.getObjectFromSchema = function (jsonSchema) {
      var result = {},
        schemaObj;
      schemaObj = JSON.parse(jsonSchema);

      function iterateObject(obj) {
        var obProp,
          prop;
        for (obProp in obj) {
          if (obj.hasOwnProperty(obProp)) {
            prop = obProp[obProp];
          }
        }
      }
      try {
        result = iterateObject(schemaObj);
      } catch (err) {
        result = {};
        cmajs.utils.logMessage("An object template could not be generated from the JSON schema due to an error.  See the following error to find cause");
        cmajs.utils.logError(err);
      }
      return result;
    };
  }
}());
/*global cmajs */
(function () {
   function template () {

    var runtimeInterface = {

      init: function () {
        // Create ane EMP Error to notify system that this capability has not been implemented
        cmajs.utils.logMessage("The init method has not been implemented by this environment");
        // Return false as the initialization failed
        return false;
      },

      destroy: function () {
        // Create ane EMP Error to notify system that this capability has not been implemented
        cmajs.utils.logMessage("The destroy method has not been implemented by this environment");
        // Return false as the envirnment could not be destroyed
        return false;
      },

      pubSub: {

        publish: function () {
          // Create ane EMP Error to notify system that this capability has not been implemented
          cmajs.utils.logMessage("pubSub.publish has not been implemented by this environment");
          // Return false for failure to publish
          return false;
        },

        subscribe: function () {
          // Create ane EMP Error to notify system that this capability has not been implemented
          cmajs.utils.logMessage("pubSub.subscribe has not been implemented by this environment");
          // Return false for failure to publish
          return false;
        },

        unsubscribe: function () {
          // Create ane EMP Error to notify system that this capability has not been implemented
          cmajs.utils.logMessage("pubSub.unsubscribe has not been implemented by this environment");
          // Return false for failure to publish
          return false;
        }
      },

      getInstanceId: function () {
        // Create ane EMP Error to notify system that this capability has not been implemented
        cmajs.utils.logMessage("getInstanceId has not been implemented by this environment");
        // Return null as the requested pref could not be returned
        return undefined;
      },

      name: "Unnamed Environment",
      version: "1.0.0",
      sender: {
        id: cmajs.utils.getUUID()
      }
    };


    // returns a copy of the runtimeInterface template object that will have
    // its methods and properties overridden by an runtime definition
    return runtimeInterface;
  }
  // append to cmajs.runtime namespcae
  cmajs.utils.getRuntimeTemplate = template;
}());
/*global cmajs */
(function () {
  // Keep track of used ids to make sure we never use the same id twice in one session
  var usedIds = {};

  function repFunc(c) {
    var r = Math.random() * 16 | 0,
      v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }

  function generateUUID() {
      var isUsed = true,
        uuid;
      while (isUsed) {
        uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, repFunc);
        if (!usedIds[uuid]) {
          usedIds[uuid] = uuid;
          isUsed = false;
        }
      }
      return uuid;
    }
    // append this function to the cmajs.utils namespace
  cmajs.utils.getUUID = generateUUID;
}());
/*global cmapi, cmajs */
(function () {

  function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  }
  // append to cmajs.utils namespace
  cmajs.utils.isArray = isArray;
}());
/*global cmapi, cmajs */
(function () {
  function logError(error) {
    if (console && console.hasOwnProperty("error")) {
      console.error(error);
    }
  }
  cmajs.utils.logError = logError;
}());
/*global cmapi,console, cmajs */
(function () {
  function logMessage(message) {
    if (console && console.hasOwnProperty("log")) {
      console.log(message);
    }
  }

  cmajs.utils.logMessage = logMessage;
}());
/*global cmajs, tv4, cmapi */
(function () {
   
    function getValidationErrorString(valError, index, total) {
      var message,
        i;
      if (total <= 1) {
        message = "The message payload is not valid:  ";
      } else {
        message = "The message payload " + index + " of " + total + " is not valid:  ";
      }
      for (i = 0; i < valError.length; i++) {
        message += "\n " + valError[i].message + " " + valError[i].schemaPath + " " + valError[i].dataPath;
      }
      return message;
    }

    

    function validate(container, strict, schema) {
      var msg = container.payload,
        i,
        len,
        validation,
        isJson = false,
        response = container;

      if (typeof msg === "string") {
        try {
          msg = JSON.parse(msg);
          isJson = true;
        } catch (e) {
          cmajs.utils.logError(e);
        }
      } else if (typeof msg === "object") {
        isJson = true;
      }
      if (isJson === true) {
        if (strict !== true) {
          strict = false;
        }
        if (!cmajs.utils.isArray(msg)) {
          msg = [msg];
        }
        len = msg.length;
        for (i = 0; i < len; i++) {
          validation = tv4.validateMultiple(msg[i], schema, true, strict);
          response.valid = validation.valid;
          if (validation.valid === false) {
            response.errors.push(getValidationErrorString(validation.errors, i, len));
          }
        }
      }
      return response;
    }
    // append to cmajs.utils namespace
   cmajs.utils.validateMessage = validate;
}());
/*global cmajs */
(function () {

  var template = cmajs.utils.getRuntimeTemplate(),
    senderId = cmajs.utils.getUUID();

  template.name = "Browser";

  template.getInstanceId = function () {
    return senderId;
  };

  template.init = function (args) {
    if (args) {
      if (args.hasOwnProperty("initcallback")) {
        args.initcallback();
      }
    }
  };

  template.pubSub.publish = function (args) {
    var success = false;


    cmajs.runtime.browser.mediator.publish({
      channel: args.channel,
      message: args.message,
      sender: {
        id: senderId
      }
    });
    success = true;


    return success;
  };

  template.pubSub.subscribe = function (args) {
    var success = false;

    cmajs.runtime.browser.mediator.subscribe({
      channel: args.channel,
      callback: args.callback
    });
    success = true;

    return success;
  };

  template.pubSub.unsubscribe = function (args) {
    var success = false;

    cmajs.runtime.browser.mediator.unsubscribe({
      channel: args.channel,
      callback: args.callback
    });
    success = true;

    return success;
  };

  cmajs.runtimes.browser = template;

}());
/*global cmajs */
(function () {
  cmajs.runtimes.browser.mediator = (function () {
    var listeners = new cmajs.utils.Hash(),
      publicInterface = {

        subscribe: function (listenerInfo) {
          if (listeners.getItem(listenerInfo.channel) !== null && listeners.getItem(listenerInfo.channel) !== undefined) {
            listeners.getItem(listenerInfo.channel).push(listenerInfo.callback);
          } else {
            var callbacks = [];
            callbacks.push(listenerInfo.callback);
            listeners.setItem(listenerInfo.channel, callbacks);
          }
        },

        unsubscribe: function (listenerInfo) {
          var callbackArray,
            len,
            i;

          if (listeners.getItem(listenerInfo.channel) !== null && listeners.getItem(listenerInfo.channel) !== undefined) {
            callbackArray = listeners.getItem(listenerInfo.channel);
            len = callbackArray.length;

            for (i = 0; i < len; i += 1) {
              if (callbackArray[i] === listenerInfo.callback) {
                callbackArray.splice(i, 1);
                return true;
              }
            }
          }
          return false;
        },
        publish: function (message) {
          var callbacks = listeners.getItem(message.channel),
            len,
            i,
            success = {
              success: false,
              message: "An unanticipated error has occurred in cmajs.runtime.browser.mediator.dispatch"
            };
          try {
            if (typeof (message.message) === "string") {
              message.message = JSON.parse(message.message);
            }
            if (callbacks !== null && callbacks !== undefined) {
              len = callbacks.length;
              for (i = 0; i < len; i += 1) {
                if (callbacks[i] !== null) {
                  try {
                    callbacks[i](message.sender, message.message, message.channel);
                  } catch (ignore) {

                  }
                }
              }
            }
          } catch (err2) {

            success = {

              success: false,
              message: err2.toString()
            };
          }
          return success;
        }
      };

    return publicInterface;
  }());
}());
/*global cmajs, tv4 */

  // Verify that the tv4 JSON schema validation library is avaialbe in current application
  if (!tv4) {
    cmajs.utils.logMessage("tv4 is not availble and required to use the cmajs library.  Please include tv4.js on the page bdofre the cmajs include.  See https://github.com/geraintluff/tv4 or use the tv4.min.js file located in the libs driectory of the cmajs project");
  }
  // Initilize cmajs library to load schemas and perfrom setup
  cmajs.init();

