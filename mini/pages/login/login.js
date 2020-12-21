// pages/login/login.js

//const url = 'https://wx.szrunlifang.com/app'
//
const app = getApp()

const url = app.globalData.url

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    smsCode:'',
    time: "获取验证码",
    suffix:'',
    currentTime: 61,
    disabled:false,

  },

  nameblur:function(e){
    //console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
 },



 getInputValue:function(e){
  var that = this;
  let _this = this;
  

  if(that.data.phone==""){
    wx.showToast({
        title:"请输入手机号",
        icon:'none',
        duration:2000
    });
    return;
  }


  if (!_this.data.disabled) {
    let interval = null;
    let currentTime = _this.data.currentTime;
  
    interval = setInterval(function() {
      currentTime--;
      _this.setData({
        time: currentTime,
        suffix: 's可重新获取'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        _this.setData({
          time: '重新发送',
          suffix: '',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  }
  _this.setData({
    disabled: true
  })

  wx.request({
    url: url+'/common/sms', 
    data: {'mobile':that.data.phone},
  
    header: {
    
    'content-type': 'application/json' // 默认值
    
    },success: function(res) {
        wx.showToast({
          title:'发送验证码成功',
          icon:'success',
          duration:2000
      });

   
    }
    
  })
  

},

  createData:function(data){
    // var phone='13536524756';
     var that = this;

     var phone = data.detail.value.phone;
     var smsCode = data.detail.value.smsCode;
 
     wx.request({
       url: url+'/register/appRegisters', //仅为示例，并非真实的接口地址
       data: {'mobile':phone,'smsCode':smsCode,'name': wx.getStorageSync('nickName')},
       method: "POST",
       header: {
       
       'content-type': 'application/json' // 默认值
       
       },success: function(res) {
        if(res.data.code=="0000"){
          wx.setStorageSync('phone', phone);
          app.globalData.phone = phone;   
          //console.log(wx.getStorageSync('phone'));
          wx.showToast({
              title:'绑定成功',
              icon:'success',
              duration:2000
          });

       
          wx.setStorageSync('communityNameCho', "");
          wx.setStorageSync('residentId', "");
        //  wx.setStorageSync('phone', "");
      
          setTimeout(function () {      
            wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
              url:'/pages/index/index'       
            })
          }, 2000) //延迟时间 这里是1秒

         



        }else{
          wx.showToast({
            title:res.data.message,
            icon:'none',
            duration:2000
        });


        }
      
       }
       
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