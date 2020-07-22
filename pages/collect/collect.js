// pages/collect/collect.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: wx.getSystemInfoSync().windowHeight - 50,
    type:3  // 2：收藏商品 3：收藏店铺
  },
  onTabsClick(e){
    console.log(e.detail.name)
  },
  fetchData(type=3){
    api.post({
      url:'/share/selectShareListByUser',
      data:{
        state:type,
      },
      success(res){
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData()
    setTimeout(()=>{
      this.setData({
        height: wx.getSystemInfoSync().windowHeight - 50
      })
    },100)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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