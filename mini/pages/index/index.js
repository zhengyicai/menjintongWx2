const QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'
let qrcode;


// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(500)

const minuti1  =  20

//const url = 'https://wx.szrunlifang.com/app'
const app = getApp()

const url = app.globalData.url


// pages/index/index.js 


Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    qrcodeWidth: qrcodeWidth,
    imgsrc: '',
    text: "JR^\\\\D_XEHxU\u000b",
    image: '',
    timer:'',
    minuti:'',
    phone:'',
    phone:'',
    equList:'',
    switchCho:false,
    hidden:true,
    loadingText:"开锁中...",
    disabled:false,
    text1:"请先绑定用户",
    phone1:"请先绑定用户",
    displayOne:"block",
    none1:"auto",
    residentId:"",
   
  },
  switch1Change: function (e) {
    var that = this;
    wx.showModal({
      title:"是否远程开锁",
      success(res){
        if(res.confirm){

          that.setData({
            hidden: false
          });

          console.log("是");
          console.log(e.target.dataset.bean.id)
          console.log(e.target.dataset.bean.equipmentId)
          var phone = that.data.phone;    

          wx.request({
            url: url+'/equipment/onlineUnlock', //仅为示例，并非真实的接口地址
            data: {'id':phone,'ips':wx.getStorageSync('residentId'),'equipmentId':e.target.dataset.bean.id,'equipmentNo':e.target.dataset.bean.equipmentId},
            method: "POST",
            header: {
            'content-type': 'application/json' // 默认值
            },success: function(res1) {
              if(res1.data.code=='9999'){
                that.setData({
                  hidden: true
                });
                return;
              }
             else if(res1.data.code=='0000'){
              setTimeout(function () {
                wx.request({
                  url: url+'/equipment/getEquipmentStatus', //仅为示例，并非真实的接口地址
                  data: {'phone':phone,'equipmentId':res1.data.data.id},
                  header: {
                  'content-type': 'application/json' // 默认值
                  },success: function(res) {
                      if(res.data.data.state=='10'){
                        that.setData({
                          loadingText: '开锁成功'
                        });
                      }else{
                        that.setData({
                          loadingText: '开锁失败'
                        });  
                      }
                      setTimeout(function () {      
                        that.setData({
                          hidden: true
                        });

                        that.setData({
                          loadingText: '开锁中...'
                        });  


                      }, 1000) //延迟时间 这里是1秒
                      
                  }
                  
                })    
      



                
              }, 2500) //延迟时间 这里是1秒
              }else{

                wx.showToast({
                  title:"开锁失败",
                  icon:'none',
                  duration:2000
              }); 

                that.setData({
                    hidden: true
                });
              }  
            
            
            },error:function(res1) {
              console.log("unlockerror");
              that.setData({
                hidden: true
              });


            }
            
          })    




       
       
        }else if(res.cancel){
          console.log("否");
        }

      
      
        that.setData({
          switchCho: false
        });
      }
     

    })

    console.log('switch1 发生 change 事件，携带值为', e.target.dataset.bean.equipmentName);
  },
  onShow: function () {
    var that = this;
    that.createData();
    that.getEquipmentList();
    console.log("onShow");
  },

  /** 
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    var that = this;
   // wx.clearStorageSync("phone");
    //this.text="JR^\\\\D_XEHxU\u000b";
    console.log("OnLoad");
   
    that.setData({
      disabled: false
    });
    that.setData({
      text1: ""
    });

    
   
    console.log("wx"+wx.getStorageSync('phone'))  
    that.setData({
      phone: wx.getStorageSync('phone')
    });
    that.setData({
      residentId: wx.getStorageSync('residentId')
    });


    

    console.log("wxPone"+that.phone)  
  


   


    // setTimeout(function(){
    //   that.createData();
    //   that.getEquipmentList();

    // },1000)


    setInterval(function(){
      that.getEquipmentList();
      // clearTimeout(timer) 
     },1*1000*60);



    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight/1.5 
        });
      }
    });
  },

  createData:function(){


   // var phone='13536524756';
    var that = this;

    var phone = wx.getStorageSync('phone');
    var residentId = wx.getStorageSync('residentId');



    if((residentId==null || residentId==undefined || residentId=="") && phone!=""){
      wx.showToast({
          title:"请点击我的--》切换小区里面选择当前小区",
          icon:'none',
          duration:3000
      }); 
      return;
    }

    that.minuti=minuti1;

    that.setData({
      disabled: true
    });


    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

    

   
   // console.log(that.data.timer);
    clearInterval(that.data.timer);
    wx.request({
      url: url+'/equipment/getUser', //仅为示例，并非真实的接口地址
      data: {'phone':phone,'id':residentId},
      
      header: {
      
      'content-type': 'application/json' // 默认值
      
      },success: function(res) {
      
           //console.log(res.data)
         //  this.text = ;

          if(res.data.code=='9999'){
            that.setData({
              phone1:""
            })
            that.setData({
              text1:res.data.message
            })
            console.log(that.data.phone1+";;;"+that.data.text1);
            
            return;
          }

          console.log("fuck you");  


          that.setData({
            phone1:"12121"
          })
          that.setData({
            text1:""
          })

          that.setData({
            displayOne:"block"
          })

          

          that.setData({
            text:res.data.data
          })                 
          that.createImg();
      
      }
      
      })
  },



  getEquipmentList(){

    var that = this;
    var residentId = wx.getStorageSync('residentId');
    that.setData({
      equList:''
    })

    // console.log("indexPhone2"+that.data.phone);

    // console.log("11"+that.data.equList)

    var phone = wx.getStorageSync('phone');

   // var residentId = this.data.residentId;

    wx.request({
      url: url+'/equipment/getEquipmentList', //仅为示例，并非真实的接口地址
      data: {'phone':phone,'id':residentId},
      
      header: {
      
      'content-type': 'application/json' // 默认值
      
      },success: function(res) {
      
           //console.log(res.data)
         //  this.text = ;  

          if(res.data.code=='9999'){
            that.setData({
              phone1:""
            })

            that.setData({
              text1:res.data.message
            })
            that.setData({
              clientHeight:0
            })

            
            return;
          }


          wx.getSystemInfo({
            success: function (res) {
              that.setData({
                clientHeight: res.windowHeight/1.5 
              });
            }
          });



          that.setData({
            phone1:"12121"
          })
          that.setData({
            text1:""
          })

          that.setData({
            displayOne:"block"
          })
         

            that.setData({
              equList:res.data.data
            })

            setTimeout(() => {  
              that.setData({
                none1:"auto"
              });

            },300)
            //console.log("22as"+that.data.equList)  
            
        
        }
      
      })




  },

  createImg:function(){



    
    const z = this
    qrcode = new QRCode('canvas', {
      usingIn: this, // usingIn 如果放到组件里使用需要加这个参数
      text: z.text,
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: "#000000",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.L,
    });

   
    setTimeout(() => {
    z.setData({
      none1:"auto"
    });
    },300)


    setTimeout(() => {
      z.setData({
        disabled: false
      });
  
    },1300)
  

   
    // 生成图片，绘制完成后调用回调
    qrcode.makeCode(z.data.text, () => {
      // 回调
      setTimeout(() => {
        qrcode.exportImage(function(path) {
          console.log("this.create");
          z.setData({
            imgsrc: path
          })
         
        })
      }, 200)
    })

    //z.minuti--;
    
    // z.setData({
    //   minuti: 19
    // })

   // console.log("dddddddd"+z.minuti);
    
    var count= minuti1;

      z.setData({
      minuti: count
    })

    z.data.timer = setInterval(function(){
      count--;

      if(count==0){
        clearInterval(z.data.timer) 
      }
      z.setData({
        minuti: count
      })
      // clearTimeout(timer) 
     },1*1000*60)


    



  },
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        width: qrcodeWidth,
        height: qrcodeWidth,
      });

      that.setData({
        none1:"none"
      });

      if(e.target.dataset.current=="0"){
          this.createData();
      }else{
          this.getEquipmentList();
      }

      
      

      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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