// pages/order/order-payed/order-payed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:''
  },
  goHome(){
    wx.switchTab({
      url:'/pages/home/home'
    })
  },
  goDetail(){
    let that = this
    //console.log(that.data.orderid,'----------------------------')
    if(that.data.orderid.length > 1){
      wx.reLaunch({
        url:'/pages/order/order-list/order-list'
      })
    }else {
      wx.reLaunch({
        url:'/pages/order/order-status/order-status?orderid='+that.data.orderid[0]
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderid=JSON.parse(options.orderid)
    this.setData({
      orderid:orderid
    })
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