const plugin = requirePlugin('WechatSI');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '恭喜您已经完成舌苔检测，马上进入下一步', // 语音播放内容
    src: '',  //word2voice地址
  },

  onReady(e) {
    this.voice();
  },
  onLoad(e) {
    this.word2voice();
    this.delay();
  },

  delay: function() {
    setTimeout(function () {
      wx.navigateTo({
        url: '../test4/test3'
      })
     }, 6000) //延迟时间
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
  word2voice: function (e) {
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
      console.log("暂无语音");
      return;
    }
    this.innerAudioContext.src = this.data.src //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },
})