
const plugin = requirePlugin('WechatSI');

Page({
  onShareAppMessage() {
    return {
      title: 'camera',
    }
  },

  data: {
    position: 'front',
    result: {},
    frameWidth: 0,
    frameHeight: 0,
    width: 288,
    height: 358,
    showCanvas: false,

    timeId: 0,
    content: '第一步，请伸舌头',//word2voice内容
    src: '',  //word2voice地址
  },
  
  onReady() {
    this.ctx = wx.createCameraContext()
    this.voice();
  },

  endTime: function() {
    console.log("停止循环...")
    clearInterval(this.timeId)
  },

  time: function () {
    let _that = this;
    this.timeId = setInterval(function() {
      _that.takePhoto();
    }, 5000)
  },

  onLoad(e) {
    this.word2voice(this.data.content);
    this.time();
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
  word2voice: function (content) {
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
 
  init(res) {
    if (this.listener) {
      this.listener.stop()
    }
    const canvas = res.node
    const render = createRenderer(canvas, this.data.width, this.data.height);

    this.listener = this.ctx.onCameraFrame((frame) => {

      render(new Uint8Array(frame.data), frame.width, frame.height);
      const {
        frameWidth,
        frameHeight,
      } = this.data;
      if (frameWidth === frame.width && frameHeight == frame.height) return;
      this.setData({
        frameWidth: frame.width,
        frameHeight: frame.height,
        
      })

    })
    this.listener.start()
  },
  // 拍照上传
  takePhoto: function() {
    var that = this;
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        }),
        wx.uploadFile({
          url: 'http://81.70.101.221:9999/uploadImg',
          // url: 'http://127.0.0.1:9999/uploadImg',
          filePath: res.tempImagePath,
          name: 'file',
          success (ans){
            console.log(ans)
            if(ans.data == "Yes") {
              that.endTime();
              wx.navigateTo({
                url: '../test3/test2',
              })
            } else {
              that.word2voice("没有检测到舌头，请调整位置")
            }
          },
          fail (e) {
            console.log(e)
          }
        })
      }
    })
  },

  // 摄像头位置
  togglePosition() {
    this.setData({
      position: this.data.position === 'front'
        ? 'back' : 'front'
    })
  },
  error(e) {
    console.log(e.detail)
  },
})
