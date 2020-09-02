// pages/live-room/create-room/create-room.js
import {formatTime} from "../../../utils/util";
const api = require('../../../utils/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '', // 房间名字
        startTime: '', // 开始时间
        endTime: '',// 结束时间
        anchorName: '',// 主播昵称
        anchorWechat: '',// 主播微信号
        coverImg: 'sS1AxNwXE0i-z99wtvEtVJWzhHXqFsfTFd6zS3rP4r0WtMneOZOykC3cbQB5WIl3',  // 通过 uploadfile 上传，填写 mediaID
        shareImg: '7cPMgeJFMi9o_8fCNN2703MZwA_5pv-PiobynDTeJRNHAlH32M6JPPcZ5yDIjmGo', //通过 uploadfile 上传，填写 mediaID
        feedsImg: '7cPMgeJFMi9o_8fCNN2703MZwA_5pv-PiobynDTeJRNHAlH32M6JPPcZ5yDIjmGo', //通过 uploadfile 上传，填写 mediaID
        isFeedsPublic: 0,// 是否开启官方收录，1 开启，0 关闭
        type: 0,//直播类型，1 推流 0 手机直播
        screenType: 0, // 1：横屏 0：竖屏
        closeLike: 0, // 是否 关闭点赞 1 关闭
        closeGoods: 0, // 是否 关闭商品货架，1：关闭
        closeComment: 0, // 是否开启评论，1：关闭
        closeReplay: 1, // 是否关闭回放 1 关闭
        closeShare: 0,   //  是否关闭分享 1 关闭
        closeKf: 1, // 是否关闭客服，1 关闭


        coverImg1: '',
        shareImg1: '',
        feedsImg1: '',
        accessToken:'',
        startTime1: '',
        endTime1: '',
        showStartTime: false,
        showEndTime: false,
        minDate: new Date().getTime(),
        maxDate: new Date(2020, 10, 1).getTime(),
        currentDate: new Date().getTime(),
    },
    showStartTime() {
        this.setData({
            showStartTime: true
        })
    },
    hiddenStartTime() {
        this.setData({
            showStartTime: false
        })
    },
    onStartTimeConfirm(e) {
        let value = parseInt(e.detail / 1000)
        console.log(value)
        this.setData({
            startTime: value,
            startTime1: formatTime(value * 1000),
            showStartTime: false
        })
    },
    showEndTime() {
        this.setData({
            showEndTime: true
        })
    },
    hiddenEndTime() {
        this.setData({
            showEndTime: false
        })
    },
    onEndTimeConfirm(e) {
        let value = parseInt(e.detail / 1000)
        console.log(value)
        this.setData({
            endTime: value,
            endTime1: formatTime(value * 1000),
            showEndTime: false
        })
    },

    onFeedsPublicChange(e) {
        console.log(e.detail)
        let value = e.detail
        if (value) {
            this.setData({
                isFeedsPublic: 1
            })
        } else {
            this.setData({
                isFeedsPublic: 0
            })
        }
    },

    submitForm(){
        let that = this
        let formData={}
        formData.name=this.data.name
        formData.coverImg=this.data.coverImg
        formData.startTime=this.data.startTime
        formData.endTime=this.data.endTime
        formData.anchorName=this.data.anchorName
        formData.anchorWechat=this.data.anchorWechat
        formData.shareImg=this.data.shareImg
        formData.feedsImg=this.data.feedsImg
        formData.isFeedsPublic=this.data.isFeedsPublic
        formData.type=this.data.type
        formData.screenType=this.data.screenType
        formData.closeLike=this.data.closeLike
        formData.closeGoods=this.data.closeGoods
        formData.closeComment=this.data.closeComment
        formData.closeReplay=this.data.closeReplay
        formData.closeShare=this.data.closeShare
        formData.closeKf=this.data.closeKf
        console.log(formData)
        if(formData.name==''){
            wx.showToast({
                title:'房间名字不能为空！',
                icon:'success',
                duration:1000
            })
        }else if(formData.startTime==''||formData.endTime==''){
            wx.showToast({
                title:'开播时间需要在当前时间的10分钟后，并且开始时间不能在6个月后' +
                    '开播时间和结束时间间隔不得短于30分钟，不得超过24小时',
                icon:'none',
                duration:3000
            })
        }else {
            wx.request({
                url:"https://api.weixin.qq.com/wxaapi/broadcast/room/create?access_token="+that.data.accessToken,
                method:'POST',
                data:{
                    ...formData
                },
                success(res){
                    console.log(res)
                    if(res.data.errcode == 0 ){

                    }else if(res.data.errcode == 0) {

                    }
                }
            })
        }

    },
    fetchToken() {
        wx.hideLoading()
        wx.showLoading({
            title: '加载中',
        })
        const that = this
        //获取access_token
        wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/token',
            method: 'GET',
            data: {
                appid: api.AppID,
                secret: api.AppSecret,
                grant_type: 'client_credential'
            },
            success(res) {
                console.log(res.data.access_token)
                that.setData({
                    accessToken:res.data.access_token
                })
            },
            complete(){
                wx.hideLoading()
            }
        })
    },
    uploadImg(e){

        let that = this
        let index=e.currentTarget.dataset.index
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                wx.showLoading()
                wx.uploadFile({
                    url: api.Host+'/imageUpload/uploadMedia',
                    filePath: tempFilePaths[0],
                    formData:{
                        type:'image'
                    },
                    name: 'file',
                    success (res0){
                        console.log(JSON.parse(res0.data))

                        if(index==1){
                            that.setData({
                                coverImg:res0.data.media_id,
                                coverImg1:tempFilePaths[0]
                            })
                        }else if(index==2){
                            that.setData({
                                shareImg:res0.data.media_id,
                                shareImg1:tempFilePaths[0]
                            })
                        }else if(index==3){
                            that.setData({
                                feedsImg:res0.data.media_id,
                                feedsImg1:tempFilePaths[0]
                            })
                        }

                        console.log(that.data)

                    },
                    complete(){
                        wx.hideLoading()
                    }
                })
            },
        })
    },
    openLiveProgram(){
        wx.navigateToMiniProgram({
            appId: 'wxcbbd86b156ae4441',
            success(res) {
                // 打开其他小程序成功同步触发
                wx.showToast({
                    title: '跳转成功'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.fetchToken()
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