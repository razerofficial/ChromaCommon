// JavaScript source code

/**
 * A Color is a three-byte RGB value.
 * 
 * The red, green, and blue channels are in order from low byte to high byte.
 * 
 * i.e. in the color 0x012345, R=0x45, G=0x23, B=0x01.
 * @typedef { number } Color
 */

/**
 * Chroma SDK client.
 */
function ChromaSDK() {
  let uri = undefined;
  let timerId = undefined;
  let initialized = false;
  let customInitData = undefined;
}

ChromaSDK.prototype = {
  uri: undefined,
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

/**
 * Object containing keyboard key constants.
 */
const RZKEY = {
  RZKEY_ESC: 0x0001,                 /*!< Esc (VK_ESCAPE) */
  RZKEY_F1: 0x0003,                  /*!< F1 (VK_F1) */
  RZKEY_F2: 0x0004,                  /*!< F2 (VK_F2) */
  RZKEY_F3: 0x0005,                  /*!< F3 (VK_F3) */
  RZKEY_F4: 0x0006,                  /*!< F4 (VK_F4) */
  RZKEY_F5: 0x0007,                  /*!< F5 (VK_F5) */
  RZKEY_F6: 0x0008,                  /*!< F6 (VK_F6) */
  RZKEY_F7: 0x0009,                  /*!< F7 (VK_F7) */
  RZKEY_F8: 0x000A,                  /*!< F8 (VK_F8) */
  RZKEY_F9: 0x000B,                  /*!< F9 (VK_F9) */
  RZKEY_F10: 0x000C,                 /*!< F10 (VK_F10) */
  RZKEY_F11: 0x000D,                 /*!< F11 (VK_F11) */
  RZKEY_F12: 0x000E,                 /*!< F12 (VK_F12) */
  RZKEY_1: 0x0102,                   /*!< 1 (VK_1) */
  RZKEY_2: 0x0103,                   /*!< 2 (VK_2) */
  RZKEY_3: 0x0104,                   /*!< 3 (VK_3) */
  RZKEY_4: 0x0105,                   /*!< 4 (VK_4) */
  RZKEY_5: 0x0106,                   /*!< 5 (VK_5) */
  RZKEY_6: 0x0107,                   /*!< 6 (VK_6) */
  RZKEY_7: 0x0108,                   /*!< 7 (VK_7) */
  RZKEY_8: 0x0109,                   /*!< 8 (VK_8) */
  RZKEY_9: 0x010A,                   /*!< 9 (VK_9) */
  RZKEY_0: 0x010B,                   /*!< 0 (VK_0) */
  RZKEY_A: 0x0302,                   /*!< A (VK_A) */
  RZKEY_B: 0x0407,                   /*!< B (VK_B) */
  RZKEY_C: 0x0405,                   /*!< C (VK_C) */
  RZKEY_D: 0x0304,                   /*!< D (VK_D) */
  RZKEY_E: 0x0204,                   /*!< E (VK_E) */
  RZKEY_F: 0x0305,                   /*!< F (VK_F) */
  RZKEY_G: 0x0306,                   /*!< G (VK_G) */
  RZKEY_H: 0x0307,                   /*!< H (VK_H) */
  RZKEY_I: 0x0209,                   /*!< I (VK_I) */
  RZKEY_J: 0x0308,                   /*!< J (VK_J) */
  RZKEY_K: 0x0309,                   /*!< K (VK_K) */
  RZKEY_L: 0x030A,                   /*!< L (VK_L) */
  RZKEY_M: 0x0409,                   /*!< M (VK_M) */
  RZKEY_N: 0x0408,                   /*!< N (VK_N) */
  RZKEY_O: 0x020A,                   /*!< O (VK_O) */
  RZKEY_P: 0x020B,                   /*!< P (VK_P) */
  RZKEY_Q: 0x0202,                   /*!< Q (VK_Q) */
  RZKEY_R: 0x0205,                   /*!< R (VK_R) */
  RZKEY_S: 0x0303,                   /*!< S (VK_S) */
  RZKEY_T: 0x0206,                   /*!< T (VK_T) */
  RZKEY_U: 0x0208,                   /*!< U (VK_U) */
  RZKEY_V: 0x0406,                   /*!< V (VK_V) */
  RZKEY_W: 0x0203,                   /*!< W (VK_W) */
  RZKEY_X: 0x0404,                   /*!< X (VK_X) */
  RZKEY_Y: 0x0207,                   /*!< Y (VK_Y) */
  RZKEY_Z: 0x0403,                   /*!< Z (VK_Z) */
  RZKEY_NUMLOCK: 0x0112,             /*!< Numlock (VK_NUMLOCK) */
  RZKEY_NUMPAD0: 0x0513,             /*!< Numpad 0 (VK_NUMPAD0) */
  RZKEY_NUMPAD1: 0x0412,             /*!< Numpad 1 (VK_NUMPAD1) */
  RZKEY_NUMPAD2: 0x0413,             /*!< Numpad 2 (VK_NUMPAD2) */
  RZKEY_NUMPAD3: 0x0414,             /*!< Numpad 3 (VK_NUMPAD3) */
  RZKEY_NUMPAD4: 0x0312,             /*!< Numpad 4 (VK_NUMPAD4) */
  RZKEY_NUMPAD5: 0x0313,             /*!< Numpad 5 (VK_NUMPAD5) */
  RZKEY_NUMPAD6: 0x0314,             /*!< Numpad 6 (VK_NUMPAD6) */
  RZKEY_NUMPAD7: 0x0212,             /*!< Numpad 7 (VK_NUMPAD7) */
  RZKEY_NUMPAD8: 0x0213,             /*!< Numpad 8 (VK_NUMPAD8) */
  RZKEY_NUMPAD9: 0x0214,             /*!< Numpad 9 (VK_ NUMPAD9*/
  RZKEY_NUMPAD_DIVIDE: 0x0113,       /*!< Divide (VK_DIVIDE) */
  RZKEY_NUMPAD_MULTIPLY: 0x0114,     /*!< Multiply (VK_MULTIPLY) */
  RZKEY_NUMPAD_SUBTRACT: 0x0115,     /*!< Subtract (VK_SUBTRACT) */
  RZKEY_NUMPAD_ADD: 0x0215,          /*!< Add (VK_ADD) */
  RZKEY_NUMPAD_ENTER: 0x0415,        /*!< Enter (VK_RETURN - Extended) */
  RZKEY_NUMPAD_DECIMAL: 0x0514,      /*!< Decimal (VK_DECIMAL) */
  RZKEY_PRINTSCREEN: 0x000F,         /*!< Print Screen (VK_PRINT) */
  RZKEY_SCROLL: 0x0010,              /*!< Scroll Lock (VK_SCROLL) */
  RZKEY_PAUSE: 0x0011,               /*!< Pause (VK_PAUSE) */
  RZKEY_INSERT: 0x010F,              /*!< Insert (VK_INSERT) */
  RZKEY_HOME: 0x0110,                /*!< Home (VK_HOME) */
  RZKEY_PAGEUP: 0x0111,              /*!< Page Up (VK_PRIOR) */
  RZKEY_DELETE: 0x020f,              /*!< Delete (VK_DELETE) */
  RZKEY_END: 0x0210,                 /*!< End (VK_END) */
  RZKEY_PAGEDOWN: 0x0211,            /*!< Page Down (VK_NEXT) */
  RZKEY_UP: 0x0410,                  /*!< Up (VK_UP) */
  RZKEY_LEFT: 0x050F,                /*!< Left (VK_LEFT) */
  RZKEY_DOWN: 0x0510,                /*!< Down (VK_DOWN) */
  RZKEY_RIGHT: 0x0511,               /*!< Right (VK_RIGHT) */
  RZKEY_TAB: 0x0201,                 /*!< Tab (VK_TAB) */
  RZKEY_CAPSLOCK: 0x0301,            /*!< Caps Lock(VK_CAPITAL) */
  RZKEY_BACKSPACE: 0x010E,           /*!< Backspace (VK_BACK) */
  RZKEY_ENTER: 0x030E,               /*!< Enter (VK_RETURN) */
  RZKEY_LCTRL: 0x0501,               /*!< Left Control(VK_LCONTROL) */
  RZKEY_LWIN: 0x0502,                /*!< Left Window (VK_LWIN) */
  RZKEY_LALT: 0x0503,                /*!< Left Alt (VK_LMENU) */
  RZKEY_SPACE: 0x0507,               /*!< Spacebar (VK_SPACE) */
  RZKEY_RALT: 0x050B,                /*!< Right Alt (VK_RMENU) */
  RZKEY_FN: 0x050C,                  /*!< Function key. */
  RZKEY_RMENU: 0x050D,               /*!< Right Menu (VK_APPS) */
  RZKEY_RCTRL: 0x050E,               /*!< Right Control (VK_RCONTROL) */
  RZKEY_LSHIFT: 0x0401,              /*!< Left Shift (VK_LSHIFT) */
  RZKEY_RSHIFT: 0x040E,              /*!< Right Shift (VK_RSHIFT) */
  RZKEY_MACRO1: 0x0100,              /*!< Macro Key 1 */
  RZKEY_MACRO2: 0x0200,              /*!< Macro Key 2 */
  RZKEY_MACRO3: 0x0300,              /*!< Macro Key 3 */
  RZKEY_MACRO4: 0x0400,              /*!< Macro Key 4 */
  RZKEY_MACRO5: 0x0500,              /*!< Macro Key 5 */
  RZKEY_OEM_1: 0x0101,               /*!< ~ (tilde/半角/全角) (VK_OEM_3) */
  RZKEY_OEM_2: 0x010C,               /*!< -- (minus) (VK_OEM_MINUS) */
  RZKEY_OEM_3: 0x010D,               /*!< = (equal) (VK_OEM_PLUS) */
  RZKEY_OEM_4: 0x020C,               /*!< [ (left sqaure bracket) (VK_OEM_4) */
  RZKEY_OEM_5: 0x020D,               /*!< ] (right square bracket) (VK_OEM_6) */
  RZKEY_OEM_6: 0x020E,               /*!< \ (backslash) (VK_OEM_5) */
  RZKEY_OEM_7: 0x030B,               /*!< ; (semi-colon) (VK_OEM_1) */
  RZKEY_OEM_8: 0x030C,               /*!< ' (apostrophe) (VK_OEM_7) */
  RZKEY_OEM_9: 0x040A,               /*!< , (comma) (VK_OEM_COMMA) */
  RZKEY_OEM_10: 0x040B,              /*!< . (period) (VK_OEM_PERIOD) */
  RZKEY_OEM_11: 0x040C,              /*!< / (forward slash) (VK_OEM_2) */
  RZKEY_EUR_1: 0x030D,               /*!< "#" (VK_OEM_5) */
  RZKEY_EUR_2: 0x0402,               /*!< \ (VK_OEM_102) */
  RZKEY_JPN_1: 0x0015,               /*!< ¥ (0xFF) */
  RZKEY_JPN_2: 0x040D,               /*!< \ (0xC1) */
  RZKEY_JPN_3: 0x0504,               /*!< 無変換 (VK_OEM_PA1) */
  RZKEY_JPN_4: 0x0509,               /*!< 変換 (0xFF) */
  RZKEY_JPN_5: 0x050A,               /*!< ひらがな/カタカナ (0xFF) */
  RZKEY_KOR_1: 0x0015,               /*!< | (0xFF) */
  RZKEY_KOR_2: 0x030D,               /*!< (VK_OEM_5) */
  RZKEY_KOR_3: 0x0402,               /*!< (VK_OEM_102) */
  RZKEY_KOR_4: 0x040D,               /*!< (0xC1) */
  RZKEY_KOR_5: 0x0504,               /*!< (VK_OEM_PA1) */
  RZKEY_KOR_6: 0x0509,               /*!< 한/영 (0xFF) */
  RZKEY_KOR_7: 0x050A,               /*!< (0xFF) */
  RZKEY_INVALID: 0xFFFF              /*!< Invalid keys. */
};

/**
 * Object containing keyboard LED constants.
 */
const RZLED = {
  RZLED_LOGO: 0x0014                 /*!< Razer logo */
};

/**
 * Object containing mouse LED constants.
 */
const Mouse = {
  RZLED2: {
    RZLED2_SCROLLWHEEL: 0x0203,  //!< Scroll Wheel LED.
    RZLED2_LOGO: 0x0703,  //!< Logo LED.
    RZLED2_BACKLIGHT: 0x0403,  //!< Backlight LED.
    RZLED2_LEFT_SIDE1: 0x0100,  //!< Left LED 1.
    RZLED2_LEFT_SIDE2: 0x0200,  //!< Left LED 2.
    RZLED2_LEFT_SIDE3: 0x0300,  //!< Left LED 3.
    RZLED2_LEFT_SIDE4: 0x0400,  //!< Left LED 4.
    RZLED2_LEFT_SIDE5: 0x0500,  //!< Left LED 5.
    RZLED2_LEFT_SIDE6: 0x0600,  //!< Left LED 6.
    RZLED2_LEFT_SIDE7: 0x0700,  //!< Left LED 7.
    RZLED2_BOTTOM1: 0x0801,  //!< Bottom LED 1.
    RZLED2_BOTTOM2: 0x0802,  //!< Bottom LED 2.
    RZLED2_BOTTOM3: 0x0803,  //!< Bottom LED 3.
    RZLED2_BOTTOM4: 0x0804,  //!< Bottom LED 4.
    RZLED2_BOTTOM5: 0x0805,  //!< Bottom LED 5.
    RZLED2_RIGHT_SIDE1: 0x0106,  //!< Right LED 1.
    RZLED2_RIGHT_SIDE2: 0x0206,  //!< Right LED 2.
    RZLED2_RIGHT_SIDE3: 0x0306,  //!< Right LED 3.
    RZLED2_RIGHT_SIDE4: 0x0406,  //!< Right LED 4.
    RZLED2_RIGHT_SIDE5: 0x0506,  //!< Right LED 5.
    RZLED2_RIGHT_SIDE6: 0x0606,  //!< Right LED 6.
    RZLED2_RIGHT_SIDE7: 0x0706   //!< Right LED 7.
  }
};

/**
 * Retrieves the high byte of a 2-byte RZKEY value.
 * @param { number } key The 2-byte RZKEY value.
 * @returns The high byte.
 */
function getHighByte(key) {
  return (key & 0xFF00) >> 8;
}

/**
 * Retrieves the low byte of a 2-byte RZKEY value.
 * @param { number } key The 2-byte RZKEY value.
 * @returns The low byte.
 */
function getLowByte(key) {
  return (key & 0xFF);
}

/**
 * Enum for the type of Chroma device.
 */
const EChromaSDKDeviceTypeEnum = {
  /**
   * One dimensional device.
   */
  DE_1D: 0,
  /**
   * Two dimensional device.
   */
  DE_2D: 1
};

/**
 * Enum for the type of 1D Chroma device.
 */
const EChromaSDKDevice1DEnum = {
  DE_ChromaLink: 0,
  DE_Headset: 1,
  DE_Mousepad: 2,
  DE_MAX: 3
};

/**
 * Enum for the type of 2D Chroma device.
 */
const EChromaSDKDevice2DEnum = {
  DE_Keyboard: 0,
  DE_Keypad: 1,
  DE_Mouse: 2,
  DE_KeyboardExtended: 3,
  DE_MAX: 4
};

/**
 * Enum for the type of Chroma device.
 */
const EChromaSDKDeviceEnum = {
  DE_ChromaLink: 0,
  DE_Headset: 1,
  DE_Keyboard: 2,
  DE_Keypad: 3,
  DE_Mouse: 4,
  DE_Mousepad: 5,
  DE_KeyboardExtended: 6,
  DE_MAX: 7
};

/**
 * Frame for 1D Chroma animation.
 */
function ChromaAnimationFrame1D() {
  /** @type { number } */
  this.Duration = 0.033;
  /** @type { Color[] } */
  this.Colors = undefined;
}

/**
 * Frame for 2D Chroma animation.
 */
function ChromaAnimationFrame2D(device) {
  /** @type { number } */
  this.Duration = 0.033;
  /** @type { Color[][] } */
  this.Colors = [];
  switch (device) {
    case EChromaSDKDevice2DEnum.DE_Keyboard:
    case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
      let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
      let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
      let keys = new Array(maxRow);
      for (let i = 0; i < maxRow; ++i) {
        let row = new Array(maxColumn);
        keys[i] = row;
        for (let j = 0; j < maxColumn; ++j) {
          row[j] = 0;
        }
      }
      /** @type { number[][] } */
      this.Keys = keys; // For Keyboard and KeyboardExtended
      break;
  }
}

/**
 * Global object for manipulating Chroma animations.
 */
let ChromaAnimation = {
  /**
   * All animations.
   * 
   * Key is the name of the animation.
   * @type { Object.<string, ChromaAnimation1D | ChromaAnimation2D> }
   */
  LoadedAnimations: {},
  /**
   * The current 1D animation for each 1D device.
   * 
   * Key is of type EChromaSDKDevice1DEnum.
   * @type { Object.<number, ChromaAnimation1D> }
   */
  LoadedAnimations1D: {},
  /**
   * The current 2D animation for each 2D device.
   * 
   * Key is of type EChromaSDKDevice2DEnum.
   * @type { Object.<number, ChromaAnimation2D> }
   */
  LoadedAnimations2D: {},
  /**
   * The array of 1D animations for each 1D device.
   * 
   * Key is of type EChromaSDKDevice1DEnum.
   * @type { Object.<number, Array.<ChromaAnimation1D>> }
   */
  PlayingAnimations1D: {},
  /**
   * The array of 2D animations for each 2D device.
   * 
   * Key is of type EChromaSDKDevice2DEnum.
   * @type { Object.<number, Array.<ChromaAnimation2D>> }
   */
  PlayingAnimations2D: {},
  /**
   * Whether to play the 1D idle animations for each 1D device.
   * 
   * Key is of type EChromaSDKDevice1DEnum.
   * @type { Object.<number, boolean> }
   */
  UseIdleAnimation1D: {},
  /**
   * Whether to play the 2D idle animations for each 2D device.
   * 
   * Key is of type EChromaSDKDevice2DEnum.
   * @type { Object.<number, boolean> }
   */
  UseIdleAnimation2D: {},
  /**
   * The name of 1D animations to use when idle for each 1D device.
   * 
   * Key is of type EChromaSDKDevice1DEnum.
   * @type { Object.<number, string> }
   */
  IdleAnimation1D: {},
  /**
   * The name of 2D animations to use when idle for each 2D device.
   * 
   * Key is of type EChromaSDKDevice2DEnum.
   * @type { Object.<number, string> }
   */
  IdleAnimation2D: {},
  /**
   * The ID of the interval handler.
   * @type { number | undefined }
   */
  IntervalUpdateFrame: undefined,

  /**
   * Processes the main update loop.
   * 
   * Reinitialises all idle and playing animations when first run, 
   */
  updateFrame: function () {
    if (ChromaAnimation.IntervalUpdateFrame == undefined) {

      ChromaAnimation.useIdleAnimations(false);

      ChromaAnimation.IdleAnimation1D[EChromaSDKDevice1DEnum.DE_ChromaLink] = {};
      ChromaAnimation.IdleAnimation1D[EChromaSDKDevice1DEnum.DE_Headset] = {};
      ChromaAnimation.IdleAnimation1D[EChromaSDKDevice1DEnum.DE_Mousepad] = {};
      ChromaAnimation.IdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keyboard] = {};
      ChromaAnimation.IdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keypad] = {};
      ChromaAnimation.IdleAnimation2D[EChromaSDKDevice2DEnum.DE_Mouse] = {};

      ChromaAnimation.PlayingAnimations1D[EChromaSDKDevice1DEnum.DE_ChromaLink] = {};
      ChromaAnimation.PlayingAnimations1D[EChromaSDKDevice1DEnum.DE_Headset] = {};
      ChromaAnimation.PlayingAnimations1D[EChromaSDKDevice1DEnum.DE_Mousepad] = {};
      ChromaAnimation.PlayingAnimations2D[EChromaSDKDevice2DEnum.DE_Keyboard] = {};
      ChromaAnimation.PlayingAnimations2D[EChromaSDKDevice2DEnum.DE_Keypad] = {};
      ChromaAnimation.PlayingAnimations2D[EChromaSDKDevice2DEnum.DE_Mouse] = {};
      ChromaAnimation.IntervalUpdateFrame = setInterval(this.updateFrame, 33);
    }

    // 1D Devices
    for (let device = 0; device < EChromaSDKDevice1DEnum.DE_MAX; ++device) {
      let idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimation1D[device]);
      let useIdleAnimation = true;

      for (let animationName in ChromaAnimation.PlayingAnimations1D[device]) {
        let animation = ChromaAnimation.PlayingAnimations1D[device][animationName];
        if (animation != undefined) {
          animation.playFrame();
          if (idleAnimation != animation) {
            useIdleAnimation = false;

            if (idleAnimation != undefined) {
              idleAnimation.FrameTime = animation.FrameTime;
            }
          }
        }
      }

      // play idle animation if no other animations are playing
      if (ChromaAnimation.UseIdleAnimation1D[device] &&
        idleAnimation != undefined) {
        if (useIdleAnimation) {
          idleAnimation.playFrame();
        }
      }
    }

    // 2D Devices
    for (let device = 0; device < EChromaSDKDevice2DEnum.DE_MAX; ++device) {
      let idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimation2D[device]);
      let useIdleAnimation = true;

      for (let animationName in ChromaAnimation.PlayingAnimations2D[device]) {
        let animation = ChromaAnimation.PlayingAnimations2D[device][animationName];
        if (animation != undefined) {
          animation.playFrame();
          if (idleAnimation != animation) {
            useIdleAnimation = false;

            if (idleAnimation != undefined) {
              idleAnimation.FrameTime = animation.FrameTime;
            }
          }
        }
      }

      // play idle animation if no other animations are playing
      if (ChromaAnimation.UseIdleAnimation2D[device] &&
        idleAnimation != undefined) {
        if (useIdleAnimation) {
          idleAnimation.playFrame();
        }
      }
    }

  },
  /**
   * Retrieves the number of LEDs in a 1D device.
   * @param { number } device The EChromaSDKDevice1DEnum.
   * @returns The number of LEDs.
   */
  getMaxLeds: function (device) {
    switch (device) {
      case EChromaSDKDevice1DEnum.DE_ChromaLink:
        return 5;
      case EChromaSDKDevice1DEnum.DE_Headset:
        return 5;
      case EChromaSDKDevice1DEnum.DE_Mousepad:
        return 15;
    }
    console.log('getMaxLeds: Invalid device!');
    return undefined;
  },
  /**
   * Retrieves the number of rows in a 2D device.
   * @param { number } device The EChromaSDKDevice2DEnum.
   * @returns The number of rows.
   */
  getMaxRow: function (device) {
    switch (device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
        return 6;
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        return 8;
      case EChromaSDKDevice2DEnum.DE_Keypad:
        return 4;
      case EChromaSDKDevice2DEnum.DE_Mouse:
        return 9;
    }
    console.log('getMaxRow: Invalid device!');
    return undefined;
  },
  /**
   * Retrieves the number of columns in a 2D device.
   * @param { number } device The EChromaSDKDevice2DEnum.
   * @returns The number of columns.
   */
  getMaxColumn: function (device) {
    switch (device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
        return 22;
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        return 24;
      case EChromaSDKDevice2DEnum.DE_Keypad:
        return 5;
      case EChromaSDKDevice2DEnum.DE_Mouse:
        return 7;
    }
    console.log('getMaxColumn: Invalid device!');
    return undefined;
  },
  /**
   * Opens an animation from memory.
   * @param { any[] } buffer The data buffer.
   * @param { string } animationName The name of the animation, without the _{DEVICE} suffix.
   * @param { (anim: ChromaAnimation1D | ChromaAnimation2D | undefined) => void } callback The callback.
   */
  openAnimationFromMemory: function (buffer, animationName, callback) {
    let arrayBuffer = (new Uint8Array(buffer)).buffer;

    let readIndex = 0;
    let readSize = 4;
    let version = new Uint32Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
    readIndex += readSize;
    //console.log('version:', version);

    if (version != 1) {
      console.log('openAnimationFromMemory: Unsupported version!', animationName);
      return undefined;
    }

    readSize = 1;
    let deviceType = new Uint8Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
    readIndex += readSize;
    //console.log('deviceType:', deviceType);

    if (deviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let animation = new ChromaAnimation1D();
      animation.openAnimation(arrayBuffer, readIndex);
      animation.Name = animationName;
      this.LoadedAnimations[animationName] = animation;
      callback(animation);
    } else if (deviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let animation = new ChromaAnimation2D();
      animation.openAnimation(arrayBuffer, readIndex);
      animation.Name = animationName;
      this.LoadedAnimations[animationName] = animation;
      if (callback != undefined) {
        callback(animation);
      }
    } else {
      if (callback != undefined) {
        callback(undefined);
      }
    }

  },
  /**
   * Opens an animation from file.
   * @param { string } animationName The name of the animation, without the _{DEVICE} suffix.
   * @param { (anim: ChromaAnimation1D | ChromaAnimation2D | undefined) => void } callback The callback.
   * @param { boolean } useCache Whether to use the cached object. 
   */
  openAnimation: function (animationName, callback, useCache) {
    let refThis = this;
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status != 200) {
          console.error('Animation is missing!', animationName);
          let animation = undefined;
          if (animationName.indexOf("_KeyboardExtended") > 0) {
            animation = refThis.createAnimation(animationName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_KeyboardExtended);
          } else if (animationName.indexOf("_Keyboard") > 0) {
            animation = refThis.createAnimation(animationName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Keyboard);
          } else if (animationName.indexOf("_Keypad") > 0) {
            animation = refThis.createAnimation(animationName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Keypad);
          } else if (animationName.indexOf("_Mouse") > 0) {
            animation = refThis.createAnimation(animationName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Mouse);
          } else if (animationName.indexOf("_ChromaLink") > 0) {
            animation = refThis.createAnimation(animationName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_ChromaLink);
          } else if (animationName.indexOf("_Headset") > 0) {
            animation = refThis.createAnimation(animationName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_Headset);
          } else if (animationName.indexOf("_Mousepad") > 0) {
            animation = refThis.createAnimation(animationName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_Mousepad);
          }
          callback(animation);
          return;
        }
        //console.log('Animation Name:', animationName);

        let arrayBuffer = xhr.response;
        //console.log('Array Buffer:');
        //console.log(arrayBuffer);

        let readIndex = 0;
        let readSize = 4;
        let version = new Uint32Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
        readIndex += readSize;
        //console.log('version:', version);

        if (version != 1) {
          console.log('openAnimation: Unsupported version!', animationName);
          return undefined;
        }

        readSize = 1;
        let deviceType = new Uint8Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
        readIndex += readSize;
        //console.log('deviceType:', deviceType);

        if (deviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
          let animation = new ChromaAnimation1D();
          animation.openAnimation(arrayBuffer, readIndex);
          animation.Name = animationName;
          refThis.LoadedAnimations[animationName] = animation;
          callback(animation);
        } else if (deviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
          let animation = new ChromaAnimation2D();
          animation.openAnimation(arrayBuffer, readIndex);
          animation.Name = animationName;
          refThis.LoadedAnimations[animationName] = animation;
          if (callback != undefined) {
            callback(animation);
          }
        } else {
          if (callback != undefined) {
            callback(undefined);
          }
        }
      }
    }

    if (useCache == undefined || useCache == true) {
      xhr.open('GET', animationName, true);
    } else {
      xhr.open('GET', animationName + '?cache=' + Date.now(), true);
    }
    xhr.responseType = "arraybuffer";
    xhr.send('');
  },
  /**
   * Converts a EChromaSDKDeviceEnum to EChromaSDKDeviceTypeEnum.
   * @param { number } device The EChromaSDKDeviceEnum.
   * @returns The EChromaSDKDeviceTypeEnum, or undefined if not a valid input.
   */
  getDeviceType(device) {
    switch (device) {
      case EChromaSDKDeviceEnum.DE_ChromaLink:
      case EChromaSDKDeviceEnum.DE_Headset:
      case EChromaSDKDeviceEnum.DE_Mousepad:
        return EChromaSDKDeviceTypeEnum.DE_1D;
      case EChromaSDKDeviceEnum.DE_Keyboard:
      case EChromaSDKDeviceEnum.DE_Keypad:
      case EChromaSDKDeviceEnum.DE_Mouse:
        return EChromaSDKDeviceTypeEnum.DE_2D;
    }
    return undefined;
  },
  /**
   * Converts a EChromaSDKDeviceEnum to EChromaSDKDevice1DEnum.
   * @param { number } device The EChromaSDKDeviceEnum.
   * @returns The EChromaSDKDevice1DEnum, or undefined if not a 1D device.
   */
  getDevice1D(device) {
    switch (device) {
      case EChromaSDKDeviceEnum.DE_ChromaLink:
        return EChromaSDKDevice1DEnum.DE_ChromaLink;
      case EChromaSDKDeviceEnum.DE_Headset:
        return EChromaSDKDevice1DEnum.DE_Headset;
      case EChromaSDKDeviceEnum.DE_Mousepad:
        return EChromaSDKDevice1DEnum.DE_Mousepad;

    }
    return undefined;
  },
  /**
   * Converts a EChromaSDKDeviceEnum to EChromaSDKDevice2DEnum.
   * @param { number } device The EChromaSDKDeviceEnum.
   * @returns The EChromaSDKDevice2DEnum, or undefined if not a 2D device.
   */
  getDevice2D(device) {
    switch (device) {
      case EChromaSDKDeviceEnum.DE_Keyboard:
        return EChromaSDKDevice2DEnum.DE_Keyboard;
      case EChromaSDKDeviceEnum.DE_KeyboardExtended:
        return EChromaSDKDevice2DEnum.DE_KeyboardExtended;
      case EChromaSDKDeviceEnum.DE_Keypad:
        return EChromaSDKDevice2DEnum.DE_Keypad;
      case EChromaSDKDeviceEnum.DE_Mouse:
        return EChromaSDKDevice2DEnum.DE_Mouse;
    }
    return undefined;
  },
  /**
   * Converts a EChromaSDKDeviceTypeEnum and EChromaSDKDevice1DEnum to EChromaSDKDeviceEnum.
   * @param { number } deviceType The EChromaSDKDeviceTypeEnum.
   * @param { number } device The EChromaSDKDevice1DEnum or EChromaSDKDevice2DEnum.
   * @returns The EChromaSDKDeviceEnum, or undefined if not a valid input.
   */
  getDeviceEnum(deviceType, device) {
    switch (deviceType) {
      case EChromaSDKDeviceTypeEnum.DE_1D:
        switch (device) {
          case EChromaSDKDevice1DEnum.DE_ChromaLink:
            return EChromaSDKDeviceEnum.DE_ChromaLink;
          case EChromaSDKDevice1DEnum.DE_Headset:
            return EChromaSDKDeviceEnum.DE_Headset;
          case EChromaSDKDevice1DEnum.DE_Mousepad:
            return EChromaSDKDeviceEnum.DE_Mousepad;
        }
        break;
      case EChromaSDKDeviceTypeEnum.DE_2D:
        switch (device) {
          case EChromaSDKDevice2DEnum.DE_Keyboard:
            return EChromaSDKDeviceEnum.DE_Keyboard;
          case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
            return EChromaSDKDeviceEnum.DE_KeyboardExtended;
          case EChromaSDKDevice2DEnum.DE_Keypad:
            return EChromaSDKDeviceEnum.DE_Keypad;
          case EChromaSDKDevice2DEnum.DE_Mouse:
            return EChromaSDKDeviceEnum.DE_Mouse;
        }
        break;
    }
    return undefined;
  },
  /**
   * Retrieves the Pascal case name of a device.
   * @param { number } deviceEnum The EChromaSDKDeviceEnum.
   * @returns The name of the device.
   */
  getDeviceEnumName(deviceEnum) {
    switch (deviceEnum) {
      case EChromaSDKDeviceEnum.DE_ChromaLink:
        return "ChromaLink";
      case EChromaSDKDeviceEnum.DE_Headset:
        return "Headset";
      case EChromaSDKDeviceEnum.DE_Keyboard:
        return "Keyboard";
      case EChromaSDKDeviceEnum.DE_Keypad:
        return "Keypad";
      case EChromaSDKDeviceEnum.DE_Mouse:
        return "Mouse";
      case EChromaSDKDeviceEnum.DE_Mousepad:
        return "Mousepad";
      case EChromaSDKDeviceEnum.DE_KeyboardExtended:
        return "KeyboardExtended";
    }
    return '';
  },
  /**
   * Retrieves the Pascal case name of a device.
   * @param { number } deviceType The EChromaSDKDeviceTypeEnum.
   * @param { number } device The EChromaSDKDevice1DEnum or EChromaSDKDevice2DEnum.
   * @returns The name of the device.
   */
  getDeviceName(deviceType, device) {
    return this.getDeviceEnumName(this.getDeviceEnum(deviceType, device));
  },
  /**
   * Linearly interpolates between two numbers.
   * @param { number } start The first value.
   * @param { number } end The second value.
   * @param { number } amt The amount to interpolate by.
   * @returns The interpolated value.
   */
  lerp: function (start, end, amt) {
    return (1 - amt) * start + amt * end;
  },
  /**
   * Linearly interpolates between two color values.
   * @param { number } from The first color as a 3-byte number.
   * @param { number } to The second color as a 3-byte number.
   * @param { number } t The amount to interpolate by.
   * @returns The interpolated color.
   */
  lerpColor: function (from, to, t) {
    let red = Math.floor(this.lerp((from & 0xFF), (to & 0xFF), t));
    let green = Math.floor(this.lerp((from & 0xFF00) >> 8, (to & 0xFF00) >> 8, t));
    let blue = Math.floor(this.lerp((from & 0xFF0000) >> 16, (to & 0xFF0000) >> 16, t));
    let color = red | (green << 8) | (blue << 16);
    return color;
  },
  /**
   * Retrieves an animation by its name.
   * @param { string } animationName The name of the animation.
   * @returns The ChromaAnimation1D or ChromaAnimation2D, or undefined if the animation does not exist.
   */
  getAnimation: function (animationName) {
    return this.LoadedAnimations[animationName];
  },
  /**
   * Retrieves the number of frames in an animation.
   * @param { string } animationName The name of the animation.
   * @returns The number of frames, or 0 if the animation does not exist.
   */
  getFrameCount: function (animationName) {
    const animation = this.getAnimation(animationName);
    if (animation == undefined) {
      return 0;
    } else {
      return animation.getFrameCount();
    }
  },
  /**
   * Stops the current animation for a device.
   * @param { number } device The EChromaSDKDeviceEnum.
   */
  stopByAnimationType: function (device) {
    if (chromaSDK == undefined) {
      setTimeout(function () { ChromaAnimation.stopByAnimationType(device); }, 100);
      return;
    }
    //1D
    if (this.getDeviceType(device) == EChromaSDKDeviceTypeEnum.DE_1D) {
      let device1D = this.getDevice1D(device);
      let animation = ChromaAnimation.LoadedAnimations1D[device1D];
      if (animation != undefined) {
        animation.stop();
      }
      ChromaAnimation.LoadedAnimations1D[device1D] = undefined;
      //2D
    } else if (this.getDeviceType(device) == EChromaSDKDeviceTypeEnum.DE_2D) {
      let device2D = this.getDevice2D(device);
      if (device2D == EChromaSDKDevice2DEnum.DE_KeyboardExtended) {
        device2D = EChromaSDKDevice2DEnum.DE_Keyboard;
      }
      let animation = this.LoadedAnimations2D[device2D];
      if (animation != undefined) {
        animation.stop();
      }
      this.LoadedAnimations2D[device2D] = undefined;
    }
  },
  /**
   * Stops all current animations.
   */
  stopAll: function () {
    this.stopByAnimationType(EChromaSDKDeviceEnum.DE_ChromaLink);
    this.stopByAnimationType(EChromaSDKDeviceEnum.DE_Headset);
    this.stopByAnimationType(EChromaSDKDeviceEnum.DE_Keyboard);
    this.stopByAnimationType(EChromaSDKDeviceEnum.DE_Keypad);
    this.stopByAnimationType(EChromaSDKDeviceEnum.DE_Mouse);
    this.stopByAnimationType(EChromaSDKDeviceEnum.DE_Mousepad);
  },
  /**
   * Checks whether an animation is playing.
   * @param { string } animationName The name of the animation.
   * @returns Whether the named animation is playing.
   */
  isPlaying: function (animationName) {
    if (chromaSDK == undefined) {
      return false;
    }
    if (this.LoadedAnimations[animationName] != undefined) {
      return this.LoadedAnimations[animationName].isPlaying();
    }
    return false;
  },
  /**
   * Plays an animation.
   * @param { string } animationName The name of the animation. 
   * @param { boolean } loop Whether to loop the animation.
   * @param { (anim: ChromaAnimation1D | ChromaAnimation2D, colors: Color[]) => void } frameCallback The callback to call once per frame.
   */
  playAnimation: function (animationName, loop, frameCallback) {
    if (chromaSDK == undefined) {
      setTimeout(function () { ChromaAnimation.playAnimation(animationName, loop, frameCallback); }, 100);
      return;
    }
    if (this.LoadedAnimations[animationName] == undefined) {
      const refThis = this;
      ChromaAnimation.openAnimation(animationName,
        function (animation) {
          //console.log(animation);
          refThis.LoadedAnimations[animationName] = animation;
          //console.log('playAnimation:', animationName);
          animation.FrameCallback = frameCallback;
          let device = animation.Device;
          if (device == EChromaSDKDevice2DEnum.DE_KeyboardExtended) {
            // Keyboard and KeyboardExtended share the same slot, only one can play at the same time
            device = EChromaSDKDevice2DEnum.DE_Keyboard;
          }
          switch (animation.DeviceType) {
            case EChromaSDKDeviceTypeEnum.DE_1D:
              ChromaAnimation.PlayingAnimations1D[device][animationName] = animation;
              break;
            case EChromaSDKDeviceTypeEnum.DE_2D:
              ChromaAnimation.PlayingAnimations2D[device][animationName] = animation;
              break;
          }
          animation.play(loop);
        });
    } else {
      let animation = this.LoadedAnimations[animationName];
      //console.log('playAnimation:', animationName);
      animation.FrameCallback = frameCallback;
      let device = animation.Device;
      if (device == EChromaSDKDevice2DEnum.DE_KeyboardExtended) {
        // Keyboard and KeyboardExtended share the same slot, only one can play at the same time
        device = EChromaSDKDevice2DEnum.DE_Keyboard;
      }
      switch (animation.DeviceType) {
        case EChromaSDKDeviceTypeEnum.DE_1D:
          ChromaAnimation.PlayingAnimations1D[device][animationName] = animation;
          break;
        case EChromaSDKDeviceTypeEnum.DE_2D:
          ChromaAnimation.PlayingAnimations2D[device][animationName] = animation;
          break;
      }
      animation.play(loop);
    }
  },
  /**
   * Stops an animation.
   * @param { string } animationName The name of the animation.
   */
  stopAnimation: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation != undefined) {
      this.LoadedAnimations[animationName].stop();
      let device = animation.Device;
      if (device == EChromaSDKDevice2DEnum.DE_KeyboardExtended) {
        // Keyboard and KeyboardExtended share the same slot, only one can play at the same time
        device = EChromaSDKDevice2DEnum.DE_Keyboard;
      }
      switch (animation.DeviceType) {
        case EChromaSDKDeviceTypeEnum.DE_1D:
          ChromaAnimation.PlayingAnimations1D[device][animationName] = undefined;
          break;
        case EChromaSDKDeviceTypeEnum.DE_2D:
          ChromaAnimation.PlayingAnimations2D[device][animationName] = undefined;
          break;
      }
    }
  },
  /**
   * Stops and unloads an animation.
   * @param { string } animationName The name of the animation.
   */
  closeAnimation: function (animationName) {
    if (this.LoadedAnimations[animationName] != undefined) {
      this.LoadedAnimations[animationName].stop();
      this.LoadedAnimations[animationName] = undefined;
    }
  },
  /**
   * Set the idling state of a device.
   * @param { number } device The EChromaSDKDeviceEnum.
   * @param { boolean } flag Whether to play the idle animation.
   */
  useIdleAnimation: function (device, flag) {
    switch (device) {
      case EChromaSDKDeviceEnum.DE_ChromaLink:
        ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_ChromaLink] = flag;
        break;
      case EChromaSDKDeviceEnum.DE_Headset:
        ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_Headset] = flag;
        break;
      case EChromaSDKDeviceEnum.DE_Mousepad:
        ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_Mousepad] = flag;
        break;
      case EChromaSDKDeviceEnum.DE_Keyboard:
        ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keyboard] = flag;
        break;
      case EChromaSDKDeviceEnum.DE_Keypad:
        ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keypad] = flag;
        break;
      case EChromaSDKDeviceEnum.DE_Mouse:
        ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Mouse] = flag;
        break;
    }
  },
  /**
   * Set the idling state of all devices.
   * @param { boolean } flag Whether to play the idle animations.
   */
  useIdleAnimations: function (flag) {
    ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_ChromaLink] = flag;
    ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_Headset] = flag;
    ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_Mousepad] = flag;
    ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keyboard] = flag;
    ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keypad] = flag;
    ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Mouse] = flag;
  },
  /**
   * Designates an animation as the idle animation for its device.
   * @param { string } animationName The name of the animation.
   */
  setIdleAnimation: function (animationName) {
    let animation = ChromaAnimation.LoadedAnimations[animationName];
    if (animation == undefined) {
      ChromaAnimation.openAnimation(animationName, function (animation) {
        switch (animation.DeviceType) {
          case EChromaSDKDeviceTypeEnum.DE_1D:
            ChromaAnimation.IdleAnimation1D[animation.Device] = animationName;
            break;
          case EChromaSDKDeviceTypeEnum.DE_2D:
            ChromaAnimation.IdleAnimation2D[animation.Device] = animationName;
            break;
        }
      });
    } else {
      switch (animation.DeviceType) {
        case EChromaSDKDeviceTypeEnum.DE_1D:
          ChromaAnimation.IdleAnimation1D[animation.Device] = animationName;
          break;
        case EChromaSDKDeviceTypeEnum.DE_2D:
          ChromaAnimation.IdleAnimation2D[animation.Device] = animationName;
          break;
      }
    }
  },
  /**
   * Reverses the frames of an animation.
   * @param { string } animationName The name of the animation.
   */
  reverseAllFrames: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    animation.Frames = animation.Frames.reverse();
  },
  /**
   * Sets the colors of all given keyboard keys for a single frame.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number[] } keys The array of RZKEYs.
   * @param { Color } color The color.
   */
  setKeysColor: function (animationName, frameId, keys, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          for (let k = 0; k < keys.length; ++k) {
            let key = keys[k];
            if (getHighByte(key) == i &&
              getLowByte(key) == j) {
              row[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Sets the colors of all given keyboard keys for a single frame.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number[] } keys The array of RZKEYs.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  setKeysColorRGB: function (animationName, frameId, keys, red, green, blue) {
    setKeysColor(animationName, frameId, keys, ChromaAnimation.getRGB(red, green, blue));
  },
  /**
   * Retrieves the color of a given keyboard key for a single frame.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } key The RZKEY.
   * @returns { Color } The color.
   */
  getKeyColor: function (animationName, frameId, key) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return 0;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return 0;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          if (getHighByte(key) == i &&
            getLowByte(key) == j) {
            return row[j];
          }
        }
      }
    }
    return 0;
  },
  /**
   * Sets the color of a given keyboard key for a single frame.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } key The RZKEY.
   * @param { Color } color The color.
   */
  setKeyColor: function (animationName, frameId, key, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D) {
      return;
    }
    switch (animation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        break;
      default:
        return;
    }
    const customFlag = 1 << 24;
    const keyColor = color | customFlag;
    let frames = animation.Frames;
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      let keys = frame.Keys;
      const i = getHighByte(key);
      let row = keys[i];
      const j = getLowByte(key);
      row[j] = color | keyColor;
    }
  },
  /**
   * Copies the color from one keyboard key to another for a single frame.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } sourceKey The source RZKEY.
   * @param { number } targetKey The target RZKEY.
   */
  copyKeyColorToKey: function (animationName, frameId, sourceKey, targetKey) {
    let color = ChromaAnimation.getKeyColor(animationName, frameId, sourceKey);
    ChromaAnimation.setKeyColor(animationName, frameId, targetKey, color);
  },
  /**
   * Sets the color of a given keyboard key for every frame in an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } key The RZKEY.
   * @param { Color } color The color.
   */
  setKeyColorAllFrames: function (animationName, key, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D) {
      return;
    }
    switch (animation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        break;
      default:
        return;
    }
    const customFlag = 1 << 24;
    const keyColor = color | customFlag;
    let frames = animation.Frames;
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      let keys = frame.Keys;
      const i = getHighByte(key);
      let row = keys[i];
      const j = getLowByte(key);
      row[j] = color | keyColor;
    }
  },
  /**
   * Sets the color of a given keyboard key for every frame in an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } key The RZKEY.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  setKeyColorAllFramesRGB: function (animationName, key, red, green, blue) {
    setKeyColorAllFrames(animationName, key, ChromaAnimation.getRGB(red, green, blue));
  },
  /**
   * Sets the colors of all given keyboard keys for every frame in an animation.
   * @param { string } animationName The name of the animation.
   * @param { number[] } keys The array of RZKEYs.
   * @param { Color } color The color.
   */
  setKeysColorAllFrames: function (animationName, keys, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D) {
      return;
    }
    switch (animation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        break;
      default:
        return;
    }

    let customFlag = 1 << 24;
    let keyColor = color | customFlag;
    let frames = animation.Frames;
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      let colors = frame.Keys; // use Keys for custom layout
      for (let k = 0; k < keys.length; ++k) {
        let key = keys[k];
        const i = getHighByte(key);
        const j = getLowByte(key);
        let row = colors[i];
        row[j] = keyColor;
      }
    }
  },
  /**
   * Sets the colors of all given keyboard keys for every frame in an animation.
   * @param { string } animationName The name of the animation.
   * @param { number[] } keys The array of RZKEYs.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  setKeysColorAllFramesRGB: function (animationName, keys, red, green, blue) {
    setKeysColorAllFrames(animationName, keys, ChromaAnimation.getRGB(red, green, blue));
  },
  /**
   * Copies the color of a given keyboard key for every frame from one animation to another.
   * 
   * If the number of source frames is less than the number of target frames,
   * the animation wraps from the start.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } key The RZKEY.
   */
  copyKeyColorAllFrames: function (sourceAnimationName, targetAnimationName, key) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D) {
      return;
    }
    switch (sourceAnimation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        break;
      default:
        return;
    }
    switch (targetAnimation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        break;
      default:
        return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    const i = getHighByte(key);
    const j = getLowByte(key);
    for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId % sourceFrames.length];
      let targetFrame = targetFrames[frameId];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Keys;
      let sourceRow = sourceColors[i];
      let targetRow = targetColors[i];
      let color = sourceRow[j];
      const customFlag = 1 << 24;
      const keyColor = color | customFlag;
      targetRow[j] = keyColor;
    }
  },
  /**
   * Copies the color of a given keyboard key for every frame from one animation to another, offsetting the frame index.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } key The RZKEY.
   * @param { number } offset The number of frames to offset the destination by.
   */
  copyKeyColorAllFramesOffset: function (sourceAnimationName, targetAnimationName, key, offset) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < sourceFrames.length && (frameId + offset) < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId];
      let targetFrame = targetFrames[(frameId + offset) % targetFrames.length];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          if (getHighByte(key) == i &&
            getLowByte(key) == j) {
            targetRow[j] = sourceRow[j];
          }
        }
      }
    }
  },
  /**
   * Copies the color of all given keyboard keys for every frame from one animation to another.
   * 
   * If the number of source frames is less than the number of target frames,
   * the animation wraps from the start.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number[] } keys The array of RZKEYs.
   */
  copyKeysColorAllFrames: function (sourceAnimationName, targetAnimationName, keys) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D) {
      return;
    }
    switch (sourceAnimation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        break;
      default:
        return;
    }
    switch (targetAnimation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        break;
      default:
        return;
    }
    if (sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }

    for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId % sourceFrames.length];
      let targetFrame = targetFrames[frameId];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Keys;
      for (let k = 0; k < keys.length; ++k) {
        let key = keys[k];
        const i = getHighByte(key);
        const j = getLowByte(key);
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        let color = sourceRow[j];
        const customFlag = 1 << 24;
        const keyColor = color | customFlag;
        targetRow[j] = keyColor;
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for a single frame from one animation to another,
   * if the source color is not zero.
   * 
   * If the number of source frames is less than the frame index,
   * the frame index wraps from the start.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } frameId The frame index.
   */
  copyNonZeroAllKeys: function (sourceAnimationName, targetAnimationName, frameId) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < targetFrames.length) {
      let sourceFrame = sourceFrames[frameId % sourceFrames.length];
      let targetFrame = targetFrames[frameId];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0) {
            targetRow[j] = color;
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for every frame from one animation to another,
   * if the source color is not zero.
   * 
   * If the number of source frames is less than the number of target frames,
   * the animation wraps from the start.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  copyNonZeroAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType ||
      sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = sourceColors[i];
          if (color != 0) {
            targetColors[i] = color;
          }
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = sourceRow[j];
            if (color != 0) {
              targetRow[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Adds two colors.
   * @param { Color } color1 The first color.
   * @param { Color } color2 The second color.
   * @returns The added color.
   */
  addColor(color1, color2) {
    let red1 = color1 & 0xFF;
    let green1 = (color1 & 0xFF00) >> 8;
    let blue1 = (color1 & 0xFF0000) >> 16;

    let red2 = color2 & 0xFF;
    let green2 = (color2 & 0xFF00) >> 8;
    let blue2 = (color2 & 0xFF0000) >> 16;

    let red = Math.min(255, Math.max(0, Number(red1) + Number(red2))) & 0xFF;
    let green = Math.min(255, Math.max(0, Number(green1) + Number(green2))) & 0xFF;
    let blue = Math.min(255, Math.max(0, Number(blue1) + Number(blue2))) & 0xFF;

    let newColor = red | (green << 8) | (blue << 16);
    return newColor;
  },
  /**
   * Subtracts two colors.
   * @param { Color } color1 The first color.
   * @param { Color } color2 The second color.
   * @returns The subtracted color.
   */
  subtractColor(color1, color2) {
    let red1 = color1 & 0xFF;
    let green1 = (color1 & 0xFF00) >> 8;
    let blue1 = (color1 & 0xFF0000) >> 16;

    let red2 = color2 & 0xFF;
    let green2 = (color2 & 0xFF00) >> 8;
    let blue2 = (color2 & 0xFF0000) >> 16;

    let red = Math.min(255, Math.max(0, Number(red1) - Number(red2))) & 0xFF;
    let green = Math.min(255, Math.max(0, Number(green1) - Number(green2))) & 0xFF;
    let blue = Math.min(255, Math.max(0, Number(blue1) - Number(blue2))) & 0xFF;

    let newColor = red | (green << 8) | (blue << 16);
    return newColor;
  },
  /**
   * Adds the color of all keyboard keys for every frame in one animation to another.
   * 
   * If the number of source frames is less than the number of target frames,
   * the animation wraps from the start.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  addAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType ||
      sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = sourceColors[i];
          let sourceRed = color & 0xFF;
          let sourceGreen = (color & 0xFF00) >> 8;
          let sourceBlue = (color & 0xFF0000) >> 16;

          let oldColor = targetColors[i];
          let oldRed = oldColor & 0xFF;
          let oldGreen = (oldColor & 0xFF00) >> 8;
          let oldBlue = (oldColor & 0xFF0000) >> 16;

          let red = Math.min(255, Math.max(0, Number(oldRed) + Number(sourceRed))) & 0xFF;
          let green = Math.min(255, Math.max(0, Number(oldGreen) + Number(sourceGreen))) & 0xFF;
          let blue = Math.min(255, Math.max(0, Number(oldBlue) + Number(sourceBlue))) & 0xFF;
          let newColor = red | (green << 8) | (blue << 16);

          targetColors[i] = newColor;
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = sourceRow[j];
            let sourceRed = color & 0xFF;
            let sourceGreen = (color & 0xFF00) >> 8;
            let sourceBlue = (color & 0xFF0000) >> 16;

            let oldColor = targetRow[j];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;

            let red = Math.min(255, Math.max(0, Number(oldRed) + Number(sourceRed))) & 0xFF;
            let green = Math.min(255, Math.max(0, Number(oldGreen) + Number(sourceGreen))) & 0xFF;
            let blue = Math.min(255, Math.max(0, Number(oldBlue) + Number(sourceBlue))) & 0xFF;
            let newColor = red | (green << 8) | (blue << 16);

            targetRow[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Adds the color of all keyboard keys for every frame in one animation to another,
   * if the source color is not zero.
   * 
   * If the number of source frames is less than the number of target frames,
   * the animation wraps from the start.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  addNonZeroAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType ||
      sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = sourceColors[i];
          if (color != 0) {
            let sourceRed = color & 0xFF;
            let sourceGreen = (color & 0xFF00) >> 8;
            let sourceBlue = (color & 0xFF0000) >> 16;

            let oldColor = targetColors[i];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;

            let red = Math.min(255, Math.max(0, Number(oldRed) + Number(sourceRed))) & 0xFF;
            let green = Math.min(255, Math.max(0, Number(oldGreen) + Number(sourceGreen))) & 0xFF;
            let blue = Math.min(255, Math.max(0, Number(oldBlue) + Number(sourceBlue))) & 0xFF;
            let newColor = red | (green << 8) | (blue << 16);

            targetColors[i] = newColor;
          }
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = sourceRow[j];
            if (color != 0) {
              let sourceRed = color & 0xFF;
              let sourceGreen = (color & 0xFF00) >> 8;
              let sourceBlue = (color & 0xFF0000) >> 16;

              let oldColor = targetRow[j];
              let oldRed = oldColor & 0xFF;
              let oldGreen = (oldColor & 0xFF00) >> 8;
              let oldBlue = (oldColor & 0xFF0000) >> 16;

              let red = Math.min(255, Math.max(0, Number(oldRed) + Number(sourceRed))) & 0xFF;
              let green = Math.min(255, Math.max(0, Number(oldGreen) + Number(sourceGreen))) & 0xFF;
              let blue = Math.min(255, Math.max(0, Number(oldBlue) + Number(sourceBlue))) & 0xFF;
              let newColor = red | (green << 8) | (blue << 16);

              targetRow[j] = newColor;
            }
          }
        }
      }
    }
  },
  /**
   * Subtracts the color of all keyboard keys for every frame in one animation from another.
   * 
   * If the number of source frames is less than the number of target frames,
   * the animation wraps from the start.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  subtractAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType ||
      sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = sourceColors[i];
          let sourceRed = color & 0xFF;
          let sourceGreen = (color & 0xFF00) >> 8;
          let sourceBlue = (color & 0xFF0000) >> 16;

          let oldColor = targetColors[i];
          let oldRed = oldColor & 0xFF;
          let oldGreen = (oldColor & 0xFF00) >> 8;
          let oldBlue = (oldColor & 0xFF0000) >> 16;

          let red = Math.min(255, Math.max(0, Number(oldRed) - Number(sourceRed))) & 0xFF;
          let green = Math.min(255, Math.max(0, Number(oldGreen) - Number(sourceGreen))) & 0xFF;
          let blue = Math.min(255, Math.max(0, Number(oldBlue) - Number(sourceBlue))) & 0xFF;
          let newColor = red | (green << 8) | (blue << 16);

          targetColors[i] = newColor;
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = sourceRow[j];
            let sourceRed = color & 0xFF;
            let sourceGreen = (color & 0xFF00) >> 8;
            let sourceBlue = (color & 0xFF0000) >> 16;

            let oldColor = targetRow[j];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;

            let red = Math.min(255, Math.max(0, Number(oldRed) - Number(sourceRed))) & 0xFF;
            let green = Math.min(255, Math.max(0, Number(oldGreen) - Number(sourceGreen))) & 0xFF;
            let blue = Math.min(255, Math.max(0, Number(oldBlue) - Number(sourceBlue))) & 0xFF;
            let newColor = red | (green << 8) | (blue << 16);

            targetRow[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Subtracts the color of all keyboard keys for every frame in one animation from another,
   * if the source color is not zero.
   * 
   * If the number of source frames is less than the number of target frames,
   * the animation wraps from the start.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  subtractNonZeroAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType ||
      sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = sourceColors[i];
          if (color != 0) {
            let sourceRed = color & 0xFF;
            let sourceGreen = (color & 0xFF00) >> 8;
            let sourceBlue = (color & 0xFF0000) >> 16;

            let oldColor = targetColors[i];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;

            let red = Math.min(255, Math.max(0, Number(oldRed) - Number(sourceRed))) & 0xFF;
            let green = Math.min(255, Math.max(0, Number(oldGreen) - Number(sourceGreen))) & 0xFF;
            let blue = Math.min(255, Math.max(0, Number(oldBlue) - Number(sourceBlue))) & 0xFF;
            let newColor = red | (green << 8) | (blue << 16);

            targetColors[i] = newColor;
          }
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = sourceRow[j];
            if (color != 0) {
              let sourceRed = color & 0xFF;
              let sourceGreen = (color & 0xFF00) >> 8;
              let sourceBlue = (color & 0xFF0000) >> 16;

              let oldColor = targetRow[j];
              let oldRed = oldColor & 0xFF;
              let oldGreen = (oldColor & 0xFF00) >> 8;
              let oldBlue = (oldColor & 0xFF0000) >> 16;

              let red = Math.min(255, Math.max(0, Number(oldRed) - Number(sourceRed))) & 0xFF;
              let green = Math.min(255, Math.max(0, Number(oldGreen) - Number(sourceGreen))) & 0xFF;
              let blue = Math.min(255, Math.max(0, Number(oldBlue) - Number(sourceBlue))) & 0xFF;
              let newColor = red | (green << 8) | (blue << 16);

              targetRow[j] = newColor;
            }
          }
        }
      }
    }
  },
  /**
   * Adds the color of all keyboard keys for every frame in one animation to another,
   * offsetting the frame index,
   * if the source color is not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } offset The number of frames to offset the destination by.
   */
  addNonZeroAllKeysAllFramesOffset: function (sourceAnimationName, targetAnimationName, offset) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = sourceFrames.length - 1; frameId >= 0; --frameId) {
      let sourceFrame = sourceFrames[frameId];
      let targetFrame = targetFrames[(frameId + offset) % targetFrames.length];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0) {
            let sourceRed = color & 0xFF;
            let sourceGreen = (color & 0xFF00) >> 8;
            let sourceBlue = (color & 0xFF0000) >> 16;

            let oldColor = targetRow[j];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;

            let red = Math.min(255, Math.max(0, Number(oldRed) + Number(sourceRed))) & 0xFF;
            let green = Math.min(255, Math.max(0, Number(oldGreen) + Number(sourceGreen))) & 0xFF;
            let blue = Math.min(255, Math.max(0, Number(oldBlue) + Number(sourceBlue))) & 0xFF;
            let newColor = red | (green << 8) | (blue << 16);

            targetRow[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Subtracts the color of all keyboard keys for every frame in one animation from another,
   * offsetting the frame index,
   * if the source color is not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } offset The number of frames to offset the destination by.
   */
  subtractNonZeroAllKeysAllFramesOffset: function (sourceAnimationName, targetAnimationName, offset) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < sourceFrames.length && frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId];
      let targetFrame = targetFrames[(frameId + offset) % targetFrames.length];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0) {
            let sourceRed = color & 0xFF;
            let sourceGreen = (color & 0xFF00) >> 8;
            let sourceBlue = (color & 0xFF0000) >> 16;

            let oldColor = targetRow[j];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;

            let red = Math.min(255, Math.max(0, Number(oldRed) - Number(sourceRed))) & 0xFF;
            let green = Math.min(255, Math.max(0, Number(oldGreen) - Number(sourceGreen))) & 0xFF;
            let blue = Math.min(255, Math.max(0, Number(oldBlue) - Number(sourceBlue))) & 0xFF;
            let newColor = red | (green << 8) | (blue << 16);

            targetRow[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for a single frame from one animation to another,
   * offsetting the frame index,
   * if the source color is not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } frameId The frame index.
   * @param { number } offset The number of frames to offset the destination by.
   */
  copyNonZeroAllKeysOffset: function (sourceAnimationName, targetAnimationName, frameId, offset) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < sourceFrames.length) {
      let sourceFrame = sourceFrames[frameId];
      let targetFrame = targetFrames[(frameId + offset) % targetFrames.length];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0) {
            targetRow[j] = color;
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for every frame from one animation to another,
   * offsetting the frame index,
   * if the source color is not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } offset The number of frames to offset the destination by.
   */
  copyNonZeroAllKeysAllFramesOffset: function (sourceAnimationName, targetAnimationName, offset) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < sourceFrames.length && (frameId + offset) < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId];
      let targetFrame = targetFrames[(frameId + offset) % targetFrames.length];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0) {
            targetRow[j] = color;
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for a single frame from one animation to another,
   * if the source and target colors are not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } frameId The frame index.
   */
  copyNonZeroTargetAllKeys: function (sourceAnimationName, targetAnimationName, frameId) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }

    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId % targetFrames.length];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let sourceColor = sourceColors[i];
          let targetColor = targetColors[i];
          if (sourceColor != 0 &&
            targetColor != 0) {
            targetColors[i] = sourceColor;
          }
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId % targetFrames.length];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = sourceRow[j];
            if (color != 0 &&
              targetRow[j] != 0) {
              targetRow[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Multiplies the color of all keyboard keys for a single frame of one animation to another,
   * if the source color is not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } frameId The frame index.
   */
  copyNonZeroTargetMultiplyAllKeys: function (sourceAnimationName, targetAnimationName, frameId) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }

    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId % targetFrames.length];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let sourceColor = sourceColors[i];
          if (sourceColor != 0) {
            let oldColor = targetColors[i];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;
            let t = (oldRed + oldGreen + oldBlue) / 3.0 / 255.0;
            targetColors[i] = ChromaAnimation.lerpColor(0, sourceColor, t);
          }
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId % targetFrames.length];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let sourceColor = sourceRow[j];
            if (sourceColor != 0) {
              let oldColor = targetRow[j];
              let oldRed = oldColor & 0xFF;
              let oldGreen = (oldColor & 0xFF00) >> 8;
              let oldBlue = (oldColor & 0xFF0000) >> 16;
              let t = (oldRed + oldGreen + oldBlue) / 3.0 / 255.0;
              targetRow[j] = ChromaAnimation.lerpColor(0, sourceColor, t);
            }
          }
        }
      }
    }
  },
  /**
   * Multiplies the color of all keyboard keys for every frame of one animation to another.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  copyTargetMultiplyAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }

    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId % targetFrames.length];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let sourceColor = sourceColors[i];
          let oldColor = targetColors[i];
          let oldRed = oldColor & 0xFF;
          let oldGreen = (oldColor & 0xFF00) >> 8;
          let oldBlue = (oldColor & 0xFF0000) >> 16;
          let t = (oldRed + oldGreen + oldBlue) / 3.0 / 255.0;
          targetColors[i] = ChromaAnimation.lerpColor(0, sourceColor, t);
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId % targetFrames.length];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let sourceColor = sourceRow[j];
            let oldColor = targetRow[j];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;
            let t = (oldRed + oldGreen + oldBlue) / 3.0 / 255.0;
            targetRow[j] = ChromaAnimation.lerpColor(0, sourceColor, t);
          }
        }
      }
    }
  },
  /**
   * Multiplies the color of all keyboard keys for every frame of one animation to another,
   * if the source color is not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  copyNonZeroTargetMultiplyAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.Device != targetAnimation.Device) {
      return;
    }
    if (sourceAnimation.DeviceType != targetAnimation.DeviceType) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }

    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId % targetFrames.length];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let sourceColor = sourceColors[i];
          if (sourceColor != 0) {
            let oldColor = targetColors[i];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;
            let t = (oldRed + oldGreen + oldBlue) / 3.0 / 255.0;
            targetColors[i] = ChromaAnimation.lerpColor(0, sourceColor, t);
          }
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId % targetFrames.length];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let sourceColor = sourceRow[j];
            if (sourceColor != 0) {
              let oldColor = targetRow[j];
              let oldRed = oldColor & 0xFF;
              let oldGreen = (oldColor & 0xFF00) >> 8;
              let oldBlue = (oldColor & 0xFF0000) >> 16;
              let t = (oldRed + oldGreen + oldBlue) / 3.0 / 255.0;
              targetRow[j] = ChromaAnimation.lerpColor(0, sourceColor, t);
            }
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for every frame from one animation to another,
   * if the source and target colors are not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  copyNonZeroTargetAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let sourceColor = sourceColors[i];
          let targetColor = targetColors[i];
          if (sourceColor != 0 &&
            targetColor != 0) {
            targetColors[i] = sourceColor;
          }
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = sourceRow[j];
            if (color != 0 &&
              targetRow[j] != 0) {
              targetRow[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Replaces the color of all keyboard keys for every frame from one animation to another,
   * if the target color is zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  replaceZeroKeysWithSourceAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let sourceColor = sourceColors[i];
          let targetColor = targetColors[i];
          if (sourceColor != 0 &&
            targetColor == 0) {
            targetColors[i] = sourceColor;
          }
        }
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
        let sourceFrame = sourceFrames[frameId % sourceFrames.length];
        let targetFrame = targetFrames[frameId];
        let sourceColors = sourceFrame.Colors;
        let targetColors = targetFrame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let sourceRow = sourceColors[i];
          let targetRow = targetColors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let sourceColor = sourceRow[j];
            let targetColor = targetRow[j];
            if (sourceColor != 0 &&
              targetColor == 0) {
              targetRow[j] = sourceColor;
            }
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for every frame from one animation to another,
   * if the target color is zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  copyNonZeroTargetZeroAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId % sourceFrames.length];
      let targetFrame = targetFrames[frameId];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0 &&
            targetRow[j] == 0) {
            targetRow[j] = color;
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for every frame from one animation to another,
   * offsetting the frame index,
   * if the source and target colors are not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   * @param { number } offset The number of frames to offset the destination by.
   */
  copyNonZeroTargetAllKeysAllFramesOffset: function (sourceAnimationName, targetAnimationName, offset) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId];
      let targetFrame = targetFrames[(frameId + offset) % targetFrames.length];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0 &&
            targetRow[j] != 0) {
            targetRow[j] = color;
          }
        }
      }
    }
  },
  /**
   * Adds the color of all keyboard keys for every frame from one animation to another,
   * if the source and target colors are not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  addNonZeroTargetAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId % sourceFrames.length];
      let targetFrame = targetFrames[frameId];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0 &&
            targetRow[j] != 0) {
            let sourceRed = color & 0xFF;
            let sourceGreen = (color & 0xFF00) >> 8;
            let sourceBlue = (color & 0xFF0000) >> 16;

            let oldColor = targetRow[j];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;

            let red = Math.min(255, Math.max(0, Number(oldRed) + Number(sourceRed))) & 0xFF;
            let green = Math.min(255, Math.max(0, Number(oldGreen) + Number(sourceGreen))) & 0xFF;
            let blue = Math.min(255, Math.max(0, Number(oldBlue) + Number(sourceBlue))) & 0xFF;
            let newColor = red | (green << 8) | (blue << 16);

            targetRow[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Subtracts the color of all keyboard keys for every frame of one animation from another,
   * if the source and target colors are not zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  subtractNonZeroTargetAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId % sourceFrames.length];
      let targetFrame = targetFrames[frameId];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color != 0 &&
            targetRow[j] != 0) {
            let sourceRed = color & 0xFF;
            let sourceGreen = (color & 0xFF00) >> 8;
            let sourceBlue = (color & 0xFF0000) >> 16;

            let oldColor = targetRow[j];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor & 0xFF00) >> 8;
            let oldBlue = (oldColor & 0xFF0000) >> 16;

            let red = Math.min(255, Math.max(0, Number(oldRed) - Number(sourceRed))) & 0xFF;
            let green = Math.min(255, Math.max(0, Number(oldGreen) - Number(sourceGreen))) & 0xFF;
            let blue = Math.min(255, Math.max(0, Number(oldBlue) - Number(sourceBlue))) & 0xFF;
            let newColor = red | (green << 8) | (blue << 16);

            targetRow[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for every frame from one animation to another,
   * if the source color is zero.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  copyZeroTargetAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId % sourceFrames.length];
      let targetFrame = targetFrames[frameId];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color == 0 &&
            targetRow[j] != 0) {
            targetRow[j] = color;
          }
        }
      }
    }
  },
  /**
   * Copies the color of all keyboard keys for every frame from one animation to another,
   * if the source and target colors are zero.
   * 
   * This function actually doesn't have any tangible effect.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  copyZeroTargetZeroAllKeysAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    if (sourceAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      sourceAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    if (targetAnimation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      targetAnimation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    if (sourceFrames.length == 0) {
      return;
    }
    let targetFrames = targetAnimation.Frames;
    if (targetFrames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < targetFrames.length; ++frameId) {
      let sourceFrame = sourceFrames[frameId % sourceFrames.length];
      let targetFrame = targetFrames[frameId];
      let sourceColors = sourceFrame.Colors;
      let targetColors = targetFrame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let sourceRow = sourceColors[i];
        let targetRow = targetColors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = sourceRow[j];
          if (color == 0 &&
            targetRow[j] == 0) {
            targetRow[j] = color;
          }
        }
      }
    }
  },
  /**
   * Sets every color for a single frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { Color } newColor The color.
   */
  fillColor: function (animationName, frameId, newColor) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          colors[i] = newColor;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            row[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { Color } newColor The color.
   */
  fillColorAllFrames: function (animationName, newColor) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          colors[i] = newColor;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            row[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Sets every color for a single frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  fillColorRGB: function (animationName, frameId, red, green, blue) {
    let newColor = this.getRGB(red, green, blue);
    this.fillColor(animationName, frameId, newColor);
  },
  /**
   * Sets every color for a single frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { Color } newColor The color.
   */
  fillNonZeroColor: function (animationName, frameId, newColor) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          if (color != 0) {
            row[j] = newColor;
          }
        }
      }
    }
  },
  /**
   * Sets every color for a single frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  fillNonZeroColorRGB: function (animationName, frameId, red, green, blue) {
    let newColor = ChromaAnimation.getRGB(red, green, blue);
    fillNonZeroColor(animationName, frameId, newColor);
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { Color } newColor The color.
   */
  fillNonZeroColorAllFrames: function (animationName, newColor) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          if (color != 0) {
            colors[i] = newColor;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            if (color != 0) {
              row[j] = newColor;
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  fillNonZeroColorAllFramesRGB: function (animationName, red, green, blue) {
    let newColor = ChromaAnimation.getRGB(red, green, blue);
    fillNonZeroColorAllFrames(animationName, newColor);
  },
  /**
   * Sets every color for a single frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { Color } newColor The color.
   */
  fillZeroColor: function (animationName, frameId, newColor) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          if (color == 0) {
            colors[i] = newColor;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            if (color == 0) {
              row[j] = newColor;
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { Color } newColor The color.
   */
  fillZeroColorAllFrames: function (animationName, newColor) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          if (color == 0) {
            colors[i] = newColor;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            if (color == 0) {
              row[j] = newColor;
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  fillZeroColorAllFramesRGB: function (animationName, red, green, blue) {
    let newColor = ChromaAnimation.getRGB(red, green, blue);
    fillZeroColorAllFrames(animationName, newColor);
  },
  /**
   * Sets every color for a single frame of an animation,
   * if the color is less than a given threshold component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { Color } threshold The threshold color.
   * @param { Color } color The color.
   */
  fillThresholdColors: function (animationName, frameId, threshold, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let oldColor = row[j];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if (red != 0 &&
            green != 0 &&
            blue != 0 &&
            red <= threshold &&
            green <= threshold &&
            blue <= threshold) {
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is less than a given threshold component-wise.
   * @param { string } animationName The name of the animation.
   * @param { Color } threshold The threshold color.
   * @param { Color } color The color.
   */
  fillThresholdColorsAllFrames: function (animationName, threshold, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let oldColor = colors[i];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if ((red != 0 ||
            green != 0 ||
            blue != 0) &&
            red <= threshold &&
            green <= threshold &&
            blue <= threshold) {
            colors[i] = color;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let oldColor = row[j];
            let red = oldColor & 0xFF;
            let green = (oldColor & 0xFF00) >> 8;
            let blue = (oldColor & 0xFF0000) >> 16;
            if ((red != 0 ||
              green != 0 ||
              blue != 0) &&
              red <= threshold &&
              green <= threshold &&
              blue <= threshold) {
              row[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for a single frame of an animation,
   * if the color is less than a given threshold component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { Color } threshold The threshold color.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  fillThresholdColorsRGB: function (animationName, frameId, threshold, red, green, blue) {
    let color = ChromaAnimation.getRGB(red, green, blue);
    fillThresholdColors(animationName, frameId, threshold, color);
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is less than a given threshold component-wise.
   * @param { string } animationName The name of the animation.
   * @param { Color } threshold The threshold color.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  fillThresholdColorsAllFramesRGB: function (animationName, threshold, red, green, blue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let color = ChromaAnimation.getRGB(red, green, blue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let oldColor = colors[i];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if ((red != 0 ||
            green != 0 ||
            blue != 0) &&
            red <= threshold &&
            green <= threshold &&
            blue <= threshold) {
            colors[i] = color;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let color = ChromaAnimation.getRGB(red, green, blue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let oldColor = row[j];
            let red = oldColor & 0xFF;
            let green = (oldColor & 0xFF00) >> 8;
            let blue = (oldColor & 0xFF0000) >> 16;
            if ((red != 0 ||
              green != 0 ||
              blue != 0) &&
              red <= threshold &&
              green <= threshold &&
              blue <= threshold) {
              row[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for a single frame of an animation,
   * if the color is outside of a given threshold range component-wise.
   * If less than the minimum threshold, the color is set to the minimum color,
   * else if more than the maximum threshold, the color is set to the maximum color.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } minThreshold The minimum threshold value.
   * @param { number } minRed The minimum red value, in [0, 255].
   * @param { number } minGreen The minimum green value, in [0, 255].
   * @param { number } minBlue The minimum blue value, in [0, 255].
   * @param { number } maxThreshold The maximum threshold value.
   * @param { number } maxRed The maximum red value, in [0, 255].
   * @param { number } maxGreen The maximum green value, in [0, 255].
   * @param { number } maxBlue The maximum blue value, in [0, 255].
   */
  fillThresholdColorsMinMaxRGB: function (animationName, frameId, minThreshold, minRed, minGreen, minBlue, maxThreshold, maxRed, maxGreen, maxBlue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
    let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let oldColor = colors[i];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if (red != 0 ||
            green != 0 ||
            blue != 0) {
            if (red <= minThreshold &&
              green <= minThreshold &&
              blue <= minThreshold) {
              colors[i] = minColor;
            }
            if (red >= maxThreshold &&
              green >= maxThreshold &&
              blue >= maxThreshold) {
              colors[i] = maxColor;
            }
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
      let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let oldColor = row[j];
            let red = oldColor & 0xFF;
            let green = (oldColor & 0xFF00) >> 8;
            let blue = (oldColor & 0xFF0000) >> 16;
            if (red != 0 ||
              green != 0 ||
              blue != 0) {
              if (red <= minThreshold &&
                green <= minThreshold &&
                blue <= minThreshold) {
                row[j] = minColor;
              }
              if (red >= maxThreshold &&
                green >= maxThreshold &&
                blue >= maxThreshold) {
                row[j] = maxColor;
              }
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for a single frame of an animation,
   * if the color is within a given threshold range component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } minThreshold The minimum threshold value.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   * @param { number } maxThreshold The maximum threshold value.
   */
  fillThresholdColorsMiddleAllFramesRGB: function (animationName, minThreshold, red, green, blue, maxThreshold) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let color = ChromaAnimation.getRGB(red, green, blue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let oldColor = colors[i];
          let oldRed = oldColor & 0xFF;
          let oldGreen = (oldColor >> 8) & 0xFF;
          let oldBlue = (oldColor >> 16) & 0xFF;
          if (oldRed >= minThreshold &&
            oldGreen >= minThreshold &&
            oldBlue >= minThreshold &&
            oldRed <= maxThreshold &&
            oldGreen <= maxThreshold &&
            oldBlue <= maxThreshold) {
            colors[i] = color;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let color = ChromaAnimation.getRGB(red, green, blue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let oldColor = row[j];
            let oldRed = oldColor & 0xFF;
            let oldGreen = (oldColor >> 8) & 0xFF;
            let oldBlue = (oldColor >> 16) & 0xFF;
            if (oldRed >= minThreshold &&
              oldGreen >= minThreshold &&
              oldBlue >= minThreshold &&
              oldRed <= maxThreshold &&
              oldGreen <= maxThreshold &&
              oldBlue <= maxThreshold) {
              row[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is outside of a given threshold range component-wise.
   * If less than the minimum threshold, the color is set to the minimum color,
   * else if more than the maximum threshold, the color is set to the maximum color.
   * @param { string } animationName The name of the animation.
   * @param { number } minThreshold The minimum threshold value.
   * @param { number } minRed The minimum red value, in [0, 255].
   * @param { number } minGreen The minimum green value, in [0, 255].
   * @param { number } minBlue The minimum blue value, in [0, 255].
   * @param { number } maxThreshold The maximum threshold value.
   * @param { number } maxRed The maximum red value, in [0, 255].
   * @param { number } maxGreen The maximum green value, in [0, 255].
   * @param { number } maxBlue The maximum blue value, in [0, 255].
   */
  fillThresholdColorsMinMaxAllFramesRGB: function (animationName, minThreshold, minRed, minGreen, minBlue, maxThreshold, maxRed, maxGreen, maxBlue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
      let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let oldColor = colors[i];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if (red <= minThreshold &&
            green <= minThreshold &&
            blue <= minThreshold) {
            colors[i] = minColor;
          }
          if (red >= maxThreshold &&
            green >= maxThreshold &&
            blue >= maxThreshold) {
            colors[i] = maxColor;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
      let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let oldColor = row[j];
            let red = oldColor & 0xFF;
            let green = (oldColor & 0xFF00) >> 8;
            let blue = (oldColor & 0xFF0000) >> 16;
            if (red <= minThreshold &&
              green <= minThreshold &&
              blue <= minThreshold) {
              row[j] = minColor;
            }
            if (red >= maxThreshold &&
              green >= maxThreshold &&
              blue >= maxThreshold) {
              row[j] = maxColor;
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is outside of a given threshold range component-wise.
   * If less than the minimum threshold, the color is set to the minimum color,
   * else if more than the maximum threshold, the color is set to the maximum color.
   * @param { string } animationName The name of the animation.
   * @param { number } minThreshold The minimum threshold value.
   * @param { number } minRed The minimum red value, in [0, 255].
   * @param { number } minGreen The minimum green value, in [0, 255].
   * @param { number } minBlue The minimum blue value, in [0, 255].
   * @param { number } maxThreshold The maximum threshold value.
   * @param { number } maxRed The maximum red value, in [0, 255].
   * @param { number } maxGreen The maximum green value, in [0, 255].
   * @param { number } maxBlue The maximum blue value, in [0, 255].
   */
  fillThresholdNonZeroColorsMinMaxAllFramesRGB: function (animationName, minThreshold, minRed, minGreen, minBlue, maxThreshold, maxRed, maxGreen, maxBlue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
      let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let oldColor = colors[i];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if (red != 0 ||
            green != 0 ||
            blue != 0) {
            if (red <= minThreshold &&
              green <= minThreshold &&
              blue <= minThreshold) {
              colors[i] = minColor;
            }
            if (red >= maxThreshold &&
              green >= maxThreshold &&
              blue >= maxThreshold) {
              colors[i] = maxColor;
            }
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
      let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let oldColor = row[j];
            let red = oldColor & 0xFF;
            let green = (oldColor & 0xFF00) >> 8;
            let blue = (oldColor & 0xFF0000) >> 16;
            if (red != 0 ||
              green != 0 ||
              blue != 0) {
              if (red <= minThreshold &&
                green <= minThreshold &&
                blue <= minThreshold) {
                row[j] = minColor;
              }
              if (red >= maxThreshold &&
                green >= maxThreshold &&
                blue >= maxThreshold) {
                row[j] = maxColor;
              }
            }
          }
        }
      }
    }
  },
  /**
   * Adds to every color for every frame of an animation,
   * if the color is outside of a given threshold range component-wise.
   * If less than the minimum threshold, the color is added by the minimum color,
   * else if more than the maximum threshold, the color is added by the maximum color.
   * @param { string } animationName The name of the animation.
   * @param { number } minThreshold The minimum threshold value.
   * @param { number } minRed The minimum red value, in [0, 255].
   * @param { number } minGreen The minimum green value, in [0, 255].
   * @param { number } minBlue The minimum blue value, in [0, 255].
   * @param { number } maxThreshold The maximum threshold value.
   * @param { number } maxRed The maximum red value, in [0, 255].
   * @param { number } maxGreen The maximum green value, in [0, 255].
   * @param { number } maxBlue The maximum blue value, in [0, 255].
   */
  addThresholdColorsMinMaxAllFramesRGB: function (animationName, minThreshold, minRed, minGreen, minBlue, maxThreshold, maxRed, maxGreen, maxBlue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
      let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let oldColor = colors[i];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if (red != 0 ||
            green != 0 ||
            blue != 0) {
            if (red <= minThreshold &&
              green <= minThreshold &&
              blue <= minThreshold) {
              colors[i] = ChromaAnimation.addColor(oldColor, minColor);
            }
            if (red >= maxThreshold &&
              green >= maxThreshold &&
              blue >= maxThreshold) {
              colors[i] = ChromaAnimation.addColor(oldColor, maxColor);
            }
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
      let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let oldColor = row[j];
            let red = oldColor & 0xFF;
            let green = (oldColor & 0xFF00) >> 8;
            let blue = (oldColor & 0xFF0000) >> 16;
            if (red != 0 ||
              green != 0 ||
              blue != 0) {
              if (red <= minThreshold &&
                green <= minThreshold &&
                blue <= minThreshold) {
                row[j] = ChromaAnimation.addColor(oldColor, minColor);
              }
              if (red >= maxThreshold &&
                green >= maxThreshold &&
                blue >= maxThreshold) {
                row[j] = ChromaAnimation.addColor(oldColor, maxColor);
              }
            }
          }
        }
      }
    }
  },
  /**
   * Subtracts from every color for every frame of an animation,
   * if the color is outside of a given threshold range component-wise.
   * If less than the minimum threshold, the color is subtracted by the minimum color,
   * else if more than the maximum threshold, the color is subtracted by the maximum color.
   * @param { string } animationName The name of the animation.
   * @param { number } minThreshold The minimum threshold value.
   * @param { number } minRed The minimum red value, in [0, 255].
   * @param { number } minGreen The minimum green value, in [0, 255].
   * @param { number } minBlue The minimum blue value, in [0, 255].
   * @param { number } maxThreshold The maximum threshold value.
   * @param { number } maxRed The maximum red value, in [0, 255].
   * @param { number } maxGreen The maximum green value, in [0, 255].
   * @param { number } maxBlue The maximum blue value, in [0, 255].
   */
  subtractThresholdColorsMinMaxAllFramesRGB: function (animationName, minThreshold, minRed, minGreen, minBlue, maxThreshold, maxRed, maxGreen, maxBlue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
      let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let oldColor = colors[i];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if (red != 0 ||
            green != 0 ||
            blue != 0) {
            if (red <= minThreshold &&
              green <= minThreshold &&
              blue <= minThreshold) {
              colors[i] = ChromaAnimation.subtractColor(oldColor, minColor);
            }
            if (red >= maxThreshold &&
              green >= maxThreshold &&
              blue >= maxThreshold) {
              colors[i] = ChromaAnimation.subtractColor(oldColor, maxColor);
            }
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let minColor = ChromaAnimation.getRGB(minRed, minGreen, minBlue);
      let maxColor = ChromaAnimation.getRGB(maxRed, maxGreen, maxBlue);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let oldColor = row[j];
            let red = oldColor & 0xFF;
            let green = (oldColor & 0xFF00) >> 8;
            let blue = (oldColor & 0xFF0000) >> 16;
            if (red != 0 ||
              green != 0 ||
              blue != 0) {
              if (red <= minThreshold &&
                green <= minThreshold &&
                blue <= minThreshold) {
                row[j] = ChromaAnimation.subtractColor(oldColor, minColor);
              }
              if (red >= maxThreshold &&
                green >= maxThreshold &&
                blue >= maxThreshold) {
                row[j] = ChromaAnimation.subtractColor(oldColor, maxColor);
              }
            }
          }
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation,
   * if the color is less than a given threshold component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } redThreshold The red threshold value, in [0, 255].
   * @param { number } greenThreshold The green threshold value, in [0, 255].
   * @param { number } blueThreshold The blue threshold value, in [0, 255].
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  fillThresholdRGBColorsAllFramesRGB: function (animationName, redThreshold, greenThreshold, blueThreshold, red, green, blue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    let color = ChromaAnimation.getRGB(red, green, blue);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let oldColor = row[j];
          let red = oldColor & 0xFF;
          let green = (oldColor & 0xFF00) >> 8;
          let blue = (oldColor & 0xFF0000) >> 16;
          if ((red != 0 ||
            green != 0 ||
            blue != 0) &&
            red <= redThreshold &&
            green <= greenThreshold &&
            blue <= blueThreshold) {
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Sets every color for a single frame of an animation to random colors.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   */
  fillRandomColors: function (animationName, frameId) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let red = Math.floor(Math.random() * 256) % 256;
          let green = Math.floor(Math.random() * 256) % 256;
          let blue = Math.floor(Math.random() * 256) % 256;
          let color = red | (green << 8) | (blue << 16);
          row[j] = color;
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation to random colors.
   * @param { string } animationName The name of the animation.
   */
  fillRandomColorsAllFrames: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let red = Math.floor(Math.random() * 256) % 256;
          let green = Math.floor(Math.random() * 256) % 256;
          let blue = Math.floor(Math.random() * 256) % 256;
          let color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let red = Math.floor(Math.random() * 256) % 256;
            let green = Math.floor(Math.random() * 256) % 256;
            let blue = Math.floor(Math.random() * 256) % 256;
            let color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Sets every color for a single frame of an animation to random greyscale colors.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   */
  fillRandomColorsBlackAndWhite: function (animationName, frameId) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let c = Math.floor(Math.random() * 256) % 256;
          let red = c;
          let green = c;
          let blue = c;
          let color = red | (green << 8) | (blue << 16);
          row[j] = color;
        }
      }
    }
  },
  /**
   * Sets every color for every frame of an animation to random greyscale colors.
   * @param { string } animationName The name of the animation.
   */
  fillRandomColorsBlackAndWhiteAllFrames: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }
    //console.log(animation.Frames);
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let c = Math.floor(Math.random() * 256) % 256;
          let red = c;
          let green = c;
          let blue = c;
          let color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let c = Math.floor(Math.random() * 256) % 256;
            let red = c;
            let green = c;
            let blue = c;
            let color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Inverts every color for every frame of an animation.
   * @param { string } animationName The name of the animation.
   */
  invertColorsAllFrames: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (frames.length == 0) {
      return;
    }

    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          let red = 255 - (color & 0xFF);
          let green = 255 - ((color & 0xFF00) >> 8);
          let blue = 255 - ((color & 0xFF0000) >> 16);
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            let red = 255 - (color & 0xFF);
            let green = 255 - ((color & 0xFF00) >> 8);
            let blue = 255 - ((color & 0xFF0000) >> 16);
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Duplicates a frame at a given frame index and inserts it at another frame index.
   * @param { string } animationName The name of the animation.
   * @param { number } sourceFrame The source frame index.
   * @param { number } targetFrame The destination frame index.
   */
  insertFrame: function (animationName, sourceFrame, targetFrame) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('insertFrame', 'Frame length is zero!', animationName)
      return;
    }
    if (sourceFrame < 0 ||
      sourceFrame >= animation.Frames.length) {
      return;
    }
    let copyFrame = animation.Frames[sourceFrame];
    let frames = [];
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < animation.Frames.length; ++frameId) {
        let oldFrame = animation.Frames[frameId];
        if (frameId == targetFrame) {
          let frame = new ChromaAnimationFrame1D();
          frame.Colors = new Array(maxLeds);
          for (let i = 0; i < maxLeds; ++i) {
            frame.Colors[i] = copyFrame.Colors[i];
          }
          frame.Duration = copyFrame.Duration;
          frames.push(frame);
        }
        frames.push(oldFrame);
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < animation.Frames.length; ++frameId) {
        let oldFrame = animation.Frames[frameId];
        if (frameId == targetFrame) {
          let frame = new ChromaAnimationFrame2D(animation.Device);
          frame.Colors = new Array(maxRow);
          for (let i = 0; i < maxRow; ++i) {
            frame.Colors[i] = new Array(maxColumn);
            for (let j = 0; j < maxColumn; ++j) {
              frame.Colors[i][j] = copyFrame.Colors[i][j];
            }
          }
          frame.Duration = copyFrame.Duration;
          frames.push(frame);
        }
        frames.push(oldFrame);
      }
    }
    animation.Frames = frames;
  },
  /**
   * Duplicates a frame at a given frame index a given number of times.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } delay The number of times to duplicate.
   */
  insertDelay: function (animationName, frameId, delay) {
    for (let i = 0; i < delay; ++i) {
      this.insertFrame(animationName, frameId, frameId);
    }
  },
  /**
   * Copies every frame from one animation to the end of another.
   * @param { string } sourceAnimationName The name of the source animation.
   * @param { string } targetAnimationName The name of the target animation.
   */
  appendAllFrames: function (sourceAnimationName, targetAnimationName) {
    let sourceAnimation = this.LoadedAnimations[sourceAnimationName];
    if (sourceAnimation == undefined) {
      return;
    }
    let targetAnimation = this.LoadedAnimations[targetAnimationName];
    if (targetAnimation == undefined) {
      return;
    }
    this.stopAnimation(targetAnimationName);
    if (sourceAnimation.Frames.length == 0) {
      console.error('appendAllFrames', 'Source Frame length is zero!', animationName)
      return;
    }
    let sourceFrames = sourceAnimation.Frames;
    let targetFrames = targetAnimation.Frames;
    let frameCount = sourceFrames.length;
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let sourceFrame = sourceFrames[frameId];
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = sourceFrame.Colors[i];
        }
        frame.Duration = sourceFrame.Duration;
        targetFrames.push(frame);
      }
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let sourceFrame = sourceFrames[frameId];
        let frame = new ChromaAnimationFrame2D(sourceAnimation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = sourceFrame.Colors[i][j];
          }
        }
        frame.Duration = sourceFrame.Duration;
        targetFrames.push(frame);
      }
    }
  },
  /**
   * Duplicates the first frame a given number of times.
   * @param { string } animationName The name of the animation.
   * @param { number } frameCount The number of times to duplicate.
   */
  duplicateFirstFrame: function (animationName, frameCount) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('duplicateFirstFrame', 'Frame length is zero!', animationName)
      return;
    }
    let firstFrame = animation.Frames[0];
    let frames = [];
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = firstFrame.Colors[i];
        }
        frame.Duration = firstFrame.Duration;
        frames.push(frame);
      }
      animation.Frames = frames;
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let frame = new ChromaAnimationFrame2D(animation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = firstFrame.Colors[i][j];
          }
        }
        frame.Duration = firstFrame.Duration;
        frames.push(frame);
      }
      animation.Frames = frames;
    }
  },
  /**
   * Duplicates every frame.
   * @param { string } animationName The name of the animation.
   */
  duplicateFrames: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('duplicateFrames', 'Frame length is zero!', animationName)
      return;
    }
    let frames = [];
    let frameCount = animation.Frames.length;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        for (let d = 0; d < 2; ++d) {
          let copyFrame = animation.Frames[frameId];
          let frame = new ChromaAnimationFrame1D();
          frame.Colors = new Array(maxLeds);
          for (let i = 0; i < maxLeds; ++i) {
            frame.Colors[i] = copyFrame.Colors[i];
          }
          frame.Duration = copyFrame.Duration;
          frames.push(frame);
        }
      }
      animation.Frames = frames;
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        for (let d = 0; d < 2; ++d) {
          let copyFrame = animation.Frames[frameId];
          let frame = new ChromaAnimationFrame2D(animation.Device);
          frame.Colors = new Array(maxRow);
          for (let i = 0; i < maxRow; ++i) {
            frame.Colors[i] = new Array(maxColumn);
            for (let j = 0; j < maxColumn; ++j) {
              frame.Colors[i][j] = copyFrame.Colors[i][j];
            }
          }
          frame.Duration = copyFrame.Duration;
          frames.push(frame);
        }
      }
    }
    animation.Frames = frames;
  },
  /**
   * Duplicates every frame, starting from the end.
   * @param { string } animationName The name of the animation.
   */
  duplicateMirrorFrames: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('duplcateMirrorFrames', 'Frame length is zero!', animationName)
      return;
    }
    let frames = [];
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      let frameCount = animation.Frames.length;
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let copyFrame = animation.Frames[frameId];
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = copyFrame.Colors[i];
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
      for (let frameId = frameCount - 1; frameId >= 0; --frameId) {
        let copyFrame = animation.Frames[frameId];
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = copyFrame.Colors[i];
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
      animation.Frames = frames;
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      let frameCount = animation.Frames.length;
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let copyFrame = animation.Frames[frameId];
        let frame = new ChromaAnimationFrame2D(animation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = copyFrame.Colors[i][j];
          }
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
      for (let frameId = frameCount - 1; frameId >= 0; --frameId) {
        let copyFrame = animation.Frames[frameId];
        let frame = new ChromaAnimationFrame2D(animation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = copyFrame.Colors[i][j];
          }
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
      animation.Frames = frames;
    }
  },
  /**
   * Copies an animation.
   * @param { string } animationName The name of the animation.
   * @param { string } newAnimationName The name of the new animation.
   */
  copyAnimation: function (animationName, newAnimationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.Frames.length == 0) {
      console.error('copyAnimation', 'Frame length is zero!', animationName)
      return;
    }
    let frames = [];
    let frameCount = animation.Frames.length;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let copyFrame = animation.Frames[frameId];
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = copyFrame.Colors[i];
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
      let newAnimation = new ChromaAnimation1D();
      newAnimation.Name = newAnimationName;
      newAnimation.Device = animation.Device;
      newAnimation.DeviceType = animation.DeviceType;
      newAnimation.Frames = frames;
      this.LoadedAnimations[newAnimationName] = newAnimation;
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let copyFrame = animation.Frames[frameId];
        let frame = new ChromaAnimationFrame2D(animation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = copyFrame.Colors[i][j];
          }
        }
        switch (animation.Device) {
          case EChromaSDKDevice2DEnum.DE_Keyboard:
          case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
            let keysMaxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
            let keysMaxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
            frame.Keys = new Array(keysMaxRow);
            for (let i = 0; i < keysMaxRow; ++i) {
              frame.Keys[i] = new Array(keysMaxColumn);
              for (let j = 0; j < keysMaxColumn; ++j) {
                frame.Keys[i][j] = copyFrame.Keys[i][j];
              }
            }
            break;
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
      let newAnimation = new ChromaAnimation2D();
      newAnimation.Name = newAnimationName;
      newAnimation.Device = animation.Device;
      newAnimation.DeviceType = animation.DeviceType;
      newAnimation.Frames = frames;
      newAnimation.UseChromaCustom = animation.UseChromaCustom;
      this.LoadedAnimations[newAnimationName] = newAnimation;
    }
  },
  /**
   * Copies every frame from one animation to another.
   * @param { ChromaAnimation1D | ChromaAnimation2D } sourceAnimation The source animation.
   * @param { ChromaAnimation1D | ChromaAnimation2D } destinationAnimation The destination animation.
   */
  copyAnimationFrames: function (sourceAnimation, destinationAnimation) {
    if (!sourceAnimation || !destinationAnimation) {
      return;
    }
    if (sourceAnimation.Frames.length == 0) {
      console.error('copyAnimationFrames', 'Frame length is zero!', sourceAnimation.Name)
      return;
    }
    let frames = [];
    let frameCount = sourceAnimation.Frames.length;
    if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(sourceAnimation.Device);
      //console.log(sourceAnimation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let copyFrame = sourceAnimation.Frames[frameId];
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = copyFrame.Colors[i];
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
      destinationAnimation.Device = sourceAnimation.Device;
      destinationAnimation.DeviceType = sourceAnimation.DeviceType;
      destinationAnimation.Frames = frames;
    } else if (sourceAnimation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(sourceAnimation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(sourceAnimation.Device);
      //console.log(sourceAnimation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let copyFrame = sourceAnimation.Frames[frameId];
        let frame = new ChromaAnimationFrame2D(sourceAnimation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = copyFrame.Colors[i][j];
          }
        }
        switch (sourceAnimation.Device) {
          case EChromaSDKDevice2DEnum.DE_Keyboard:
          case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
            let keysMaxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
            let keysMaxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
            frame.Keys = new Array(keysMaxRow);
            for (let i = 0; i < keysMaxRow; ++i) {
              frame.Keys[i] = new Array(keysMaxColumn);
              for (let j = 0; j < keysMaxColumn; ++j) {
                frame.Keys[i][j] = copyFrame.Keys[i][j];
              }
            }
            break;
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
      destinationAnimation.Device = sourceAnimation.Device;
      destinationAnimation.DeviceType = sourceAnimation.DeviceType;
      destinationAnimation.Frames = frames;
    }
  },
  /**
   * Converts an animation for a new device.
   * @param { string } animationName The name of the animation.
   * @param { string } newAnimationName The name of the new converted animation.
   * @param { number } newDeviceType The EChromaSDKDeviceTypeEnum.
   * @param { number } newDevice The EChromaSDKDevice1DEnum or EChromaSDKDevice2DEnum.
   * @returns The new converted animation, or undefined.
   */
  convertAnimation: function (animationName, newAnimationName, newDeviceType, newDevice) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.Frames.length == 0) {
      console.error('convertAnimation', 'Frame length is zero!', animationName)
      return;
    }
    ChromaAnimation.closeAnimation(newAnimationName);
    let frames = [];
    let frameCount = animation.Frames.length;

    // this only converts keyboard frames to *.*
    let keyboardMaxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let keyboardMaxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);

    if (newDeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let copyFrame = animation.Frames[frameId];
        let maxLeds = ChromaAnimation.getMaxLeds(newDevice);
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < keyboardMaxRow; ++i) {
          if (i >= 1) {
            continue;
          }
          for (let j = 0; j < keyboardMaxColumn; ++j) {
            if (j >= maxLeds) {
              continue;
            }
            frame.Colors[j] = copyFrame.Colors[i][j];
          }
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }

      let newAnimation = new ChromaAnimation1D();
      newAnimation.Name = newAnimationName;
      newAnimation.Device = newDevice;
      newAnimation.DeviceType = newDeviceType;
      newAnimation.Frames = frames;
      this.LoadedAnimations[newAnimationName] = newAnimation;
      return newAnimation;
    } else if (newDeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let copyFrame = animation.Frames[frameId];
        let maxRow = ChromaAnimation.getMaxRow(newDevice);
        let maxColumn = ChromaAnimation.getMaxColumn(newDevice);
        let frame = new ChromaAnimationFrame2D(newAnimation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < keyboardMaxRow || i < maxRow; ++i) {
          if (i >= maxRow) {
            continue;
          }
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < keyboardMaxColumn || j < maxColumn; ++j) {
            if (j >= maxColumn) {
              continue;
            }
            let color = undefined;
            if (i >= keyboardMaxRow ||
              j >= keyboardMaxColumn) {
              color = 0;
            } else {
              color = copyFrame.Colors[i][j];
            }
            frame.Colors[i][j] = color;
          }
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }

      let newAnimation = new ChromaAnimation2D();
      newAnimation.Name = newAnimationName;
      newAnimation.Device = newDevice;
      newAnimation.DeviceType = newDeviceType;
      newAnimation.Frames = frames;
      this.LoadedAnimations[newAnimationName] = newAnimation;
      return newAnimation;
    }
  },
  /**
   * Creates an animation for a device.
   * @param { string } animationName The name of the animation.
   * @param { number } deviceType The EChromaSDKDeviceTypeEnum.
   * @param { number } device The EChromaSDKDevice1DEnum or EChromaSDKDevice2DEnum.
   * @returns The created animation.
   */
  createAnimation: function (animationName, deviceType, device) {
    this.closeAnimation(animationName);
    let frames = [];
    let frameCount = 1;
    if (deviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = 0;
        }
        frame.Duration = 0.033;
        frames.push(frame);
      }
      let newAnimation = new ChromaAnimation1D();
      newAnimation.Name = animationName;
      newAnimation.Device = device;
      newAnimation.DeviceType = deviceType;
      newAnimation.Frames = frames;
      this.LoadedAnimations[animationName] = newAnimation;
      return newAnimation;
    } else if (deviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(device);
      let maxColumn = ChromaAnimation.getMaxColumn(device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let frame = new ChromaAnimationFrame2D(device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = 0;
          }
        }
        frame.Duration = 0.033;
        frames.push(frame);
      }
      let newAnimation = new ChromaAnimation2D();
      newAnimation.Name = animationName;
      newAnimation.Device = device;
      newAnimation.DeviceType = deviceType;
      newAnimation.Frames = frames;
      this.LoadedAnimations[animationName] = newAnimation;
      return newAnimation;
    }
  },
  /**
   * Removes every N frames from an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } n N.
   */
  reduceFrames: function (animationName, n) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('reduceFrames', 'Frame length is zero!', animationName)
      return;
    }
    let frames = [];
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let frameCount = animation.Frames.length;
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        if (frameId % n == 0) {
          continue;
        }
        let copyFrame = animation.Frames[frameId];
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = copyFrame.Colors[i];
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      let frameCount = animation.Frames.length;
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        if (frameId % n == 0) {
          continue;
        }
        let copyFrame = animation.Frames[frameId];
        let frame = new ChromaAnimationFrame2D(animation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = copyFrame.Colors[i][j];
          }
        }
        frame.Duration = copyFrame.Duration;
        frames.push(frame);
      }
    }
    animation.Frames = frames;
  },
  /**
   * Removes a frame from an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } removeFrameId The frame index.
   */
  trimFrame: function (animationName, removeFrameId) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('trimFrame', 'Frame length is zero!', animationName)
      return;
    }
    let frames = [];
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    let frameCount = animation.Frames.length;
    for (let frameId = 0; frameId < frameCount; ++frameId) {
      if (frameId == removeFrameId) {
        continue;
      }
      let frame = animation.Frames[frameId];
      frames.push(frame);
    }
    animation.Frames = frames;
  },
  /**
   * Removes a given number of frames from the start of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } numberOfFrames The number of frames.
   */
  trimStartFrames: function (animationName, numberOfFrames) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('trimStartFrames', 'Frame length is zero!', animationName)
      return;
    }
    //console.log(animation.Frames);
    for (let i = 0; i < numberOfFrames; ++i) {
      this.trimFrame(animationName, 0);
    }
  },
  /**
   * Removes frames after a given frame index from the end of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } lastFrameId The index of the last frame to keep.
   */
  trimEndFrames: function (animationName, lastFrameId) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('trimEndFrames', 'Frame length is zero!', animationName)
      return;
    }
    //console.log(animation.Frames);
    while (lastFrameId >= 0 &&
      (lastFrameId + 1) < animation.Frames.length) {
      this.trimFrame(animationName, animation.Frames.length - 1);
    }
  },
  /**
   * Fade in the start of the animation.
   * @param { string } animationName The name of the animation.
   * @param { number } fade The number of frames to fade.
   */
  fadeStartFrames: function (animationName, fade) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('fadeStartFrames', 'Frame length is zero!', animationName)
      return;
    }
    if (fade <= 0) {
      return;
    }
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < fade; ++frameId) {
      let t = (frameId + 1) / fade;
      this.multiplyIntensity(animationName, frameId, t);
    }
  },
  /**
   * Fade out the end of the animation.
   * @param { string } animationName The name of the animation.
   * @param { number } fade The number of frames to fade.
   */
  fadeEndFrames: function (animationName, fade) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    if (animation.Frames.length == 0) {
      console.error('fadeEndFrames', 'Frame length is zero!', animationName)
      return;
    }
    if (fade <= 0) {
      return;
    }
    //console.log(animation.Frames);
    for (let offset = 0; offset < fade; ++offset) {
      let frameId = animation.Frames.length - 1 - offset;
      let t = (offset + 1) / fade;
      this.multiplyIntensity(animationName, frameId, t);
    }
  },
  /**
   * Adds a given number of frames to the end of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } frameCount The number of frames.
   * @param { number } duration The duration of each frame.
   * @param { Color } color The color.
   */
  makeBlankFrames: function (animationName, frameCount, duration, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    this.stopAnimation(animationName);
    let frames = [];
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let frame = new ChromaAnimationFrame1D();
        frame.Colors = new Array(maxLeds);
        for (let i = 0; i < maxLeds; ++i) {
          frame.Colors[i] = color;
        }
        frame.Duration = duration;
        frames.push(frame);
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frameCount; ++frameId) {
        let frame = new ChromaAnimationFrame2D(animation.Device);
        frame.Colors = new Array(maxRow);
        for (let i = 0; i < maxRow; ++i) {
          frame.Colors[i] = new Array(maxColumn);
          for (let j = 0; j < maxColumn; ++j) {
            frame.Colors[i][j] = color;
          }
        }
        frame.Duration = duration;
        frames.push(frame);
      }
    }
    animation.Frames = frames;
  },
  /**
   * Adds a given number of frames to the end of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } frameCount The number of frames.
   * @param { number } duration The duration of each frame.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  makeBlankFramesRGB: function (animationName, frameCount, duration, red, green, blue) {
    let color = ChromaAnimation.getRGB(red, green, blue);
    makeBlankFrames(animationName, frameCount, duration, color)
  },
  /**
   * Offsets every color for a single frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } redOffset The red offset, in [0, 255].
   * @param { number } greenOffset The green offset, in [0, 255].
   * @param { number } blueOffset The blue offset, in [0, 255].
   */
  offsetColors: function (animationName, frameId, redOffset, greenOffset, blueOffset) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Offsets every color for a single frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } color The color.
   */
  offsetColorsWithColor: function (animationName, frameId, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let redOffset = (color & 0xFF);
    let greenOffset = (color & 0xFF00) >> 8;
    let blueOffset = (color & 0xFF0000) >> 16;
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          row[j] = color;
        }
      }
    }
  },
  /**
   * Offsets every color for every frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } color The color.
   */
  offsetColorsWithColorAllFrames: function (animationName, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let redOffset = (color & 0xFF);
    let greenOffset = (color & 0xFF00) >> 8;
    let blueOffset = (color & 0xFF0000) >> 16;
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Offsets every color for every frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { number } color The color.
   */
  offsetNonZeroColorsWithColorAllFrames: function (animationName, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let redOffset = (color & 0xFF);
    let greenOffset = (color & 0xFF00) >> 8;
    let blueOffset = (color & 0xFF0000) >> 16;
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          if (color != 0) {
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            colors[i] = color;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            if (color != 0) {
              //console.log('color', color);
              let red = (color & 0xFF);
              let green = (color & 0xFF00) >> 8;
              let blue = (color & 0xFF0000) >> 16;
              red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
              green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
              blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
              color = red | (green << 8) | (blue << 16);
              row[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Subtracts every color for every frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } color The color.
   */
  subtractColorsWithColorAllFrames: function (animationName, color) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let redOffset = (color & 0xFF);
    let greenOffset = (color & 0xFF00) >> 8;
    let blueOffset = (color & 0xFF0000) >> 16;
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          if (color != 0) {
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) - Number(redOffset))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) - Number(greenOffset))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) - Number(blueOffset))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            colors[i] = color;
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            if (color != 0) {
              //console.log('color', color);
              let red = (color & 0xFF);
              let green = (color & 0xFF00) >> 8;
              let blue = (color & 0xFF0000) >> 16;
              red = Math.min(255, Math.max(0, Number(red) - Number(redOffset))) & 0xFF;
              green = Math.min(255, Math.max(0, Number(green) - Number(greenOffset))) & 0xFF;
              blue = Math.min(255, Math.max(0, Number(blue) - Number(blueOffset))) & 0xFF;
              color = red | (green << 8) | (blue << 16);
              row[j] = color;
            }
          }
        }
      }
    }
  },
  /**
   * Offsets every color for every frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } redOffset The red offset, in [0, 255].
   * @param { number } greenOffset The green offset, in [0, 255].
   * @param { number } blueOffset The blue offset, in [0, 255].
   */
  offsetColorsAllFrames: function (animationName, redOffset, greenOffset, blueOffset) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Offsets every color for a single frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } redOffset The red offset, in [0, 255].
   * @param { number } greenOffset The green offset, in [0, 255].
   * @param { number } blueOffset The blue offset, in [0, 255].
   */
  offsetNonZeroColors: function (animationName, frameId, redOffset, greenOffset, blueOffset) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          if (color != 0) {
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Offsets every color for every frame of an animation,
   * if the color is not zero.
   * @param { string } animationName The name of the animation.
   * @param { number } redOffset The red offset, in [0, 255].
   * @param { number } greenOffset The green offset, in [0, 255].
   * @param { number } blueOffset The blue offset, in [0, 255].
   */
  offsetNonZeroColorsAllFrames: function (animationName, redOffset, greenOffset, blueOffset) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          if (color != 0) {
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) + Number(redOffset))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) + Number(greenOffset))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) + Number(blueOffset))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Multiplies every color for a single frame of an animation by a value component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } intensity The multiply value.
   */
  multiplyIntensity: function (animationName, frameId, intensity) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) * Number(intensity))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) * Number(intensity))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) * Number(intensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(intensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(intensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(intensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Converts red, green, and blue values to its 3-byte representation.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   * @returns { Color } The color.
   */
  getRGB(red, green, blue) {
    return (red & 0xFF) | ((green & 0xFF) << 8) | ((blue & 0xFF) << 16);
  },
  /**
   * Retrieves the red value of a 3-byte color.
   * @param { Color } color The color.
   * @returns { number } The red value.
   */
  getRed(color) {
    return (color & 0xFF);
  },
  /**
   * Retrieves the green value of a 3-byte color.
   * @param { Color } color The color.
   * @returns { number } The green value.
   */
  getGreen(color) {
    return (color & 0xFF00) >> 8;
  },
  /**
   * Retrieves the blue value of a 3-byte color.
   * @param { Color } color The color.
   * @returns { number } The blue value.
   */
  getBlue(color) {
    return (color & 0xFF0000) >> 16;
  },
  /**
   * Prints the RGB values of a 3-byte color to the console.
   * @param { Color } color The color.
   */
  debugColor(color) {
    let red = (color & 0xFF);
    let green = (color & 0xFF00) >> 8;
    let blue = (color & 0xFF0000) >> 16;
    console.log('Red', red, 'Green', green, 'Blue', blue);
  },
  /**
   * Multiplies every color for a single frame of an animation by a color component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } colorTint The multiply color.
   */
  multiplyIntensityColor: function (animationName, frameId, colorTint) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let red = (colorTint & 0xFF);
      let green = (colorTint & 0xFF00) >> 8;
      let blue = (colorTint & 0xFF0000) >> 16;
      let redIntensity = red / 255.0;
      let greenIntensity = green / 255.0;
      let blueIntensity = blue / 255.0;
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let red = (colorTint & 0xFF);
      let green = (colorTint & 0xFF00) >> 8;
      let blue = (colorTint & 0xFF0000) >> 16;
      let redIntensity = red / 255.0;
      let greenIntensity = green / 255.0;
      let blueIntensity = blue / 255.0;
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Multiplies every color for every frame of an animation by a color component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } colorTint The multiply color.
   */
  multiplyIntensityColorAllFrames: function (animationName, colorTint) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let red = (colorTint & 0xFF);
      let green = (colorTint & 0xFF00) >> 8;
      let blue = (colorTint & 0xFF0000) >> 16;
      let redIntensity = red / 255.0;
      let greenIntensity = green / 255.0;
      let blueIntensity = blue / 255.0;
      //console.log(animation.Frames);
      for (frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let red = (colorTint & 0xFF);
      let green = (colorTint & 0xFF00) >> 8;
      let blue = (colorTint & 0xFF0000) >> 16;
      let redIntensity = red / 255.0;
      let greenIntensity = green / 255.0;
      let blueIntensity = blue / 255.0;
      //console.log(animation.Frames);
      for (frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Multiplies every color for a single frame of an animation by a color component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  multiplyIntensityRGB: function (animationName, frameId, red, green, blue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }

    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      let redIntensity = red / 255.0;
      let greenIntensity = green / 255.0;
      let blueIntensity = blue / 255.0;
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      let redIntensity = red / 255.0;
      let greenIntensity = green / 255.0;
      let blueIntensity = blue / 255.0;
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Multiplies every color for every frame of an animation by a value component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } intensity The multiply value.
   */
  multiplyIntensityAllFrames: function (animationName, intensity) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) * Number(intensity))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) * Number(intensity))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) * Number(intensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(intensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(intensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(intensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Multiplies every color for every frame of an animation by a color component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  multiplyIntensityAllFramesRGB: function (animationName, red, green, blue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    let redIntensity = red / 255.0;
    let greenIntensity = green / 255.0;
    let blueIntensity = blue / 255.0;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          colors[i] = color;
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Multiplies every color for every frame of an animation by an interpolated color.
   * 
   * The multiplied color is linearly interpolated between the two given colors
   * by the normalized position of the frame in the animation.
   * @param { string } animationName The name of the animation.
   * @param { number } color1 The start color.
   * @param { number } color2 The end color.
   */
  multiplyColorLerpAllFrames: function (animationName, color1, color2) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    let frameCount = frames.length;
    for (let frameId = 0; frameId < frameCount; ++frameId) {
      let t = (frameId + 1) / frameCount;
      let color = this.lerpColor(color1, color2, t);
      this.multiplyIntensityColor(animationName, frameId, color);
    }
  },
  /**
   * Multiplies every color for a single frame of an animation by an interpolated color.
   * 
   * The multiplied color is linearly interpolated between the two given colors
   * by the average value of the components of color of the original frame.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } color1 The start color.
   * @param { number } color2 The end color.
   */
  multiplyTargetColorLerp: function (animationName, frameId, color1, color2) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF) / 255.0;
          let green = ((color & 0xFF00) >> 8) / 255.0;
          let blue = ((color & 0xFF0000) >> 16) / 255.0;
          let t = (red + green + blue) / 3.0;
          colors[i] = ChromaAnimation.lerpColor(color1, color2, t);
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      if (frameId >= 0 && frameId < frames.length) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF) / 255.0;
            let green = ((color & 0xFF00) >> 8) / 255.0;
            let blue = ((color & 0xFF0000) >> 16) / 255.0;
            let t = (red + green + blue) / 3.0;
            row[j] = ChromaAnimation.lerpColor(color1, color2, t);
          }
        }
      }
    }
  },
  /**
   * Multiplies every color for every frame of an animation by an interpolated color.
   * 
   * The multiplied color is linearly interpolated between the two given colors
   * by the average value of the components of color of the original frame.
   * @param { string } animationName The name of the animation.
   * @param { number } color1 The start color.
   * @param { number } color2 The end color.
   */
  multiplyTargetColorLerpAllFrames: function (animationName, color1, color2) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          //console.log('color', color);
          let red = (color & 0xFF) / 255.0;
          let green = ((color & 0xFF00) >> 8) / 255.0;
          let blue = ((color & 0xFF0000) >> 16) / 255.0;
          let t = (red + green + blue) / 3.0;
          colors[i] = ChromaAnimation.lerpColor(color1, color2, t);
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF) / 255.0;
            let green = ((color & 0xFF00) >> 8) / 255.0;
            let blue = ((color & 0xFF0000) >> 16) / 255.0;
            let t = (red + green + blue) / 3.0;
            row[j] = ChromaAnimation.lerpColor(color1, color2, t);
          }
        }
      }
    }
  },
  /**
   * Multiplies every color for every frame of an animation by an interpolated color,
   * if the color is not zero.
   * 
   * The multiplied color is linearly interpolated between the two given colors
   * by the average value of the components of color of the original frame.
   * @param { string } animationName The name of the animation.
   * @param { number } color1 The start color.
   * @param { number } color2 The end color.
   */
  multiplyNonZeroTargetColorLerpAllFrames: function (animationName, color1, color2) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
      let maxLeds = ChromaAnimation.getMaxLeds(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxLeds; ++i) {
          let color = colors[i];
          if (color != 0) {
            //console.log('color', color);
            let red = (color & 0xFF) / 255.0;
            let green = ((color & 0xFF00) >> 8) / 255.0;
            let blue = ((color & 0xFF0000) >> 16) / 255.0;
            let t = (red + green + blue) / 3.0;
            colors[i] = ChromaAnimation.lerpColor(color1, color2, t);
          }
        }
      }
    } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
      let maxRow = ChromaAnimation.getMaxRow(animation.Device);
      let maxColumn = ChromaAnimation.getMaxColumn(animation.Device);
      //console.log(animation.Frames);
      for (let frameId = 0; frameId < frames.length; ++frameId) {
        let frame = frames[frameId];
        //console.log(frame);
        let colors = frame.Colors;
        for (let i = 0; i < maxRow; ++i) {
          let row = colors[i];
          for (let j = 0; j < maxColumn; ++j) {
            let color = row[j];
            if (color != 0) {
              //console.log('color', color);
              let red = (color & 0xFF) / 255.0;
              let green = ((color & 0xFF00) >> 8) / 255.0;
              let blue = ((color & 0xFF0000) >> 16) / 255.0;
              let t = (red + green + blue) / 3.0;
              row[j] = ChromaAnimation.lerpColor(color1, color2, t);
            }
          }
        }
      }
    }
  },
  /**
   * Copies the red channel of every color for every frame of an animation to the other channels.
   * @param { string } animationName The name of the animation.
   * @param { number } greenIntensity The green multiply value.
   * @param { number } blueIntensity The blue multiply value.
   */
  copyRedChannelAllFrames: function (animationName, greenIntensity, blueIntensity) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          green = Math.min(255, Math.max(0, Number(red) * Number(greenIntensity))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(red) * Number(blueIntensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          row[j] = color;
        }
      }
    }
  },
  /**
   * Copies the green channel of every color for every frame of an animation to the other channels.
   * @param { string } animationName The name of the animation.
   * @param { number } redIntensity The red multiply value.
   * @param { number } blueIntensity The blue multiply value.
   */
  copyGreenChannelAllFrames: function (animationName, redIntensity, blueIntensity) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(green) * Number(redIntensity))) & 0xFF;
          blue = Math.min(255, Math.max(0, Number(green) * Number(blueIntensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          row[j] = color;
        }
      }
    }
  },
  /**
   * Copies the blue channel of every color for every frame of an animation to the other channels.
   * @param { string } animationName The name of the animation.
   * @param { number } redIntensity The red multiply value.
   * @param { number } greenIntensity The green multiply value.
   */
  copyBlueChannelAllFrames: function (animationName, redIntensity, greenIntensity) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          red = Math.min(255, Math.max(0, Number(blue) * Number(redIntensity))) & 0xFF;
          green = Math.min(255, Math.max(0, Number(blue) * Number(greenIntensity))) & 0xFF;
          color = red | (green << 8) | (blue << 16);
          row[j] = color;
        }
      }
    }
  },
  /**
   * Desaturates every color for every frame of an animation.
   * @param { string } animationName The name of the animation.
   */
  desaturateAllFrames: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          //console.log('color', color);
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          let gray = Math.sqrt(red * red + green * green + blue * blue);
          color = gray | (gray << 8) | (gray << 16);
          row[j] = color;
        }
      }
    }
  },
  /**
   * Multiplies the color of a given keyboard key for a single frame of an animation by a value component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } frameId The frame index.
   * @param { number } key The RZKEY.
   * @param { number } intensity The multiply value.
   */
  multiplyIntensityKey: function (animationName, frameId, key, intensity) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    if (frameId >= 0 && frameId < frames.length) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          if (getHighByte(key) == i &&
            getLowByte(key) == j) {

            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(intensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(intensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(intensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Multiplies the color of a given keyboard key for every frame of an animation by a value component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } key The RZKEY.
   * @param { number } intensity The multiply value.
   */
  multiplyIntensityKeyAllFrames: function (animationName, key, intensity) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          if (getHighByte(key) == i &&
            getLowByte(key) == j) {

            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(intensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(intensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(intensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Multiplies the color of a given keyboard key for every frame of an animation by a color component-wise.
   * @param { string } animationName The name of the animation.
   * @param { number } key The RZKEY.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  multiplyIntensityKeyAllFramesRGB: function (animationName, key, red, green, blue) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    let redIntensity = red / 255.0;
    let greenIntensity = green / 255.0;
    let blueIntensity = blue / 255.0;
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          if (getHighByte(key) == i &&
            getLowByte(key) == j) {

            let color = row[j];
            //console.log('color', color);
            let red = (color & 0xFF);
            let green = (color & 0xFF00) >> 8;
            let blue = (color & 0xFF0000) >> 16;
            red = Math.min(255, Math.max(0, Number(red) * Number(redIntensity))) & 0xFF;
            green = Math.min(255, Math.max(0, Number(green) * Number(greenIntensity))) & 0xFF;
            blue = Math.min(255, Math.max(0, Number(blue) * Number(blueIntensity))) & 0xFF;
            color = red | (green << 8) | (blue << 16);
            row[j] = color;
          }
        }
      }
    }
  },
  /**
   * Sets the custom color flag for every frame in an animation.
   * @param { string } animationName The name of the animation.
   */
  setChromaCustomColorAllFrames: function (animationName) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
      animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
      return;
    }
    let frames = animation.Frames;
    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      //console.log(frame);
      let colors = frame.Colors;
      for (let i = 0; i < maxRow; ++i) {
        let row = colors[i];
        for (let j = 0; j < maxColumn; ++j) {
          let color = row[j];
          //console.log('color', color);
          let customFlag = 0x01;
          let red = (color & 0xFF);
          let green = (color & 0xFF00) >> 8;
          let blue = (color & 0xFF0000) >> 16;
          color = red | (green << 8) | (blue << 16) | (customFlag << 24);
          row[j] = color;
        }
      }
    }
  },
  /**
   * Sets the custom flag for an animation.
   * @param { string } animationName The name of the animation.
   * @param { boolean } flag The flag.
   */
  setChromaCustomFlag: function (animationName, flag) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D) {
      return;
    }
    switch (animation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        break;
      default:
        return;
    }
    animation.setChromaCustomFlag(flag);
  },
  /**
   * Plays an animation for multiple devices.
   * @param { string } animationName The name of the animations, without the _{DEVICE} suffix.
   * @param { boolean } loop Whether to loop the animation.
   * @param { (anim: ChromaAnimation1D | ChromaAnimation2D, colors: Color[]) => void } frameCallback The callback to call once per frame.
   */
  playComposite: function (animationName, loop, frameCallback) {
    if (chromaSDK == undefined) {
      setTimeout(function () { ChromaAnimation.playComposite(animationName, loop); }, 100);
      return;
    }
    this.playAnimation(animationName + "_ChromaLink.chroma", loop, frameCallback);
    this.playAnimation(animationName + "_Headset.chroma", loop, frameCallback);
    this.playAnimation(animationName + "_Keyboard.chroma", loop, frameCallback);
    this.playAnimation(animationName + "_Keypad.chroma", loop, frameCallback);
    this.playAnimation(animationName + "_Mouse.chroma", loop, frameCallback);
    this.playAnimation(animationName + "_Mousepad.chroma", loop, frameCallback);
  },
  /**
   * Sets the duration for every frame of an animation.
   * @param { string } animationName The name of the animation.
   * @param { number } duration The duration of each frame.
   * @returns 
   */
  overrideFrameDuration: function (animationName, duration) {
    let animation = this.LoadedAnimations[animationName];
    if (animation == undefined) {
      return;
    }
    let frames = animation.Frames;
    //console.log(animation.Frames);
    for (let frameId = 0; frameId < frames.length; ++frameId) {
      let frame = frames[frameId];
      frame.Duration = duration;
    }
  },
  /**
   * Stops an animation for multiple devices.
   * @param { string } animationName The name of the animations, without the _{DEVICE} suffix.
   */
  stopComposite: function (animationName) {
    if (chromaSDK == undefined) {
      setTimeout(function () { ChromaAnimation.stopComposite(animationName, loop); }, 100);
      return;
    }
    this.stopAnimation(animationName + "_ChromaLink.chroma");
    this.stopAnimation(animationName + "_Headset.chroma");
    this.stopAnimation(animationName + "_Keyboard.chroma");
    this.stopAnimation(animationName + "_KeyboardExtended.chroma");
    this.stopAnimation(animationName + "_Keypad.chroma");
    this.stopAnimation(animationName + "_Mouse.chroma");
    this.stopAnimation(animationName + "_Mousepad.chroma");
  },
  /**
   * Sets a static color effect for a device.
   * @param { number } device The EChromaSDKDeviceEnum.
   * @param { Color } color The color.
   */
  staticColor: function (device, color) {
    if (chromaSDK == undefined) {
      setTimeout(function () { ChromaAnimation.staticColor(device, color); }, 100);
      return;
    }
    this.stopByAnimationType(device);
    switch (device) {
      case EChromaSDKDeviceEnum.DE_ChromaLink:
        chromaSDK.createChromaLinkEffect("CHROMA_STATIC", color);
        break;
      case EChromaSDKDeviceEnum.DE_Headset:
        chromaSDK.createHeadsetEffect("CHROMA_STATIC", color);
        break;
      case EChromaSDKDeviceEnum.DE_Keyboard:
      case EChromaSDKDeviceEnum.DE_KeyboardExtended:
        chromaSDK.createKeyboardEffect("CHROMA_STATIC", color);
        break;
      case EChromaSDKDeviceEnum.DE_Keypad:
        chromaSDK.createKeypadEffect("CHROMA_STATIC", color);
        break;
      case EChromaSDKDeviceEnum.DE_Mouse:
        chromaSDK.createMouseEffect("CHROMA_STATIC", color);
        break;
      case EChromaSDKDeviceEnum.DE_Mousepad:
        chromaSDK.createMousematEffect("CHROMA_STATIC", color);
        break;
    }
  },
  /**
   * Sets a static color effect for every device.
   * @param { Color } color The color.
   */
  staticColorAll: function (color) {
    this.staticColor(EChromaSDKDeviceEnum.DE_ChromaLink, color);
    this.staticColor(EChromaSDKDeviceEnum.DE_Headset, color);
    this.staticColor(EChromaSDKDeviceEnum.DE_Keyboard, color);
    this.staticColor(EChromaSDKDeviceEnum.DE_Keypad, color);
    this.staticColor(EChromaSDKDeviceEnum.DE_Mouse, color);
    this.staticColor(EChromaSDKDeviceEnum.DE_Mousepad, color);
  },
  /**
   * Sets a custom color effect for a device.
   * @param { number } device The EChromaSDKDeviceEnum.
   * @param { Color[] } colors The colors.
   * @param { RZKEY[] } keys The RZKEYs.
   */
  custom: function (device, colors, keys) {
    if (chromaSDK == undefined) {
      setTimeout(function () {
        ChromaAnimation.custom(device, colors, keys);
      }, 100);
      return;
    }
    this.stopByAnimationType(device);
    switch (device) {
      case EChromaSDKDeviceEnum.DE_ChromaLink:
        chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", colors);
        break;
      case EChromaSDKDeviceEnum.DE_Headset:
        chromaSDK.createHeadsetEffect("CHROMA_CUSTOM", colors);
        break;
      case EChromaSDKDeviceEnum.DE_Keyboard:
        chromaSDK.createKeyboardEffect("CHROMA_CUSTOM", colors, keys);
        break;
      case EChromaSDKDeviceEnum.DE_Keypad:
        chromaSDK.createKeypadEffect("CHROMA_CUSTOM", colors);
        break;
      case EChromaSDKDeviceEnum.DE_Mouse:
        chromaSDK.createMouseEffect("CHROMA_CUSTOM2", colors);
        break;
      case EChromaSDKDeviceEnum.DE_Mousepad:
        chromaSDK.createMousematEffect("CHROMA_CUSTOM", colors);
        break;
      case EChromaSDKDeviceEnum.DE_KeyboardExtended:
        chromaSDK.createKeyboardEffect("CHROMA_CUSTOM", colors, keys);
        break;
    }
  },
  /**
   * Sets a custom color effect for keyboard.
   * @param { Color[] } colors The colors.
   * @param { RZKEY[] } keys The RZKEYs.
   */
  customKey: function (colors, keys) {
    if (chromaSDK == undefined) {
      setTimeout(function () {
        ChromaAnimation.customKey(colors, keys);
      }, 100);
      return;
    }
    this.stopByAnimationType(EChromaSDKDeviceEnum.DE_Keyboard);
    chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", colors, keys);
  },
  /**
   * Clears the color effect for a device.
   * @param { number } device The EChromaSDKDeviceEnum.
   */
  clear: function (device) {
    if (chromaSDK == undefined) {
      setTimeout(function () { ChromaAnimation.clear(device); }, 100);
      return;
    }
    this.stopByAnimationType(device);
    switch (device) {
      case EChromaSDKDeviceEnum.DE_ChromaLink:
        chromaSDK.createChromaLinkEffect("CHROMA_NONE");
        break;
      case EChromaSDKDeviceEnum.DE_Headset:
        chromaSDK.createHeadsetEffect("CHROMA_NONE");
        break;
      case EChromaSDKDeviceEnum.DE_Keyboard:
        chromaSDK.createKeyboardEffect("CHROMA_NONE");
        break;
      case EChromaSDKDeviceEnum.DE_Keypad:
        chromaSDK.createKeypadEffect("CHROMA_NONE");
        break;
      case EChromaSDKDeviceEnum.DE_Mouse:
        chromaSDK.createMouseEffect("CHROMA_NONE");
        break;
      case EChromaSDKDeviceEnum.DE_Mousepad:
        chromaSDK.createMousematEffect("CHROMA_NONE");
        break;
      case EChromaSDKDeviceEnum.DE_KeyboardExtended:
        chromaSDK.createKeyboardEffect("CHROMA_NONE");
        break;
    }
  },
  /**
   * Clears the color effect for every device.
   */
  clearAll: function () {
    this.clear(EChromaSDKDeviceEnum.DE_ChromaLink);
    this.clear(EChromaSDKDeviceEnum.DE_Headset);
    this.clear(EChromaSDKDeviceEnum.DE_Keyboard);
    this.clear(EChromaSDKDeviceEnum.DE_Keypad);
    this.clear(EChromaSDKDeviceEnum.DE_Mouse);
    this.clear(EChromaSDKDeviceEnum.DE_Mousepad);
    this.clear(EChromaSDKDeviceEnum.DE_KeyboardExtended);
  },
  /**
   * Retrieves the RZKEY at a given row and column.
   * @param { number } row The row.
   * @param { number } col The column.
   */
  getKey: function (row, col) {
    return (row << 8) | col;
  },

  /**
   * Helper function to implement reactive key effect.
   * @param { string } layer The animation name.
   * @param { number } key The RZKEY.
   * @param { number } lineWidth The width of the line.
   * @param { Color } color The color. 
   */
  reactiveKeyEffectAllFrames: function (layer, key, lineWidth, color) {

    let frameCount = ChromaAnimation.getFrameCount(layer);

    let maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    let maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);

    let startRow = getHighByte(key);
    let startColumn = getLowByte(key);

    // console.log('Start Column =', startColumn);
    // console.log('Start Row =', startRow);

    let radius = 0;
    let speed = 25 / frameCount;

    for (let frameIndex = 0; frameIndex < frameCount; ++frameIndex) {
      let stroke = radius;
      for (let t = 0; t < lineWidth; ++t) {
        for (let i = 0; i < 360; ++i) {
          let angle = i * Math.PI / 180;
          let r = Math.floor(startRow + stroke * Math.sin(angle));
          let c = Math.floor(startColumn + stroke * Math.cos(angle));
          if (r >= 0 && r < maxRow &&
            c >= 0 && c < maxColumn) {
            let rkey = ChromaAnimation.getKey(r, c);
            ChromaAnimation.setKeyColor(layer, frameIndex, rkey, color);
          }
        }
        stroke += speed;
      }
      radius += speed;
    }
  },

  /**
   * Helper function to implement reactive key effect.
   * @param { string } layer The animation name.
   * @param { number } key The RZKEY.
   * @param { number } lineWidth The width of the line.
   * @param { number } red The red value, in [0, 255].
   * @param { number } green The green value, in [0, 255].
   * @param { number } blue The blue value, in [0, 255].
   */
  reactiveKeyEffectAllFramesRGB: function (layer, key, lineWidth, red, green, blue) {
    let color = ChromaAnimation.getRGB(red, green, blue);
    reactiveKeyEffectAllFrames(layer, key, lineWidth, color);
  }
};

// Call update frame once to initialise everything
ChromaAnimation.updateFrame();

class ChromaAnimation1D {
  /** @type { string } */
  Name;
  /**
   * EChromaSDKDevice1DEnum.
   * @type { number }
   */
  Device;
  /** @type { ChromaAnimationFrame1D[] } */
  Frames = [];
  /** @type { boolean } */
  Loop = true;
  /** @type { number } */
  FrameTime = 0;
  /** @type { ((anim: ChromaAnimation1D | ChromaAnimation2D, colors: Color[]) => void) | undefined } */
  FrameCallback = undefined;

  /**
   * EChromaSDKDeviceTypeEnum.
   * @type { number }
   */
  DeviceType = EChromaSDKDeviceTypeEnum.DE_1D;

  /** @type { number } */
  CurrentIndex = 0;

  /** @type { boolean } */
  IsPlaying = false;

  /**
   * Opens an animation.
   * @param { Array } arrayBuffer The data buffer.
   * @param { number } readIndex The starting index.
   */
  openAnimation(arrayBuffer, readIndex) {

    let readSize = 1;
    let device = new Uint8Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
    readIndex += readSize;
    //console.log('device:', device);
    this.Device = device;

    readSize = 4;
    let frameCount = new Uint32Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
    readIndex += readSize;
    //console.log('frameCount:', frameCount);

    let maxLeds = ChromaAnimation.getMaxLeds(device);
    //console.log('maxLeds:', maxLeds);

    let frames = [];

    for (let index = 0; index < frameCount; ++index) {

      let frame = new ChromaAnimationFrame1D();

      readSize = Float32Array.BYTES_PER_ELEMENT;
      let duration = new Float32Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
      readIndex += readSize;

      if (duration < 0.033) {
        duration = 0.033;
      }

      frame.Duration = duration;

      //console.log('Frame '+index+': duration='+duration);

      readSize = 4 * maxLeds;
      let colors = new Uint32Array(arrayBuffer.slice(readIndex, readIndex + readSize));
      readIndex += readSize;
      //console.log(colors);

      frame.Colors = new Array(maxLeds);
      for (let i = 0; i < maxLeds; ++i) {
        let color = colors[i];
        frame.Colors[i] = color;
      }

      frames.push(frame);
    }

    this.Frames = frames;
  }
  /**
   * Serializes an animation to a file blob.
   * @returns The file blob.
   */
  saveAnimation() {

    let device = this.Device;
    let maxLeds = ChromaAnimation.getMaxLeds(device);
    let frames = this.Frames;
    let frameCount = frames.length;

    let writeArrays = [];


    var writeArray = new Uint32Array(1);
    let version = 1;
    writeArray[0] = version;
    writeArrays.push(writeArray.buffer);
    //console.log('version:', version);


    var writeArray = new Uint8Array(1);
    let deviceType = this.DeviceType;
    writeArray[0] = deviceType;
    writeArrays.push(writeArray.buffer);
    //console.log('deviceType:', deviceType);


    var writeArray = new Uint8Array(1);
    writeArray[0] = device;
    writeArrays.push(writeArray.buffer);
    //console.log('device:', device);


    var writeArray = new Uint32Array(1);
    writeArray[0] = frameCount;
    writeArrays.push(writeArray.buffer);
    //console.log('frameCount:', frameCount);

    for (let index = 0; index < frameCount; ++index) {

      let frame = frames[index];

      var writeArray = new Float32Array(1);
      let duration = frame.Duration;
      if (duration < 0.033) {
        duration = 0.033;
      }
      writeArray[0] = duration;
      writeArrays.push(writeArray.buffer);

      //console.log('Frame', index, 'duration', duration);

      var writeArray = new Uint32Array(maxLeds);
      for (let i = 0; i < maxLeds; ++i) {
        let color = frame.Colors[i];
        writeArray[i] = color;
      }
      writeArrays.push(writeArray.buffer);
    }

    let blob = new Blob(writeArrays, { type: 'application/octet-stream' });

    return blob;
  }
  /**
   * Retrieves the number of frames.
   * @returns The number of frames.
   */
  getFrameCount() {
    return this.Frames.length;
  }
  /**
   * Retrieves the current frame.
   * @returns The current frame, or undefined if the current index is out of range.
   */
  getFrame() {
    if (this.CurrentIndex < this.Frames.length) {
      return this.Frames[this.CurrentIndex];
    } else {
      return undefined;
    }
  }
  /**
   * Retrieves the duration of the current frame.
   * @returns The duration, or 0 if the current index is out of range.
   */
  getDuration() {
    let frame = this.getFrame();
    if (frame != undefined) {
      return frame.Duration;
    } else {
      return 0;
    }
  }
  /**
   * Plays the current frame.
   */
  playFrame() {
    if (this.FrameTime > Date.now()) {
      return;
    }
    if (this.CurrentIndex < this.Frames.length) {
      let duration = this.getDuration();
      //console.log('Play Frame: '+this.CurrentIndex+' of: '+this.Frames.length+' Duration: '+duration);

      if (this.Device == EChromaSDKDevice1DEnum.DE_ChromaLink) {
        chromaSDK.createChromaLinkEffect("CHROMA_CUSTOM", this.getFrame().Colors);
      } else if (this.Device == EChromaSDKDevice1DEnum.DE_Headset) {
        chromaSDK.createHeadsetEffect("CHROMA_CUSTOM", this.getFrame().Colors);
      } else if (this.Device == EChromaSDKDevice1DEnum.DE_Mousepad) {
        chromaSDK.createMousematEffect("CHROMA_CUSTOM", this.getFrame().Colors);
      }

      if (this.FrameCallback != undefined) {
        this.FrameCallback(this, this.getFrame().Colors);
      }

      // schedule next frame
      let refThis = this;
      if (duration < 0.033) {
        duration = 0.033;
      }
      this.FrameTime = Date.now() + Math.floor(duration * 1000);
      ++this.CurrentIndex;
    } else {
      //console.log('Animation complete.');
      if (this.Loop) {
        this.play(this.Loop);
      } else {
        this.stop();
      }
    }
  }
  /**
   * Stops the animation.
   */
  stop() {
    this.IsPlaying = false;
    this.CurrentIndex = 0;
    this.Loop = false;
    if (ChromaAnimation.LoadedAnimations1D[this.Device] == this) {
      ChromaAnimation.LoadedAnimations1D[this.Device] = undefined;
    }
    ChromaAnimation.PlayingAnimations1D[this.Device][this.Name] = undefined;
  }
  /**
   * Retrieves the playing state of the animation.
   * @returns Whether the animation is playing.
   */
  isPlaying() {
    return this.IsPlaying;
  }
  /**
   * Plays the animation.
   * @param { boolean } loop Whether to loop. 
   */
  play(loop) {
    this.stop();
    this.IsPlaying = true;
    ChromaAnimation.stopByAnimationType(ChromaAnimation.getDeviceEnum(this.DeviceType, this.Device));
    ChromaAnimation.LoadedAnimations1D[this.Device] = this;
    ChromaAnimation.PlayingAnimations1D[this.Device][this.Name] = this;
    this.CurrentIndex = 0;
    this.Loop = loop;
    //console.log('play:', this.Name);
    this.playFrame();
  }
};

class ChromaAnimation2D {
  /** @type { string } */
  Name;
  /**
   * EChromaSDKDevice2DEnum.
   * @type { number }
   */
  Device;
  /** @type { ChromaAnimationFrame1D[] } */
  Frames = [];
  /** @type { boolean } */
  Loop = false;
  /** @type { number } */
  FrameTime = 0;
  /** @type { ((anim: ChromaAnimation1D | ChromaAnimation2D, colors: Color[]) => void) | undefined } */
  FrameCallback = undefined;

  /**
   * EChromaSDKDeviceTypeEnum.
   * @type { number }
   */
  DeviceType = EChromaSDKDeviceTypeEnum.DE_2D;

  /** @type { number } */
  CurrentIndex = 0;

  /** @type { boolean } */
  UseChromaCustom = false;

  /** @type { boolean } */
  IsPlaying = false;

  /**
   * Opens an animation from file.
   * @param { Array } arrayBuffer The file buffer.
   * @param { number } readIndex The starting index.
   */
  openAnimation(arrayBuffer, readIndex) {

    let readSize = 1;
    let device = new Uint8Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
    readIndex += readSize;
    //console.log('device:', device);
    this.Device = device;

    readSize = 4;
    let frameCount = new Uint32Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
    readIndex += readSize;
    //console.log('frameCount:', frameCount);

    let maxRow = ChromaAnimation.getMaxRow(device);
    //console.log('maxRow:', maxRow);

    let maxColumn = ChromaAnimation.getMaxColumn(device);
    //console.log('maxColumn:', maxColumn);

    let frames = [];

    for (let index = 0; index < frameCount; ++index) {

      let frame = new ChromaAnimationFrame2D(device);

      readSize = Float32Array.BYTES_PER_ELEMENT;
      let duration = new Float32Array(arrayBuffer.slice(readIndex, readIndex + readSize))[0];
      readIndex += readSize;

      if (duration < 0.033) {
        duration = 0.033;
      }

      frame.Duration = duration;

      //console.log('Frame '+index+': duration='+duration);

      readSize = 4 * maxRow * maxColumn;
      let colors = new Uint32Array(arrayBuffer.slice(readIndex, readIndex + readSize));
      readIndex += readSize;
      //console.log(colors);

      frame.Colors = new Array(maxRow);
      for (let i = 0; i < maxRow; ++i) {
        frame.Colors[i] = new Array(maxColumn);
        for (let j = 0; j < maxColumn; ++j) {
          let color = colors[i * maxColumn + j];
          frame.Colors[i][j] = color;
        }
      }

      frames.push(frame);
    }

    this.Frames = frames;
  }
  /**
   * Serializes an animation to a file blob.
   * @returns The file blob.
   */
  saveAnimation() {

    let device = this.Device;
    let maxRow = ChromaAnimation.getMaxRow(device);
    let maxColumn = ChromaAnimation.getMaxColumn(device);
    let frames = this.Frames;
    let frameCount = frames.length;

    let writeArrays = [];


    var writeArray = new Uint32Array(1);
    let version = 1;
    writeArray[0] = version;
    writeArrays.push(writeArray.buffer);
    //console.log('version:', version);


    var writeArray = new Uint8Array(1);
    let deviceType = this.DeviceType;
    writeArray[0] = deviceType;
    writeArrays.push(writeArray.buffer);
    //console.log('deviceType:', deviceType);


    var writeArray = new Uint8Array(1);
    writeArray[0] = device;
    writeArrays.push(writeArray.buffer);
    //console.log('device:', device);


    var writeArray = new Uint32Array(1);
    writeArray[0] = frameCount;
    writeArrays.push(writeArray.buffer);
    //console.log('frameCount:', frameCount);

    for (let index = 0; index < frameCount; ++index) {

      let frame = frames[index];

      var writeArray = new Float32Array(1);
      let duration = frame.Duration;
      if (duration < 0.033) {
        duration = 0.033;
      }
      writeArray[0] = duration;
      writeArrays.push(writeArray.buffer);

      //console.log('Frame', index, 'duration', duration);

      var writeArray = new Uint32Array(maxRow * maxColumn);
      for (let i = 0; i < maxRow; ++i) {
        for (let j = 0; j < maxColumn; ++j) {
          let color = frame.Colors[i][j];
          writeArray[i * maxColumn + j] = color;
        }
      }
      writeArrays.push(writeArray.buffer);
    }

    let blob = new Blob(writeArrays, { type: 'application/octet-stream' });

    return blob;
  }
  /**
   * Retrieves the number of frames.
   * @returns The number of frames.
   */
  getFrameCount() {
    return this.Frames.length;
  }
  /**
   * Retrieves the current frame.
   * @returns The current frame, or undefined if the current index is out of range.
   */
  getFrame() {
    if (this.CurrentIndex < this.Frames.length) {
      return this.Frames[this.CurrentIndex];
    } else {
      return undefined;
    }
  }
  /**
   * Retrieves the duration of the current frame.
   * @returns The duration, or 0 if the current index is out of range.
   */
  getDuration() {
    const frame = this.getFrame();
    if (frame != undefined) {
      return frame.Duration;
    } else {
      return 0;
    }
  }
  /**
   * Sets the custom flag.
   * @param { boolean } flag The flag.
   */
  setChromaCustomFlag(flag) {
    switch (this.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
      case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
        if (flag == true) {
          this.UseChromaCustom = true;
        } else {
          this.UseChromaCustom = false;
        }
        break;
    }
  }
  /**
   * Plays the current frame.
   */
  playFrame() {
    if (this.FrameTime > Date.now()) {
      return;
    }
    if (this.CurrentIndex < this.Frames.length) {
      let duration = this.getDuration();
      //console.log('Play Frame: '+this.CurrentIndex+' of: '+this.Frames.length+' Duration: '+duration);

      switch (this.Device) {
        case EChromaSDKDevice2DEnum.DE_Keyboard:
          if (this.UseChromaCustom) {
            chromaSDK.createKeyboardEffect("CHROMA_CUSTOM_KEY", this.getFrame().Colors, this.getFrame().Keys);
          } else {
            chromaSDK.createKeyboardEffect("CHROMA_CUSTOM", this.getFrame().Colors);
          }
          break;
        case EChromaSDKDevice2DEnum.DE_KeyboardExtended:
          if (this.UseChromaCustom) {
            chromaSDK.createKeyboardEffect2("CHROMA_CUSTOM2", this.getFrame().Colors, this.getFrame().Keys);
          } else {
            chromaSDK.createKeyboardEffect2("CHROMA_CUSTOM2", this.getFrame().Colors, this.getFrame().Keys);
          }
          break;
        case EChromaSDKDevice2DEnum.DE_Keypad:
          chromaSDK.createKeypadEffect("CHROMA_CUSTOM", this.getFrame().Colors);
          break;
        case EChromaSDKDevice2DEnum.DE_Mouse:
          chromaSDK.createMouseEffect("CHROMA_CUSTOM2", this.getFrame().Colors);
          break;
      }

      if (this.FrameCallback != undefined) {
        this.FrameCallback(this, this.getFrame().Colors);
      }

      // schedule next frame
      let refThis = this;
      if (duration < 0.033) {
        duration = 0.033;
      }
      this.FrameTime = Date.now() + Math.floor(duration * 1000);
      ++this.CurrentIndex;
    } else {
      //console.log('Animation complete.');
      if (this.Loop) {
        this.play(this.Loop);
      } else {
        this.stop();
      }
    }
  }
  /**
   * Stops the animation.
   */
  stop() {
    this.IsPlaying = false;
    this.CurrentIndex = 0;
    this.Loop = false;
    let device = this.Device;
    if (device == EChromaSDKDevice2DEnum.DE_KeyboardExtended) {
      // Keyboard and KeyboardExtended share the same slot, only one can play at the same time
      device = EChromaSDKDevice2DEnum.DE_Keyboard;
    }
    if (ChromaAnimation.LoadedAnimations2D[device] == this) {
      ChromaAnimation.LoadedAnimations2D[device] = undefined;
    }
    ChromaAnimation.PlayingAnimations2D[device][this.Name] = undefined;
  }
  /**
   * Retrieves the playing state of the animation.
   * @returns Whether the animation is playing.
   */
  isPlaying() {
    return this.IsPlaying;
  }
  /**
   * Plays the animation.
   * @param { boolean } loop Whether to loop. 
   */
  play(loop) {
    this.stop();
    this.IsPlaying = true;
    let device = this.Device;
    if (device == EChromaSDKDevice2DEnum.DE_KeyboardExtended) {
      // Keyboard and KeyboardExtended share the same slot, only one can play at the same time
      device = EChromaSDKDevice2DEnum.DE_Keyboard;
    }
    ChromaAnimation.stopByAnimationType(ChromaAnimation.getDeviceEnum(this.DeviceType, device));
    ChromaAnimation.LoadedAnimations2D[device] = this;
    ChromaAnimation.PlayingAnimations2D[device][this.Name] = this;
    this.CurrentIndex = 0;
    this.Loop = loop;
    //console.log('play:', this.Name);
    this.playFrame();
  }
};
