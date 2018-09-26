var cmapi = cmapi || {};
cmapi.channel = cmapi.channel || {};
cmapi.overview = cmapi.overview || {};cmapi.channel["map.drag-drop"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Framework dependent",
    "type": "object",
    "properties": {
      "dragDropData": {
        "type": "object",
        "required": ["featureId"],
        "properties": {
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "zoom": {
            "type": "boolean",
            "default": false
          },
          "marker": {
            "type": "object",
            "properties": {
              "details": {
                "type": "string"
              },
              "iconUrl": {
                "type": "string",
                "default": "map default icon"
              }
            }
          },
          "feature": {
            "type": "object",
            "properties": {
              "format": {
                "type": "string",
                "default": "kml"
              },
              "featureData": {
                "type": "object"
              }
            },
            "required": ["featureData"]
          },
          "featureUrl": {
            "type": "object",
            "properties": {
              "format": {
                "type": "string",
                "default": "kml"
              },
              "url": {
                "type": "string"
              },
              "params": {
                "type": "object"
              }
            },
            "required": ["url"]
          }
        }
      }
    },
    "required": ["dragDropData"]
  }
};
cmapi.channel["map.error"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.error",
    "type": "object",
    "properties": {
      "sender": {
        "type": "string"
      },
      "type": {
        "type": "string"
      },
      "msg": {
        "type": "object"
      },
      "error": {
        "type": "string"
      }
    },
    "required": ["sender", "type", "msg", "error"]
  }
};
cmapi.channel["map.feature.clicked"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.clicked",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "lat": {
        "type": "number",
        "minimum": "-90",
        "maximum": "90"
      },
      "lon": {
        "type": "number",
        "minimum": "-180",
        "maximum": "180"
      },
      "button": {
        "type": ["string", "enum"],
        "enum": ["left", "middle", "right"],
        "default": "left"
      },
      "type": {
        "type": ["string", "enum"],
        "enum": ["single", "double"],
        "default": "single"
      },
      "keys": {
        "type": "array",
        "uniqueItems": true,
        "default": ["none"],
        "items": {
          "enum": ["shift", "alt", "ctrl", "none"]
        }
      }
    },
    "required": ["lat", "lon", "button", "keys", "type", "featureId", "overlayId"]
  }
};
cmapi.channel["map.feature.deselected.batch.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "features": {
        "type": "array",
        "properties": {
          "deSelectedId": {
		    "type": "string"
          },
          "deSelectedName": {
            "type": "string"
          },
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }		 
        },
        "required": ["deSelectedId", "deSelectedName", "featureId", "overlayId"]
      }
    },
    "required": ["features"]
  }
};
cmapi.channel["map.feature.deselected.batch"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.deselected.batch",
    "type": "object",
    "properties": {
       "features": {
        "type": "array"
      },
      "overlayId": {
        "type": "string"
      },
      "messageId": {
        "type": "string",
        "extension": "User Manipulation - Message Complete"
      } 
    },
    "required": ["features"]
  }
};
cmapi.channel["map.feature.deselected.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {	
          "deSelectedId": {
		    "type": "string"
          },
          "deSelectedName": {
            "type": "string"
          },
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }		 
    },
    "required": ["deSelectedId", "deSelectedName", "featureId", "overlayId"]
  }
};
cmapi.channel["map.feature.deselected"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.deselected",
    "properties": {
      "deSelectedId": {
        "type": "string"
      },
      "deSelectedName": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "overlayId": {
        "type": "string"
      }
    },
    "required": ["featureId"]
  }
};
cmapi.channel["map.feature.draw.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "type": {
        "type": "string"
      },
      "properties": {
        "type": "object"
      },
      "feature": {
        "type": "object"
      },
      "format": {
        "type": "string"
      },
      "coordinates": {
        "type": "array"
      }
    },
    "required": ["featureId", "overlayId", "type", "feature", "format", "coordinates"]
  }
};
cmapi.channel["map.feature.draw.progress"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.progress Details object",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "type": {
        "type": "string"
      },
      "properties": {
        "type": "object"
      },
      "feature": {
        "type": "object"
      },
      "format": {
        "type": "string"
      },
      "updates": {
        "type": "object",
        "properties": {
          "type": {
            "enum": ["add", "update", "remove"]
          },
          "indices": {
            "type": "array",
            "items": {
              "type": "integer"
            },
            "additionalItems": true
          },
          "coordinates": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "number",
                  "maximum": 90,
                  "minimum": -90,
                  "description": "The latitude component of the coordinate."
                },
                "lon": {
                  "type": "number",
                  "maximum": 180,
                  "minimum": -180,
                  "description": "The longitude component of the coordinate."
                },
                "alt": {
                  "type": "number",
                  "description": "The optional altitude component of the coordinate."
                }
              }
            },
            "additionalItems": true
          }
        }
      }
    },
    "required": ["featureId", "overlayId", "type", "feature", "format", "updates"]
  }
};
cmapi.channel["map.feature.draw"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.draw",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "messageId": {
        "type": "string"
      },
      "type": {
        "type": "string",
        "default": "line"
      },
      "name": {
        "type": "string"
      },
      "properties": {
        "type": "object"
      },
      "menuId": {
        "type": "string",
        "status": "new",
        "extension": "User Manipulation - Context Menus"
      }
    },
    "required": ["featureId", "messageId", "type"]
  }
};
cmapi.channel["map.feature.edit.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "properties": {
        "type": "object"
      },
      "feature": {
        "type": "object"
      },
      "format": {
        "type": "string"
      },
      "coordinates": {
        "type": "array"
      }
    },
    "required": ["featureId", "overlayId", "feature", "format", "coordinates"]
  }
};
cmapi.channel["map.feature.edit.progress"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.progress Details object",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "properties": {
        "type": "object"
      },
      "feature": {
        "type": "object"
      },
      "format": {
        "type": "string"
      },
      "status": {
        "enum": ["start", "update"]
      },
      "updates": {
        "type": "object",
        "properties": {
          "type": {
            "enum": ["add", "update", "remove"]
          },
          "indices": {
            "type": "array",
            "items": {
              "type": "integer"
            },
            "additionalItems": true
          },
          "coordinates": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "number",
                  "maximum": 90,
                  "minimum": -90,
                  "description": "The latitude component of the coordinate."
                },
                "lon": {
                  "type": "number",
                  "maximum": 180,
                  "minimum": -180,
                  "description": "The longitude component of the coordinate."
                },
                "alt": {
                  "type": "number",
                  "description": "The optional altitude component of the coordinate."
                }
              },
              "required": ["lat", "lon"]
            },
            "additionalItems": true
          }
        },
        "required": ["type", "indices", "coordinates"]
      }
    },
    "required": ["featureId", "overlayId", "feature", "format", "status", "updates"]
  }
};
cmapi.channel["map.feature.edit"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.edit",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "messageId": {
        "type": "string"
      }
    },
    "required": ["featureId", "messageId"]
  }
};
cmapi.channel["map.feature.get"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.get",
    "properties": {
      "features": {
        "type": "array",
        "properties": {
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }
        },
        "additionalItems": true,
        "required": ["features, messagId"]
      },
      "messageId": {
        "type": "string"
      }
    },
    "required": ["features, messagId"]
  }
};
cmapi.channel["map.feature.hide.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {		
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          } 
    },
    "required": ["featureId", "overlayId"]
  }
};
cmapi.channel["map.feature.hide"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.hide",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      }
    },
    "required": ["featureId"]
  }
};
cmapi.channel["map.feature.mousedown"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.mousedown",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "lat": {
        "type": "number",
        "minimum": "-90",
        "maximum": "90"
      },
      "lon": {
        "type": "number",
        "minimum": "-180",
        "maximum": "180"
      },
      "button": {
        "type": "string",
        "enum": ["left", "middle", "right"],
        "default": "left"
      },
      "type": {
        "type": "string",
        "enum": ["single", "double"],
        "default": "single"
      },
      "keys": {
        "uniqueItems": true,
        "type": "string",
        "default": "none",
        "enum": ["shift", "alt", "ctrl", "none"]
      }
    },
    "required": ["lat", "lon", "button", "keys", "type", "featureId", "overlayId"]
  }
};
cmapi.channel["map.feature.mouseup"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.mouseup",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "lat": {
        "type": "number",
        "minimum": "-90",
        "maximum": "90"
      },
      "lon": {
        "type": "number",
        "minimum": "-180",
        "maximum": "180"
      },
      "button": {
        "type": "string",
        "enum": ["left", "middle", "right"],
        "default": "left"
      },
      "type": {
        "type": "string",
        "enum": ["single", "double"],
        "default": "single"
      },
      "keys": {
        "default": "none",
        "type": "string",
        "enum": ["shift", "alt", "ctrl", "none"]
      }
    },
    "required": ["lat", "lon", "button", "keys", "type", "featureId", "overlayId"]
  }
};
cmapi.channel["map.feature.plot.2525b"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "http://json-schema.org/geojson/geojson.json#",
    "title": "map.feature.plot.2525b",
    "type": "object",
    "required": ["format", "feature"],
    "properties": {
      "format": {
        "type": "string",
        "enum": ["2525b"]
      },
      "feature": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "feature",
        "type": "object",
        "properties": {
          "symbolCode": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "enum": ["point", "lineString"]
          },
          "coordinates": {
            "type": "array"
          }
        },
        "required": ["symbolCode", "type", "coordinates"]
      },
      "properties": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "properties",
        "type": "object",
        "properties": {
          "modifiers": {
            "type": "object",
            "properties": {
              "size": {
                "type": "integer"
              },
              "A": {
                "type": "string"
              },
              "B": {
                "type": "string"
              },
              "C": {
                "type": "string"
              },
              "D": {
                "type": "string"
              },
              "E": {
                "type": "string"
              },
              "F": {
                "type": "string"
              },
              "G": {
                "type": "string"
              },
              "H": {
                "type": "string"
              },
              "H1": {
                "type": "string"
              },
              "H2": {
                "type": "string"
              },
              "J": {
                "type": "string"
              },
              "K": {
                "type": "string"
              },
              "L": {
                "type": "string"
              },
              "M": {
                "type": "string"
              },
              "N": {
                "type": "string"
              },
              "P": {
                "type": "string"
              },
              "Q": {
                "type": "number",
                "minimum": 0,
                "maximum": 359
              },
              "R": {
                "type": "string"
              },
              "R2": {
                "enum": ["M", "S", "U"]
              },
              "S": {
                "type": "string"
              },
              "T": {
                "type": "string"
              },
              "T1": {
                "type": "string"
              },
              "V": {
                "type": "string"
              },
              "W": {
                "type": "string"
              },
              "W1": {
                "type": "string"
              },
              "X": {
                "type": "array"
              },
              "Y": {
                "type": "string"
              },
              "AA": {
                "type": "string"
              },
              "AC": {
                "type": "string"
              },
              "AD": {
                "type": "string"
              },
              "AE": {
                "type": "number"
              },
              "AF": {
                "type": "string"
              },
              "AG": {
                "type": "string"
              },
              "AH": {
                "type": "string"
              },
              "AI": {
                "type": "string"
              },
              "AJ": {
                "type": "string"
              },
              "AK": {
                "type": "string"
              },
              "AL": {
                "type": "string"
              },
              "AM": {
                "type": "array"
              },
              "AN": {
                "type": "array"
              },
              "AO": {
                "type": "string"
              },
              "CC": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
};
cmapi.channel["map.feature.plot.2525c"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "http://json-schema.org/geojson/geojson.json#",
    "title": "map.feature.plot.2525c",
    "type": "object",
    "required": ["format", "feature"],
    "properties": {
      "format": {
        "type": "string",
        "enum": ["2525c"]
      },
      "feature": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "feature",
        "type": "object",
        "properties": {
          "symbolCode": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "enum": ["point", "lineString"]
          },
          "coordinates": {
            "type": "array"
          }
        },
        "required": ["symbolCode", "type", "coordinates"]
      },
      "properties": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "properties",
        "type": "object",
        "properties": {
          "modifiers": {
            "type": "object",
            "properties": {
              "size": {
                "type": "integer"
              },
              "A": {
                "type": "string"
              },
              "B": {
                "type": "string"
              },
              "C": {
                "type": "string"
              },
              "D": {
                "type": "string"
              },
              "E": {
                "type": "string"
              },
              "F": {
                "type": "string"
              },
              "G": {
                "type": "string"
              },
              "H": {
                "type": "string"
              },
              "H1": {
                "type": "string"
              },
              "H2": {
                "type": "string"
              },
              "J": {
                "type": "string"
              },
              "K": {
                "type": "string"
              },
              "L": {
                "type": "string"
              },
              "M": {
                "type": "string"
              },
              "N": {
                "type": "string"
              },
              "P": {
                "type": "string"
              },
              "Q": {
                "type": "number",
                "minimum": 0,
                "maximum": 359
              },
              "R": {
                "type": "string"
              },
              "R2": {
                "enum": ["M", "S", "U"]
              },
              "S": {
                "type": "string"
              },
              "T": {
                "type": "string"
              },
              "T1": {
                "type": "string"
              },
              "V": {
                "type": "string"
              },
              "W": {
                "type": "string"
              },
              "W1": {
                "type": "string"
              },
              "X": {
                "type": "array"
              },
              "Y": {
                "type": "string"
              },
              "AA": {
                "type": "string"
              },
              "AC": {
                "type": "string"
              },
              "AD": {
                "type": "string"
              },
              "AE": {
                "type": "number"
              },
              "AF": {
                "type": "string"
              },
              "AG": {
                "type": "string"
              },
              "AH": {
                "type": "string"
              },
              "AI": {
                "type": "string"
              },
              "AJ": {
                "type": "string"
              },
              "AK": {
                "type": "string"
              },
              "AL": {
                "type": "string"
              },
              "AM": {
                "type": "array"
              },
              "AN": {
                "type": "array"
              },
              "AO": {
                "type": "string"
              },
              "CC": {
                "type": "string"
              }
            }
          }
        }
      }
    }
  }
};
cmapi.channel["map.feature.plot.aoi"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "http://json-schema.org/geojson/geojson.json#",
    "title": "map.feature.plot.aoi",
    "type": "object",
    "required": ["aoi"],
    "properties": {
      "aoi": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "aoi",
        "type": "object",
        "properties": {
          "buffer": {
            "type": "number",
            "minimum": 1
          },
          "type": {
            "type": "string",
            "enum": ["bbox", "polygon", "line", "point-radius"]
          }
        },
        "required": ["type"]
      }
    }
  }
};
cmapi.channel["map.feature.plot.batch.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "features": {
        "type": "array",
        "properties": {
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "format": {
            "type": "string"
          },
          "feature": {
            "type": ["object", "string"],
            "additionalProperties": true
          },
          "readOnly": {
            "type": "boolean"
          },
          "properties": {
            "additionalProperties": true,
            "type": "object"
          }
        },
        "required": ["featureId", "overlayId","name","format","feature","readOnly","properties"]
      }
    },
    "required": ["features"]
  }
};
cmapi.channel["map.feature.plot.batch"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.plot.batch",
    "type": "object",
    "properties": {
      "features": {
        "type": "array"
      },
      "overlayId": {
        "type": "string"
      },
      "format": {
        "type": "string"
      },
      "zoom": {
        "type": "boolean"
      },
      "readOnly": {
        "type": "boolean"
      }
    },
    "required": ["features","overlayId","format"]
  }
};
cmapi.channel["map.feature.plot.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {		
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "format": {
            "type": "string"
          },
          "feature": {
            "type": ["object", "string"],
            "additionalProperties": true
          },
		  "zoom": {
            "type": "boolean",
          }, 
          "readOnly": {
            "type": "boolean",
          },
          "properties": {
            "additionalProperties": true,
            "type": "object"
          }
    },
     "required": ["featureId", "overlayId", "name","format","feature","zoom","readOnly","properties"]
  }
};
cmapi.channel["map.feature.plot.geojson"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "http://json-schema.org/geojson/geojson.json#",
    "title": "map.feature.plot.geojson",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "id": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "timePrimitive": {
        "type": "object",
        "properties": {
          "timeSpan": {
            "type": "object",
            "properties": {
              "begin": {
                "type": "string",
                "format": "date-time"
              },
              "end": {
                "type": "string",
                "format": "date-time"
              }
            },
            "required": ["begin", "end"]
          },
          "timeStamp": {
            "type": "string",
            "format": "date-time"
          }
        }
      },
      "style": {
        "type": "object",
        "properties": {
          "lineStyle": {
            "type": "object",
            "properties": {
              "color": {
                "type": "object",
                "default": "No value sent results in default settings on the map.",
                "properties": {
                  "r": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "g": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "b": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "a": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                },
                "required": ["r", "g", "b", "a"]
              }
            },
            "required": ["color"]
          },
          "polyStyle": {
            "type": "object",
            "properties": {
              "color": {
                "type": "object",
                "default": "No value sent results in default settings on the map.",
                "properties": {
                  "r": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "g": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "b": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "a": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                },
                "required": ["r", "g", "b", "a"]
              }
            },
            "required": ["color"]
          },
          "iconStyle": {
            "type": "object",
            "properties": {
              "url": {
                "type": "uri"
              },
              "size": {
                "type": "integer",
                "default": 32
              }
            },
            "required": ["url"]
          }
        }
      }
    }
  }
};
cmapi.channel["map.feature.plot"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.plot",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "format": {
        "type": "string",
        "enum": ["kml","geojson"],
        "default": "kml"
      },
      "feature": {
        "type": ["object", "string"],
        "additionalProperties": true
      },
      "zoom": {
        "type": "boolean",
        "default": false
      },
      "readOnly": {
        "type": "boolean",
        "default": true
      },
      "properties": {
        "additionalProperties": true,
        "type": "object",
        "status": "new"
      }
    },
    "required": ["featureId", "feature"]
  }
};
cmapi.channel["map.feature.plot.symbol"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "http://json-schema.org/geojson/geojson.json#",
    "title": "map.feature.plot.symbol",
    "type": "object",
    "required": ["feature"],
    "properties": {
      "feature": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "feature",
        "type": "object",
        "properties": {
          "symbolCode": {
            "type": "string",
            "minimum": 1
          },
          "type": {
            "enum": ["point", "polygon", "lineString"]
          },
          "coordinates": {
            "type": "array"
          }
        },
        "required": ["symbolCode", "type", "coordinates"]
      },
      "properties": {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "properties",
        "type": "object",
        "properties": {}
      }
    }
  }
};
cmapi.channel["map.feature.plot.url.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "format": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
		  "params": {
			"type": "object"
		  },
          "zoom": {
            "type": "boolean"
          } 
    },
    "required": ["featureId", "overlayId","name","format","url","params","zoom"]
  }
};

cmapi.channel["map.feature.plot.url"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.plot.url",
    "type": "object",
    "properties": {
      "featureId": {
        "type": "string"
      },
      "url": {
        "type": "string"
      },
      "overlayId": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "format": {
        "type": "string",
        "default": "kml"
      },
      "params": {
        "type": "object"
      },
      "zoom": {
        "type": "boolean",
        "default": false
      }
    },
    "required": ["featureId", "url"]
  }
};
cmapi.channel["map.feature.selected.batch.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "features": {
        "type": "array",
        "properties": {
          "selectedId": {
		    "type": "string"
          },
          "selectedName": {
            "type": "string"
          },
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }		 
        },
        "required": ["selectedId", "selectedName", "featureId", "overlayId"]
      }
    },
    "required": ["features"]
  }
};
cmapi.channel["map.feature.selected.batch"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.selected.batch",
    "type": "object",
    "properties": {
      "features": {
        "type": "array"
      },
      "overlayId": {
        "type": "string"
      },
      "messageId": {
        "type": "string",
        "extension": "User Manipulation - Message Complete"
      }
    },
    "required": ["features"]
  }
};
cmapi.channel["map.feature.selected.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
		  "selectedId": {
		    "type": "string"
          },
          "selectedName": {
            "type": "string"
          },
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }		  
    },
    "required": ["selectedId","selectedName","featureId", "overlayId"]
  }
};
cmapi.channel["map.feature.selected"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.selected",
    "properties": {
      "selectedId": {
        "type": "string"
      },
      "selectedName": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "overlayId": {
        "type": "string"
      }
    },
    "required": ["featureId"]
  }
};
cmapi.channel["map.feature.show.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {		
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }	,
		  "zoom": {
			  "type":"boolean"
		  }
    },
    "required": ["featureId", "overlayId","zoom"]
  }
};
cmapi.channel["map.feature.show"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.show",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "zoom": {
        "type": "boolean",
        "default": false
      }
    },
    "required": ["featureId"]
  }
};
cmapi.channel["map.feature.unplot.batch.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "features": {
        "type": "array",
        "properties": {
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }
        },
        "required": ["featureId", "overlayId"]
      }
    },
    "required": ["features"]
  }
};
cmapi.channel["map.feature.unplot.batch"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.unplot.batch",
    "type": "object",
    "properties": {
      "features": {
        "type": "array"
      },
      "overlayId": {
        "type": "string",
        "default": ""
      }
    },
    "required": ["features"]
  }
};
cmapi.channel["map.feature.unplot.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {	
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }
    },
    "required": ["featureId", "overlayId"]
  }
};
cmapi.channel["map.feature.unplot"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.unplot",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      }
    },
    "required": ["featureId"]
  }
};
cmapi.channel["map.feature.update.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {		
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "newOverlayId": {
            "type": "string",
          }
    },
    "required": ["overlayId", "featureId", "name", "newOverlayId"]	
  }
};
cmapi.channel["map.feature.update"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.feature.update",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string",
      },
      "name": {
        "type": "string"
      },
      "newOverlayId": {
        "type": "string",
      }
    },
    "required": ["featureId"]
  }
};
cmapi.channel["map.get.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.message.complete",
    "type": "object",
    "properties": {
      "messageId": {
        "type": "string"
      },
      "details": {
        "type": "object"
      }
    },
    "required": ["messageId", "details"]
  }
};
cmapi.channel["map.get"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.get",
    "properties": {
      "recursive": {
        "type": "boolean",
        "default": false
      },
      "types": {
        "type": ["array", "string"],
        "enum": ["overlay", "feature"]
      },
      "filter": {
        "type": "array",
        "properties": {
          "property": {
            "type": "string"
          },
          "term": {
            "type": ["string", "number", "boolean"]
          }
        },
        "additionalItems": true
      },
      "messageId": {
        "type": "string"
      }
    },
    "required": ["types", "messageId"]
  }
};
cmapi.channel["map.menu.clicked"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.menu.clicked",
    "properties": {
      "menuId": {
        "type": "string"
      },
      "menuItemId": {
        "type": "string"
      },
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "lat": {
        "type": "number",
        "minimum": -90,
        "maximum": 90
      },
      "lon": {
        "type": "number",
        "minimum": -180,
        "maximum": 180
      },
      "x": {
        "type": "number",
        "minimum": 0
      },
      "y": {
        "type": "number",
        "minimum": 0
      },
      "elevation": {
        "type": "number"
      }
    },
    "required": ["menuId", "menuItemId"]
  }
};
cmapi.channel["map.menu.create"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.menu.create",
    "properties": {
      "name": {
        "type": "string",
        "default": "value passed in menuId param"
      },
      "menuId": {
        "type": "string"
      },
      "menuType": {
        "enum": ["mapglobal", "overlayglobal", "featureglobal", "objectinstance", "submenu"]
      },
      "menuItems": {
        "type": "array",
        "properties": {
          "menuItemId": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "iconUrl": {
            "type": "string"
          }
        },
        "required": ["menuItemId", "label"]
      },
      "messageId": {
        "type": "string"
      }
    },
    "required": ["menuId", "menuItems"]
  }
};
cmapi.channel["map.menu.remove"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.menu.remove",
    "properties": {
      "menuId": {
        "type": "string"
      },
      "messageId": {
        "type": "string"
      }
    },
    "required": ["menuId"]
  }
};
cmapi.channel["map.message.cancel"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.message.cancel",
    "type": "object",
    "properties": {
      "messageId": {
        "type": "string"
      }
    },
    "required": ["messageId"]
  }
};
cmapi.channel["map.message.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.message.complete",
    "type": "object",
    "properties": {
      "messageId": {
        "type": "string"
      },
      "originatingChannel": {
        "type": "string"
      },
      "status": {
        "type": "string",
        "enum": ["success", "failure", "mixed", "cancelled"]
      },
      "details": {
        "type": "object"
      },
      "failures": {
        "type": "array",
        "properties": {
          "failureObject": {
            "type": "object",
            "properties": {
              "payload": {
                "type": "object"
              },
              "message": {
                "type": "string"
              }
            }
          }
        }
      }
    },
    "required": ["failures", "messageId", "status", "details"]
  }
};
cmapi.channel["map.message.progress"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.message.progress",
    "type": "object",
    "properties": {
      "messageId": {
        "type": "string"
      },
      "originatingChannel": {
        "type": "string"
      },
      "details": {
        "type": "object"
      }
    },
    "required": ["messageId", "details"]
  }
};
cmapi.channel["map.overlay.cluster.activate"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.cluster.activate",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.overlay.cluster.deactivate"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.cluster.deactivate",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.overlay.cluster.remove"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.cluster.remove",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.overlay.cluster.set"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.cluster.set",
    "properties": {
      "threshold": {
        "type": "integer",
        "minimum": 2,
        "default": 2
      },
      "distance": {
        "type": "integer",
        "minimum": 1,
        "default": 50
      },
      "clusterStyle": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "summary": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "pointStyle": {
            "type": "object",
            "properties": {
              "color": {
                "type": "object",
                "properties": {
                  "r": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "g": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "b": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 255
                  },
                  "a": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 1
                  }
                },
                "required": ["r", "g", "b", "a"]
              },
              "radius": {
                "type": ["integer", "string"],
                "default": 6
              }
            },
            "required": []
          },
          "iconStyle": {
            "decription": "",
            "type": "object",
            "properties": {
              "url": {
                "type": "string"
              }
            },
            "required": ["url"]
          }
        }
      },
      "overlayId": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.overlay.create.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.overlay.create map.message.complete Details object",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "overlayId": {
        "type": "string"
      },
      "parentId": {
        "type": "string"
      },
      "properties": {
        "type": "object"
      },
      "menuId": {
        "type": "string"
      }
    },
    "required": ["overlayId"]
  }
};
cmapi.channel["map.overlay.create"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.create",
    "properties": {
      "name": {
        "type": "string"
      },
      "overlayId": {
        "type": "string"
      },
      "parentId": {
        "type": "string"
      },
      "properties": {
        "type": "object",
        "status": "new"
      }
    },
    "required": []
  }
};
cmapi.channel["map.overlay.features.get"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.features.get",
    "properties": {
      "features": {
        "type": "array",
        "properties": {
          "overlayId": {
            "type": "string"
          },
          "featureId": {
            "type": "string"
          }
        },
        "additionalItems": true,
        "required": ["features, messagId"]
      },
      "messageId": {
        "type": "string"
      }
    },
    "required": ["features, messagId"]
  }
};
cmapi.channel["map.overlay.get"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.get",
    "properties": {
      "overlays": {
        "type": "array",
        "properties": {
          "overlayId": {
            "type": "string"
          }
        },
        "additionalItems": true,
        "required": ["overlays, messagId"]
      },
      "messageId": {
        "type": "string"
      }
    },
    "required": ["features, messagId"]
  }
};
cmapi.channel["map.overlay.hide.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": ["overlayId"]
  }
};
cmapi.channel["map.overlay.hide"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.hide",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.overlay.remove.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": ["overlayId"]
  }
};
cmapi.channel["map.overlay.remove"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.remove",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.overlay.show.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": ["overlayId"]
  }
};
cmapi.channel["map.overlay.show"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.show",
    "properties": {
      "overlayId": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.overlay.update.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "overlayId": {
        "type": "string"
      },
      "parentId": {
        "type": "string"
      }
    },
    "required": ["name", "overlayId", "parentId"]
  }
};
cmapi.channel["map.overlay.update"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.overlay.update",
    "properties": {
      "name": {
        "type": "string"
      },
      "overlayId": {
        "type": "string"
      },
      "parentId": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.status.about"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.status.about",
    "type": "object",
    "properties": {
      "version": {
        "type": "string"
      },
      "type": {
		"type":"string",
        "enum": ["2-D", "3-D", "other"]
      },
      "widgetName": {
        "type": "string"
      },
      "instanceName": {
        "type": "string"
      },
      "universalName": {
        "type": "string"
      },
      "extensions": {
        "type": "array",
        "default" : [],
        "uniqueItems": true,
        "items": {
          "anyOf": ["intents", "clustering", "userManipulation", "selected", null]
        }
      }
    },
    "required": ["version", "type", "widgetName", "extensions"]
  }
};
cmapi.channel["map.status.format"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.status.format",
    "type": "object",
    "properties": {
      "formats": {
        "type": "array",
        "uniqueItems": true,
        "default": ["kml"],
        "items": {
          "anyOf": ["kml", "geojson", "wms"]
        }
      }
    },
    "required": ["formats"]
  }
};
cmapi.channel["map.status.initialization"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.status.initialization",
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["init", "ready", "teardown", "mapswapinprogress"]
      }
    },
    "required": ["status"]
  }
};
cmapi.channel["map.status.request"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.status.request",
    "type": "object",
    "properties": {
      "types": {
        "type": "array",
        "items": {
          "enum": ["view", "format", "selected", "about", "initialization"]
        }
      }
    },
    "required": []
  }
};
cmapi.channel["map.status.selected"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.status.selected",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "selectedFeatures": {
        "type": "array",
        "items": {
          "description": "Individual selected feature object",
          "type": "object",
          "properties": {
            "featureId": {
              "type": "string",
              "description": "The ID of the feature that contains the selected object."
            },
            "selectedId": {
              "type": "string",
              "description": "The ID of the actual selected object (may be a sub-feature contained within the aggregate feature data with the given featureId)."
            },
            "selectedName": {
              "type": "string",
              "description": "The name of the selected object."
            }
          },
          "required": ["featureId"]
        }
      }
    },
    "required": ["overlayId", "selectedFeatures"]
  }
};
cmapi.channel["map.status.view"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.status.view",
    "type": "object",
    "properties": {
      "bounds": {
        "type": "object",
        "properties": {
          "southWest": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "minimum": -90,
                "maximum": 90
              },
              "lon": {
                "type": "number",
                "minimum": -180,
                "maximum": 180
              }
            },
            "required": ["lat", "lon"]
          },
          "northEast": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "minimum": -90,
                "maximum": 90
              },
              "lon": {
                "type": "number",
                "minimum": -180,
                "maximum": 180
              }
            },
            "required": ["lat", "lon"]
          }
        },
        "required": ["southWest", "northEast"]
      },
      "center": {
        "type": "object",
        "properties": {
          "lat": {
            "type": "number",
            "minimum": -90,
            "maximum": 90
          },
          "lon": {
            "type": "number",
            "minimum": -180,
            "maximum": 180
          }
        },
        "required": ["lat", "lon"]
      },
      "range": {
        "type": "number"
      },
      "requester": {
        "type": "string",
        "status": "updated"
      }
    },
    "required": ["bounds", "center", "range"]
  }
};
cmapi.channel["map.view.area.selected"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.area.selected",
    "type": "object",
    "properties": {
      "bounds": {
        "type": "object",
        "default": " ",
        "properties": {
          "southWest": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "minimum": -90,
                "maximum": 90
              },
              "lon": {
                "type": "number",
                "minimum": -180,
                "maximum": 180
              }
            },
            "required": ["lat", "lon"]
          },
          "northEast": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "minimum": -90,
                "maximum": 90
              },
              "lon": {
                "type": "number",
                "minimum": -180,
                "maximum": 180
              }
            },
            "required": ["lat", "lon"]
          }
        },
        "required": ["southWest", "northEast"]
      },
      "button": {
        "type": ["string", "enum"],
        "enum": ["left", "middle", "right"],
        "default": "left"
      },
      "keys": {
        "type": ["array", "enum"],
        "uniqueItems": true,
        "default": ["none"],
        "items": {
          "anyOf": ["shift", "alt", "ctrl", "none"]
        }
      }
    },
    "required": ["bounds", "keys", "button"]
  }
};
cmapi.channel["map.view.center.bounds"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.center.bounds.complete",
    "type": "object",
    "properties": {
      "bounds": {
        "type": "object",
        "default": " ",
        "properties": {
          "southWest": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "minimum": -90,
                "maximum": 90
              },
              "lon": {
                "type": "number",
                "minimum": -180,
                "maximum": 180
              }
            },
            "required": ["lat", "lon"]
          },
          "northEast": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "minimum": -90,
                "maximum": 90
              },
              "lon": {
                "type": "number",
                "minimum": -180,
                "maximum": 180
              }
            },
            "required": ["lat", "lon"]
          }
        },
        "required": ["southWest", "northEast"]
      },
      "zoom": {
        "type": ["string", "number"]
      }
    },
    "required": ["bounds", "zoom"]
  }
};
cmapi.channel["map.view.center.bounds"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.center.bounds",
    "type": "object",
    "properties": {
      "bounds": {
        "type": "object",
        "default": " ",
        "properties": {
          "southWest": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "minimum": -90,
                "maximum": 90
              },
              "lon": {
                "type": "number",
                "minimum": -180,
                "maximum": 180
              }
            },
            "required": ["lat", "lon"]
          },
          "northEast": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number",
                "minimum": -90,
                "maximum": 90
              },
              "lon": {
                "type": "number",
                "minimum": -180,
                "maximum": 180
              }
            },
            "required": ["lat", "lon"]
          }
        },
        "required": ["southWest", "northEast"]
      },
      "zoom": {
        "type": ["string", "number"]
      }
    },
    "required": ["bounds"]
  }
};
cmapi.channel["map.view.center.feature.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.center.feature.commplete",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "zoom": {
        "type": ["string", "number"]
      }
    },
    "required": ["overlayId", "featureId", "zoom"]
  }
};
cmapi.channel["map.view.center.feature"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.center.feature",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "featureId": {
        "type": "string"
      },
      "zoom": {
        "type": ["string", "number"]
      }
    },
    "required": ["featureId"]
  }
};
cmapi.channel["map.view.center.location.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.center.location.complete",
    "type": "object",
    "properties": {
      "location": {
        "type": "object",
        "properties": {
          "lat": {
            "type": "number",
            "minimum": -90,
            "maximum": 90
          },
          "lon": {
            "type": "number",
            "minimum": -180,
            "maximum": 180
          }
        },
        "required": ["lat", "lon"]
      },
      "zoom": {
        "type": ["string", "number"]
      }
    },
    "required": ["location", "zoom"]
  }
};
cmapi.channel["map.view.center.location"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.center.location",
    "type": "object",
    "properties": {
      "location": {
        "type": "object",
        "properties": {
          "lat": {
            "type": "number",
            "minimum": -90,
            "maximum": 90
          },
          "lon": {
            "type": "number",
            "minimum": -180,
            "maximum": 180
          }
        },
        "required": ["lat", "lon"]
      },
      "zoom": {
        "type": ["string", "number"]
      }
    },
    "required": ["location"]
  }
};
cmapi.channel["map.view.center.overlay.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.center.overlay.complete",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "zoom": {
        "type": "string"
      }
    },
    "required": ["overlayId", "zoom"]
  }
};
cmapi.channel["map.view.center.overlay"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.center.overlay",
    "type": "object",
    "properties": {
      "overlayId": {
        "type": "string"
      },
      "zoom": {
        "type": "string"
      }
    },
    "required": []
  }
};
cmapi.channel["map.view.clicked"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.clicked",
    "type": "object",
    "properties": {
      "lat": {
        "type": "number",
        "minimum": -90,
        "maximum": 90
      },
      "lon": {
        "type": "number",
        "minimum": -180,
        "maximum": 180
      },
      "button": {
        "type": "string",
        "enum": ["left", "middle", "right"],
        "default": "left"
      },
      "type": {
        "type": "string",
        "enum": ["single", "double"],
        "default": "single"
      },
      "keys": {
        "type": "array",
        "uniqueItems": true,
        "default": ["none"],
        "items": {
          "enum": ["shift", "alt", "ctrl", "none"]
        }
      }
    },
    "required": ["lat", "lon", "button", "keys", "type"]
  }
};
cmapi.channel["map.view.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "bounds": {
        "type": "object",
        "properties": {
          "northEast": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number"
              },
              "lon": {
                "type": "number"
              }
            },
            "required": ["lat", "lon"]
          },
          "southWest": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "number"
              },
              "lon": {
                "type": "number"
              }
            },
            "required": ["lat", "lon"]
          }
        },
        "required": ["northEast", "southWest"]
      },
      "range": {
        "type": "number"
      },
      "center": {
        "type": "object",
        "properties": {
          "lat": {
            "type": "number"
          },
          "lon": {
            "type": "number"
          }
        },
        "required": ["lat", "lon"]
      }
    },
    "required": ["bounds", "range", "center"]
  }
};
cmapi.channel["map.view.mousedown"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.mousedown",
    "type": "object",
    "properties": {
      "lat": {
        "type": "number",
        "minimum": "-90",
        "maximum": "90"
      },
      "lon": {
        "type": "number",
        "minimum": "-180",
        "maximum": "180"
      },
      "button": {
        "type": "string",
        "enum": ["left", "middle", "right"],
        "default": "left"
      },
      "type": {
        "type": "string",
        "enum": ["single", "double"],
        "default": "single"
      },
      "keys": {
        "type": "array",
        "uniqueItems": true,
        "default": ["none"],
        "items": {
          "enum": ["shift", "alt", "ctrl", "none"]
        }
      }
    },
    "required": ["lat", "lon", "button", "keys", "type"]
  }
};
cmapi.channel["map.view.mouseup"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.mouseup",
    "type": "object",
    "properties": {
      "lat": {
        "type": "number",
        "minimum": -90,
        "maximum": 90
      },
      "lon": {
        "type": "number",
        "minimum": -180,
        "maximum": 180
      },
      "button": {
        "type": "string",
        "enum": ["left", "middle", "right"],
        "default": "left"
      },
      "type": {
        "type": "string",
        "enum": ["single", "double"],
        "default": "single"
      },
      "keys": {
        "type": "array",
        "uniqueItems": true,
        "default": ["none"],
        "items": {
          "enum": ["shift", "alt", "ctrl", "none"]
        }
      }
    },
    "required": ["lat", "lon", "button", "keys", "type"]
  }
};
cmapi.channel["map.view.zoom.complete"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Schema for map.message.complete Details object",
    "type": "object",
    "properties": {
      "range": {
        "type": "number"
      }
    },
    "required": ["range"]
  }
};
cmapi.channel["map.view.zoom"] = {
  schema: {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "map.view.zoom",
    "type": "object",
    "properties": {
      "range": {
        "type": "number"
      }
    },
    "required": ["range"]
  }
};
