const plugin = requirePlugin('WechatSI');
var res = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: "",
    content: '最后一个问题，', // 语音播放内容
    src: '',  //word2voice地址
    timeId: 0,  //计时器id
    list: [
    "您是否睡眠不佳？",
    "您是否嗜睡？",
    "您是否睡眠不佳？",
    "您是否睡眠不佳？",
    "您是否心烦不安？"],
    type: "0",
    question_tile: "问题3："
  },

  onLoad: function (option) {
    res = JSON.parse(option.res);
    var oType = res.type != null ? res.type : 0;
    this.setData({
      type: oType,
      question: this.data.list[parseInt(oType)],
      content: this.data.content + this.data.list[parseInt(oType)]
    })
    this.word2voice(this.data.content);
  },

  formSubmit(e) {
    console.log('test6提交：', e.detail.value["radio"]);
    var radio = e.detail.value["radio"];
    if (radio != "") {
      res.q3 = radio;
      console.log(res)
      wx.navigateTo({
        url: '../test7/test7?res=' + JSON.stringify(res),
      });
    } else {
      wx.showToast({
        title: '请选择是或否',
        icon: 'loading',
        duration: 1000//持续的时间
      })
      return false;
    }
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