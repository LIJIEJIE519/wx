//app.js

var fetchWechat = require('fetch-wechat');
var tf = require('@tensorflow/tfjs-core');
var tfl = require('@tensorflow/tfjs-layers');
var webgl = require('@tensorflow/tfjs-backend-webgl');
var cpu = require('@tensorflow/tfjs-backend-cpu');
var plugin = requirePlugin('tfjsPlugin');



App({

  onLaunch: function () {
    tf.ENV.flagRegistry.WEBGL_VERSION.evaluationFn = () => { return 1 };
    plugin.configPlugin({
      // polyfill fetch function
      fetchFunc: fetchWechat.fetchFunc(),
      // inject tfjs runtime
      tf,
      tfl,
      // inject webgl backend
      webgl,
      // inject cpu backend
      cpu,
      // provide webgl canvas
      canvas: wx.createOffscreenCanvas()
    });
    // tf.tensor([1, 2, 3, 4]).print();
  },
})