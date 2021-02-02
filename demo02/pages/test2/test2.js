
const plugin = requirePlugin('WechatSI');
let tongue_num = 1;
const tfl = require('@tensorflow/tfjs-layers')
const tf = require('@tensorflow/tfjs-core')
// import * as tf from '../../tfjs/tf.min.js';
let modelLocalFolder = wx.env.USER_DATA_PATH + '/model/';
let fileManager = wx.getFileSystemManager();

var app = getApp();

Page({
  onShareAppMessage() {
    return {
      title: 'camera',
    }
  },
  async predictBreed(){
    console.log("Model is loading...");
    // const MODEL_URL = wx.env.USER_DATA_PATH + '/model/model.json';
    const MODEL_URL = 'http://usr/model/model.json';
    fileManager.getFileInfo({
      filePath: MODEL_URL,
      success(res) {
        console.log(res.size);
      }
    })
    var model = await tfl.loadLayersModel(MODEL_URL);
    model.predict(tf.zeros([1, 64, 64, 3])).dispose();
    console.log("Model loaded Successfully!")
  },

  data: {
    position: 'front',
    result: {},
    frameWidth: 0,
    frameHeight: 0,
    width: 888,
    height: 358,
    showCanvas: false,

    timeId: 0,
    content: '第一步为您进行舌诊，请伸舌头对准摄像头！',//word2voice内容
    src: '',  //word2voice地址
    tongue_src: '', // 舌头拍照地址
    photo_text: "拍第一张"
  },
  
  async onReady() {
    const net = await this.predictBreed()
    this.ctx = wx.createCameraContext()
    this.voice();

  },

  onLoad(e) {
    // this.word2voice(this.data.content);
  },


  // 创建内部 voice 上下文 InnerAudioContext 对象。
  voice: function() {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError(function (res) {
      console.log(res);
      wx.showToast({
        title: '语音播放失败',
        icon: 'none',
      })
    }) 
  },



  // 文字转语音
  word2voice: function (content) {
    var that = this;
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: content,
      success: function (res) {
        console.log(res);
        that.setData({
          src: res.filename
        })
        that.play(res.filename);
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  
  //播放语音
  play: function (src) {
    if (src == '') {
      console.log("暂无语音");
      return;
    }
    this.innerAudioContext.src = src //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },
 
  init(res) {
    if (this.listener) {
      this.listener.stop()
    }
    const canvas = res.node
    const render = createRenderer(canvas, this.data.width, this.data.height);
    this.listener = this.ctx.onCameraFrame((frame) => {
      render(new Uint8Array(frame.data), frame.width, frame.height);
      const {
        frameWidth,
        frameHeight,
      } = this.data;
      if (frameWidth === frame.width && frameHeight == frame.height) return;
      this.setData({
        frameWidth: frame.width,
        frameHeight: frame.height,
      })
    })
    this.listener.start()
  },
  // 拍照上传
  takePhoto: function() {
    var that = this;
    app.globalData.theType = '2';
    console.log(app.globalData.theType);
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res.tempImagePath)
        tongue_num += 1;
        if(false) {
          that.showTag();
        }
        this.setData({
          tongue_src: res.tempImagePath,
          photo_text: "拍第"+tongue_num+"张",
        })
      }
    });

    // 0,1,2,3,4
    var type = 0;
    wx.navigateTo({
      url: '../test4/test4?type=' + type,
    });
  },


  showTag() {
    wx.showModal({
      title: '提示',
      content: '未检测到舌头，请重新拍摄',
      success (res) {
        if (res.confirm) {
          console.log('点击确定')
        } else if (res.cancel) {
          console.log('点击取消')
        }
      }
    })
  },

  // 摄像头位置
  togglePosition() {
    this.setData({
      position: this.data.position === 'front'
        ? 'back' : 'front'
    })
  },
  error(e) {
    console.log(e.detail)
  },
})
