Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 传递过来的参数，用于支付使用
    params: {
      appId: "", // 小程序appid
      timeStamp: "", // 时间戳
      nonceStr: "", // 随机字符串
      package: "", // 统一下单接口返回的 prepay_id 参数值
      signType: "", // 签名算法
      paySign: "", // 签名
    },
  },

  pay() {
    console.log("this.data.params", this.data.params);
    const params = this.data.params;
    wx.requestPayment({
      appId: params.appId, // 小程序appid
      timeStamp: params.timeStamp, // 时间戳
      nonceStr: params.nonceStr, // 随机字符串
      package: params.package, // 统一下单接口返回的 prepay_id 参数值
      signType: params.signType, // 签名算法
      paySign: params.paySign, // 签名,
      complete: function () {
        wx.navigateBack();
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      params: JSON.parse(decodeURIComponent(options.params)),
    });

    this.pay();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
