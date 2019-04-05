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

  // get user's goods from database
  getData: function () {
    var that = this;

    console.log('begin to call cloud functions')
    // call cloud function to sent request to server
    wx.cloud.callFunction({ 
      name: 'db',
      data: {
        type: 'owngoods'
      },

      success: function (res) {
        console.log('get success');
        console.log(res);  //res is the data sent from the server
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
        console.log('get fail');
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
      url: '/pages/myDetail/myDetail'
    })
  },

  // delete goods
  onDelete:function(event){
    // get user's ID
    var deleteIndex = event.currentTarget.dataset.index;
    var deleteID = this.data.list[deleteIndex]._id;
    console.log(deleteID);

    // call cloud function to sent request to server
    wx.cloud.callFunction({  
      name: 'db',
      data: {
        type: 'delete',
        deleteID: deleteID
      },
      success: function (res) {
        console.log('delete success');
        wx.showToast({
          title: 'delete success'
        });
        //jump to the Delete Page after 1.5 sec
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/delete/delete'
          });
        }, 1500)
      },
      fail: function () {
        console.log('delete fail');
      }
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