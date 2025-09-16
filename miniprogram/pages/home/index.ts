import { getCosImgUrl, jumpNormalWebview, jumpTripMiniH5Webview } from "@/util/common-url";
import storeBehavior from "@/behaviors/store/index";
import { getPersonalDetailsApi } from "@/api/common/user/index";
import { getTimeHorizonApi } from "@/api/pages/main/index";

Page({
  behaviors: [storeBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    // 是否统一隐私策略
    isAgreePrivacy: false,
    // 摩捷logo
    mobjeLogo: getCosImgUrl("logo_text.png"),
    // 轮播数据
    swiperList: [
      // {
      //   url: 'https://mobje-pro-04-1309183960.cos.ap-beijing.myqcloud.com/banner-student-activity.jpg',
      //   cbName: "goStudent"
      // },
      {
        url: 'https://mobje-pro-04-1309183960.cos.ap-beijing.myqcloud.com/activity-newcustomer.jpg',
        cbName: "goTrumpActivity"
      },
    ]
  },

  onGlobalDataChange(globalData) {
    this.setData({
      token: globalData.token,
      isAgreePrivacy: globalData.isAgreePrivacy,
    });
  },

  // 轮播图中，点击大学生活动
  goStudent() {
    wx.navigateTo({
      url: "/pages/web-view-special/activity-student/index",
    });
  },

  // 轮播图中，点击新用户专属福利图
  goTrumpActivity() {
    jumpNormalWebview(
      "https://mp.weixin.qq.com/s/jg5TDG_2qMGA7JDqbjoUyA"
    )
  },

  // 点击活动进行跳转
  handleTapSwiperItem(event) {
    const cbName = event.currentTarget.dataset['cb']
    this[cbName]();
  },

  handleAbout() {
    jumpTripMiniH5Webview("about");
  },

  handleLogin() {
    wx.navigateTo({
      url: "/pages/login/index",
    });
  },

  async handleService() {
    // 这个函数不能放在onShow中，因为onShow调用这个接口会自动提示登录，并不好
    // 放在这里有点不合理，但是电话号码可能被修改，数据可能会变
    const result = await getPersonalDetailsApi();
    const phone = result.phone;
    const name = result.name;

    jumpNormalWebview(
        `https://webchat1-bj.clink.cn/chat.html?accessId=7600099f-d07c-41d2-94d7-fd785cd25814&language=zh_CN&headerIsShow=1&visitorId=${phone}&tel=${phone}&customerFields=${encodeURIComponent(
          JSON.stringify({
            客户名称: name ?? ''
          })
        )}&visitorExtraInfo=${encodeURIComponent(JSON.stringify({ phone }))}`
    )
  },

  // 留着这个事件的目的是方便以后参考
  handleChangePosition(val) {
    // console.log('位置信息', val);
  },

  // async updateTime() {
  //   let result = await getTimeHorizonApi(this.globalDataProxy.selectedPointInfo.cityInfo.cityCode);
  //   this.globalDataProxy.timeLimitInfo.fetchTime = result.fetchTime
  //   this.globalDataProxy.timeLimitInfo.returnTime = result.returnTime
  // },

  onLoad() {
    wx.preloadWebview();
    // 更新状态管理中的取还车时间
    // if (this.globalDataProxy) {
    //   this.updateTime()
    // }
  },
});
