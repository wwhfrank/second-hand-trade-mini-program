// cloud functions
const cloud = require('wx-server-sdk')

cloud.init()
var db = cloud.database();

// cloud entrance function
exports.main = async (event, context) => {
  console.log('Success');
  console.log(event); //event is the data sent from wx.cloud.callFunction

  if (event.type == 'add') {
    return add(event, context);
  }

  if (event.type == 'get') {
    return getData(event, context);
  }

  if (event.type == 'delete') {
    return deleteData(event, context);
  }

  if (event.type == 'detail') {
    return getDetailData(event, context);
  }

  if (event.type == 'addFavourite') {
    return addFavouriteData(event, context);
  }

  if (event.type == 'getFavourite') {
    return getFavouriteData(event, context);
  }

  if (event.type == 'deleteFavourite') {
    return deleteFavouriteData(event, context);
  }

  return getOwnData(event, context);
}

//add data to database
function add(event, context) {
  return new Promise(function (resolve, reject) {
    db.collection('goodinfo').add({ //goodinfo is the collection in database
      // data need to add
      data: {
        imgID: event.imgID,
        name: event.name,
        price: event.price,
        describe: event.describe,
        contact: event.contact,
        time: Date.now(),
        sellerID: event.userInfo.openId
      },
      success: function (res) {
        console.log('add success');
        resolve(res);
      },
      fail: function (err) {
        console.log('add fail');
        reject(err);
      }
    })
  });
}

//get data from database
function getData(event, context) {
  return db.collection('goodinfo').get();
}

function getOwnData(event, context) {
  return db.collection('goodinfo').where({
    sellerID: event.userInfo.openId  //selector
  }).get();
}

function deleteData(event, context) {
  return db.collection('goodinfo').doc(event.deleteID).remove();
}

function getDetailData(event, context) {
  return db.collection('goodinfo').doc(event.detailID).get();
}

function addFavouriteData(event, context) {
  return db.collection('goodinfo').doc(event.favouriteID).update({
    data: {
      collectors: db.command.push(event.userInfo.openId) //add user's ID to collectors
    },
    success(res) {
      console.log('add to cart success')
      console.log(res.data)
    }
  })
}

function getFavouriteData(event, context) {
  return db.collection('goodinfo').where({
    collectors: event.userInfo.openId  //selector
  }).get();
}

function deleteFavouriteData(event, context) {
  var collectors = event.collectors;
  var length = collectors.length;
  // remove user's ID in collectors
  for (var i=length; i>=0; i--){
    if (collectors[i] == event.userInfo.openId) {
      collectors.splice(i, 1);
    }
  };
  // update collectors
  return db.collection('goodinfo').doc(event.favouriteID).update({
    data: {
      collectors: collectors
    },
    success(res) {
      console.log('remove from cart success')
    }
  })
}