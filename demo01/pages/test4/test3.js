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
        "question": "1. 头重如裹"
      },
      {
        "question": "2. 昏昏欲睡"
      },
      {
        "question": "3. 脘腹痞满"
      },
      {
        "question": "10. 体型肥胖",
        "option": {
          "2": "体重指数＜25",
          "3": "25≤体重指数＜29",
          "4": "29≤体重指数＜34",
          "5": "34≤体重指数",  
        }
      }],
    option: [
      {value: "5", name: "5 分（非常同意）"},
      {value: "4", name: "4 分（同意）"},
      {value: "3", name: "3 分（不一定）"},
      {value: "2", name: "2 分（不同意）"},
      {value: "1", name: "1 分（非常不同意）"}],

    content: '', // 语音播放内容
    src: '',  //word2voice地址
    list: [
    "您是否头重如裹",
    "您是否昏昏欲睡",
    "您是否脘腹痞满",
    "您是否呕恶涎沫",
    "您是否肢体困重"],

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.word2voice(this.data.list[0]);
    recorderManager.onStart(() => {})
    recorderManager.start(options)
    // this.time();
    this.recordeDetect();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
            // wx.navigateTo({
            //   url: '../testCamera/testCamera',
            // })
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