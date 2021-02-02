// import { Classifier } from './model';
// const regeneratorRuntime = require('regenerator-runtime')
const tf = require('@tensorflow/tfjs-core')
const tfl = require('@tensorflow/tfjs-layers')

// import * as tf from '../../tfjs/tf.min.js';
let modelLocalFolder = wx.env.USER_DATA_PATH + '/model/';
let fileManager = wx.getFileSystemManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async predictBreed(){
    console.log("Model is loading...");
    const MODEL_URL = wx.env.USER_DATA_PATH + "/model/model.json";
    
    var model = await tfl.loadLayersModel(MODEL_URL);
    model.predict(tf.zeros([1, 64, 64, 3])).dispose();

    console.log("Model loaded Successfully!")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady () {
    const net = await this.predictBreed()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})