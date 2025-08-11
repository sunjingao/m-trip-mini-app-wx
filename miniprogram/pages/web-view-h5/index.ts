import storeBehavior from "@/behaviors/store/index";
import { OperationUrl } from "mo-front-end-util";

Page({
  behaviors: [storeBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    // baseUrl: "https://trip-sit-tc.mobje.cn/trip-mini-h5/",
    // baseUrl: "http://localhost:8899/trip-mini-h5/",
    // path: "/platform-fee",
    // query: {},
    // baseUrl: "http://localhost:8899/trip-mini-h5/index.html/",
    // baseUrl: "https://trip-sit-tc.mobje.cn/trip-mini-h5/index.html/",
    // path: "/main",
    url: "",
  },

  onGlobalDataChange(globalData) {
    // // if (!globalData.selectedPointInfo.pickUpPointInfo.no) {
    // //   return;
    // // }
    // let baseUrl = `${this.data.baseUrl}#${this.data.path}`;
    // const query = {
    //   ...this.data.query,
    //   ...globalData,
    // };
    // const url = OperationUrl.concat(baseUrl, query);
    // // for (const [key, value] of Object.entries(query)) {
    // //   if (value === undefined) {
    // //     continue;
    // //   }
    // //   if (url.endsWith("?")) {
    // //     url = `${url}${key}=${encodeURIComponent(JSON.stringify(value))}`;
    // //   } else {
    // //     url = `${url}&${key}=${encodeURIComponent(JSON.stringify(value))}`;
    // //   }
    // // }
    // this.setData({
    //   url: url,
    // });
  },

  // 处理h5传递过来的data数据
  handleMesage(event) {
    if (event.type !== "message") {
      return;
    }

    // 取最近传入的数据
    const receiveData = event.detail.data[event.detail.data.length - 1];

    for (const [key, value] of Object.entries(receiveData)) {
      this.globalDataProxy[key] = value;
    }
  },

  // 初始化需要跳转的url
  initToUrl(url) {
    const urlPath = OperationUrl.concat(url, this.globalDataProxy);

    this.setData({
      url: urlPath,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!options.url) {
      return;
    }

    const url = decodeURIComponent(options.url);

    this.initToUrl(url);
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
