// pages/home/home.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {formatTimeTwo, saveOneDecimal, saveTwoDecimal} from "../../utils/util";
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    categoryList: [],
    advertisementList: [],
    hotGoodsList: [],
    nearbyShopList: [],
    showMenus:true,
    searchKeyword:"",
    tagsActive:0,
    timeTagsActive:0,
    showRedPackage:false,
    showGetAddress:true,
    leftTime: 0,
    scrapStart:false,
    nowScrapIndex:0,//选择的当前抢购时间下标
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
    //console.log('倒计时结束')
    this.getScrapGoods(this.data.nowScrapIndex)
  },
  onTimeChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  //领取红包
  catchRedPackage(){
    //console.log('我领到红包了')
  },
  //隐藏红包
  hideRedPackage(){
    this.setData({ showRedPackage: false });
  },
  onSearchFocus(){
    // wx.navigateTo({
    //   url:'/pages/search-result/search-result'
    // })
  },
  onSearchChange(event){
    //console.log(event.detail)
    if(event.detail!=''){
      this.setData({searchKeyword:event.detail})
      wx.navigateTo({
        url:'/pages/search-result/search-result?searchKeyword='+event.detail
      })
    }
  },
  onSearchCancel(event){
    //console.log(event.detail)
  },
  onTagsChange(event) {
    let index=event.detail.name
    //console.log(index)
    wx.setStorageSync('defaultIndex',index)
    wx.switchTab({
      url:'/pages/class/class'
    })
  },
  goToClass(e){
    let index=e.currentTarget.dataset.index
    wx.setStorageSync('defaultIndex',index)
    wx.switchTab({
      url:'/pages/class/class'
    })
  },
  onTimeTagsChange(event) {
   let t=event.detail.name
    this.setData({
      nowScrapIndex:event.detail.name
    })
    this.getScrapGoods(event.detail.name)
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
        that.getNearbyShop()
      },
      fail(){
        Dialog.confirm({
          title: '提示',
          message: '请授权位置信息，以更好地使用本程序',
        }).then(() => {
          // wx.openSetting()
          wx.navigateTo({
            url:'/pages/permission/permission?type=address'
          })
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
  getNearbyShop(){
    let that = this
    //首页附近的店铺展示
    api.post({
      url:'/business/businessList',
      noLogin:true,
      data:{
        pageSize:3,
        pageNum:1,
        lng:that.data.addressData.longitude,
        lat:that.data.addressData.latitude
      },
      success:res=>{
        if(res.data.list){
          for (const resKey in res.data.list) {
            res.data.list[resKey].nearby_img=api.Host+'/'+res.data.list[resKey].nearby_img
            res.data.list[resKey].end_time=formatTimeTwo(res.data.list[resKey].end_time)
            res.data.list[resKey].start_time=formatTimeTwo(res.data.list[resKey].start_time)
            res.data.list[resKey].distance=saveTwoDecimal(res.data.list[resKey].distance)
            res.data.list[resKey].shopstar=saveOneDecimal(res.data.list[resKey].shopstar)
          }
          that.setData({
            nearbyShopList:res.data.list
          })
        }else {
          that.setData({
            nearbyShopList:[]
          })
        }
      }
    })
  },
  getScrapGoods(timeLimitState = 0){
    let that = this
    //首页显示抢购
    api.post({
      url:'/timeLimit/tGoodsTimeLimitList',
      noLogin:true,
      data:{
        timeLimitState:timeLimitState,
        pageSize:2,
      },
      success:res=>{
        //console.log(res)
        for (const resKey in res.data.data.list) {
          res.data.data.list[resKey].thumbnail=api.Host+'/'+res.data.data.list[resKey].thumbnail
        }
        let serverTime=res.data.localtime
        let startTime=0
        let endTime=new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000
        if(timeLimitState==0){
          startTime=new Date(new Date().toLocaleDateString()).getTime()+10*60*60*1000
        }else if(timeLimitState==1){
          startTime=new Date(new Date().toLocaleDateString()).getTime()+16*60*60*1000
        }else if(timeLimitState==2){
          startTime=new Date(new Date().toLocaleDateString()).getTime()+20*60*60*1000
        }
        if(serverTime<startTime){
          //未开始
          that.setData({
            leftTime:startTime-serverTime,
            scrapStart:false
          })
        }else {
          //已开始
          that.setData({
            leftTime:endTime-serverTime,
            scrapStart:true
          })
        }
        //console.log(this.data.leftTime)
        that.setData({
          grabList:res.data.data.list
        })
      }
    })
  },
  fetchData(){
    let that = this
    //首页显示抢购
    this.getScrapGoods()
    //轮播
    api.get({
      url:'/image/showAd',
      noLogin:true,
      data:{
        pageSize:5
      },
      success:res=>{
        for (const resKey in res.data.list) {
          res.data.list[resKey].imageUrl=api.Host+'/'+res.data.list[resKey].imageUrl
        }
        that.setData({
          bannerList:res.data.list
        })
      }
    })
    //首页精选类型
    api.get({
      url:'/goodsType/TypeList',
      noLogin:true,
      data:{},
      success:res=>{
        that.setData({
          categoryList:res.data
        })
      }
    })
    //首页板块广告
    api.get({
      url:'/image/partsAd',
      noLogin:true,
      data:{
        pageSize:4
      },
      success:res=>{
        for (const resKey in res.data.list) {
          res.data.list[resKey].imageUrl=api.Host+'/'+res.data.list[resKey].imageUrl
        }
        that.setData({
          advertisementList:res.data.list
        })
      }
    })
    //首页热门商品
    api.get({
      url:'/hotGoods/hotGoodsList',
      noLogin:true,
      data:{
        pageSize:6
      },
      success:res=>{
        for (const resKey in res.data.list) {
          res.data.list[resKey].thumbnail=api.Host+'/'+res.data.list[resKey].thumbnail
        }
        that.setData({
          hotGoodsList:res.data.list
        })
      }
    })
    //首页最新上架
    api.get({
      url:'/newGoods/newGoodsList',
      noLogin:true,
      data:{
        pageSize:6,
        byLaunch:'y'
      },
      success:res=>{
        for (const resKey in res.data.list) {
          res.data.list[resKey].thumbnail=api.Host+'/'+res.data.list[resKey].thumbnail
        }
        that.setData({
          newGoodsList:res.data.list
        })
      }
    })

  },
  goLiveRoom(){
    wx.navigateTo({
      url:'/pages/live-room/live-room/live-room?right=none'
    })
  },
  goTo(e){
    let type=e.currentTarget.dataset.type
    if(type && type=='newGoods'||type=='hotGoods'){
      wx.navigateTo({
        url:'/pages/goods-list/goods-list?type='+type,
      })
      return
    }
    if(type && type=='nearbyShops'){
      wx.navigateTo({
        url:'/pages/nearby-shops/nearby-shops',
      })
      return
    }
    let path=e.currentTarget.dataset.path
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url:path+'?id='+id,
    })
    // console.log(path)
    // console.log(id)
  },
  bannerGo(e){
    let flag = e.currentTarget.dataset.flag
    let id = e.currentTarget.dataset.id
    let path = ""
    if(flag=='1'){
      path = "/pages/goods-detail/goods-detail"
      wx.navigateTo({
        url:path+'?id='+id,
      })
    }else if(flag=='2'||flag=='3'){
      //console.log(this.data.categoryList,id)
      path = "/pages/class/class"
      for (let i =0;i<this.data.categoryList.length;i++){
        if(this.data.categoryList[i].id==id){
          wx.setStorageSync('defaultIndex',i)
          wx.switchTab({
            url:path
          })
          break;
        }
      }
    }
  },
  addTrolley(e){
    let item = e.currentTarget.dataset.item
    //console.log(item)

    api.post({
      url:'/tCar/addTCarByUser',
      data:{
        goodsid:item.id,
        shopid:item.userId
      },
      success(res){
        //console.log(res)
        if(res.code == 200){
          wx.showToast({
            title:'添加成功！',
            icon:'success',
            duration:1000
          })

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData()
    //console.log(options,'options')
    //console.log(options.scene,'options.scene')
    if(options.scene){
      wx.setStorageSync('upopenid',options.scene)
    }
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
    this.getLocation()
    this.fetchData()

    setTimeout(()=>{
      wx.stopPullDownRefresh()
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