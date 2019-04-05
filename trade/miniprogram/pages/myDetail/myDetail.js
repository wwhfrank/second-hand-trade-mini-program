// miniprogram/pages/detail/detail.js

var app = getApp(); //get global variable

Page({

  /**
   * page's data
   */
  data: {
    imgsrc: '',
    name: '',
    price: '',
    describe: '',
    contact: ''
  },

  /**
   * life cycle function: run when the page finishes loading
   */
  onLoad: function (options) {
    //get goods ID
    var detailID = app.globalData.detailID;
    this.getDetailData(detailID);
  },

  getDetailData: function (detailID) {
    var that = this;
    // call cloud function to sent request to server
    wx.cloud.callFunction({ 
      name: 'db',
      data: {
        type: 'detail',
        detailID: detailID
      },
      success: function (res) { //res is the data sent from the server
        console.log('detail success');
        var data = res.result.data;
        that.setData({
          name: data.name,
          price: data.price,
          describe: data.describe,
          contact: data.contact
        });

        var list = [];
        list[0] = data.imgID;
        that.dealData(list, function (urlList) {
          //function dealData will return picture's URL link，callback function will update pages' data
          that.setData({
            imgsrc: urlList[0]
          });
        })
      },
      fail: function () {
        console.log('detail fail');
      }
    })
  },

  // transform Cloud link to URL link
  dealData: function (oldList, callback) {
    var tempList = [];
    tempList = oldList

    //transform Cloud link to URL link
    wx.cloud.getTempFileURL({
      fileList: tempList,
      success: function (res) {
        var mixList = res.fileList; //mixList has both cloud link and url link
        oldList[0] = mixList[0].tempFileURL

        callback(oldList); //callback function
      },

      fail: function () {
        console.log('url fail')
      }
    })
  }
})