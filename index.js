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
detectWindowFocus = function() {
  if (browserTabIsVisible == true) {
    if (pageHadFocus != true) {
      pageHadFocus = true;
      //console.log('page has focus');
    }
  } else {
    if (pageHadFocus == true) {
      ChromaAnimation.clearAll();
      chromaSDK.uninit();
      pageHadFocus = false;
      initialized = false;
      //console.log('page lost focus');
    }
  }
}
loadCanvases = function() {
  //show loading text on canvases
  var canvases = document.getElementsByClassName('canvasKeyboard');
  for (var i in canvases) {
    var canvas = canvases[i];
    if (canvas != undefined &&
      canvas.getContext != undefined) {
      var ctx = canvas.getContext("2d");
      ctx.font = "30px Arial";
      ctx.fillStyle ='rgb(127, 127, 127)';
      ctx.fillText("Loading...",225,100);
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
exampleReset = function () {
  ChromaAnimation.useIdleAnimation(false);
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
var stateDisplay = [];
function drawKeyboard(canvasName, animationName, loop) {

  var state = stateDisplay[canvasName];
  if (state == undefined) {
    state = {};
    stateDisplay[canvasName] = state;
    state.FrameId = 0;
    state.Delay = undefined;
    state.Loop = loop;
  }

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  // play idle animation for non-looping animations
  var idleAnimation = ChromaAnimation.getAnimation(ChromaAnimation.IdleAnimationName);
  var usingIdle = false;
  if (state.Loop == false &&
    idleAnimation != undefined &&
    ChromaAnimation.UseIdleAnimation &&
    state.Delay != undefined) {
    if (state.Delay < Date.now()) {
      state.Delay = undefined;
      state.FrameId = 0;
    } else {
      animation = idleAnimation;
      usingIdle = true;
    }
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
    animation.Device != EChromaSDKDevice2DEnum.DE_Keyboard) {
    return;
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = getRGBString(0, 0, 0);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  var map = {};
  var setupMapping = function() {
    map['RZKEY.RZKEY_ESC'] = [46, 5, 27, 28];
    map['RZKEY.RZKEY_F1'] = [113, 5, 25, 28];
    map['RZKEY.RZKEY_F2'] = [139, 5, 25, 28];
    map['RZKEY.RZKEY_F3'] = [165, 5, 25, 28];
    map['RZKEY.RZKEY_F4'] = [190, 5, 26, 28];
    map['RZKEY.RZKEY_F5'] = [222, 5, 24, 28];
    map['RZKEY.RZKEY_F6'] = [248, 5, 24, 28];
    map['RZKEY.RZKEY_F7'] = [274, 5, 24, 28];
    map['RZKEY.RZKEY_F8'] = [299, 5, 25, 28];
    map['RZKEY.RZKEY_F9'] = [330, 5, 25, 28];
    map['RZKEY.RZKEY_F10'] = [356, 5, 25, 28];
    map['RZKEY.RZKEY_F11'] = [382, 5, 25, 28];
    map['RZKEY.RZKEY_F12'] = [407, 5, 25, 28];
    map['RZKEY.RZKEY_1'] = [72, 37, 26, 25];
    map['RZKEY.RZKEY_2'] = [98, 37, 25, 25];
    map['RZKEY.RZKEY_3'] = [124, 37, 25, 25];
    map['RZKEY.RZKEY_4'] = [150, 37, 25, 25];
    map['RZKEY.RZKEY_5'] = [176, 37, 24, 25];
    map['RZKEY.RZKEY_6'] = [202, 37, 24, 25];
    map['RZKEY.RZKEY_7'] = [228, 37, 24, 25];
    map['RZKEY.RZKEY_8'] = [253, 37, 25, 25];
    map['RZKEY.RZKEY_9'] = [279, 37, 25, 25];
    map['RZKEY.RZKEY_0'] = [305, 37, 25, 25];
    map['RZKEY.RZKEY_A'] = [92, 89, 25, 25];
    map['RZKEY.RZKEY_B'] = [208, 114, 25, 26];
    map['RZKEY.RZKEY_C'] = [156, 114, 26, 26];
    map['RZKEY.RZKEY_D'] = [144, 89, 24, 25];
    map['RZKEY.RZKEY_E'] = [137, 63, 25, 25];
    map['RZKEY.RZKEY_F'] = [169, 89, 25, 25];
    map['RZKEY.RZKEY_G'] = [195, 89, 25, 25];
    map['RZKEY.RZKEY_H'] = [221, 89, 25, 25];
    map['RZKEY.RZKEY_I'] = [266, 63, 25, 25];
    map['RZKEY.RZKEY_J'] = [247, 89, 25, 25];
    map['RZKEY.RZKEY_K'] = [272, 89, 25, 25];
    map['RZKEY.RZKEY_L'] = [298, 89, 25, 25];
    map['RZKEY.RZKEY_M'] = [259, 114, 25, 26];
    map['RZKEY.RZKEY_N'] = [233, 114, 26, 26];
    map['RZKEY.RZKEY_O'] = [292, 63, 25, 25];
    map['RZKEY.RZKEY_P'] = [318, 63, 25, 25];
    map['RZKEY.RZKEY_Q'] = [86, 63, 24, 25];
    map['RZKEY.RZKEY_R'] = [163, 63, 25, 25];
    map['RZKEY.RZKEY_S'] = [118, 89, 25, 25];
    map['RZKEY.RZKEY_T'] = [188, 63, 26, 25];
    map['RZKEY.RZKEY_U'] = [240, 63, 25, 25];
    map['RZKEY.RZKEY_V'] = [182, 114, 25, 26];
    map['RZKEY.RZKEY_W'] = [112, 63, 24, 25];
    map['RZKEY.RZKEY_X'] = [131, 114, 25, 26];
    map['RZKEY.RZKEY_Y'] = [214, 63, 25, 25];
    map['RZKEY.RZKEY_Z'] = [105, 114, 25, 26];
    map['RZKEY.RZKEY_NUMLOCK'] = [521, 37, 26, 26];
    map['RZKEY.RZKEY_NUMPAD0'] = [521, 140, 52, 26];
    map['RZKEY.RZKEY_NUMPAD1'] = [521, 114, 26, 26];
    map['RZKEY.RZKEY_NUMPAD2'] = [547, 114, 26, 26];
    map['RZKEY.RZKEY_NUMPAD3'] = [573, 114, 26, 26];
    map['RZKEY.RZKEY_NUMPAD4'] = [521, 88, 26, 26];
    map['RZKEY.RZKEY_NUMPAD5'] = [547, 88, 26, 26];
    map['RZKEY.RZKEY_NUMPAD6'] = [573, 88, 26, 26];
    map['RZKEY.RZKEY_NUMPAD7'] = [521, 63, 26, 25];
    map['RZKEY.RZKEY_NUMPAD8'] = [547, 63, 26, 25];
    map['RZKEY.RZKEY_NUMPAD9'] = [573, 63, 26, 25];
    map['RZKEY.RZKEY_NUMPAD_DIVIDE'] = [547, 37, 26, 26];
    map['RZKEY.RZKEY_NUMPAD_MULTIPLY'] = [573, 37, 26, 26];
    map['RZKEY.RZKEY_NUMPAD_SUBTRACT'] = [598, 37, 27, 26];
    map['RZKEY.RZKEY_NUMPAD_ADD'] = [598, 63, 27, 51];
    map['RZKEY.RZKEY_NUMPAD_ENTER'] = [598, 114, 27, 60];
    map['RZKEY.RZKEY_NUMPAD_DECIMAL'] = [572, 140, 52, 26];
    map['RZKEY.RZKEY_PRINTSCREEN'] = [438, 5, 26, 28];
    map['RZKEY.RZKEY_SCROLL'] = [464, 5, 26, 28];
    map['RZKEY.RZKEY_PAUSE'] = [490, 5, 26, 28];
    map['RZKEY.RZKEY_INSERT'] = [438, 37, 26, 27];
    map['RZKEY.RZKEY_HOME'] = [464, 37, 26, 27];
    map['RZKEY.RZKEY_PAGEUP'] = [490, 37, 26, 27];
    map['RZKEY.RZKEY_DELETE'] = [438, 63, 26, 27];
    map['RZKEY.RZKEY_END'] = [464, 63, 26, 27];
    map['RZKEY.RZKEY_PAGEDOWN'] = [490, 63, 26, 27];
    map['RZKEY.RZKEY_UP'] = [464, 114, 26, 26];
    map['RZKEY.RZKEY_LEFT'] = [438, 140, 26, 26];
    map['RZKEY.RZKEY_DOWN'] = [464, 140, 26, 26];
    map['RZKEY.RZKEY_RIGHT'] = [490, 140, 25, 26];
    map['RZKEY.RZKEY_TAB'] = [46, 63, 39, 25];
    map['RZKEY.RZKEY_CAPSLOCK'] = [46, 89, 45, 25];
    map['RZKEY.RZKEY_BACKSPACE'] = [382, 37, 50, 25];
    map['RZKEY.RZKEY_ENTER'] = [375, 89, 57, 25];
    map['RZKEY.RZKEY_LCTRL'] = [46, 140, 39, 26];
    map['RZKEY.RZKEY_LWIN'] = [86, 140, 25, 26];
    map['RZKEY.RZKEY_LALT'] = [111, 140, 38, 26];
    map['RZKEY.RZKEY_SPACE'] = [149, 140, 156, 26];
    map['RZKEY.RZKEY_RALT'] = [305, 140, 37, 26];
    map['RZKEY.RZKEY_FN'] = [342, 140, 26, 26];
    map['RZKEY.RZKEY_RMENU'] = [368, 140, 26, 26];
    map['RZKEY.RZKEY_RCTRL'] = [395, 140, 37, 26];
    map['RZKEY.RZKEY_LSHIFT'] = [46, 114, 58, 26];
    map['RZKEY.RZKEY_RSHIFT'] = [362, 114, 70, 26];
    map['RZKEY.RZKEY_MACRO1'] = [15, 37, 27, 25];
    map['RZKEY.RZKEY_MACRO2'] = [15, 62, 27, 26];
    map['RZKEY.RZKEY_MACRO3'] = [15, 88, 27, 26];
    map['RZKEY.RZKEY_MACRO4'] = [15, 114, 27, 26];
    map['RZKEY.RZKEY_MACRO5'] = [15, 140, 27, 26];
    map['RZKEY.RZKEY_OEM_1'] = [46, 37, 26, 25];
    map['RZKEY.RZKEY_OEM_2'] = [330, 37, 25, 25];
    map['RZKEY.RZKEY_OEM_3'] = [356, 37, 25, 25];
    map['RZKEY.RZKEY_OEM_4'] = [343, 63, 25, 25];
    map['RZKEY.RZKEY_OEM_5'] = [369, 63, 25, 25];
    map['RZKEY.RZKEY_OEM_6'] = [394, 63, 38, 25];
    map['RZKEY.RZKEY_OEM_7'] = [324, 89, 25, 25];
    map['RZKEY.RZKEY_OEM_8'] = [350, 89, 24, 25];
    map['RZKEY.RZKEY_OEM_9'] = [285, 114, 25, 26];
    map['RZKEY.RZKEY_OEM_10'] = [311, 114, 25, 26];
    map['RZKEY.RZKEY_OEM_11'] = [337, 114, 25, 26];
    map['RZKEY.RZKEY_EUR_1'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_EUR_2'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_JPN_1'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_JPN_2'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_JPN_3'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_JPN_4'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_JPN_5'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_KOR_1'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_KOR_2'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_KOR_3'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_KOR_4'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_KOR_5'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_KOR_6'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_KOR_7'] = [0, 0, 0, 0];
    map['RZKEY.RZKEY_INVALID'] = [0, 0, 0, 0];
    map['RZLED.RZLED_LOGO'] = [309, 185, 24, 25];
  };
  setupMapping();

  var frameCount = animation.getFrameCount();
  //console.log('frameCount', frameCount);
  var maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Keyboard);
  var maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Keyboard);
  //console.log('frameId', frameId);
  if (state.FrameId >= 0 && state.FrameId < frameCount) {
    //var frame = animation.Frames[frameId];
    var frame = animation.Frames[state.FrameId];
    var colors = frame.Colors;

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
      var red = color & 0xFF;
      var green = (color & 0xFF00) >> 8;
      var blue = (color & 0xFF0000) >> 16;
      var keyDesc = 'RZKEY.'+key;
      var coords = map[keyDesc];

      var color = getRGBString(red, green, blue);
      ctx.fillStyle = color;
      ctx.fillRect(coords[0],coords[1],coords[2],coords[3]);
      ctx.stroke();
    }

    for (var key in RZLED) {
      var val = RZLED[key];
      var i = getHighByte(val);
      var row = colors[i];
      var j = getLowByte(val);
      var color = row[j];
      var red = color & 0xFF;
      var green = (color & 0xFF00) >> 8;
      var blue = (color & 0xFF0000) >> 16;
      var keyDesc = 'RZLED.'+key;
      var coords = map[keyDesc];

      var color = getRGBString(red, green, blue);
      ctx.fillStyle = color;
      var a = coords[0];
      var b = coords[1];
      var c = coords[2];
      var d = coords[3];
      ctx.fillRect(a,b,c,d);
      ctx.stroke();
    }

    var drawWidth = canvas.width;
    var drawHeight = canvas.height;
    ctx.drawImage(imgEmulatorKeyboard, 0, 0, drawWidth, drawHeight);
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
function drawChromaLink(canvasName, animationName) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_1D ||
    animation.Device != EChromaSDKDevice1DEnum.DE_ChromaLink) {
    return;
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = getRGBString(0, 0, 0);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  var map = [];
  map[0] = [0, 0, 128, 50];
  map[1] = [128, 0, 128, 50];
  map[2] = [256, 0, 128, 50];
  map[3] = [384, 0, 128, 50];
  map[4] = [512, 0, 128, 50];

  var frameCount = animation.getFrameCount();
  //console.log('FrameCount', frameCount);
  var maxLeds = ChromaAnimation.getMaxLeds(EChromaSDKDevice1DEnum.DE_ChromaLink);
  var frameId = animation.CurrentIndex;
  if (frameId >= 0 && frameId < frameCount) {
    //var frame = animation.Frames[frameId];
    var frame = animation.Frames[animation.CurrentIndex];
    var colors = frame.Colors;

    for (var led = 0; led < 5; ++led) {
      var color = colors[led];
      var red = color & 0xFF;
      var green = (color & 0xFF00) >> 8;
      var blue = (color & 0xFF0000) >> 16;
      var coords = map[led];

      ctx.fillStyle = getRGBString(red, green, blue, 0.3);
      ctx.fillRect(coords[0],coords[1],coords[2],coords[3]);
      ctx.stroke();
    }

    var drawWidth = canvas.width;
    var drawHeight = canvas.height;
    var halfWidth = Math.floor(drawWidth / 2);
    var halfHeight = Math.floor(drawHeight / 2);
    ctx.drawImage(imgEmulatorChromaLink, 0, 0, drawWidth, drawHeight);
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    animation.CurrentIndex = (animation.CurrentIndex + 1) % animation.getFrameCount();
    drawChromaLink(canvasName, animationName);
  }, duration * 1000);
}
function drawChromaLink2(canvasName, animationName) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_1D ||
    animation.Device != EChromaSDKDevice1DEnum.DE_ChromaLink) {
    return;
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = getRGBString(0, 0, 0);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  var map = [];
  map[0] = [0, 0, 640, 214];
  var radius = 50;
  map[1] = [78, 145, 0, 0];
  map[2] = [238, 145, 0, 0];
  map[3] = [398, 145, 0, 0];
  map[4] = [558, 145, 0, 0];

  var frameCount = animation.getFrameCount();
  //console.log('FrameCount', frameCount);
  var maxLeds = ChromaAnimation.getMaxLeds(EChromaSDKDevice1DEnum.DE_ChromaLink);
  var frameId = animation.CurrentIndex;
  if (frameId >= 0 && frameId < frameCount) {
    //var frame = animation.Frames[frameId];
    var frame = animation.Frames[animation.CurrentIndex];
    var colors = frame.Colors;

    for (var led = 0; led < 5; ++led) {
      var color = colors[led];
      var red = color & 0xFF;
      var green = (color & 0xFF00) >> 8;
      var blue = (color & 0xFF0000) >> 16;
      var coords = map[led];

      ctx.fillStyle = getRGBString(red, green, blue);
      if (led == 0) {
        ctx.fillRect(coords[0],coords[1],coords[2],coords[3]);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(coords[0], coords[1], radius, 0, 2 * Math.PI, false);
        ctx.fill();
      }
    }

    var drawWidth = canvas.width;
    var drawHeight = canvas.height;
    var halfWidth = Math.floor(drawWidth / 2);
    var halfHeight = Math.floor(drawHeight / 2);
    ctx.drawImage(imgEmulatorChromaLink, 0, 0, drawWidth, drawHeight);
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    animation.CurrentIndex = (animation.CurrentIndex + 1) % animation.getFrameCount();
    drawChromaLink(canvasName, animationName);
  }, duration * 1000);
}
function drawHeadset(canvasName, animationName) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_1D ||
    animation.Device != EChromaSDKDevice1DEnum.DE_Headset) {
    return;
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = getRGBString(0, 0, 0);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  var map = [];
  map[0] = [105, 0, 105, 214];
  map[1] = [0, 0, 105, 214];
  map[2] = [0, 0, 0, 0];
  map[3] = [0, 0, 0, 0];
  map[4] = [0, 0, 0, 0];

  var frameCount = animation.getFrameCount();
  //console.log('FrameCount', frameCount);
  var maxLeds = ChromaAnimation.getMaxLeds(EChromaSDKDevice1DEnum.DE_Headset);
  var frameId = animation.CurrentIndex;
  if (frameId >= 0 && frameId < frameCount) {
    //var frame = animation.Frames[frameId];
    var frame = animation.Frames[animation.CurrentIndex];
    var colors = frame.Colors;

    for (var led = 0; led < 2; ++led) {
      var color = colors[led];
      var red = color & 0xFF;
      var green = (color & 0xFF00) >> 8;
      var blue = (color & 0xFF0000) >> 16;
      var coords = map[led];

      ctx.fillStyle = getRGBString(red, green, blue, 0.3);
      ctx.fillRect(coords[0],coords[1],coords[2],coords[3]);
      ctx.stroke();
    }

    var drawWidth = canvas.width;
    var drawHeight = canvas.height;
    var halfWidth = Math.floor(drawWidth / 2);
    var halfHeight = Math.floor(drawHeight / 2);
    ctx.drawImage(imgEmulatorHeadset, 0, 0, drawWidth, drawHeight);
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    animation.CurrentIndex = (animation.CurrentIndex + 1) % animation.getFrameCount();
    drawHeadset(canvasName, animationName);
  }, duration * 1000);
}
function drawMouse(canvasName, animationName) {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_2D ||
    animation.Device != EChromaSDKDevice2DEnum.DE_Mouse) {
    return;
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = getRGBString(0, 0, 0);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  var regionWidth = 50;
  var regionHeight = 49;
  var x;
  var y;

  var map = {};
  map[Mouse.RZLED2.RZLED2_SCROLLWHEEL] = [285, 59, 97, 112];
  map[Mouse.RZLED2.RZLED2_LOGO] = [256, 365, 111, 118];
  map[Mouse.RZLED2.RZLED2_BACKLIGHT] = [0, 0, 0, 0];
  x = 160;
  y = 86;
  map[Mouse.RZLED2.RZLED2_LEFT_SIDE1] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_LEFT_SIDE2] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_LEFT_SIDE3] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_LEFT_SIDE4] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_LEFT_SIDE5] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_LEFT_SIDE6] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_LEFT_SIDE7] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_BOTTOM1] = [0, 0, 0, 0];
  map[Mouse.RZLED2.RZLED2_BOTTOM2] = [0, 0, 0, 0];
  map[Mouse.RZLED2.RZLED2_BOTTOM3] = [0, 0, 0, 0];
  map[Mouse.RZLED2.RZLED2_BOTTOM4] = [0, 0, 0, 0];
  map[Mouse.RZLED2.RZLED2_BOTTOM5] = [0, 0, 0, 0];
  x = 426;
  y = 86;
  map[Mouse.RZLED2.RZLED2_RIGHT_SIDE1] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_RIGHT_SIDE2] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_RIGHT_SIDE3] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_RIGHT_SIDE4] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_RIGHT_SIDE5] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_RIGHT_SIDE6] = [x, y+=regionHeight, regionWidth, regionHeight];
  map[Mouse.RZLED2.RZLED2_RIGHT_SIDE7] = [x, y+=regionHeight, regionWidth, regionHeight];

  var frameCount = animation.getFrameCount();
  //console.log('FrameCount', frameCount);
  var maxRow = ChromaAnimation.getMaxRow(EChromaSDKDevice2DEnum.DE_Mouse);
  var maxColumn = ChromaAnimation.getMaxColumn(EChromaSDKDevice2DEnum.DE_Mouse);
  var frameId = animation.CurrentIndex;
  if (frameId >= 0 && frameId < frameCount) {
    //var frame = animation.Frames[frameId];
    var frame = animation.Frames[animation.CurrentIndex];
    var colors = frame.Colors;

    for (var led in Mouse.RZLED2) {
      var val = Mouse.RZLED2[led];
      var i = getHighByte(val);
      var row = colors[i];
      var j = getLowByte(val);
      var color = row[j];
      var red = color & 0xFF;
      var green = (color & 0xFF00) >> 8;
      var blue = (color & 0xFF0000) >> 16;
      var coords = map[val];
      //console.log('led', led, val, 'coords', coords);

      ctx.fillStyle = getRGBString(red, green, blue, 0.3);
      var offset = 59;
      var a = Math.ceil(coords[0] * 248 / 640) - offset;
      var b = Math.ceil(coords[1] * 214 / 552);
      var c = Math.ceil(coords[2] * 248 / 640);
      var d = Math.ceil(coords[3] * 214 / 552);
      ctx.fillRect(a,b,c,d);
      ctx.stroke();
    }

    var drawWidth = canvas.width;
    var drawHeight = canvas.height;
    var halfWidth = Math.floor(drawWidth / 2);
    var halfHeight = Math.floor(drawHeight / 2);
    ctx.drawImage(imgEmulatorMouse, 0, 0, drawWidth, drawHeight);
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    animation.CurrentIndex = (animation.CurrentIndex + 1) % animation.getFrameCount();
    drawMouse(canvasName, animationName);
  }, duration * 1000);
}
function drawMousepad(canvasName, animationName)  {

  var animation = ChromaAnimation.getAnimation(animationName);
  if (animation == undefined) {
    return;
  }

  if (animation.DeviceType != EChromaSDKDeviceTypeEnum.DE_1D ||
    animation.Device != EChromaSDKDevice1DEnum.DE_Mousepad) {
    return;
  }

  var canvas = document.getElementById(canvasName);
  if (canvas == undefined) {
    console.error('Canvas is missing!', canvasName);
    return;
  }
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = getRGBString(0, 0, 0);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.stroke();

  var regionWidth = 75;
  var regionHeight = 83;
  var x;
  var y;

  var map = [];
  map[0] = [515, 0, 124, 124];
  x = 639 - regionWidth;
  y = 124;
  map[1] = [x, y, regionWidth, regionHeight];
  map[2] = [x, y += regionHeight, regionWidth, regionHeight];
  map[3] = [x, y += regionHeight, regionWidth, regionHeight];
  map[4] = [x, y += regionHeight, regionWidth, regionHeight];
  map[5] = [x -= regionWidth, y, regionWidth, regionHeight];
  regionWidth = 95;
  map[6] = [x -= regionWidth, y, regionWidth, regionHeight];
  map[7] = [x -= regionWidth, y, regionWidth, regionHeight];
  map[8] = [x -= regionWidth, y, regionWidth, regionHeight];
  map[9] = [x -= regionWidth, y, regionWidth, regionHeight];
  map[10] = [x -= regionWidth, y, regionWidth, regionHeight];
  regionHeight = 90;
  map[11] = [x, y -= regionHeight, regionWidth, regionHeight];
  map[12] = [x, y -= regionHeight, regionWidth, regionHeight];
  map[13] = [x, y -= regionHeight, regionWidth, regionHeight];
  map[14] = [x, y -= regionHeight, regionWidth, regionHeight];

  var frameCount = animation.getFrameCount();
  //console.log('FrameCount', frameCount);
  var maxLeds = ChromaAnimation.getMaxLeds(EChromaSDKDevice1DEnum.DE_Mousepad);
  var frameId = animation.CurrentIndex;
  if (frameId >= 0 && frameId < frameCount) {
    //var frame = animation.Frames[frameId];
    var frame = animation.Frames[animation.CurrentIndex];
    var colors = frame.Colors;

    for (var led = 0; led < maxLeds; ++led) {
      var color = colors[led];
      var red = color & 0xFF;
      var green = (color & 0xFF00) >> 8;
      var blue = (color & 0xFF0000) >> 16;
      var coords = map[led];
      //console.log('led', led, val, 'coords', coords);

      ctx.fillStyle = getRGBString(red, green, blue, 0.3);
      var a = Math.ceil(coords[0] * 294 / 640);
      var b = Math.ceil(coords[1] * 214 / 466);
      var c = Math.ceil(coords[2] * 294 / 640);
      var d = Math.ceil(coords[3] * 214 / 466);
      ctx.fillRect(a,b,c,d);
    }

    var drawWidth = canvas.width;
    var drawHeight = canvas.height;
    var halfWidth = Math.floor(drawWidth / 2);
    var halfHeight = Math.floor(drawHeight / 2);
    ctx.drawImage(imgEmulatorMousepad, 0, 0, drawWidth, drawHeight);
  }

  var duration = Number(animation.getDuration());
  duration = Math.max(duration, 0.033);
  setTimeout(function() {
    animation.CurrentIndex = (animation.CurrentIndex + 1) % animation.getFrameCount();
    drawMousepad(canvasName, animationName);
  }, duration * 1000);
}
displayKeyboardCanvas = function(baseLayer, effectName, loop) {
  var canvasName = 'canvasKeyboard' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    ChromaAnimation.multiplyIntensityAllFrames(canvasName, 1.5); //slightly brighter
    drawKeyboard(canvasName, canvasName, loop);
  }
  drawInProgress = false;
}
displayChromaLinkCanvas = function(baseLayer, effectName) {
  var canvasName = 'canvasChromaLink' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    ChromaAnimation.multiplyIntensityAllFrames(canvasName, 1.5); //slightly brighter
    drawChromaLink(canvasName, canvasName);
  }
  drawInProgress = false;
}
displayHeadsetCanvas = function(baseLayer, effectName) {
  var canvasName = 'canvasHeadset' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    ChromaAnimation.multiplyIntensityAllFrames(canvasName, 1.5); //slightly brighter
    drawHeadset(canvasName, canvasName);
  }
  drawInProgress = false;
}
displayMouseCanvas = function(baseLayer, effectName) {
  var canvasName = 'canvasMouse' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    ChromaAnimation.multiplyIntensityAllFrames(canvasName, 1.5); //slightly brighter
    drawMouse(canvasName, canvasName);
  }
  drawInProgress = false;
}
displayMousepadCanvas = function(baseLayer, effectName) {
  var canvasName = 'canvasMousepad' + effectName;
  if (ChromaAnimation.getAnimation(canvasName) == undefined) {
    ChromaAnimation.copyAnimation(baseLayer, canvasName);
    ChromaAnimation.multiplyIntensityAllFrames(canvasName, 1.5); //slightly brighter
    drawMousepad(canvasName, canvasName);
  }
  drawInProgress = false;
}
//display canvases
var setupComplete = false;
handleButtonClick = function(button) {
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
}
displayAndPlayAnimationChromaLink = function (baseLayer, canvasName) {
  displayChromaLinkCanvas(baseLayer, canvasName);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, true);
  }
}
displayAndPlayAnimationHeadset = function (baseLayer, canvasName) {
  displayHeadsetCanvas(baseLayer, canvasName);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, true);
  }
}
displayAndPlayAnimationKeyboard = function (baseLayer, canvasName, loop) {
  displayKeyboardCanvas(baseLayer, canvasName, loop != false);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, loop != false);
  }
}
displayAndPlayAnimationMouse = function (baseLayer, canvasName) {
  displayMouseCanvas(baseLayer, canvasName);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, true);
  }
}
displayAndPlayAnimationMousepad = function (baseLayer, canvasName) {
  displayMousepadCanvas(baseLayer, canvasName);
  if (initialized && setupComplete) {
    ChromaAnimation.playAnimation(baseLayer, true);
  }
}
