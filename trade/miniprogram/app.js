//app.js
App({
  globalData: {
  },
  
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('please use 2.2.3 or the latest library to support cloud abilities')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'cloud1-2d369d'
      })
    }

    this.globalData = {}
  }
})
