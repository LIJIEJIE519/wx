
// 录音
const recorderManager = wx.getRecorderManager();
const options = {
    duration: 10000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 64000,
    format: 'wav',
    frameSize: 50
}


Page({
  data: {
    currentText: "",
  },

  beginRecoder: function() {
    console.log("开始录音1")
    recorderManager.start(options)
  },
  endRecoder: function() {
    console.log("endRecoder")
    recorderManager.onStop(res => {
      console.log('recorder stop, tempFilePath :', res.tempFilePath)
      wx.uploadFile({
        url: 'http://127.0.0.1:9999/uploadAudio',
        filePath: res.tempFilePath,
        name: 'file',
        success (res){
          console.log(res)
        },
        fail (e) {
          console.log(e)
        }
      })
    })
    recorderManager.stop()
  },

  time: function () {
    setInterval(function() {
      console.log("2s")
      recorderManager.onStop(res => {
        console.log("---录音关闭-----")
        console.log('recorder stop, tempFilePath :', res.tempFilePath)

        recorderManager.stop()
      })

      // console.log("----开始录音----")
      // recorderManager.start(options)
    }, 2000)
  },
  onLoad: function () {
    console.log("开始录音监听-----")
    recorderManager.onStart(() => {
      console.log('recorder start')
    })

    console.log("开始录音----")
    recorderManager.start(options)

    this.time();
    
  
  },
})
