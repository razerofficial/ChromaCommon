/**
 * Chroma SDK client.
 */
function ChromaSDK() { }

ChromaSDK.prototype = {
  initialized: false,
  socket: undefined,
  customInitData: undefined,

  /**
   * Attempts to connect to the Chroma SDK.
   * 
   * Call before using the Chroma SDK.
   */
  init: function () {
    if (this.socket != undefined) {
      return;
    }

    //let url = "wss://chromasdk.io:13339/razer/chromasdk"; // secure port
    let url = "ws://localhost:13337/razer/chromasdk"; // insecure port
    this.socket = new WebSocket(url);

    let data = JSON.stringify({
      "title": "Chroma RGB WebSocket Client",
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

    if (this.customInitData != undefined) {
      data = this.customInitData;
    }

    let refThis = this;
    this.socket.onopen = function (event) {
      console.log('connected to websocket');
      //console.log('sending app info ' + data);
      refThis.initialized = true;
      refThis.socket.send(data);

      /*
      refThis.socket.onmessage = function (event) {
        console.log(event.data);
      }
      */
    };

    this.socket.onclose = function (event) {
      console.log('Connection closed...');
      //return; // _DEBUG_ don't reconnect
      this.socket = undefined;
      if (this.initialized) {
        this.initialized = false;
        setTimeout(function () {
          console.log('Reconnecting...');
          refThis.init();
        }, 1000);
      }

    };

    this.socket.onerror = function (event) {
      console.log('websocket error! ', event);
    };

  },
  /**
   * Shuts down the connection to the Chroma SDK.
   */
  uninit: function () {
    this.initialized = false;
    if (this.socket != undefined) {
      console.log('closing websocket connection');
      this.socket.close();
      this.socket = undefined;
    }
  },
  /**
   * Verifies the connection to the Chroma SDK and reconnects if not connected.
   * @returns Whether the connection was closed.
   */
  reconnectIfNeeded: function () {
    // return false; // _DEBUG_ don't reconnect
    if (this.socket != undefined && this.initialized && this.socket.readyState == WebSocket.CLOSED) {
      console.log('Connection closed...');
      this.uninit();
      let refThis = this;
      setTimeout(function () {
        console.log('Reconnecting...');
        refThis.init();
      }, 1000);
      return true;
    } else {
      return false;
    }
  },
  createKeyboardEffect: function (effect, data, keys) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {

      let token = Date.now();

      let jsonObj;

      switch (effect) {
        case "CHROMA_NONE":
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "token": token });
          break;
        case "CHROMA_CUSTOM":
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "param": data, "token": token });
          break;
        case "CHROMA_STATIC":
          let color = { "color": data };
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "param": color, "token": token });
          break;
        case "CHROMA_CUSTOM_KEY":
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "param": { 'color': data, 'key': keys }, "token": token });
          break;
        case "CHROMA_CUSTOM2":
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "param": { 'color': data, 'key': keys }, "token": token });
          break;
      }

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  createKeyboardEffect2: function (effect, data, keys) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {

      let token = Date.now();

      let jsonObj;

      switch (effect) {
        case "CHROMA_NONE":
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "token": token });
          break;
        case "CHROMA_CUSTOM":
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "param": data, "token": token });
          break;
        case "CHROMA_STATIC":
          let color = { "color": data };
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "param": color, "token": token });
          break;
        case "CHROMA_CUSTOM_KEY":
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "param": { 'color': data, 'key': keys }, "token": token });
          break;
        case "CHROMA_CUSTOM2":
          jsonObj = JSON.stringify({ "endpoint": "keyboard", "effect": effect, "param": { 'color': data, 'key': keys }, "token": token });
          break;
      }

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  createMousematEffect: function (effect, data) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
      let token = Date.now();
      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "endpoint": "mousepad", "effect": effect, "token": token });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "endpoint": "mousepad", "effect": effect, "param": data, "token": token });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "endpoint": "mousepad", "effect": effect, "param": color, "token": token });
      }

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  createMouseEffect: function (effect, data) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
      let token = Date.now();
      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "endpoint": "mouse", "effect": effect, "token": token });
      } else if (effect == "CHROMA_CUSTOM2") {
        jsonObj = JSON.stringify({ "endpoint": "mouse", "effect": effect, "param": data, "token": token });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "endpoint": "mouse", "effect": effect, "param": color, "token": token });
      }

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  createHeadsetEffect: function (effect, data) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
      let token = Date.now();
      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "endpoint": "headset", "effect": effect, "token": token });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "endpoint": "headset", "effect": effect, "param": data, "token": token });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "endpoint": "headset", "effect": effect, "param": color, "token": token });
      }

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  createKeypadEffect: function (effect, data) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
      let token = Date.now();
      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "endpoint": "keypad", "effect": effect, "token": token });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "endpoint": "keypad", "effect": effect, "param": data, "token": token });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "endpoint": "keypad", "effect": effect, "param": color, "token": token });
      }

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  createChromaLinkEffect: function (effect, data) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
      let token = Date.now();
      let jsonObj;

      if (effect == "CHROMA_NONE") {
        jsonObj = JSON.stringify({ "endpoint": "chromalink", "effect": effect, "token": token });
      } else if (effect == "CHROMA_CUSTOM") {
        jsonObj = JSON.stringify({ "endpoint": "chromalink", "effect": effect, "param": data, "token": token });
      } else if (effect == "CHROMA_STATIC") {
        let color = { "color": data };
        jsonObj = JSON.stringify({ "endpoint": "chromalink", "effect": effect, "param": color, "token": token });
      }

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  setEffect: function (id) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
      let jsonObj = JSON.stringify({ "id": id });

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  deleteEffect: function (id) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
      let jsonObj = JSON.stringify({ "id": id });

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  },
  deleteEffectGroup: function (ids) {
    if (this.reconnectIfNeeded()) {
    } else if (this.socket != undefined && this.socket.readyState == WebSocket.OPEN) {
      let jsonObj = ids;

      //console.log('sending data: ' + jsonObj);

      this.socket.send(jsonObj);

      /*
      this.socket.onmessage = function(event) {
          console.log(event.data);
      }
      */
    }
  }
}
var chromaSDK = new ChromaSDK();

