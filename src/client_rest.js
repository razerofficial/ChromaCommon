/**
 * Chroma SDK client.
 */
function ChromaSDK() { }

ChromaSDK.prototype = {
  uri: undefined,
  timerId: undefined,
  initialized: false,
  customInitData: undefined,
  onTimer: function () {
    let refThis = chromaSDK; // used on interval so this is out of scope
    if (refThis.uri == undefined) {
      return;
    }

    if (!refThis.initialized) {
      return;
    }

    let request = new XMLHttpRequest();

    request.open("PUT", refThis.uri + "/heartbeat", true);

    request.setRequestHeader("content-type", "application/json");

    request.onerror = function () {
      console.log('Heartbeat onerror', request.status);
    };

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status != 200) {
        console.log('Heartbeat error', request.status);
        /*
        setTimeout(function() {
          chromaSDK.uninit();
        }, 0);
        setTimeout(function() {
          chromaSDK.init();
        }, 100);
        */
      }
    }

    request.send(null);
  },
  /**
   * Attempts to connect to the Chroma SDK.
   * 
   * Call before using the Chroma SDK.
   */
  init: function () {
    let refThis = this;
    setTimeout(function () {

      if (refThis.timerId != undefined) {
        clearInterval(refThis.timerId);
        refThis.timerId = undefined;
      }

      let request = new XMLHttpRequest();

      // let url = "https://chromasdk.io:54236/razer/chromasdk"; // secure port
      let url = "http://localhost:54235/razer/chromasdk"; // insecure port
      request.open("POST", url, true);

      request.setRequestHeader("content-type", "application/json");

      let data = JSON.stringify({
        "title": "HTML5ChromaSDK",
        "description": "JS Library for playing Chroma animations",
        "author": {
          "name": "Razer, Inc.",
          "contact": "https://github.com/RazerOfficial/HTML5ChromaSDK"
        },
        "device_supported": [
          "keyboard",
          "mouse",
          "headset",
          "mousepad",
          "keypad",
          "chromalink"],
        "category": "application"
      });

      if (refThis.customInitData != undefined) {
        data = refThis.customInitData;
      }

      request.send(data);

      request.onreadystatechange = function () {
        if (request.readyState == 4 && request.responseText != undefined && request.responseText != "") {
          refThis.uri = JSON.parse(request.responseText)["uri"];
          refThis.timerId = setInterval(refThis.onTimer, 1000);
          refThis.initialized = true;
          console.log('Chroma is initialized!');
        }
      }
    }, 0);
  },
  /**
   * Shuts down the connection to the Chroma SDK.
   */
  uninit: function () {
    let refThis = this;
    setTimeout(function () {

      refThis.initialized = false;

      if (refThis.uri == undefined) {
        return;
      }

      console.log('Uninitializing Chroma...');
      let request = new XMLHttpRequest();

      request.open("DELETE", refThis.uri, true);

      request.setRequestHeader("content-type", "application/json");

      request.send(null);

      request.onreadystatechange = function () {
        if (request.readyState == 4) {
          //console.log(request.responseText);
          console.log('Chroma uninitialized!');
        }
      }
      refThis.uri = undefined;
    }, 0);
  },
  createKeyboardEffect: function (effect, data, keys) {
    let refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "effect": effect });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "effect": effect, "param": data });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "effect": effect, "param": color });
      } else if (effect == "CHROMA_CUSTOM_KEY") {
        let color = { "color": data, "key": keys };
        jsonObj = JSON.stringify({ effect: effect, param: color });
      }

      //console.log(jsonObj);

      let request = new XMLHttpRequest();

      request.open("PUT", refThis.uri + "/keyboard", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('createKeyboardEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  createKeyboardEffect2: function (effect, data, keys) {
    let refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      let jsonObj;

      switch (effect) {
        case "CHROMA_NONE":
          jsonObj = JSON.stringify({ "effect": effect });
          break;
        case "CHROMA_CUSTOM":
          jsonObj = JSON.stringify({ "effect": effect, "param": data });
          break;
        case "CHROMA_STATIC":
          var color = { "color": data };
          jsonObj = JSON.stringify({ "effect": effect, "param": color });
          break;
        case "CHROMA_CUSTOM_KEY":
          var color = { "color": data, "key": keys };
          jsonObj = JSON.stringify({ effect: effect, param: color });
          break;
        case "CHROMA_CUSTOM2":
          var color = { "color": data, "key": keys };
          jsonObj = JSON.stringify({ effect: effect, param: color });
          break;
      }

      //console.log(jsonObj);

      let request = new XMLHttpRequest();

      request.open("PUT", refThis.uri + "/keyboard", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('createKeyboardEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  preCreateKeyboardEffect: function (effect, data) {
    let refThis = this;
    if (refThis.uri == undefined) {
      return;
    }
    let jsonObj;

    if (effect == "CHROMA_NONE") {
      jsonObj = JSON.stringify({ "effect": effect });
    } else if (effect == "CHROMA_CUSTOM") {
      jsonObj = JSON.stringify({ "effect": effect, "param": data });
    } else if (effect == "CHROMA_STATIC") {
      let color = { "color": data };
      jsonObj = JSON.stringify({ "effect": effect, "param": color });
    } else if (effect == "CHROMA_CUSTOM_KEY") {
      jsonObj = JSON.stringify({ "effect": effect, "param": keys });
    }

    //console.log(jsonObj);

    let request = new XMLHttpRequest();

    request.open("POST", refThis.uri + "/keyboard", false);

    request.setRequestHeader("content-type", "application/json");

    request.send(jsonObj);

    //console.log(request.responseText);

    //console.log('preCreateKeyboardEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);

    return JSON.parse(request.responseText)['id'];
  },
  createMousematEffect: function (effect, data) {
    let refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "effect": effect });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "effect": effect, "param": data });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "effect": effect, "param": color });
      }

      //console.log(jsonObj);

      let request = new XMLHttpRequest();

      request.open("PUT", refThis.uri + "/mousepad", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('createMousematEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  preCreateMousematEffect: function (effect, data) {
    let refThis = this;
    if (refThis.uri == undefined) {
      return;
    }
    let jsonObj;

    if (effect == "CHROMA_NONE") {
      jsonObj = JSON.stringify({ "effect": effect });
    } else if (effect == "CHROMA_CUSTOM") {
      jsonObj = JSON.stringify({ "effect": effect, "param": data });
    } else if (effect == "CHROMA_STATIC") {
      let color = { "color": data };
      jsonObj = JSON.stringify({ "effect": effect, "param": color });
    }

    //console.log(jsonObj);

    let request = new XMLHttpRequest();

    request.open("POST", refThis.uri + "/mousepad", false);

    request.setRequestHeader("content-type", "application/json");

    request.send(jsonObj);

    //console.log('preCreateMousematEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);

    return JSON.parse(request.responseText)['id'];
  },
  createMouseEffect: function (effect, data) {
    let refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "effect": effect });
      } else if (effect == "CHROMA_CUSTOM2") {
        jsonObj = JSON.stringify({ "effect": effect, "param": data });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "effect": effect, "param": color });
      }

      //console.log(jsonObj);

      let request = new XMLHttpRequest();

      request.open("PUT", refThis.uri + "/mouse", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('createMouseEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  preCreateMouseEffect: function (effect, data) {
    let refThis = this;
    if (refThis.uri == undefined) {
      return;
    }
    let jsonObj;

    if (effect == "CHROMA_NONE") {
      jsonObj = JSON.stringify({ "effect": effect });
    } else if (effect == "CHROMA_CUSTOM2") {
      jsonObj = JSON.stringify({ "effect": effect, "param": data });
    } else if (effect == "CHROMA_STATIC") {
      let color = { "color": data };
      jsonObj = JSON.stringify({ "effect": effect, "param": color });
    }

    //console.log(jsonObj);

    let request = new XMLHttpRequest();

    request.open("POST", refThis.uri + "/mouse", false);

    request.setRequestHeader("content-type", "application/json");

    request.send(jsonObj);

    //console.log('preCreateMouseEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);

    return JSON.parse(request.responseText)['id'];
  },
  createHeadsetEffect: function (effect, data) {
    let refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "effect": effect });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "effect": effect, "param": data });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "effect": effect, "param": color });
      }

      //console.log(jsonObj);

      let request = new XMLHttpRequest();

      request.open("PUT", refThis.uri + "/headset", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('createHeadsetEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  preCreateHeadsetEffect: function (effect, data) {
    let refThis = this;
    if (refThis.uri == undefined) {
      return;
    }

    let jsonObj;

    if (effect == "CHROMA_NONE") {
      jsonObj = JSON.stringify({ "effect": effect });
    } else if (effect == "CHROMA_CUSTOM") {
      jsonObj = JSON.stringify({ "effect": effect, "param": data });
    } else if (effect == "CHROMA_STATIC") {
      let color = { "color": data };
      jsonObj = JSON.stringify({ "effect": effect, "param": color });
    }

    //console.log(jsonObj);

    let request = new XMLHttpRequest();

    request.open("POST", refThis.uri + "/headset", false);

    request.setRequestHeader("content-type", "application/json");

    request.send(jsonObj);

    //console.log('preCreateHeadsetEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);

    return JSON.parse(request.responseText)['id'];
  },
  createKeypadEffect: function (effect, data) {
    let refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "effect": effect });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "effect": effect, "param": data });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "effect": effect, "param": color });
      }

      //console.log(jsonObj);

      let request = new XMLHttpRequest();

      request.open("PUT", refThis.uri + "/keypad", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('createKeypadEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  preCreateKeypadEffect: function (effect, data) {
    let refThis = this;
    if (refThis.uri == undefined) {
      return;
    }
    let jsonObj;

    if (effect == "CHROMA_NONE") {
      jsonObj = JSON.stringify({ "effect": effect });
    } else if (effect == "CHROMA_CUSTOM") {
      jsonObj = JSON.stringify({ "effect": effect, "param": data });
    } else if (effect == "CHROMA_STATIC") {
      let color = { "color": data };
      jsonObj = JSON.stringify({ "effect": effect, "param": color });
    }

    //console.log(jsonObj);

    let request = new XMLHttpRequest();

    request.open("POST", refThis.uri + "/keypad", false);

    request.setRequestHeader("content-type", "application/json");

    request.send(jsonObj);

    //console.log('preCreateKeypadEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);

    return JSON.parse(request.responseText)['id'];
  },
  createChromaLinkEffect: function (effect, data) {
    let refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "effect": effect });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "effect": effect, "param": data });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "effect": effect, "param": color });
      }

      //console.log(jsonObj);

      var request = new XMLHttpRequest();

      request.open("PUT", refThis.uri + "/chromalink", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('createChromaLinkEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  preCreateChromaLinkEffect: function (effect, data) {
    var refThis = this;
    if (refThis.uri == undefined) {
      return;
    }
    var jsonObj;

    if (effect == "CHROMA_NONE") {
      jsonObj = JSON.stringify({ "effect": effect });
    } else if (effect == "CHROMA_CUSTOM") {
      jsonObj = JSON.stringify({ "effect": effect, "param": data });
    } else if (effect == "CHROMA_STATIC") {
      var color = { "color": data };
      jsonObj = JSON.stringify({ "effect": effect, "param": color });
    }

    //console.log(jsonObj);

    var request = new XMLHttpRequest();

    request.open("POST", refThis.uri + "/chromalink", false);

    request.setRequestHeader("content-type", "application/json");

    request.send(jsonObj);

    //console.log('preCreateChromaLinkEffect(' + effect + ', ' + data + ') returns ' + JSON.parse(request.responseText)['result']);

    return JSON.parse(request.responseText)['id'];
  },
  setEffect: function (id) {
    var refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      var jsonObj = JSON.stringify({ "id": id });

      //console.log(jsonObj);

      var request = new XMLHttpRequest();

      request.open("PUT", refThis.uri + "/effect", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('setEffect(' + id + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  deleteEffect: function (id) {
    var refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      var jsonObj = JSON.stringify({ "id": id });

      //console.log(jsonObj);

      var request = new XMLHttpRequest();

      request.open("DELETE", refThis.uri + "/effect", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('deleteEffect(' + id + ') returns ' + JSON.parse(request.responseText)['result']);
    }, 0);
  },
  deleteEffectGroup: function (ids) {
    var refThis = this;
    setTimeout(function () {

      if (refThis.uri == undefined) {
        return;
      }

      var jsonObj = ids;

      //console.log(jsonObj);

      var request = new XMLHttpRequest();

      request.open("DELETE", refThis.uri + "/effect", true);

      request.setRequestHeader("content-type", "application/json");

      request.send(jsonObj);

      //console.log('deleteEffectGroup() returns ' + JSON.parse(request.responseText));
    }, 0);
  }
}
var chromaSDK = new ChromaSDK();

