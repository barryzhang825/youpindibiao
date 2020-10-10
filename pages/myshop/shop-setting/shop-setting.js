// pages/myshop/shop-setting/shop-setting.js
import {checkPhone} from "../../../utils/util";

const api = require('../../../utils/api.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: api.Host + '/',
        shopInfo: {
            shopname: '',
            usercode: '',
            text: '',
            tel: '',
            headimg: '',
            bgimg: '',
        },
        headimg: '',
        bgimg: '',
    },
    uploadImg(e) {
        let that = this
        let type = e.currentTarget.dataset.type
        //console.log(type)
        wx.chooseImage({
            success(res) {
                const tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: api.Host + '/imageUpload/upReturnImage',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {},
                    success(res) {
                        let result = JSON.parse(res.data).data[0]
                        //console.log(result, 'result')
                        if (type == 'headimg') {
                            that.setData({
                                ['shopInfo.headimg']: result
                            })
                        } else {
                            that.setData({
                                ['shopInfo.bgimg']: result
                            })
                        }
                        //console.log(that.data.shopInfo)
                    }
                })
            }
        })
    },
    onShopNameChange(e) {
        this.setData({
            ['shopInfo.shopname']: e.detail
        })
    },
    onTextChange(e) {
        this.setData({
            ['shopInfo.text']: e.detail
        })
    },
    onTelChange(e) {
        this.setData({
            ['shopInfo.tel']: e.detail
        })
    },
    fetchData() {
        let that = this
        api.post({
            url: '/myShop/userShopInfo',
            data: {},
            success(res) {
                //console.log(res)
                if (res.code == 200) {
                    that.setData({
                        shopInfo: res.data
                    })
                }
            }
        })
    },
    submitForm() {

        let formData = {
            shopName: this.data.shopInfo.shopname,
            text: this.data.shopInfo.text,
            phoneNumber: this.data.shopInfo.tel,
            shopHeardImage: this.data.shopInfo.headimg,
            shopBackImage: this.data.shopInfo.bgimg,
        }
        //console.log(formData)
        for (const i in formData) {
            if (formData[i] == '' || formData[i] == undefined || formData[i] == 'undefined') {
                wx.showToast({
                    title: '请检查输入是否完整！',
                    icon: 'none',
                    duration: 1000
                })
                return
            }
        }
        if(!checkPhone(formData.phoneNumber)){
            wx.showToast({
                title: '请输入正确的手机号！',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        api.post({
            url: '/myShop/updateShopInfo',
            data: formData,
            success(res) {
                if (res.code == 200) {
                    wx.showToast({
                        title:'保存成功！',
                        icon:'success',
                        duration:2000
                    })
                  setTimeout(()=>{
                      wx.navigateBack({
                          delta:1
                      })
                  },1500)

                }
            }
        })
    }
    ,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchData()
    }
    ,

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    }
    ,

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
    ,

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
    ,

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})