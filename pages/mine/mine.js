// pages/mine/mine.js
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    avatarUrl:'',
    nickName:'',
    phone:'',
    numberList:{}
  },
  goList(e){
    let index = e.currentTarget.dataset.index
    if(index!=5){
      wx.navigateTo({
        url:'/pages/order/order-list/order-list?tagsActive='+index
      })
    }else{
      wx.navigateTo({
        url:'/pages/order/refund-list/refund-list'
      })
    }


  },
  goTo(e){
    let path=e.currentTarget.dataset.path
    if(e.currentTarget.dataset.type=='switch'){
      wx.switchTab({
        url: path
      })
    }else {
      wx.navigateTo({url:path})
    }
  },
  fetchData(){
    let that = this
    api.post({
      url:'/order/orderNum',
      success(res){
        //console.log(res)
        that.setData({
          numberList:res.data
        })
      }
    })
  },
  goLogin(){
    let that = this
    wx.getUserInfo({
      success: function(res) {
        //console.log(res,123)
        api.login({
          ...res,
          success:response=>{
            wx.showToast({
              title: '登录成功!',
              icon: 'success',
              duration: 1000
            });
            that.fetchData()
            that.setData({
              isLogin:true,
              nickName:res.userInfo.nickName,
              avatarUrl:res.userInfo.avatarUrl,
            })

          }
        })
      },
      fail(e){
        //console.log('失败',e)
        wx.navigateTo({
          url:'/pages/permission/permission?type=login',
          events:{
            refreshData(){
              //console.log('刷新数据啦')
              let token = wx.getStorageSync('token')
              let nickName = wx.getStorageSync('nickName')
              let avatarUrl = wx.getStorageSync('avatarUrl')
              if(token){
                that.setData({
                  isLogin:true,
                  nickName:nickName,
                  avatarUrl:avatarUrl,
                })
              }else {
                that.setData({
                  isLogin:false
                })
              }
            }
          }
        })
      }
    })
  },
  goToOrderList(){
    wx.navigateTo({
      url:'/pages/order/order-list/order-list'
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
    let that = this
    // this.fetchData()
    let token = wx.getStorageSync('token')
    let nickName = wx.getStorageSync('nickName')
    let avatarUrl = wx.getStorageSync('avatarUrl')
    let phone = wx.getStorageSync('phone')
    if(token && nickName && avatarUrl){
      this.setData({
        isLogin:true,
        nickName:nickName,
        avatarUrl:avatarUrl,
        phone:phone
      })
    }else {
      this.setData({
        isLogin:false
      })
    }
    //console.log(that.data.isLogin,'isLogin')
    if(wx.getStorageSync('token')){
      this.fetchData()
    }

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