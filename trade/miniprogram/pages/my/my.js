// pages/my/my.js
Page({

  /**
   * page's data
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false
  },

  /**
   * life cycle function: run when the page finishes loading
   */
  onLoad: function (options) {
    // check server initialization and library version
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // get user's info
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  //Jump to the Add Page if want to add goods
  addGood: function(){
    wx.navigateTo({ 
      url: '/pages/add/add'
    })
  },
  
  //Jump to the Delete Page if want to delete goods
  deleteGood: function () {
    wx.navigateTo({
      url: '/pages/delete/delete'
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