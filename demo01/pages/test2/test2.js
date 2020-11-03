
const plugin = requirePlugin('WechatSI');
let tongue_num = 0;

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
    content: '第一步为您进行舌诊，请伸舌头对准摄像头！',//word2voice内容
    src: '',  //word2voice地址
    tongue_src: '', // 舌头拍照地址
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
    let that = this;
    setTimeout(function() {
      that.time();
    }, 2000);  
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
        wx.uploadFile({
          url: 'http://81.70.101.221:9999/uploadImg',
          filePath: res.tempImagePath,
          name: 'file',
          success (ans){
            console.log(ans)
            if(ans.data == "Yes") {
              tongue_num += 1;
              if (tongue_num != 3) {
                that.setData({
                  tongue_src: res.tempImagePath
                })
                that.word2voice("请转一转头！")
                console.log(tongue_num);
              } else {
                that.endTime();
                wx.navigateTo({
                  url: '../test3/test3',
                })
              }
            } else {
              that.word2voice("没有检测到舌头，请调整位置");
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
