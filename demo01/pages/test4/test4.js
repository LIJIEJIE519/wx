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

  /**
   * 页面的初始数据
   */
  data: {
    qnaire: [
      {
        "question": "1. 您是否头重如裹？请回答是或否。"
      },
    ],
    option: [
      {value: "1", name: "是"},
      {value: "0", name: "否"},
    ],
    content: '第一个问题，您是否头重如裹？请回答是或否。', // 语音播放内容
    src: '',  //word2voice地址
    timeId: 0,  //计时器id
    list: [
    "您是否头重如裹？请回答是或否。",
    "您是否昏昏欲睡？请回答是或否。",
    "您是否肢体困重？请回答是或否。"],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.word2voice(this.data.content);
    this.delayRecoder(7000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.voice();
  },

  delayRecoder: function(time) {
    let that = this;
    setTimeout(function() {
      recorderManager.onStart(() => {})
      recorderManager.start(options)
      that.recordeDetect();
    }, time);  
  },

   // 关键字录音上传检测
  recordeDetect: function() {
    recorderManager.onStop(res => {
      let that = this;
      wx.uploadFile({
        url: 'http://81.70.101.221:9999/detectHotWords',
        filePath: res.tempFilePath,
        name: 'file',
        success (res){
          console.log(res);
          if(res.data >= 1) {
            console.log("11111");
            wx.navigateTo({
              url: '../test5/test5',
            })
          } else if(res.data <= 0) {
            that.play(that.data.src);
            that.delayRecoder(6000);
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
        // 保存当前地址
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
})