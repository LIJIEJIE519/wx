
const plugin = requirePlugin('WechatSI');

Page({
  onShareAppMessage() {
    return {
      title: 'camera',
    }
  },

  data: {
    src: '',
    videoSrc: '',
    position: 'back',
    result: {},
    frameWidth: 0,
    frameHeight: 0,
    width: 288,
    height: 358,
    showCanvas: false,

    timeId: 0,
    content: '第一步，请伸舌头',//内容
  },
  
  onReady() {
    this.ctx = wx.createCameraContext()

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

  endTime: function() {
    console.log("停止循环...")
    clearInterval(this.timeId)
  },

  time: function () {
    let _that = this;
    this.timeId = setInterval(function() {
      _that.takePhoto();
    }, 1000)
  },

  onLoad(e) {
    this.word2voice();
    // this.time();
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
      console.log(暂无语音);
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
  takePhoto: function() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        }),
        wx.uploadFile({
          // url: 'http://81.70.101.221:9999/uploadImg',
          url: 'http://127.0.0.1:9999/uploadImg',
          filePath: res.tempImagePath,
          name: 'file',
          success (ans){
            console.log(ans)
          },
          fail (e) {
            console.log(e)
          }
        })
      }
    })
  },
  startRecord() {
    this.ctx.startRecord({
      success: () => {
        console.log('startRecord')
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
        wx.uploadFile({
          url: 'http://127.0.0.1:9999/uploadVideo',
          filePath: res.tempVideoPath,
          name: 'file',
          success (ans){
            console.log(ans)
          },
          fail (e) {
            console.log(e)
          }
        })
      }
    })
  },
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
