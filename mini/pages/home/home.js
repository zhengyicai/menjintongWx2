//const url = 'https://wx.szrunlifang.com/app'
const app = getApp()

const url = app.globalData.url

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrl:"/images/wx_login.jpg",
    showImg:1,
    nickName:'',
    index:"",
    phone:wx.getStorage('phone')==""?'未绑定':wx.getStorageSync('phone'),
    array: [],
    communityNameCho:"",

  },
  onShow: function () {
      var that = this;
      that.getCommunityList();
      var residentId = wx.getStorageSync('residentId');

      if(residentId==null || residentId==undefined || residentId==""){


      }else{

        wx.request({
          url: url+'/equipment/getResident1', 
          data: {'id':residentId},
          header: {
          'content-type': 'application/json' // 默认值
          },success: function(res) {
          //  wx.setStorage('nickName', res.userInfo.nickName);
          if(res.data.data==null){
            that.setData({
              communityNameCho: ""
            })

          }else{

            that.setData({
              communityNameCho: res.data.data.identityNo
            })

          }
            
          }
          
        })

      }


  },
  onLoad: function () {
    // 查看是否授权
    var that = this;
    this.showImg = 0;
    this.imgUrl = '/images/wx_login.jpg';



    that.setData({
      phone: wx.getStorageSync('phone')
    });




   
    // if(wx.getStorageSync('phone')==undefined|| wx.getStorageSync('phone')==""){
    //   that.phone = app.globalData.phone;
    // }else{
    //   that.phone=wx.getStorageSync('phone');
    // }
    
   

    that.setData({
      imgUrl:  wx.getStorageSync('phone')==""?'未绑定':wx.getStorageSync('phone')
    });
    
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo.avatarUrl);
              
              that.setData({
                imgUrl: res.userInfo.avatarUrl
              });
              
              
              wx.setStorage('nickName', res.userInfo.nickName);
              


              // that.setData({
              //   phone: "13536524756"
              // });
              that.setData({
                nickName: res.userInfo.nickName
              });
              that.setData({
                showImg: 1
              });
            }
          })
        }else{
          //console.log("testss");
          that.setData({
            showImg: 0
          });

        }
      }
    })

    that.setData({
      communityNameCho: wx.getStorageSync('communityNameCho')==""?'请选择小区':wx.getStorageSync('communityNameCho')
    });  
    
    that.getCommunityList();
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    var that = this;
    if(e.detail.userInfo.nickName!=""){
      that.setData({
        showImg: 1
      });
      that.setData({
        imgUrl: e.detail.userInfo.avatarUrl
      });
      that.setData({
        nickName: e.detail.userInfo.nickName
      });
    }
  },
  getCommunityList:function(){
    var that = this;

    that.setData({
      array: []
    })


    console.log("test11111");
    wx.request({
      url: url+'/equipment/getResidentList', 
      data: {'phone':that.data.phone},
      header: {
      'content-type': 'application/json' // 默认值
      },success: function(res) {
        that.setData({
          array: res.data.data
        })
      }
      
    })
  },
  goPage: function () {
    console.log("sdfd");
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  bindPickerChange: function(e) {

    var that = this;

    that.setData({
      communityNameCho: that.data.array[e.detail.value].identityNo
    });  


    wx.setStorageSync('communityNameCho', that.data.array[e.detail.value].identityNo);
    wx.setStorageSync('residentId', that.data.array[e.detail.value].id);

    
    console.log('picker发送选择改变，携带值为',that.data.array[e.detail.value].id)
    this.setData({
      index: e.detail.value
    })
  },

})
