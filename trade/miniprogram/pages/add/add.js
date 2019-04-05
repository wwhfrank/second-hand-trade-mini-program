// miniprogram/pages/addcomment/addcomment.js
Page({

  /**
   * page's data
   */
  data: {
    form: {
      imgsrc: '',
      name:'',
      price:'',
      describe:'',
      contact:''
    },
    choice: true
  },

  /**
   * life cycle function: run when the page finishes loading
   */
  onLoad: function (options) {

  },

  // choose goods picture
  onChoose: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) { 
        //callback function when api call succeeded
        that.setData({
          'form.imgsrc': res.tempFilePaths[0], //store picture's local path in data
          choice: false              
        });
      }
    })
  },

  // get goods information
  onInput1: function (event) {
    this.setData({
      'form.name': event.detail.value 
    })
  },

  onInput2: function (event) {
    this.setData({
      'form.price': event.detail.value 
    })
  },

  onInput3: function (event) {
    this.setData({
      'form.describe': event.detail.value 
    })
  },

  onInput4: function (event) {
    this.setData({
      'form.contact': event.detail.value 
    })
  },

  // upload picture to the Storage
  uploadToStore: function () {
    var form = this.data.form;
    var that = this;
    // if the info list is empty, the system will remind user to input
    if (!form.imgsrc || !form.name || !form.price || !form.describe || !form.contact) {
      wx.showToast({
        title: 'please fill out the list',
        icon: 'none'
      });
      return;
    }

    var cloudPath = Date.now() + form.imgsrc.match(/\.[^.]+?$/)[0]; //create picture's unique name in Storage
    wx.cloud.uploadFile({
      cloudPath: cloudPath, 
      filePath: form.imgsrc, 
      success: function (res) {
        // return picture ID
        console.log('store success');
        that.addToDB(res.fileID); //call function to add to Database
      },
      fail: function () {
        console.log('store fail');
      }
    })
  },

  // add data to Database
  addToDB: function (fileID) {
    var form = this.data.form;
    //sent request and data to server
    wx.cloud.callFunction({  
      name: 'db',
      data: {
        type: 'add',
        imgID: fileID,
        name: form.name,
        price: form.price,
        describe: form.describe,
        contact: form.contact,
        collectors: []
      },
      success: function (res) {
         //res is feedback from server
        wx.showToast({
          title: 'add success',
        });
        // jump to My Page after 1.5 sec
        setTimeout(function () {
          wx.reLaunch({
            url: '/pages/my/my'
          });
        }, 1500)       
      },
      fail: function () {
        console.log('upload database fail');
      }
    })
  }
})