// miniprogram/pages/list/list.js
var app = getApp();

Page({
  //page's data
  data: {
    list: []
  },

 //life cycle function: run when the page finishes loading
  onLoad: function (options) {
    this.getData();
  },

  getData: function () {
    var that = this;

    console.log('begin to call cloud functions')
    // call cloud function to sent request to server
    wx.cloud.callFunction({
      name: 'db',
      data: {
        type: 'getFavourite'
      },

      success: function (res) {
        console.log('get goods in cart success');
        console.log(res); 
        var result = res.result;
        that.dealData(result.data, function (urlList) {
          //function dealData will return picture's URL link，callback function will update pages' data
          console.log(urlList);
          that.setData({
            list: urlList
          });
        })
      },

      fail: function () {
        console.log('get goods in cart fail');
      }
    })
  },

  // transform Cloud link to URL link
  dealData: function (oldList, callback) {
    var tempList = [];
    oldList.forEach(function (item) { //item is oldList's element
      tempList.push(item.imgID); //put every cloud link into tempList
    });

    //transform Cloud link to URL link
    wx.cloud.getTempFileURL({
      fileList: tempList,
      success: function (res) {
        var mixList = res.fileList; //mixList has both cloud link and url link
        oldList.forEach(function (item, index) { //put mixList's url link into oldList
          item.imgID = mixList[index].tempFileURL;
        })

        callback(oldList); //callback function
      },

      fail: function () {
        wx.showToast({
          title: 'error'
        })
      }
    })
  },

 
  // get user's ID before jump to Detail Page
  onDetail: function (event) {
    var detailIndex = event.currentTarget.dataset.index;
    var detailID = this.data.list[detailIndex]._id;
    app.globalData.detailID = detailID;
    wx.navigateTo({
      url: '/pages/favouriteDetail/favouriteDetail'
    })
  },

  //Jump to the Home Page
  onHome: function () {
    wx.navigateTo({
      url: '/pages/home/home'
    })
  },

  //Jump to the Cart Page
  onFavourite: function () {
    wx.navigateTo({
      url: '/pages/favourite/favourite'
    })
  },

  //Jump to the My Page
  onMy: function () {
    wx.navigateTo({
      url: '/pages/my/my'
    })
  }
})