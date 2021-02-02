//index.js
//获取应用实例
const app = getApp()
const plugin = requirePlugin('WechatSI');
const MODEL_PATH = "cloud://old-snowboy.6f6c-old-snowboy-1304907222/model/model.json";
const MODEL_WEIGHT_PATH = "cloud://old-snowboy.6f6c-old-snowboy-1304907222/model/";
let modelLocalFolder = wx.env.USER_DATA_PATH + '/model/';
let fileManager = wx.getFileSystemManager();

const isModel = async() => {
  // 判断模型是否已经下载
  try {
    fileManager.accessSync(modelLocalFolder + 'model.json');
    fileManager.getFileInfo({
      filePath: modelLocalFolder + 'model.json',
      success(res) {
        console.log(res.size);
      }
    })
    console.log(wx.env.USER_DATA_PATH + '/model/model.json')
    return true;
  } catch (err) {
    try {
      fileManager.accessSync(modelLocalFolder);
    } catch (err) {
      fileManager.mkdirSync(modelLocalFolder);
    }
    console.log("Downloading model manifest ...");

    // 首先下载model.json
    let model_json = await downloadFile(MODEL_PATH);
    // 然后根据模型定义文件下载weights
    return await downloadWeights(model_json);
  }
}

function downloadWeights(json_file) {
  return new Promise((resolve, reject) => {
    // 解析model.json文件
    let lines = fileManager.readFileSync(json_file, "utf-8");
    let json = JSON.parse(lines);
    let weights_manifest = json.weightsManifest;
    let weights_path = weights_manifest[0].paths.toString().split(",");

    // 下载所有的权重文件，并保存到本地
    var downloadList = new Array();
    for (let i = 0; i < weights_path.length; i++) {
      let weight_file = MODEL_WEIGHT_PATH + weights_path[i];
      console.log('Downloading model weight file:' + weight_file);
      downloadList.push(downloadFile(weight_file).then((tempFilePath) => {
        return saveToLocal(tempFilePath, modelLocalFolder + weights_path[i]);
      }));
    }

    // 期望所有权重文件都保存到本地成功
    Promise.all(downloadList).then(() => {
      console.log("download all weights success!");
      // model weights全部保存成功，将model.json文件也保存到本地
      saveToLocal(json_file, modelLocalFolder + 'model.json').then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    });
  });
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    wx.cloud.downloadFile({
      fileID: url, // 文件 ID
      success: res => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        } else {
          console.log('downloadFile fail, statusCode is:', res.statusCode);
          reject(false);
        }
      },
      fail: function ({
        errMsg
      }) {
        console.log('downloadFile fail, err is:', errMsg);
        reject(false);
      }
    })
  });
}

function saveToLocal(tempFilePath, destFilePath) {
  return new Promise((resolve, reject) => {
    fileManager.saveFile({
      tempFilePath: tempFilePath,
      filePath: destFilePath,
      success: (res) => {
        console.log("save to:" + res.savedFilePath);
        resolve(res.savedFilePath);
      },
      fail: (res) => {
        reject(res);
      }
    });
  });
}

Page({
  data: {
    content: '我是老中医，很高兴为您服务',        // word2voice内容
    currentText: "请拍三张舌头照片！",  // 页面显示内容
    src: '',  //word2voice地址
    timeId: 0,
    
  },

  

  onLoad: function () {
    // this.word2voice(this.data.content);
    wx.showLoading({
      title: '正在加载模型...',
    });
    isModel().then(function(res) {
      if (res) {
        console.log(res)
        wx.hideLoading();
      } else {
        console.log("模型加载错误")
      }
    })
  },
  onReady(e) {
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
