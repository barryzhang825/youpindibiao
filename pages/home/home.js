// pages/home/home.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    showMenus:true,
    searchKeyword:"",
    tagsActive:0,
    timeTagsActive:0,
    showRedPackage:true,
    showGetAddress:true,
    time: 0.5 * 60 * 60 * 1000,
    timeData: {},

    addressDetail:{
      city: "",
      district: "",
      nation: "",
      province: "",
      recommend: "",
      rough: "",
      street: "",
      street_number: "",
    },
    addressData:{

    }
  },
  onTimeOut(){
    console.log('倒计时结束')
  },
  onTimeChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  //领取红包
  catchRedPackage(){
    console.log('我领到红包了')
  },
  //隐藏红包
  hideRedPackage(){
    this.setData({ showRedPackage: false });
  },
  onSearchChange(event){
    console.log(event.detail)
    this.setData({searchKeyword:event.detail})
    wx.navigateTo({
      url:'/pages/search-result/search-result?searchKeyword='+event.detail
    })
  },
  onSearchCancel(event){
    console.log(event.detail)
  },
  onTagsChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  onTimeTagsChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
  toggleShow(){
    if(this.data.showMenus){
      this.setData({
        showMenus:false
      })
    }else {
      this.setData({
        showMenus:true
      })
    }
  },
  getLocation(){
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy  //位置精确度
        that.setData({
          addressData:{
            latitude:latitude,
            longitude:longitude,
          }
        })
        // 构建请求地址
        let mapInfo = 'https://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + latitude + ',' +
            longitude + "&key=" + '2F2BZ-73GKU-ENKVJ-4RIAJ-GBNMJ-OHFD2' + "&get_poi=1";
        that.fetchAddress(mapInfo)
      },
      fail(){
        Dialog.confirm({
          title: '提示',
          message: '请授权位置信息，以更好地使用本程序',
        }).then(() => {
          // wx.navigateTo({
          //   url:'/pages/permission/permission'
          // })
          wx.openSetting()
        }).catch(() => {
          // on cancel
        });
      }
    })





  },
  /**
   * 发送请求获取地图接口的返回值
   */
  fetchAddress(mapInfo) {
    let that = this;
    // 调用请求
    wx.request({
      url: mapInfo,
      data: {},
      method: 'GET',
      success: (res) => {
        if (res.statusCode == 200 && res.data.status == 0) {
          // 从返回值中提取需要的业务地理信息数据
          let add={
            ...res.data.result.address_component,
            ...res.data.result.formatted_addresses
          }
          that.setData({ addressDetail: add});
        }
      }
    })
  },

  async fetchData(){
    await api.post({

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getLocation()
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
    this.fetchAddress()

    console.log('下拉刷新')

    setTimeout(()=>{
      wx.stopPullDownRefresh()
      console.log('停止下拉刷新')
    },1000)
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