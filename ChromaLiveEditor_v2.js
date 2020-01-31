// edit panel variables
ELEMENT.locale(ELEMENT.lang.en);
var vue = undefined;
var editCanvas = undefined;
var editButton = undefined;

Vue.component('div-chroma-set', {
  props: [ 'index', 'header', 'image', 'video' ],
  methods: {
    keyboardClick: function() {
      console.log('function not set');
    },
    keyboardCanvasClick: function(event) {
      //console.log('keyboardCanvasClick');
    }
  },
  template: `
  <div style="padding-bottom: 50px; display: inline-table">
    <div class="box" style="padding: 0px; width: 650px; background: hsl(0, 0%, 10%); display: inline-table; vertical-align: top;">
      <div style="background: hsl(0, 0%, 20%); width: 650px;">
        <button class="buttonChroma" :onclick="keyboardClick" style="font-size: 1.2em; display: inline-table; padding: 4px; max-width: 65px" :id="'showEffect'+index">{{ index }}</button>
        <div style="width: 550px; display: inline-table">{{ header }}</div>
      </div>
      <section v-show="index != undefined && index != ''" style="padding: 0px; font-size: 0.65em; text-align: center;">
        <small>
        <b>Download:</b>
        <a name="link" :onclick="'downloadChromaLinkAnimation('+index+')'" href="javascript:true;"><img title="ChromaLink" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedChromaLink.svg"/></a>
        <a name="link" :onclick="'downloadHeadsetAnimation('+index+')'" href="javascript:true;"><img title="Headset" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedHeadset.svg"/></a>
        <a name="link" :onclick="'downloadKeyboardAnimation('+index+')'" href="javascript:true;"><img title="Keyboard" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedKeyboard.svg"/></a>
        <a name="link" :onclick="'downloadMouseAnimation('+index+')'" href="javascript:true;"><img title="Mouse" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedMouse.svg"/></a>
        <a name="link" :onclick="'downloadMousepadAnimation('+index+')'" href="javascript:true;"><img title="Mousepad" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedMousepad.svg"/></a>
        <a name="link" :onclick="'downloadKeypadAnimation('+index+')'" href="javascript:true;"><img title="Keypad" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedKeypad.svg"/></a>
        <wbr/> <b>Convert</b>:
          <a name="link" :onclick="'convertChromaLinkAnimation('+index+')'" href="javascript:true;"><img title="ChromaLink" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedChromaLink.svg"/></a>
          <a name="link" :onclick="'convertHeadsetAnimation('+index+')'" href="javascript:true;"><img title="Headset" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedHeadset.svg"/></a>
          <a name="link" :onclick="'convertMouseAnimation('+index+')'" href="javascript:true;"><img title="Mouse" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedMouse.svg"/></a>
          <a name="link" :onclick="'convertMousepadAnimation('+index+')'" href="javascript:true;"><img title="Mousepad" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedMousepad.svg"/></a>
          <a name="link" :onclick="'convertKeypadAnimation('+index+')'" href="javascript:true;"><img title="Keypad" style="height: 20px; border-style: solid; border-color: #228;" src="../ChromaCommon/images/LedKeypad.svg"/></a><br/>
        </small>
      </section>
      <section v-show="image != undefined && image != ''">
        <div style="width: 645px; padding-left: 25px; background: hsl(0, 0%, 10%); color: white; display: inline-table"><img :src="image"/></div>
      </section>
      <section v-show="video != undefined && video != ''">
        <div style="width: 645px; padding-left: 25px; background: hsl(0, 0%, 10%); color: white; display: inline-table"><video class="imgThumbnail" autoplay muted loop><source :src="video"/></video></div>
      </section>
      <section v-show="index != undefined && index != ''">
        <button class="buttonChromaLink" style="display: none" :id="'showEffect'+index+'ChromaLink'">1</button>
        <button class="buttonHeadset" style="display: none" :id="'showEffect'+index+'Headset'">1</button>
        <button class="buttonKeypad" style="display: none" :id="'showEffect'+index+'Keypad'">1</button>
        <button class="buttonMouse" style="display: none" :id="'showEffect'+index+'Mouse'">1</button>
        <button class="buttonMousepad" style="display: none" :id="'showEffect'+index+'Mousepad'">1</button>
      </section>
      <section v-show="index != undefined && index != ''">
        <div v-on:click="keyboardCanvasClick" style="display: inline-table;"><object :id="'canvasKeyboardShowEffect'+index" class="canvasKeyboard" style="pointer-events:none;" type="image/svg+xml" data="../ChromaCommon/emulator/EmulatorKeyboard.svg" width="400" height="214"></object></div>
        <object :id="'canvasKeypadShowEffect'+index" class="canvasKeypad" type="image/svg+xml" data="../ChromaCommon/emulator/EmulatorKeypad.svg" width="110" height="214"></object>
        <object :id="'canvasMouseShowEffect'+index" class="canvasMouse" type="image/svg+xml" data="../ChromaCommon/emulator/EmulatorMouse.svg" width="110" height="214"></object>
      </section>
      <section v-show="index != undefined && index != ''">
        <object :id="'canvasChromaLinkShowEffect'+index" class="canvasChromaLink" type="image/svg+xml" data="../ChromaCommon/emulator/EmulatorChromaLink.svg" width="200" height="200"></object>
        <object :id="'canvasHeadsetShowEffect'+index" class="canvasHeadset" type="image/svg+xml" data="../ChromaCommon/emulator/EmulatorHeadset.svg" width="214" height="214"></object>
        <object :id="'canvasMousepadShowEffect'+index" class="canvasMousepad" type="image/svg+xml" data="../ChromaCommon/emulator/EmulatorMousepad.svg" width="214" height="214"></object>
      </section>
    </div>
  </div>
  `});
  Vue.component('div-chroma-set-list', {
    template: `
      <div>
        <div-chroma-set v-for="item in items" :index="item.index" :header="item.header" ></div-chroma-set>
      </div>
    `,
    data() {
      return {
        items: $root.dataDivChromaSets
      };
    }
  });
  Vue.component('inline-chroma-set', {
    props: [ 'index', 'alt-index', 'header', 'video', 'priority', 'devices', 'description' ],
    template: `
    <table class="tableInline">
    <tr>
      <td><u>{{ header }}</u></td><td colspan="3" style="min-width: 640px; width: 640px; max-width: 640px">{{ description }}</td>
    </tr>
    <tr :show="index != undefined && index != ''">
      <td colspan="4" style="font-size: 0.75em">Download:
        <a name="link" :onclick="'downloadChromaLinkAnimation('+index+')'" href="javascript:true;">ChromaLink</a>
        <a name="link" :onclick="'downloadHeadsetAnimation('+index+')'" href="javascript:true;">Headset</a>
        <a name="link" :onclick="'downloadKeyboardAnimation('+index+')'" href="javascript:true;">Keyboard</a>
        <a name="link" :onclick="'downloadMouseAnimation('+index+')'" href="javascript:true;">Mouse</a>
        <a name="link" :onclick="'downloadMousepadAnimation('+index+')'" href="javascript:true;">Mousepad</a>
        <a name="link" :onclick="'downloadKeypadAnimation('+index+')'" href="javascript:true;">Keypad</a>
      </td>
    </tr>
    <tr v-show="video != undefined && video != ''"><td align="center">{{ priority }}</td><td colspan="4"><video class="imgThumbnail" autoplay muted loop><source :src="video"/></video></td>
    <tr><td align="center"><button class="buttonChroma" :id="'showEffect'+index">{{ index }}</button></td><td colspan="4"><canvas class="canvasKeyboard" :id="'canvasKeyboardShowEffect'+index" width="640" height="214"></canvas></td></tr>
    <tr><td align="empty"><button class="buttonChromaLink" :id="'showEffect'+index+'ChromaLink'">1</button></td><td colspan="4"><canvas class="canvasChromaLink" :id="'canvasChromaLinkShowEffect'+index" width="640" height="50"></canvas></td></tr>
    <tr><td align="empty">
      <button class="buttonHeadset" :id="'showEffect'+index+'Headset'">1</button>
      <button class="buttonMousepad" :id="'showEffect'+index+'Mousepad'">1</button>
      <button class="buttonMouse" :id="'showEffect'+index+'Mouse'">1</button>
     </td><td colspan="4">
       <canvas class="canvasHeadset" :id="'canvasHeadsetShowEffect'+index" width="210" height="214"></canvas>
       <canvas class="canvasMousepad" :id="'canvasMousepadShowEffect'+index" width="294" height="214"></canvas>
       <canvas class="canvasMouse" :id="'canvasMouseShowEffect'+index" width="128" height="214"></canvas>
     </td></tr>
    </table>
    `});

  Vue.component('tr-chroma-keyboard', {
    props: [ 'index' ],
    template: `
    <tr v-show="index != undefined && index != ''"><td align="center" width="250px"><a :name="index"></a><button class="buttonChroma" :id="'showTableEffect'+index">{{ '+'+index }}</button></td><td colspan="4"><canvas :id="'canvasKeyboardShowTableEffect'+index" class="canvasKeyboard" width="640" height="214"></canvas></td></tr>
    `});

  Vue.component('tr-chroma-set', {
    props: [ 'index' ],
    template: `
    <tr v-show="index != undefined && index != ''">
      <td align="center" width="250px"><a :name="index"></a>
        <button class="buttonChroma" :id="'showEffect'+index">{{ '+'+index }}</button>
        <button class="buttonChromaLink" :id="'showEffect'+index+'ChromaLink'">1</button>
        <button class="buttonHeadset" :id="'showEffect'+index+'Headset'">1</button>
        <button class="buttonMousepad" :id="'showEffect'+index+'Mousepad'">1</button>
        <button class="buttonMouse" :id="'showEffect'+index+'Mouse'">1</button>
      </td>
      <td colspan="4">
        <small>Download:
        <a name="link" :onclick="'downloadChromaLinkAnimation('+index+')'" href="javascript:true;">ChromaLink</a>
        <a name="link" :onclick="'downloadHeadsetAnimation('+index+')'" href="javascript:true;">Headset</a>
        <a name="link" :onclick="'downloadKeyboardAnimation('+index+')'" href="javascript:true;">Keyboard</a>
        <a name="link" :onclick="'downloadMouseAnimation('+index+')'" href="javascript:true;">Mouse</a>
        <a name="link" :onclick="'downloadMousepadAnimation('+index+')'" href="javascript:true;">Mousepad</a>
        <a name="link" :onclick="'downloadKeypadAnimation('+index+')'" href="javascript:true;">Keypad</a>
        </small><br/>
        <small>Convert:
        <a name="link" :onclick="'convertChromaLinkAnimation('+index+')'" href="javascript:true;">ChromaLink</a>
        <a name="link" :onclick="'convertHeadsetAnimation('+index+')'" href="javascript:true;">Headset</a>
        <a name="link" :onclick="'convertMouseAnimation('+index+')'" href="javascript:true;">Mouse</a>
        <a name="link" :onclick="'convertMousepadAnimation('+index+')'" href="javascript:true;">Mousepad</a>
        <a name="link" :onclick="'convertKeypadAnimation('+index+')'" href="javascript:true;">Keypad</a><br/>
        </small><br/>
        <canvas class="canvasKeyboard" :id="'canvasKeyboardShowEffect'+index" width="640" height="214"></canvas><br/>
        <canvas class="canvasChromaLink" :id="'canvasChromaLinkShowEffect'+index" width="640" height="50"></canvas><br/>
        <canvas class="canvasHeadset" :id="'canvasHeadsetShowEffect'+index" width="210" height="214"></canvas>
        <canvas class="canvasMousepad" :id="'canvasMousepadShowEffect'+index" width="294" height="214"></canvas>
        <canvas class="canvasMouse" :id="'canvasMouseShowEffect'+index" width="128" height="214"></canvas>
      </td>
    </tr>
    `});

  Vue.component('block-chroma-keyboard', {
    props: [ 'index', 'header', 'priority', 'devices', 'description', 'bonus', 'image', 'video' ],
    template: `
    <table class="tableBlock" width="100%">
    <tr bgcolor="#444444" v-show="header != undefined">
    <td><b>Effect</b></td>
    <td><b>Priority</b></td>
    <td><b>Devices</b></td>
    <td><b>Description</b></td>
    <td><b>Bonus (P2+)</b></td>
    </tr>

    <tr v-show="header != undefined">
      <td width="250px">{{ header }}</td><td width="125px">{{ priority }}</td><td width="125px">{{ devices }}</td><td>{{ description }}</td><td class="tdEmpty">{{ bonus }}</td>
    </tr>
    <tr v-show="video != undefined && video != ''"><td class="tdEmpty" width="250px"></td><td colspan="4"><video class="imgThumbnail" autoplay muted loop><source :src="video"/></video></td></tr>
    <tr v-show="image != undefined && image != ''"><td class="tdEmpty" width="250px"></td><td colspan="4"><img :src="image"/></td></tr>
    <tr v-show="index != undefined && index != ''">
      <td class="tdEmpty"></td>
      <td colspan="4">
        Download:
        <a name="link" :onclick="'downloadKeyboardTableAnimation('+index+')'" href="javascript:true;">Keyboard</a>
      </td>
    </tr>
    <tr v-show="index != undefined && index != ''"><td align="center" width="250px"><button class="buttonChroma" :id="'showTableEffect'+index">{{ '+'+index }}</button></td><td colspan="4"><canvas :id="'canvasKeyboardShowTableEffect'+index" class="canvasKeyboard" width="640" height="214"></canvas></td></tr>
    </table>
    `});

function getRGBValuesFromString(color) {
  var newColor = "";
  for (var i = 0; i < color.length; ++i) {
    var c = color[i];
    switch (c) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case ',':
        newColor += c;
        break;
    }
  }
  return newColor;
}

vue = new Vue({
  el: '#root',

  data: {
    editText: '',
    colors: [
      //{ color: '#FF0000' },
    ],
    thresholds: [
      //{ threshold: 0, max: 255, step: 1},
    ],
    layers: [
      { value: "../ChromaCommon/animations/BarrelFlash1_Keyboard.chroma" }
    ],
    layerOptions: [
      //{ label: "BarrelFlash1", value: "../ChromaCommon/animations/BarrelFlash1_Keyboard.chroma" }
    ],
    predefineColors: [
      '#ff0000',
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#ffff00',
      '#90ee90',
      '#00ffff',
      '#1e90ff',
      '#c71585',
      '#ff00ff'
    ],
    dataDivChromaSets: [
    ]
  },

  methods: {

    convertIntToHex(value) {
      var result = value.toString(16);
      if (result.length == 1) {
        return "0" + result;
      }
      return result;
    },

    hexToRGB(hex) {
      if (hex.indexOf("#") >= 0) {
        var color = parseInt("0x" + hex.substring(1));
        var blue = color & 0xFF;
        var green = (color & 0xFF00) >> 8;
        var red = (color & 0xFF0000) >> 16;
        return getRGBString(red, green, blue);
      } else {
        return "rgb(255, 255, 255)";
      }
    },

    getEditLayer(layerIndex) {
      var c = 0;
      for (var i = 0; i < vue.$children.length; ++i) {
        if (vue.$children[i].constructor.options.name == "ElSelect") {
          if (c == layerIndex) {
            var layer = vue.$children[i].value;
            if (layer != undefined) {
              return layer;
            }
            return "";
          }
          ++c;
        }
      }
      return "";
    },

    getEditColor(colorIndex) {
      var c = 0;
      for (var i = 0; i < vue.$children.length; ++i) {
        if (vue.$children[i].constructor.options.name == "ElColorPicker") {
          //console.log('color picker', vue.$children[i]._data.color.value);
          if (c == colorIndex) {
            var color = vue.$children[i]._data.color.value;
            if (color != undefined) {
              return this.hexToRGB(color);
            }
            return "rgb(255, 255, 255)";
          }
          ++c;
        }
      }
      return "rgb(255, 255, 255)";
    },

    getEditThreshold(thresholdIndex) {
      var threshold = vue._data.thresholds[thresholdIndex].threshold
      if (threshold == undefined) {
        return 255;
      }
      return threshold;
    },

    setEditColor(colorIndex, hex) {
      vue._data.colors[colorIndex].color = hex;
    },

    modifyEditLayer(lines, i, layerIndex, token) {
      var line = lines[i];

      try {
        var index = line.indexOf(token);
        if (index >= 0) {
          //console.log('before', 'layerIndex', layerIndex, line);

          var first = index + token.length;
          var start = undefined;
          for (var j = first; j < line.length; ++j) {
            if (line[j] == '"' || line[j] == "'") {
              if (start == undefined) {
                start = j;
              } else {
                var layer = this.getEditLayer(layerIndex);
                //console.log(layerIndex, 'layer', layer);
                ++layerIndex;
                line = line.substring(0, start+1) + layer + line.substring(j);
                break;
              }
            }
          }

          //console.log('after', 'layerIndex', layerIndex, line);
          lines[i] = line;
        }
      } catch (err) {
        console.error('layerIndex', layerIndex, err);
      }
      return layerIndex;
    },

    modifyEditThreshold(lines, i, thresholdIndex, token, arg) {
      var line = lines[i];

      try {
        var index = line.indexOf(token);
        if (index >= 0) {
          //console.log('before', 'thresholdIndex', thresholdIndex, line);
          var first = index + token.length;

          var last = line.substring(first).indexOf(')');
          var args = line.substring(first).substring(0, last).split(",");
          //console.log('args', args);

          args[arg] = this.getEditThreshold(thresholdIndex);
          vue._data.thresholds[thresholdIndex].max = 255;
          vue._data.thresholds[thresholdIndex].step = 1;
          ++thresholdIndex;

          line = line.substring(0, first) + args.join(",") + line.substring(first+last);

          //console.log('after', 'thresholdIndex', thresholdIndex, line);
          lines[i] = line;
        }
      } catch (err) {
        console.error('thresholdIndex', thresholdIndex, err);
      }
      return thresholdIndex;
    },

    modifyEditThresholdF(lines, i, thresholdIndex, token, arg) {
      var line = lines[i];

      try {
        var index = line.indexOf(token);
        if (index >= 0) {
          //console.log('before', 'thresholdIndex', thresholdIndex, line);
          var first = index + token.length;

          var last = line.substring(first).indexOf(')');
          var args = line.substring(first).substring(0, last).split(",");
          //console.log('args', args);

          args[arg] = this.getEditThreshold(thresholdIndex);
          vue._data.thresholds[thresholdIndex].max = 1;
          vue._data.thresholds[thresholdIndex].step = 0.1;
          ++thresholdIndex;

          line = line.substring(0, first) + args.join(",") + line.substring(first+last);

          //console.log('after', 'thresholdIndex', thresholdIndex, line);
          lines[i] = line;
        }
      } catch (err) {
        console.error('thresholdIndex', thresholdIndex, err);
      }
      return thresholdIndex;
    },

    modifyEditColor(lines, i, colorIndex, token, arg) {
      var line = lines[i];

      try {
        var index = line.indexOf(token);
        if (index >= 0) {
          //console.log('before', 'colorIndex', colorIndex, line);
          var first = index + token.length;

          var last = line.substring(first).indexOf(')');
          var args = line.substring(first).substring(0, last).split(",");
          //console.log('args', args);

          var editColor = this.getEditColor(colorIndex);
          var newColor = getRGBValuesFromString(editColor);
          var parts = newColor.split(",");
          args[arg] = parts[0];
          args[arg+1] = parts[1];
          args[arg+2] = parts[2];
          ++colorIndex;

          line = line.substring(0, first) + args.join(",") + line.substring(first+last);

          //console.log('after', 'colorIndex', colorIndex, line);
          lines[i] = line;
        }
      } catch (err) {
        console.error('colorIndex', colorIndex, err);
      }
      return colorIndex;
    },

    onTextChange(text) {
      //console.log('onTextChange', text);
      var editText = vue._data.editText;
      editButton.onclick = eval(editButton.id + " = " + editText);
      ChromaAnimation.closeAnimation(editCanvas.id);
      var first = editText.indexOf('{');
      var last = editText.lastIndexOf('}') + 1;
      var code = editText.substring(first, last);
      eval(code);
    },

    onLayerChange(option) {
      //console.log(option);

      var refThis = this;
      setTimeout(function() {
        var layerIndex = 0;

        var editText = vue._data.editText;
        var lines = editText.toString().split(/\n/);
        for (var i = 0; i < lines.length; ++i) {
          layerIndex = refThis.modifyEditLayer(lines, i, layerIndex, 'var baseLayer');
          layerIndex = refThis.modifyEditLayer(lines, i, layerIndex, 'var layer');
        }
        editText = lines.join("\n");
        vue._data.editText = editText;
        editButton.onclick = eval(editButton.id + " = " + editText);
        ChromaAnimation.closeAnimation(editCanvas.id);
        var first = editText.indexOf('{');
        var last = editText.lastIndexOf('}') + 1;
        var code = editText.substring(first, last);
        eval(code);
      }, 100);
    },

    onColorChange(color) {

      var colorIndex = 0;

      //console.log('color-change', color, this, self);
      var editText = vue._data.editText;
      var lines = editText.toString().split(/\n/);
      for (var i = 0; i < lines.length; ++i) {
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.getRGB(', 0);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.makeBlankFramesRGB(', 3);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.multiplyIntensityRGB(', 2);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.multiplyIntensityAllFramesRGB(', 1);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillThresholdColorsRGB(', 3);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillThresholdColorsAllFramesRGB(', 2);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 2); //first
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 6); //second
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillNonZeroColorAllFramesRGB(', 1);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.fillZeroColorAllFramesRGB(', 1);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.setKeysColorAllFramesRGB(', 2);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.offsetColorsAllFrames(', 1);
        colorIndex = this.modifyEditColor(lines, i, colorIndex, 'ChromaAnimation.reactiveKeyEffectAllFramesRGB(', 3);
      }
      editText = lines.join("\n");
      vue._data.editText = editText;
      editButton.onclick = eval(editButton.id + " = " + editText);
      ChromaAnimation.closeAnimation(editCanvas.id);
      var first = editText.indexOf('{');
      var last = editText.lastIndexOf('}') + 1;
      var code = editText.substring(first, last);
      eval(code);
    },

    onThresholdChange(threshold) {

      var thresholdIndex = 0;

      //console.log('color-change', color, this, self);
      var editText = vue._data.editText;
      var lines = editText.toString().split(/\n/);
      for (var i = 0; i < lines.length; ++i) {
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.fillThresholdColorsAllFramesRGB(', 1);
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 1); //first
        thresholdIndex = this.modifyEditThreshold(lines, i, thresholdIndex, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 5); //second
        thresholdIndex = this.modifyEditThresholdF(lines, i, thresholdIndex, 'ChromaAnimation.multiplyIntensityAllFrames(', 1);
      }
      editText = lines.join("\n");
      vue._data.editText = editText;
      editButton.onclick = eval(editButton.id + " = " + editText);
      ChromaAnimation.closeAnimation(editCanvas.id);
      var first = editText.indexOf('{');
      var last = editText.lastIndexOf('}') + 1;
      var code = editText.substring(first, last);
      eval(code);
    }


  }
});

//common animations

var animations = [];
animations.push('Arc1_Keyboard.chroma');
animations.push('Arc2_Keyboard.chroma');
animations.push('Arc3_Keyboard.chroma');
animations.push('Arc4_Keyboard.chroma');
animations.push('Arrow1_Keyboard.chroma');
animations.push('BarrelFlash1_Keyboard.chroma');
animations.push('BarrelFlash2_Keyboard.chroma');
animations.push('BarrelFlash3_Keyboard.chroma');
animations.push('BarRightToLeft_Keyboard.chroma');
animations.push('BarTopDown_Keyboard.chroma');
animations.push('BattleBus_Keyboard.chroma');
animations.push('Bird1_Keyboard.chroma');
animations.push('BlackAndWhiteRainbow_Keyboard.chroma');
animations.push('Blank_Keyboard.chroma');
animations.push('Blank2_Keyboard.chroma');
animations.push('Block1_Keyboard.chroma');
animations.push('Block2_Keyboard.chroma');
animations.push('Block3_Keyboard.chroma');
animations.push('Block4_Keyboard.chroma');
animations.push('Bolt1_Keyboard.chroma');
animations.push('Bolt2_Keyboard.chroma');
animations.push('Bolt3_Keyboard.chroma');
animations.push('Bolt4_Keyboard.chroma');
animations.push('Bow1_Keyboard.chroma');
animations.push('Chainsaw1_Keyboard.chroma');
animations.push('Chest1_Keyboard.chroma');
animations.push('Cinematic1_Keyboard.chroma');
animations.push('Cinematic2_Keyboard.chroma');
animations.push('Cinematic3_Keyboard.chroma');
animations.push('CircleExpanding_Keyboard.chroma');
animations.push('CircleLarge_Keyboard.chroma');
animations.push('CircleLarge2_Keyboard.chroma');
animations.push('CircleLargeLeft_Keyboard.chroma');
animations.push('CircleLargeRight_Keyboard.chroma');
animations.push('CircleSmall_Keyboard.chroma');
animations.push('CircleSmallLeft_Keyboard.chroma');
animations.push('CircleSmallRight_Keyboard.chroma');
animations.push('Claws1_Keyboard.chroma');
animations.push('Clouds1_Keyboard.chroma');
animations.push('Clouds2_Keyboard.chroma');
animations.push('Clouds3_Keyboard.chroma');
animations.push('Damage1_Keyboard.chroma');
animations.push('Damage2_Keyboard.chroma');
animations.push('Damage3_Keyboard.chroma');
animations.push('Damage4_Keyboard.chroma');
animations.push('Damage5_Keyboard.chroma');
animations.push('Damage6_Keyboard.chroma');
animations.push('Damage7_Keyboard.chroma');
animations.push('Damage8_Keyboard.chroma');
animations.push('Dragon1_Keyboard.chroma');
animations.push('Dragon2_Keyboard.chroma');
animations.push('Dragon3_Keyboard.chroma');
animations.push('Energy1_Keyboard.chroma');
animations.push('Fireball1_Keyboard.chroma');
animations.push('Fork1_Keyboard.chroma');
animations.push('Fork2_Keyboard.chroma');
animations.push('Fork3_Keyboard.chroma');
animations.push('Fork4_Keyboard.chroma');
animations.push('Fork5_Keyboard.chroma');
animations.push('FreeFall1_Keyboard.chroma');
animations.push('FreeFall2_Keyboard.chroma');
animations.push('Glider1_Keyboard.chroma');
animations.push('Glider2_Keyboard.chroma');
animations.push('Hatchet_Keyboard.chroma');
animations.push('Heart1_Keyboard.chroma');
animations.push('Ladder1_Keyboard.chroma');
animations.push('Ladder2_Keyboard.chroma');
animations.push('LaserA_Keyboard.chroma');
animations.push('LaserB_Keyboard.chroma');
animations.push('LaserRotate_Keyboard.chroma');
animations.push('LaserScroll_Keyboard.chroma');
animations.push('Lightning1_Keyboard.chroma');
animations.push('Lightning2_Keyboard.chroma');
animations.push('Lightning3_Keyboard.chroma');
animations.push('Llama1_Keyboard.chroma');
animations.push('Llama2_Keyboard.chroma');
animations.push('Llama3_Keyboard.chroma');
animations.push('Llama4_Keyboard.chroma');
animations.push('Logo1_Keyboard.chroma');
animations.push('Logo2_Keyboard.chroma');
animations.push('MachineGun1_Keyboard.chroma');
animations.push('MachineGun2_Keyboard.chroma');
animations.push('Melee1_Keyboard.chroma');
animations.push('Missile1_Keyboard.chroma');
animations.push('Missile2_Keyboard.chroma');
animations.push('Missile3_Keyboard.chroma');
animations.push('MovementUpLeft_Keyboard.chroma');
animations.push('MovementUpRight_Keyboard.chroma');
animations.push('OpenDoor1_Keyboard.chroma');
animations.push('OpenDoor2_Keyboard.chroma');
animations.push('OutParticle1_Keyboard.chroma');
animations.push('Particle1_Keyboard.chroma');
animations.push('Particle2_Keyboard.chroma');
animations.push('Particle3_Keyboard.chroma');
animations.push('ParticleTrail1_Keyboard.chroma');
animations.push('ParticleTrail2_Keyboard.chroma');
animations.push('ParticleTrail3_Keyboard.chroma');
animations.push('ParticleTrail4_Keyboard.chroma');
animations.push('Projectiles_Keyboard.chroma');
animations.push('Rain1_Keyboard.chroma');
animations.push('Ray1_Keyboard.chroma');
animations.push('Ray2_Keyboard.chroma');
animations.push('ReactiveSpace_Keyboard.chroma');
animations.push('Reticle1_Keyboard.chroma');
animations.push('Reticle2_Keyboard.chroma');
animations.push('Reticle3_Keyboard.chroma');
animations.push('Reticle4_Keyboard.chroma');
animations.push('Ring1_Keyboard.chroma');
animations.push('Ring2_Keyboard.chroma');
animations.push('Ring3_Keyboard.chroma');
animations.push('RocketProjectile1_Keyboard.chroma');
animations.push('Search1_Keyboard.chroma');
animations.push('Search2_Keyboard.chroma');
animations.push('Search3_Keyboard.chroma');
animations.push('Search4_Keyboard.chroma');
animations.push('SearchLight1_Keyboard.chroma');
animations.push('Spiral_Keyboard.chroma');
animations.push('Spray1_Keyboard.chroma');
animations.push('Spray2_Keyboard.chroma');
animations.push('Spray3_Keyboard.chroma');
animations.push('Star_Keyboard.chroma');
animations.push('Stripes1_Keyboard.chroma');
animations.push('Sword1_Keyboard.chroma');
animations.push('ThrowUp_Keyboard.chroma');
animations.push('ThrowUpLeft_Keyboard.chroma');
animations.push('ThrowUpRight_Keyboard.chroma');
animations.push('Tongue1_Keyboard.chroma');
animations.push('Tornado1_Keyboard.chroma');
animations.push('Trail1_Keyboard.chroma');
animations.push('Trail2_Keyboard.chroma');
animations.push('Trail3_Keyboard.chroma');
animations.push('Train1_Keyboard.chroma');
animations.push('Train2_Keyboard.chroma');
animations.push('Travel1_Keyboard.chroma');
animations.push('UpParticle1_Keyboard.chroma');
animations.push('UpParticle2_Keyboard.chroma');
animations.push('UpParticle3_Keyboard.chroma');
animations.push('WindMill1_Keyboard.chroma');
animations.push('Wisp1_Keyboard.chroma');
animations.push('Wisp2_Keyboard.chroma');
animations.push('Wisp3_Keyboard.chroma');
animations.push('WispBuild_Keyboard.chroma');
animations.push('WispLarge_Keyboard.chroma');
animations.push('X_Keyboard.chroma');
animations.push('X1_Keyboard.chroma');
animations.push('X2_Keyboard.chroma');
animations.push('XOutline_Keyboard.chroma');

var layerOptions = [];
for (var i in animations) {
  var animation = animations[i];
  layerOptions.push({ label: animation, value: '../ChromaCommon/animations/'+animation });
  vue._data.layerOptions = layerOptions;
}

parseEditColor = function(line, token, arg) {
  var index = line.indexOf(token);
  if (index >= 0) {
    var first = index + token.length;
    for (var j = first; j < line.length; ++j) {
      //extract rgb
      if (line[j] == ')') {
        var rgb = line.substring(first, j);
        var parts = rgb.split(",");
        var red = vue.convertIntToHex(parseInt(parts[arg].trim()));
        var green = vue.convertIntToHex(parseInt(parts[arg+1].trim()));
        var blue = vue.convertIntToHex(parseInt(parts[arg+2].trim()));
        var editColor = "#" + red + green + blue;
        vue._data.colors.push({ color: editColor });
        break;
      }
    }
  }
}
parseEditThreshold = function(line, token, arg) {
  var index = line.indexOf(token);
  if (index >= 0) {
    var first = index + token.length;
    for (var j = first; j < line.length; ++j) {
      //extract rgb
      if (line[j] == ')') {
        var args = line.substring(first, j);
        var parts = args.split(",");
        var threshold = parseInt(parts[arg].trim());
        vue._data.thresholds.push({ threshold: threshold, max: 255, step: 1 });
        break;
      }
    }
  }
}
parseEditThresholdF = function(line, token, arg) {
  var index = line.indexOf(token);
  if (index >= 0) {
    var first = index + token.length;
    for (var j = first; j < line.length; ++j) {
      //extract rgb
      if (line[j] == ')') {
        var args = line.substring(first, j);
        var parts = args.split(",");
        var threshold = parseFloat(parts[arg].trim());
        vue._data.thresholds.push({ threshold: threshold, max: 1, step: 0.1 });
        break;
      }
    }
  }
}
parseEditLayer = function(line, token, arg) {
  var index = line.indexOf(token);
  if (index >= 0) {
    var first = index + token.length;
    var start = undefined;
    for (var j = first; j < line.length; ++j) {
      //extract rgb
      if (line[j] == '"' || line[j] == "'") {
        if (start == undefined) {
          start = j+1;
        } else {
          var path = line.substring(start).substring(0, j-start);
          //console.log('path', path);
          vue._data.layers.push({ label: path.substring(path.lastIndexOf('/')), value: path });
        }
      }
    }
  }
}
displayEditComponents = function() {

  // show RGB colors

  // reset data
  vue._data.layers = [];
  vue._data.colors = [];
  vue._data.thresholds = [];

  var lines = vue._data.editText.toString().split(/\n/);
  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];
    //console.log(line);

    parseEditLayer(line, 'var baseLayer');
    parseEditLayer(line, 'var layer');

    parseEditColor(line, 'ChromaAnimation.getRGB(', 0);
    parseEditColor(line, 'ChromaAnimation.makeBlankFramesRGB(', 3);
    parseEditColor(line, 'ChromaAnimation.multiplyIntensityRGB(', 2);
    parseEditColor(line, 'ChromaAnimation.multiplyIntensityAllFramesRGB(', 1);
    parseEditColor(line, 'ChromaAnimation.fillThresholdColorsRGB(', 3);
    parseEditColor(line, 'ChromaAnimation.fillThresholdColorsAllFramesRGB(', 2);
    parseEditColor(line, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 2); //first
    parseEditColor(line, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 6); //second
    parseEditColor(line, 'ChromaAnimation.fillNonZeroColorAllFramesRGB(', 1);
    parseEditColor(line, 'ChromaAnimation.fillZeroColorAllFramesRGB(', 1);
    parseEditColor(line, 'ChromaAnimation.setKeysColorAllFramesRGB(', 2);
    parseEditColor(line, 'ChromaAnimation.offsetColorsAllFrames(', 1);
    parseEditColor(line, 'ChromaAnimation.reactiveKeyEffectAllFrames(', 3);

    parseEditThreshold(line, 'ChromaAnimation.fillThresholdColorsAllFramesRGB(', 1);
    parseEditThreshold(line, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 1); //second
    parseEditThreshold(line, 'ChromaAnimation.fillThresholdColorsMinMaxAllFramesRGB(', 5); //second
    parseEditThresholdF(line, 'ChromaAnimation.multiplyIntensityAllFrames(', 1);
  }
}
openLiveEditor = function(canvas, buttonName) {
  editButton = document.getElementById(buttonName);
  if (editButton == undefined) {
    console.error(buttonName, 'could not be found!');
    return;
  }
  editCanvas = canvas;
  var panel = document.getElementById('editPanel');
  if (panel == undefined ||
    panel.style == undefined) {
    console.error('editPanel', 'could not be found!');
    return;
  }
  if (editButton.onclick == undefined) {
    var index = buttonName.substring('showEffect'.length);
    var keyboardClick = undefined;
    for (var i in vue.dataDivChromaSets) {
      var divChromaSet = vue.dataDivChromaSets[i];
      if (divChromaSet.index == index) {
        keyboardClick = divChromaSet.keyboardClick;
        break;
      }
    }
    if (keyboardClick == undefined) {
      console.error(buttonName, 'does not have a click event');
      return;
    }
    editButton.onclick = keyboardClick;
  }
  var editText = editButton.onclick.toString();
  if (panel.style.display == "none" ||
    vue._data.editText != editText) {
    panel.style.display = "";
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    var left = (document.documentElement.scrollLeft || document.body.scrollLeft) + editButton.getBoundingClientRect().x;
    left += 715;
    top += editButton.getBoundingClientRect().y - 100;
    var style = "top: "+Math.floor(top)+"px; left: "+Math.floor(left)+"px; width: 1500px; height: 910px";
    panel.style = style;
    vue._data.editText = editText;

    displayEditComponents();

  } else {
    panel.style.display = "none";
  }
}
setupLiveEditOnClick = function(canvas) {
  if (canvas.id != undefined) {
    //console.log('canvas.id', canvas.id);
    var buttonName = 's'+canvas.id.substring('canvasKeyboardS'.length);
    canvas.parentElement.onclick = function() {
      openLiveEditor(canvas, buttonName);
    };
  }
}
function downloadAnimation(index, deviceType) {
  var canvasName = 'canvas'+deviceType+'ShowEffect'+index;
  var animation = ChromaAnimation.getAnimation(canvasName)
  if (animation != undefined) {
    //console.log(canvasName, animation);
    var data = animation.saveAnimation();
    var uriContent = URL.createObjectURL(data);
    var lnkDownload = document.getElementById('lnkDownload');
    lnkDownload.download = 'ShowEffect'+index+'_'+deviceType+'.chroma';
    lnkDownload.href = uriContent;
    lnkDownload.click();
  }
}
function downloadTableAnimation(index, deviceType) {
  var canvasName = 'canvas'+deviceType+'ShowTableEffect'+index;
  var animation = ChromaAnimation.getAnimation(canvasName)
  if (animation != undefined) {
    //console.log(canvasName, animation);
    var data = animation.saveAnimation();
    var uriContent = URL.createObjectURL(data);
    var lnkDownload = document.getElementById('lnkDownload');
    lnkDownload.download = 'ShowTableEffect'+index+'_'+deviceType+'.chroma';
    lnkDownload.href = uriContent;
    lnkDownload.click();
  }
}
function downloadKeyboardAnimation(index) {
  downloadAnimation(index, 'Keyboard');
}
function downloadChromaLinkAnimation(index) {
  downloadAnimation(index, 'ChromaLink');
}
function downloadHeadsetAnimation(index) {
  downloadAnimation(index, 'Headset');
}
function downloadMouseAnimation(index) {
  downloadAnimation(index, 'Mouse');
}
function downloadMousepadAnimation(index) {
  downloadAnimation(index, 'Mousepad');
}
function downloadKeypadAnimation(index) {
  downloadAnimation(index, 'Keypad');
}
function downloadKeyboardTableAnimation(index) {
  downloadTableAnimation(index, 'Keyboard');
}

function convertAnimation(index, deviceType, targetDeviceType) {
  var canvasName = 'canvas'+deviceType+'ShowEffect'+index;
  var sourceAnimation = ChromaAnimation.getAnimation(canvasName)
  if (sourceAnimation == undefined) {
    return;
  }
  var targetName = 'canvas'+targetDeviceType+'ShowEffect'+index;
  //console.log(canvasName, sourceAnimation);
  var data = undefined;
  switch (targetDeviceType) {
    case 'ChromaLink':
      data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_ChromaLink);
      break;
    case 'Headset':
      data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_Headset);
      break;
    case 'Mousepad':
      data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_1D, EChromaSDKDevice1DEnum.DE_Mousepad);
      break;
    case 'Keyboard':
      data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Keyboard);
      break;
    case 'Keypad':
      data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Keypad);
      break;
    case 'Mouse':
      data = ChromaAnimation.convertAnimation(canvasName, targetName, EChromaSDKDeviceTypeEnum.DE_2D, EChromaSDKDevice2DEnum.DE_Mouse);
      break;
  }
  if (data == undefined) {
    return;
  }
  var uriContent = URL.createObjectURL(data.saveAnimation());
  var lnkDownload = document.getElementById('lnkDownload');
  lnkDownload.download = 'ShowEffect'+index+'_'+targetDeviceType+'.chroma';
  lnkDownload.href = uriContent;
  lnkDownload.click();
}
function convertChromaLinkAnimation(index) {
  convertAnimation(index, 'Keyboard', 'ChromaLink');
}
function convertHeadsetAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Headset');
}
function convertMouseAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Mouse');
}
function convertMousepadAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Mousepad');
}
function convertKeypadAnimation(index) {
  convertAnimation(index, 'Keyboard', 'Keypad');
}
