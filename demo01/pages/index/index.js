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
    content: '我是老中医，很高兴为您服务',//内容
    currentText: "我是老中医，很高兴为您服务！",
    timeId: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
    this.word2voice();
    recorderManager.onStart(() => {})
    recorderManager.start(options)
    this.time();

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
              url: '../testCamera/testCamera',
            })
          }
        },
        fail (e) {
          console.log(e)
        }
      })
    })
  },
  onReady(e) {
    //创建内部 audio 上下文 InnerAudioContext 对象。
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
  word2voice:function (e) {
    var that = this;
    var content = this.data.content;
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
      console.log(暂无语音);
      return;
    }
    this.innerAudioContext.src = this.data.src //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },


})
