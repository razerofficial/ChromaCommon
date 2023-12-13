// Universal Module Definition
; (function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Chroma = factory();
  }
}(this, function () {
  return {
    ChromaSDK, chromaSDK, RZKEY, RZLED, Mouse, getHighByte, getLowByte,
    EChromaSDKDeviceTypeEnum, EChromaSDKDevice1DEnum, EChromaSDKDevice2DEnum, EChromaSDKDeviceEnum,
    ChromaAnimationFrame1D, ChromaAnimationFrame2D, ChromaAnimation, ChromaAnimation1D, ChromaAnimation2D
  };
}));

