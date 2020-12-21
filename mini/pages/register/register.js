// pages/register/register.js
// pages/login/login.js

//const url = 'https://wx.szrunlifang.com/app'

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
    disabled1:false,
    array: [],
    array2: [1,2,3,4],
    index:"",
    index2:"",
    communityId:'',
    comunityName1:'',
    equipmentId:'',
    equipmentName1:'',
    cardNo:'',
    name:'',
    remark:'',

  },

  nameblur:function(e){
    //console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
 },
 bindPickerChange: function(e) {
   var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })

    this.setData({
      communityId: that.data.array[e.detail.value].id 
    })

    this.setData({
      comunityName1: that.data.array[e.detail.value].communityName 
    })
    this.setData({
      array2: []
    })

    

    this.getEquipmentList();

},
bindPickerChange2: function(e) {
  var that = this;
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    index2: e.detail.value
  })

  this.setData({
    equipmentId: that.data.array2[e.detail.value].id 
  })

  this.setData({
    equipmentName1: that.data.array2[e.detail.value].equid 
  })

  if(that.data.array2[e.detail.value].equCode.length==8){
    this.setData({
      cardNo: that.data.array2[e.detail.value].equCode.substr(4,8)      
    })
       
  }else{
    this.setData({
      cardNo: ""      
    })
  }
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

  getCommunityList:function(){
    var that = this;
    wx.request({
      url: url+'/equipment/getCommunitylist', 
      data: {},
      header: {
      'content-type': 'application/json' // 默认值
      },success: function(res) {
        that.setData({
          array: res.data.data
        })
      }
      
    })
  },

  getEquipmentList:function(){
    var that = this;
    wx.request({
      url: url+'/equipment/findCommunitys', 
      data: {'communityId':that.data.communityId},
      header: {
      'content-type': 'application/json' // 默认值
      },success: function(res) {
        that.setData({
          array2: res.data.data
        })
      }
      
    })
  },

  createData:function(data){
    // var phone='13536524756';
     var that = this;

     var phone = data.detail.value.phone;
     var smsCode = data.detail.value.smsCode;
     var cardNo = data.detail.value.cardNo;
     var name = data.detail.value.name;

     //console.log("ddddddddddd"+cardNo);
     if(that.data.communityId==''){
      wx.showToast({
          title:"请选择小区",
          icon:'none',
          duration:1000
      });
       return;
     }

     if(that.data.equipmentId==''){
      wx.showToast({
          title:"请选择单元",
          icon:'none',
          duration:1000
      });
       return;
     }

     

     if(cardNo==''){
      wx.showToast({
          title:"请输入房间号",
          icon:'none',
          duration:1000
      });
       return;
     }

     if(name==''){
      wx.showToast({
          title:"请输入住户姓名",
          icon:'none',
          duration:1000
      });
       return;
     }
     if(phone==''){
      wx.showToast({
          title:"请输入手机号",
          icon:'none',
          duration:1000
      });
       return;
     }

     if(smsCode==''){
      wx.showToast({
          title:"请输入验证码",
          icon:'none',
          duration:1000
      });
       return;
     }


     that.setData({
      disabled1: true
    })




 
     wx.request({
       url: url+'/equipment/addUser', //仅为示例，并非真实的接口地址
       data: {'mobile':phone,'smsCode':smsCode,'unitNo':cardNo,'communityId':that.data.communityId,'equipmentId':that.data.equipmentId,'name':name,'remark':that.data.remark},
       method: "POST",
       header: {
       
       'content-type': 'application/json' // 默认值
       
       },success: function(res) {
        if(res.data.code=="0000"){
         // wx.setStorageSync('phone', phone);
         // app.globalData.phone = phone;   
          //console.log(wx.getStorageSync('phone'));
          wx.showToast({
              title:'绑定租户成功,请等待管理员审核',
              icon:'none',
              duration:2000
          });


          //注册绑定手机号
          if(wx.getStorage('phone')==""){
            wx.setStorageSync('phone', phone);
            app.globalData.phone = phone;   
          }else{

            //
            wx.setStorageSync('phone', phone);
            app.globalData.phone = phone;   

          }
         
          
          
          setTimeout(function () {      
            wx.reLaunch({     //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
              url:'/pages/index/index'       
            })
          }, 2000) //延迟时间 这里是1秒
          
          
          that.setData({
            disabled1: false
          })
         



        }else{
          wx.showToast({
              title:res.data.message,
              icon:'none',
              duration:2000
          });
        that.setData({
          disabled1: false
        })


        }
      
       }
       
       })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    this.getCommunityList();

    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo.avatarUrl);
              
              // that.setData({
              //   name:res.userInfo.nickName
              // }); 
              that.setData({
                remark:res.userInfo.nickName
              }); 


              
            }
          })
        }else{
         
        }
      }
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