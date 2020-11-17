const plugin = requirePlugin('WechatSI');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qnaire: [{
        "question": "1. 您是否头重如裹？"
      },
      {
        "question": "2. 您是否昏昏欲睡？"
      },
      {
        "question": "3. 您是否脘腹痞满？"
      }],
    option: [
      {value: "1", name: "是"},
      {value: "0", name: "否"},
    ],
    content: '', //内容
    src:'', //
    list: [
      "您是否头重如裹？请回答是或否。",
      "您是否昏昏欲睡？请回答是或否。",
      "您是否肢体困重？请回答是或否。"],
  },
  //
  radioChange: function(e) {
  },
  formSubmit: function(e) {
    // let key = Object.keys(itmes)
    const len = this.data.qnaire.length
    let sum = 0
    for (let i = 0; i < len; ++i) {
      let val = e.detail.value["answer"+i]
      if (val != "") {
        sum += parseInt(val)
      } else {
        wx.showModal({
          content: '还有题目未选择!',
          showCancel: false
        })
        return false;
      }
    }
    console.log(sum)
    // wx.navigateTo({
    //   url: '/pages/main03/mindex03'
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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

  onLoad(e) {
    // this.word2voice();
  },
  // 文字转语音
  word2voice:function (e) {
    var that = this;
    for (let i = 0; i < this.data.list.length; ++i) {
      var content = this.data.list[i];

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

    }
    
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