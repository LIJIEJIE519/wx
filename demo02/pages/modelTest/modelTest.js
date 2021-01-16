// pages/modelTest/modelTest.js
// import { Classifier } from './model';
const regeneratorRuntime = require('regenerator-runtime')
const tf = require('@tensorflow/tfjs-core')
const tfl = require('@tensorflow/tfjs-layers')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  async predictBreed(){
    console.log("Model is loading...");
    const MODEL_URL = '../../model/model.json';
    // mobilenet = await tfl.loadLayersModel("https://ai.flypot.cn/models/coco-ssd/model.json");
    mobilenet = await tfl.loadLayersModel("../../model/model.json");
    mobilenet.summary()
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