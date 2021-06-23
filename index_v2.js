// browser function to determine tab is hidden
// ref: https://stackoverflow.com/questions/7389328/detect-if-browser-tab-has-focus/46719827#46719827
var browserTabIsVisible = true;
handleTabVisibility = function() {

  // check the visiblility of the page
  var hidden, visibilityState, visibilityChange;

  if (typeof document.hidden !== "undefined") {
      hidden = "hidden", visibilityChange = "visibilitychange", visibilityState = "visibilityState";
  }
  else if (typeof document.mozHidden !== "undefined") {
      hidden = "mozHidden", visibilityChange = "mozvisibilitychange", visibilityState = "mozVisibilityState";
  }
  else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden", visibilityChange = "msvisibilitychange", visibilityState = "msVisibilityState";
  }
  else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden", visibilityChange = "webkitvisibilitychange", visibilityState = "webkitVisibilityState";
  }

  if (typeof document.addEventListener === "undefined" || typeof hidden === "undefined") {
      // not supported
  }
  else {
      document.addEventListener(visibilityChange, function() {
          //console.log('hidden', document[hidden]);
          //console.log('visibilityState: ', document[visibilityState]);

          switch (document[visibilityState]) {
          case "visible":
              // visible
              browserTabIsVisible = true;
              break;
          case "hidden":
              // hidden
              browserTabIsVisible = false;
              break;
          }
      }, false);
  }

};
// end of browser function

var chromaSDK = undefined;
var initialized = false;
var exampleInterval = undefined;
var pageHadFocus = undefined;
var drawInProgress = false;
var maps = {};
var useTint = false;
var tintRed = 255;
var tintGreen = 255;
var tintBlue = 255;
detectWindowFocus = function() {
  if (browserTabIsVisible == true) {
    if (pageHadFocus != true) {
      pageHadFocus = true;
      console.log('page has focus');
    }
  } else {
    if (pageHadFocus == true) {
      ChromaAnimation.stopAll();
      ChromaAnimation.clearAll();
      chromaSDK.uninit();
      pageHadFocus = false;
      initialized = false;
      console.log('page lost focus');
    }
  }
}

findLeds = function(children, collection, className) {
  for (var i = 0; i < children.length; ++i) {
    var child = children[i];
    if (child == undefined) {
      continue;
    }
    //console.log('class', child.getAttribute("class"));
    var childClassName = child.getAttribute("class");
    if (childClassName != undefined) {
      var classes = childClassName.split(" ");
      for (var c = 0; c < classes.length; ++c) {
        if (classes[c] == className) {
          collection.push(child);
          break;
        }
      }
    }
    findLeds(child.children, collection, className);
  }
}

function getHexColor(bgrColor) {
  var red = (bgrColor & 0xFF);
  var green = (bgrColor & 0xFF00) >> 8;
  var blue = (bgrColor & 0xFF0000) >> 16;
  return 'rgb('+red+','+green+','+blue+')';
}

function applyTint(bgrColor) {
  if (useTint) {
    var red = (bgrColor & 0xFF);
    var green = (bgrColor & 0xFF00) >> 8;
    var blue = (bgrColor & 0xFF0000) >> 16;
    var v = Math.max(Math.max(red, green), blue);
    red = 0xFF & Math.floor(v * tintRed / 255);
    green = 0xFF & Math.floor(v * tintGreen / 255);
    blue = 0xFF & Math.floor(v * tintBlue / 255);
    return getRGB(red, green, blue);
  } else {
    return bgrColor;
  }
}

function getMouseColor(colors, led) {
  var i = getHighByte(led);
  var row = colors[i];
  var j = getLowByte(led);
  return getHexColor(row[j]);
}

setupMapChromaLink = function(canvasName, svgObject) {
  if (svgObject == undefined) {
    console.error('canvasChromaLink: SVG Object cannot be accessed!', svgObject.children);
    return;
  }
  if (maps[canvasName] == undefined) {
    maps[canvasName] = {};
  }
  if (maps[canvasName].mapChromaLink != undefined) {
    return; ///already set
  }
  maps[canvasName].mapChromaLink = undefined;
  var leds = [];
  findLeds(svgObject.children, leds, 'led');
  var map = [];
  map.push(leds[4]);
  map.push(leds[0]);
  map.push(leds[1]);
  map.push(leds[2]);
  map.push(leds[3]);
  //console.log('map', map);
  maps[canvasName].mapChromaLink = map;
};

setupMapHeadset = function(canvasName, svgObject) {
  if (svgObject == undefined) {
    console.error('canvasHeadset: SVG Object cannot be accessed!', svgObject.children);
    return;
  }
  if (maps[canvasName] == undefined) {
    maps[canvasName] = {};
  }
  if (maps[canvasName].mapHeadset != undefined) {
    return; ///already set
  }
  maps[canvasName].mapHeadset = undefined;
  var leds = [];
  findLeds(svgObject.children, leds, 'led');
  var map = [];
  map.push(leds[0].children[0]);
  map.push(leds[0].children[1]);
  //console.log('map', map);
  maps[canvasName].mapHeadset = map;
};

setupMapKeyboard = function(canvasName, svgObject) {
  if (svgObject == undefined) {
    console.error('canvasKeyboard: SVG Object cannot be accessed!', svgObject.children);
    return;
  }
  if (maps[canvasName] == undefined) {
    maps[canvasName] = {};
  }
  if (maps[canvasName].mapKeyboard != undefined) {
    return; ///already set
  }
  maps[canvasName].mapKeyboard = undefined;

  var map = {};
  map[RZKEY.RZKEY_ESC] = 'keyEsc';
  map[RZKEY.RZKEY_F1] = 'keyF1';
  map[RZKEY.RZKEY_F2] = 'keyF2';
  map[RZKEY.RZKEY_F3] = 'keyF3';
  map[RZKEY.RZKEY_F4] = 'keyF4';
  map[RZKEY.RZKEY_F5] = 'keyF5';
  map[RZKEY.RZKEY_F6] = 'keyF6';
  map[RZKEY.RZKEY_F7] = 'keyF7';
  map[RZKEY.RZKEY_F8] = 'keyF8';
  map[RZKEY.RZKEY_F9] = 'keyF9';
  map[RZKEY.RZKEY_F10] = 'keyF10';
  map[RZKEY.RZKEY_F11] = 'keyF11';
  map[RZKEY.RZKEY_F12] = 'keyF12';
  map[RZKEY.RZKEY_1] = 'key1';
  map[RZKEY.RZKEY_2] = 'key2';
  map[RZKEY.RZKEY_3] = 'key3';
  map[RZKEY.RZKEY_4] = 'key4';
  map[RZKEY.RZKEY_5] = 'key5';
  map[RZKEY.RZKEY_6] = 'key6';
  map[RZKEY.RZKEY_7] = 'key7';
  map[RZKEY.RZKEY_8] = 'key8';
  map[RZKEY.RZKEY_9] = 'key9';
  map[RZKEY.RZKEY_0] = 'key0';
  map[RZKEY.RZKEY_A] = 'keyA';
  map[RZKEY.RZKEY_B] = 'keyB';
  map[RZKEY.RZKEY_C] = 'keyC';
  map[RZKEY.RZKEY_D] = 'keyD';
  map[RZKEY.RZKEY_E] = 'keyE';
  map[RZKEY.RZKEY_F] = 'keyF';
  map[RZKEY.RZKEY_G] = 'keyG';
  map[RZKEY.RZKEY_H] = 'keyH';
  map[RZKEY.RZKEY_I] = 'keyI';
  map[RZKEY.RZKEY_J] = 'keyJ';
  map[RZKEY.RZKEY_K] = 'keyK';
  map[RZKEY.RZKEY_L] = 'keyL';
  map[RZKEY.RZKEY_M] = 'keyM';
  map[RZKEY.RZKEY_N] = 'keyN';
  map[RZKEY.RZKEY_O] = 'keyO';
  map[RZKEY.RZKEY_P] = 'keyP';
  map[RZKEY.RZKEY_Q] = 'keyQ';
  map[RZKEY.RZKEY_R] = 'keyR';
  map[RZKEY.RZKEY_S] = 'keyS';
  map[RZKEY.RZKEY_T] = 'keyT';
  map[RZKEY.RZKEY_U] = 'keyU';
  map[RZKEY.RZKEY_V] = 'keyV';
  map[RZKEY.RZKEY_W] = 'keyW';
  map[RZKEY.RZKEY_X] = 'keyX';
  map[RZKEY.RZKEY_Y] = 'keyY';
  map[RZKEY.RZKEY_Z] = 'keyZ';
  map[RZKEY.RZKEY_NUMLOCK] = 'keyNumPad';
  map[RZKEY.RZKEY_NUMPAD0] = 'keyNumPad0';
  map[RZKEY.RZKEY_NUMPAD1] = 'keyNumPad1';
  map[RZKEY.RZKEY_NUMPAD2] = 'keyNumPad2';
  map[RZKEY.RZKEY_NUMPAD3] = 'keyNumPad3';
  map[RZKEY.RZKEY_NUMPAD4] = 'keyNumPad4';
  map[RZKEY.RZKEY_NUMPAD5] = 'keyNumPad5';
  map[RZKEY.RZKEY_NUMPAD6] = 'keyNumPad6';
  map[RZKEY.RZKEY_NUMPAD7] = 'keyNumPad7';
  map[RZKEY.RZKEY_NUMPAD8] = 'keyNumPad8';
  map[RZKEY.RZKEY_NUMPAD9] = 'keyNumPad9';
  map[RZKEY.RZKEY_NUMPAD_DIVIDE] = 'keyNumPadForwardSlash';
  map[RZKEY.RZKEY_NUMPAD_MULTIPLY] = 'keyNumPadAsterisk';
  map[RZKEY.RZKEY_NUMPAD_SUBTRACT] = 'keyNumPadMinus';
  map[RZKEY.RZKEY_NUMPAD_ADD] = 'keyNumPadPlus';
  map[RZKEY.RZKEY_NUMPAD_ENTER] = 'keyNumPadEnter';
  map[RZKEY.RZKEY_NUMPAD_DECIMAL] = 'keyNumPadDot';
  map[RZKEY.RZKEY_PRINTSCREEN] = 'keyPrintScreen';
  map[RZKEY.RZKEY_SCROLL] = 'keyScrollLock';
  map[RZKEY.RZKEY_PAUSE] = 'keyPauseBreak';
  map[RZKEY.RZKEY_INSERT] = 'keyInsert';
  map[RZKEY.RZKEY_HOME] = 'keyHome';
  map[RZKEY.RZKEY_PAGEUP] = 'keyPageUp';
  map[RZKEY.RZKEY_DELETE] = 'keyDelete';
  map[RZKEY.RZKEY_END] = 'keyEnd';
  map[RZKEY.RZKEY_PAGEDOWN] = 'keyPageDown';
  map[RZKEY.RZKEY_UP] = 'keyUpArrow';
  map[RZKEY.RZKEY_LEFT] = 'keyLeftArrow';
  map[RZKEY.RZKEY_DOWN] = 'keyDownArrow';
  map[RZKEY.RZKEY_RIGHT] = 'keyRightArrow';
  map[RZKEY.RZKEY_TAB] = 'keyTab';
  map[RZKEY.RZKEY_CAPSLOCK] = 'keyCaps';
  map[RZKEY.RZKEY_BACKSPACE] = 'keyBackspace';
  map[RZKEY.RZKEY_ENTER] = 'keyEnter';
  map[RZKEY.RZKEY_LCTRL] = 'keyLeftCtrl';
  map[RZKEY.RZKEY_LWIN] = 'keyWindow';
  map[RZKEY.RZKEY_LALT] = 'keyLeftAlt';
  map[RZKEY.RZKEY_SPACE] = 'keySpace';
  map[RZKEY.RZKEY_RALT] = 'keyRightAlt';
  map[RZKEY.RZKEY_FN] = 'keyFunction_1_';
  map[RZKEY.RZKEY_RMENU] = 'keyMenu';
  map[RZKEY.RZKEY_RCTRL] = 'keyRightCtrl';
  map[RZKEY.RZKEY_LSHIFT] = 'keyLeftShift';
  map[RZKEY.RZKEY_RSHIFT] = 'keyRightShift';
  map[RZKEY.RZKEY_OEM_1] = 'keyTilde';               /*!< ~ (tilde/半角/全角) (VK_OEM_3) */
  map[RZKEY.RZKEY_OEM_2] = 'keyDash';               /*!< -- (minus) (VK_OEM_MINUS) */
  map[RZKEY.RZKEY_OEM_3] = 'keyEqual';               /*!< = (equal) (VK_OEM_PLUS) */
  map[RZKEY.RZKEY_OEM_4] = 'keyStartSquareBracket';               /*!< [ (left sqaure bracket) (VK_OEM_4) */
  map[RZKEY.RZKEY_OEM_5] = 'keyEndSquareBracket';               /*!< ] (right square bracket) (VK_OEM_6) */
  map[RZKEY.RZKEY_OEM_6] = 'keyBackslash';               /*!< \ (backslash) (VK_OEM_5) */
  map[RZKEY.RZKEY_OEM_7] = 'keySemiColon';               /*!< ; (semi-colon) (VK_OEM_1) */
  map[RZKEY.RZKEY_OEM_8] = 'keyApostrophe';               /*!< ' (apostrophe) (VK_OEM_7) */
  map[RZKEY.RZKEY_OEM_9] = 'keyComma';               /*!< , (comma) (VK_OEM_COMMA) */
  map[RZKEY.RZKEY_OEM_10] = 'keyDot';              /*!< . (period) (VK_OEM_PERIOD) */
  map[RZKEY.RZKEY_OEM_11] = 'keyForwardSlash';              /*!< / (forward slash) (VK_OEM_2) */

  var entries = Object.entries(map);
  for (let [key, value] of entries) {
    //console.log(key, value);
    var leds = [];
    findLeds(svgObject.children, leds, value);
    map[key] = leds[0];
    //console.log(key, map[key]);
  }

  //console.log('map', map);
  maps[canvasName].mapKeyboard = map;
};

setupMapMousepad = function(canvasName, svgObject) {
  if (svgObject == undefined) {
    console.error('setupMapMousepad: SVG Object cannot be accessed!', svgObject.children);
    return;
  }
  if (maps[canvasName] == undefined) {
    maps[canvasName] = {};
  }
  if (maps[canvasName].mapMousepad != undefined) {
    return; ///already set
  }
  maps[canvasName].mapMousepad = undefined;
  var leds = [];
  findLeds(svgObject.children, leds, 'led');
  var map = [];
  for (var led = 14; led >= 0; --led) {
    map.push(leds[led]);
  }
  //console.log('map', map);
  maps[canvasName].mapMousepad = map;
};

setupMapMouse = function(canvasName, svgObject) {
  if (svgObject == undefined) {
    console.error('canvasMouse: SVG Object cannot be accessed!', svgObject.children);
    return;
  }
  if (maps[canvasName] == undefined) {
    maps[canvasName] = {};
  }
  if (maps[canvasName].mapMouse != undefined) {
    return; ///already set
  }
  maps[canvasName].mapMouse = undefined;
  var leds = [];
  findLeds(svgObject.children, leds, 'led');
  var map = [];
  for (var led = 0; led < leds.length; ++led) {
    map.push(leds[led]);
  }
  //console.log('map', map);
  maps[canvasName].mapMouse = map;

};

setupMapKeypad = function(canvasName, svgObject) {
  if (svgObject == undefined) {
    console.error('canvasKeypad: SVG Object cannot be accessed!', svgObject.children);
    return;
  }
  if (maps[canvasName] == undefined) {
    maps[canvasName] = {};
  }
  if (maps[canvasName].mapKeypad != undefined) {
    return; ///already set
  }
  maps[canvasName].mapKeypad = undefined;
  var leds = [];
  findLeds(svgObject.children, leds, 'ledkeys');
  var map = [];
  for (var led = 0; led < leds.length; ++led) {
    map.push(leds[led]);
  }
  var leds = [];
  findLeds(svgObject.children, leds, 'led');
  map.push(leds[0]);
  //console.log('map', map);
  maps[canvasName].mapKeypad = map;

};

loadCanvases = function() {
  //show loading text on canvases
  var canvases = document.getElementsByClassName('canvasKeyboard');
  for (var i in canvases) {
    var canvas = canvases[i];
    if (canvas != undefined) {
      setupLiveEditOnClick(canvas);
    }
  }

  var setupItems = [];
  var buttons = document.getElementsByClassName('buttonChroma');
  for (var i in buttons) {
    var button = buttons[i];
    setupItems.push(button);
  }

  var setupIndex = 0;
  var timerSetup = setInterval(function() {
    if (!drawInProgress) {
      if (setupIndex < setupItems.length) {
        if (setupItems[setupIndex] != undefined &&
        setupItems[setupIndex].click != undefined) {
          setupItems[setupIndex].click();
        }
        setupIndex++;
      } else {
        setupComplete = true;

        var buttons = document.getElementsByClassName('buttonChroma');
        var chromaButtons = [];
        for (var i in buttons) {
          var button = buttons[i];
          chromaButtons.push(button);
        }
        for (var i in chromaButtons) {
          var button = chromaButtons[i];
          if (button != undefined &&
            button.classList != undefined &&
            button.classList.contains('buttonChroma')) {
            button.classList.remove('buttonChroma');
            button.classList.add('buttonChroma2');
          }
        }

        //console.log('setup complete');
        clearInterval(timerSetup);
      }
    }
  }, 100);
}

var captureCanvas = document.createElement('canvas');
captureCanvas.setAttribute('id', 'captureCanvas');
captureCanvas.setAttribute('style', 'display: none; width: 645px; height: 430px;');
document.body.appendChild(captureCanvas);

onPageLoad = function () {
  //handle header linking to footer
  if (window.frames.length > 0) {
    var linkVideos = window.frames[0].document.getElementById('linkVideos');
    if (linkVideos != undefined) {
      linkVideos.onclick = function() {
        if (!window.location.href.endsWith('#Videos')) {
          window.location.href = window.location.href + '#Videos';
        } else {
          window.location.reload();
        }
      };
    }
  }
  try {
    if (setupAllChromaEffects != undefined) {
      setupAllChromaEffects();
    }
  } catch (err) {
  }
  loadCanvases();
  handleTabVisibility();
  chromaSDK = new ChromaSDK();
  detectWindowFocus();
  setInterval(function() {
    detectWindowFocus();
  }, 1000);
};
onPageUnload = function () {
  if (chromaSDK != undefined &&
    initialized) {
    chromaSDK.uninit()
  }
};
exampleReset = function (ignoreUseIdleAnimation) {
  if (ignoreUseIdleAnimation != true) {
    ChromaAnimation.useIdleAnimations(false);
  }
  if (exampleInterval != undefined) {
    clearInterval(exampleInterval);
    exampleInterval = undefined;
  }
  drawInProgress = true;
};
getRGBString = function(red, green, blue) {
  return "rgb("+red+", "+green+", "+blue+")";
}
getRGBAString = function(red, green, blue, alpha) {
  return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
}
var canvasTimers = {
  chromaLink: [],
  headset: [],
  keyboard: [],
  keypad: [],
  mouse: [],
  mousepad: []
};
var stateDisplay = {
  chromaLink: [],
  headset: [],
  keyboard: [],
  keypad: [],
  mouse: [],
  mousepad: []
};
function checkVisible(elm) {
  return true;
  //var rect = elm.getBoundingClientRect();
  //var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  //var tolerance = 800;
  //return !((rect.bottom-tolerance) <= 0 || rect.top - (viewHeight+tolerance) >= 0);
}
function drawKeyboard(canvasName, animationName, loop) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
    animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
    return;
  }

  var state = stateDisplay.keyboard[canvasName];
  if (state == undefined) {
    state = {};
    stateDisplay.keyboard[canvasName] = state;
    state.FrameId = 0;
    state.Delay = undefined;
    state.Loop = loop;
  }

  // play idle animation for non-looping animations
  var idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keyboard]);
  var usingIdle = false;
  if (state.Loop == false &&
    idleAnimation != undefined &&
    ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keyboard] &&
    state.Delay != undefined) {
    if (state.Delay < Date.now()) {
      state.Delay = undefined;
      state.FrameId = 0;
    } else {
      animation = idleAnimation;
      usingIdle = true;
    }
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }

  if (checkVisible(canvas)) {

    setupMapKeyboard(canvasName, canvas.contentDocument);

    var frameCount = animation.getFrameCount();
    //console.log('frameCount', frameCount);
    var maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
    var maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
    //console.log('frameId', frameId);
    if (state.FrameId >= 0 && state.FrameId < frameCount) {
      var frame = animation.Frames[state.FrameId];
      var colors = frame.Colors;
      if (maps[canvasName] != undefined) {
        var mapKeyboard = maps[canvasName].mapKeyboard;
        if (mapKeyboard != undefined) {
          for (var key in RZKEY) {
            //console.log('key', 'RZKEY.'+key, RZKEY[key], 'i', i, 'j', j, map[keyDesc]);
            var val = RZKEY[key];
            if (val == RZKEY.RZKEY_INVALID) {
              continue;
            }
            var i = getHighByte(val);
            var row = colors[i];
            var j = getLowByte(val);
            var color = row[j];
            var keyDesc = eval('RZKEY.'+key);
            if (mapKeyboard[keyDesc] != undefined) {
              mapKeyboard[keyDesc].setAttribute("style", "fill: "+getHexColor(color));
            }
          }
        }
      }
    }
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  if (canvasTimers.keyboard[canvasName] != undefined) {
    clearTimeout(canvasTimers.keyboard[canvasName]);
    canvasTimers.keyboard[canvasName] = undefined;
  }
  var timer = setTimeout(function() {
    if (state.Loop == false) {
      if (!usingIdle &&
        (state.FrameId+1) >= animation.getFrameCount()) {
        // delay before looping again
        state.Delay = Date.now() + 3000;
        state.FrameId = 0;
      } else {
        state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
      }
    } else {
      state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
    }
    drawKeyboard(canvasName, animationName);
  }, duration * 1000);
  canvasTimers.keyboard[canvasName] = timer;
}
function drawKeypad(canvasName, animationName, loop) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
    animation.Device != EChromaSDKDevice2DEnum.DE_Keypad) {
    return;
  }

  var state = stateDisplay.keypad[canvasName];
  if (state == undefined) {
    state = {};
    stateDisplay.keypad[canvasName] = state;
    state.FrameId = 0;
    state.Delay = undefined;
    state.Loop = loop;
  }

  // play idle animation for non-looping animations
  var idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keypad]);
  var usingIdle = false;
  if (state.Loop == false &&
    idleAnimation != undefined &&
    ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Keypad] &&
    state.Delay != undefined) {
    if (state.Delay < Date.now()) {
      state.Delay = undefined;
      state.FrameId = 0;
    } else {
      animation = idleAnimation;
      usingIdle = true;
    }
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }

  if (checkVisible(canvas)) {

    setupMapKeypad(canvasName, canvas.contentDocument);

    var frameCount = animation.getFrameCount();
    //console.log('frameCount', frameCount);
    var maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keypad);
    var maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keypad);
    //console.log('frameId', frameId);
    if (state.FrameId >= 0 && state.FrameId < frameCount) {
      var frame = animation.Frames[state.FrameId];
      var colors = frame.Colors;
      if (maps[canvasName] != undefined) {
        var mapKeypad = maps[canvasName].mapKeypad;
        if (mapKeypad != undefined) {
          mapKeypad[0].setAttribute("style", "fill: "+getHexColor(colors[0][0]));
          mapKeypad[1].setAttribute("style", "fill: "+getHexColor(colors[0][1]));
          mapKeypad[2].setAttribute("style", "fill: "+getHexColor(colors[0][2]));
          mapKeypad[3].setAttribute("style", "fill: "+getHexColor(colors[0][3]));
          mapKeypad[4].setAttribute("style", "fill: "+getHexColor(colors[0][4]));
          mapKeypad[5].setAttribute("style", "fill: "+getHexColor(colors[1][0]));
          mapKeypad[6].setAttribute("style", "fill: "+getHexColor(colors[1][1]));
          mapKeypad[7].setAttribute("style", "fill: "+getHexColor(colors[1][2]));
          mapKeypad[8].setAttribute("style", "fill: "+getHexColor(colors[1][3]));
          mapKeypad[9].setAttribute("style", "fill: "+getHexColor(colors[1][4]));
          mapKeypad[10].setAttribute("style", "fill: "+getHexColor(colors[2][0]));
          mapKeypad[11].setAttribute("style", "fill: "+getHexColor(colors[2][1]));
          mapKeypad[12].setAttribute("style", "fill: "+getHexColor(colors[2][2]));
          mapKeypad[13].setAttribute("style", "fill: "+getHexColor(colors[2][3]));
          mapKeypad[14].setAttribute("style", "fill: "+getHexColor(colors[2][4]));
          mapKeypad[15].setAttribute("style", "fill: "+getHexColor(colors[3][0]));
          mapKeypad[16].setAttribute("style", "fill: "+getHexColor(colors[3][1]));
          mapKeypad[17].setAttribute("style", "fill: "+getHexColor(colors[3][2]));
          mapKeypad[18].setAttribute("style", "fill: "+getHexColor(colors[3][3]));
          mapKeypad[20].setAttribute("style", "fill: "+getHexColor(colors[3][4]));
        }
      }
    }
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    if (state.Loop == false) {
      if (!usingIdle &&
        (state.FrameId+1) >= animation.getFrameCount()) {
        // delay before looping again
        state.Delay = Date.now() + 3000;
        state.FrameId = 0;
      } else {
        state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
      }
    } else {
      state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
    }
    drawKeypad(canvasName, animationName, loop);
  }, duration * 1000);
}
function drawChromaLink(canvasName, animationName, loop) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_1D ||
    animation.Device != EChromaSDKDevice1DEnum.DE_ChromaLink) {
    return;
  }

  var state = stateDisplay.chromaLink[canvasName];
  if (state == undefined) {
    state = {};
    stateDisplay.chromaLink[canvasName] = state;
    state.FrameId = 0;
    state.Delay = undefined;
    state.Loop = loop;
  }

  // play idle animation for non-looping animations
  var idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimation1D[EChromaSDKDevice1DEnum.DE_ChromaLink]);
  var usingIdle = false;
  if (state.Loop == false &&
    idleAnimation != undefined &&
    ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_ChromaLink] &&
    state.Delay != undefined) {
    if (state.Delay < Date.now()) {
      state.Delay = undefined;
      state.FrameId = 0;
    } else {
      animation = idleAnimation;
      usingIdle = true;
    }
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }

  if (checkVisible(canvas)) {

    setupMapChromaLink(canvasName, canvas.contentDocument);

    var frameCount = animation.getFrameCount();
    //console.log('FrameCount', frameCount);
    var maxLeds = ChromaAnimation.getMaxLeds(EChromaSDKDevice1DEnum.DE_ChromaLink);
    var frameId = state.FrameId;
    if (maps[canvasName] != undefined) {
      var mapChromaLink = maps[canvasName].mapChromaLink;
      if (mapChromaLink != undefined) {
        if (frameId >= 0 && frameId < frameCount) {
          var frame = animation.Frames[state.FrameId];
          var colors = frame.Colors;
          for (var led = 0; led < 5; ++led) {
            mapChromaLink[led].setAttribute("style", "fill: "+getHexColor(colors[led]));
          }
        }
      }
    }
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    if (state.Loop == false) {
      if (!usingIdle &&
        (state.FrameId+1) >= animation.getFrameCount()) {
        // delay before looping again
        state.Delay = Date.now() + 3000;
        state.FrameId = 0;
      } else {
        state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
      }
    } else {
      state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
    }
    drawChromaLink(canvasName, animationName, loop);
  }, duration * 1000);
}
function drawHeadset(canvasName, animationName, loop) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_1D ||
    animation.Device != EChromaSDKDevice1DEnum.DE_Headset) {
    return;
  }

  var state = stateDisplay.headset[canvasName];
  if (state == undefined) {
    state = {};
    stateDisplay.headset[canvasName] = state;
    state.FrameId = 0;
    state.Delay = undefined;
    state.Loop = loop;
  }

  // play idle animation for non-looping animations
  var idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimation1D[EChromaSDKDevice1DEnum.DE_Headset]);
  var usingIdle = false;
  if (state.Loop == false &&
    idleAnimation != undefined &&
    ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_Headset] &&
    state.Delay != undefined) {
    if (state.Delay < Date.now()) {
      state.Delay = undefined;
      state.FrameId = 0;
    } else {
      animation = idleAnimation;
      usingIdle = true;
    }
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }

  if (checkVisible(canvas)) {

    setupMapHeadset(canvasName, canvas.contentDocument);

    var frameCount = animation.getFrameCount();
    //console.log('FrameCount', frameCount);
    var maxLeds = ChromaAnimation.getMaxLeds(EChromaSDKDevice1DEnum.DE_Headset);
    var frameId = state.FrameId;
    if (maps[canvasName] != undefined) {
      var mapHeadset = maps[canvasName].mapHeadset;
      if (mapHeadset != undefined) {
        if (frameId >= 0 && frameId < frameCount) {
          var frame = animation.Frames[frameId];
          var colors = frame.Colors;

          if (mapHeadset != undefined) {
            for (var led = 0; led < 2; ++led) {
              mapHeadset[led].setAttribute("style", "fill: "+getHexColor(colors[led]));
            }
          }
        }
      }
    }
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    if (state.Loop == false) {
      if (!usingIdle &&
        (state.FrameId+1) >= animation.getFrameCount()) {
        // delay before looping again
        state.Delay = Date.now() + 3000;
        state.FrameId = 0;
      } else {
        state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
      }
    } else {
      state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
    }
    drawHeadset(canvasName, animationName, loop);
  }, duration * 1000);
}
function drawMouse(canvasName, animationName, loop) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
    animation.Device != EChromaSDKDevice2DEnum.DE_Mouse) {
    return;
  }

  var state = stateDisplay.mouse[canvasName];
  if (state == undefined) {
    state = {};
    stateDisplay.mouse[canvasName] = state;
    state.FrameId = 0;
    state.Delay = undefined;
    state.Loop = loop;
  }

  // play idle animation for non-looping animations
  var idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimation2D[EChromaSDKDevice2DEnum.DE_Mouse]);
  var usingIdle = false;
  if (state.Loop == false &&
    idleAnimation != undefined &&
    ChromaAnimation.UseIdleAnimation2D[EChromaSDKDevice2DEnum.DE_Mouse] &&
    state.Delay != undefined) {
    if (state.Delay < Date.now()) {
      state.Delay = undefined;
      state.FrameId = 0;
    } else {
      animation = idleAnimation;
      usingIdle = true;
    }
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }

  if (checkVisible(canvas)) {

    setupMapMouse(canvasName, canvas.contentDocument);

    var frameCount = animation.getFrameCount();
    //console.log('FrameCount', frameCount);
    var maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Mouse);
    var maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Mouse);
    var frameId = state.FrameId;
    if (maps[canvasName] != undefined) {
      var mapMouse = maps[canvasName].mapMouse;
      if (mapMouse != undefined) {
        if (frameId >= 0 && frameId < frameCount) {
          var frame = animation.Frames[frameId];
          var colors = frame.Colors;

          if (mapMouse != undefined) {
            mapMouse[0].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_LEFT_SIDE1));
            mapMouse[3].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_LEFT_SIDE2));
            mapMouse[5].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_LEFT_SIDE3));
            mapMouse[7].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_LEFT_SIDE4));
            mapMouse[9].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_LEFT_SIDE5));
            mapMouse[11].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_LEFT_SIDE6));
            mapMouse[13].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_LEFT_SIDE7));

            mapMouse[2].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_RIGHT_SIDE1));
            mapMouse[4].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_RIGHT_SIDE2));
            mapMouse[6].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_RIGHT_SIDE3));
            mapMouse[8].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_RIGHT_SIDE4));
            mapMouse[10].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_RIGHT_SIDE5));
            mapMouse[12].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_RIGHT_SIDE6));
            mapMouse[14].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_RIGHT_SIDE7));

            mapMouse[1].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_SCROLLWHEEL));
            mapMouse[15].setAttribute("style", "fill: "+getMouseColor(colors, Mouse.RZLED2.RZLED2_LOGO));
          }
        }
      }
    }
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    if (state.Loop == false) {
      if (!usingIdle &&
        (state.FrameId+1) >= animation.getFrameCount()) {
        // delay before looping again
        state.Delay = Date.now() + 3000;
        state.FrameId = 0;
      } else {
        state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
      }
    } else {
      state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
    }
    drawMouse(canvasName, animationName, loop);
  }, duration * 1000);
}
function drawMousepad(canvasName, animationName, loop)  {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_1D ||
    animation.Device != EChromaSDKDevice1DEnum.DE_Mousepad) {
    return;
  }

  var state = stateDisplay.mousepad[canvasName];
  if (state == undefined) {
    state = {};
    stateDisplay.mousepad[canvasName] = state;
    state.FrameId = 0;
    state.Delay = undefined;
    state.Loop = loop;
  }

  // play idle animation for non-looping animations
  var idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimation1D[EChromaSDKDevice1DEnum.DE_Mousepad]);
  var usingIdle = false;
  if (state.Loop == false &&
    idleAnimation != undefined &&
    ChromaAnimation.UseIdleAnimation1D[EChromaSDKDevice1DEnum.DE_Mousepad] &&
    state.Delay != undefined) {
    if (state.Delay < Date.now()) {
      state.Delay = undefined;
      state.FrameId = 0;
    } else {
      animation = idleAnimation;
      usingIdle = true;
    }
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }

  if (checkVisible(canvas)) {

    setupMapMousepad(canvasName, canvas.contentDocument);

    var frameCount = animation.getFrameCount();
    //console.log('FrameCount', frameCount);
    var maxLeds = ChromaAnimation.getMaxLeds(EChromaSDKDevice1DEnum.DE_Mousepad);
    var frameId = state.FrameId;
    if (maps[canvasName] != undefined) {
      var mapMousepad = maps[canvasName].mapMousepad;
      if (mapMousepad != undefined) {
        if (frameId >= 0 && frameId < frameCount) {
          var frame = animation.Frames[frameId];
          var colors = frame.Colors;

          if (mapMousepad != undefined) {
            for (var led = 0; led < 15; ++led) {
              mapMousepad[led].setAttribute("style", "fill: "+getHexColor(colors[led]));
            }
          }
        }
      }
    }
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    if (state.Loop == false) {
      if (!usingIdle &&
        (state.FrameId+1) >= animation.getFrameCount()) {
        // delay before looping again
        state.Delay = Date.now() + 3000;
        state.FrameId = 0;
      } else {
        state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
      }
    } else {
      state.FrameId = (state.FrameId + 1) % animation.getFrameCount();
    }
    drawMousepad(canvasName, animationName, loop);
  }, duration * 1000);
}
displayKeyboardCanvas = function(baseLayer, effectName, loop) {
  var canvasName = 'canvasKeyboard' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    drawKeyboard(canvasName, canvasName, loop);
  }
  drawInProgress = false;
}
displayKeypadCanvas = function(baseLayer, effectName, loop) {
  var canvasName = 'canvasKeypad' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    drawKeypad(canvasName, canvasName, loop);
  }
  drawInProgress = false;
}
displayChromaLinkCanvas = function(baseLayer, effectName, loop) {
  var canvasName = 'canvasChromaLink' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    drawChromaLink(canvasName, canvasName, loop);
  }
  drawInProgress = false;
}
displayHeadsetCanvas = function(baseLayer, effectName, loop) {
  var canvasName = 'canvasHeadset' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    drawHeadset(canvasName, canvasName, loop);
  }
  drawInProgress = false;
}
displayMouseCanvas = function(baseLayer, effectName, loop) {
  var canvasName = 'canvasMouse' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    drawMouse(canvasName, canvasName, loop);
  }
  drawInProgress = false;
}
displayMousepadCanvas = function(baseLayer, effectName, loop) {
  var canvasName = 'canvasMousepad' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    drawMousepad(canvasName, canvasName, loop);
  }
  drawInProgress = false;
}
//display canvases
var setupComplete = false;
var handleButtonClick = function(button) {
  if (setupComplete) {
  // when user clicks button, invoke the callback after Chroma has initialized
    if (!initialized) {
      chromaSDK.init();
      setTimeout(function() {
        initialized = true;
        //console.log('set static color');
        if (button.click != undefined) {
          button.click();
        }
      }, 100);
    }
  }
};
var displayAndPlayAnimationChromaLink = function (baseLayer, canvasName, loop) {
  displayChromaLinkCanvas(baseLayer, canvasName, loop != false);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, loop != false);
  }
};
var displayAndPlayAnimationHeadset = function (baseLayer, canvasName, loop) {
  displayHeadsetCanvas(baseLayer, canvasName, loop != false);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, loop != false);
  }
};
var displayAndPlayAnimationKeyboard = function (baseLayer, canvasName, loop) {
  displayKeyboardCanvas(baseLayer, canvasName, loop != false);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, loop != false);
  }
};
var displayAndPlayAnimationKeypad = function (baseLayer, canvasName, loop) {
  displayKeypadCanvas(baseLayer, canvasName, loop != false);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, loop != false);
  }
};
var displayAndPlayAnimationMouse = function (baseLayer, canvasName, loop) {
  displayMouseCanvas(baseLayer, canvasName, loop != false);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, loop != false);
  }
};
var displayAndPlayAnimationMousepad = function (baseLayer, canvasName, loop) {
  displayMousepadCanvas(baseLayer, canvasName, loop != false);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, loop != false);
  }
};
var displayAndPlayAnimation = function (baseLayer, canvasName, loop) {
  var animation = ChromaAnimation.getAnimation(baseLayer);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_1D) {
    switch (animation.Device) {
      case EChromaSDKDevice1DEnum.DE_ChromaLink:
        displayAndPlayAnimationChromaLink(baseLayer, canvasName, loop);
        break;
      case EChromaSDKDevice1DEnum.DE_Headset:
        displayAndPlayAnimationHeadset(baseLayer, canvasName, loop);
        break;
      case EChromaSDKDevice1DEnum.DE_Mousepad:
        displayAndPlayAnimationMousepad(baseLayer, canvasName, loop);
        break;
    }
  } else if (animation.DeviceType == EChromaSDKDeviceTypeEnum.DE_2D) {
    switch (animation.Device) {
      case EChromaSDKDevice2DEnum.DE_Keyboard:
        displayAndPlayAnimationKeyboard(baseLayer, canvasName, loop);
        break;
      case EChromaSDKDevice2DEnum.DE_Keypad:
        displayAndPlayAnimationKeypad(baseLayer, canvasName, loop);
        break;
      case EChromaSDKDevice2DEnum.DE_Mouse:
        displayAndPlayAnimationMouse(baseLayer, canvasName, loop);
        break;
    }
  }
};
var stopAllCanvasTimers = function () {
  for (var element in canvasTimers.keyboard) {
    clearTimeout(canvasTimers.keyboard[element]);
  };
  canvasTimers.keyboard = [];
}
