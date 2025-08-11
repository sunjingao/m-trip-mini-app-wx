import { getContentSigningStatusApi } from "@/api/pages/esign/index";
import { getOptions } from "@/util/common-url";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 是否首次进入
    isFirst: true,
    // 合同订单号
    orderNo: "",
    // 公证签小程序的入参
    miniExtraData: {
      flowId: undefined,
      accountId: undefined,
      type: "SIGN",
      // 微信小程序的运行环境
      env: ["develop", "trial"].includes(
        wx.getAccountInfoSync().miniProgram.envVersion
      )
        ? "sml"
        : "prod", // 环境，沙箱环境为：sml，正式环境为：prod
      group: "",
    },
  },

  handleGoEsing() {
    if (!this.data.miniExtraData.flowId && !this.data.miniExtraData.accountId) {
      wx.showToast({
        title: "未获取到合同，请重试!",
        duration: 1000 * 3,
        icon: 'error',
      });
      wx.navigateBack();
      return;
    }
    wx.navigateToMiniProgram({
      appId: "wx1cf2708c2de46337", // 公证签小程序APPID
      path: "/pages/index/index", // webview页面地址
      extraData: {
        // 入参
        requestObj: this.data.miniExtraData,
        // 回传数据：签署/授权认证完成后会将此数据完整回传
        callbackObj: {
          from: "esign",
          flag: "mobje-wx-esign",
        },
      },
      // 仅针对开发或体验版有效，线上无效
      envVersion: "release",
      success: () => {
      },
      fail: () => {
        // 显示失败提示
        wx.showToast({
          title: "打开失败，请点击按钮重试!",
          icon: "none",
          duration: 2000,
          mask: true,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const params = getOptions(options);

    this.data.miniExtraData.accountId = params?.accountId;
    this.data.miniExtraData.flowId = params?.flowId;
    this.data.orderNo = params?.no;

    if (this.data.miniExtraData.flowId && this.data.miniExtraData.accountId) {
      this.handleGoEsing();
    } else {
      wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    if (this.data.isFirst) {
      this.data.isFirst = false;
      return;
    }

    wx.showToast({
      title: "请稍后",
      icon: "none",
      mask: true,
      duration: 1000 * 20
    })

    // 是否已经签署过合同了
    const hasSign = await getContentSigningStatusApi({
      orderNo: this.data.orderNo,
    });

    if (!hasSign) {
      return;
    }

    wx.navigateBack();
    wx.showToast({
      title: "签署成功!",
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});
