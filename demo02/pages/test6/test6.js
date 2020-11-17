const plugin = requirePlugin('WechatSI');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qnaire: [
      {
        "question": "3. 您是否肢体困重？"
      },
    ],
    option: [
      {value: "1", name: "是"},
      {value: "0", name: "否"},
    ],
    content: '最后一个问题，您是否肢体困重？请选择是或否。', // 语音播放内容
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.voice();
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