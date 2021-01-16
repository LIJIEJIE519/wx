const plugin = requirePlugin('WechatSI');

const app = getApp();
var res = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: "",
    content: '第一个问题，', // 语音播放内容
    src: '',  //word2voice地址
    timeId: 0,  //计时器id
    list: [
    "您是否痰多？",
    "您是否发冷？",
    "您是否发热？",
    "您是否发热？",
    "您是否身体疼痛？"],
    type: "0",    // 舌诊类型
    question_tile: "问题1："
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var oType = option.type != null ? option.type : 0;
    this.setData({
      type: oType,
      question: this.data.list[parseInt(oType)],
      content: this.data.content + this.data.list[parseInt(oType)]
    })
    this.word2voice(this.data.content);
  },

  formSubmit(e) {
    var radio = e.detail.value["radio"];
    if (radio != "") {
      res = {
        type: this.data.type,
        q1: radio
      };
      wx.navigateTo({
        url: '../test5/test5?res=' + JSON.stringify(res),
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

  onShow: function() {
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