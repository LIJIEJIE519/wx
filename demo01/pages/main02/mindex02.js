const plugin = requirePlugin('WechatSI');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qnaire: [
      {
        "question": "1. 头重如裹"
      },
      {
        "question": "2. 昏昏欲睡"
      },
      {
        "question": "3. 脘腹痞满"
      },
      {
        "question": "4. 呕恶涎沫"
      },
      {
        "question": "5. 肢体困重"
      },
      {
        "question": "6. 口粘不渴"
      },
      {
        "question": "7. 面浮肢肿"
      },
      {
        "question": "8. 食少纳呆"
      },
      {
        "question": "9. 大便不爽"
      },
      {
        "question": "10. 体型肥胖",
        "option": {
          "2": "体重指数＜25",
          "3": "25≤体重指数＜29",
          "4": "29≤体重指数＜34",
          "5": "34≤体重指数",  
        }
      }
    ],
    option: [
      {value: "5", name: "5 分（非常同意）"},
      {value: "4", name: "4 分（同意）"},
      {value: "3", name: "3 分（不一定）"},
      {value: "2", name: "2 分（不同意）"},
      {value: "1", name: "1 分（非常不同意）"},
    ],
    content: '', //内容
    src:'', //
    list: [
    "1. 头重如裹",
    "2. 昏昏欲睡",
    "3. 脘腹痞满",
    "4. 呕恶涎沫",
    "5. 肢体困重"],

    src: ""
  },
  //
  radioChange: function(e) {
  },
  // 症积分量化表
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
    wx.navigateTo({
      url: '/pages/main03/mindex03'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.word2voice();
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