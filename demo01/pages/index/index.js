//index.js
//获取应用实例
const app = getApp()
const plugin = requirePlugin('WechatSI');

// 录音
const recorderManager = wx.getRecorderManager();
const options = {
    duration: 3000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 64000,
    format: 'mp3',
    frameSize: 50
}

Page({
  data: {
    content: '我是老中医，很高兴为您服务',        // word2voice内容
    currentText: "我是老中医，很高兴为您服务！",  // 页面显示内容
    src: '',  //word2voice地址
    timeId: 0,
    
  },

  endTime: function() {
    console.log("停止循环...")
    clearInterval(this.timeId)
  },

  time: function () {
    this.timeId = setInterval(function() {
      recorderManager.start(options)
    }, 4000)
  },

  onLoad: function () {
    this.word2voice(this.data.content);
    recorderManager.onStart(() => {})
    recorderManager.start(options)
    this.time();
    this.recordeDetect();
    
  },
  onReady(e) {
    this.voice();
  },

  // 关键字录音上传检测
  recordeDetect: function() {
    recorderManager.onStop(res => {
      let _that = this;
      wx.uploadFile({
        url: 'http://81.70.101.221:9999/uploadAudio',
        filePath: res.tempFilePath,
        name: 'file',
        success (res){
          console.log(res)
          
          if(res.data == "YES 检测到关键词!") {
            _that.endTime();
            wx.navigateTo({
              url: '../test2/test2',
            })
          }
        },
        fail (e) {
          console.log(e)
        }
      })
    })
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
  word2voice:function (content) {
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
        that.play();
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  
  //播放语音
  play: function (e) {
    if (this.data.src == '') {
      console.log("暂无语音");
      return;
    }
    this.innerAudioContext.src = this.data.src //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },


})
