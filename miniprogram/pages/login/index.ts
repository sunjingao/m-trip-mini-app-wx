import storeBehavior from "@/behaviors/store/index";
import { BASE_URL } from "@/const/config";
import { getOptions, redirectToTripMiniH5Webview } from "@/util/common-url";
import {
  postQuickLoginWxApi,
  postRegisterLoginCaptchaWxApi,
  postRegisterWxApi,
  getOpenIdApi,
} from "@/api/pages/login/index";

const maxTime = 60;

Page({
  behaviors: [storeBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    // 是否是包含快捷登录在内的部分
    isQuickLogin: true,
    // 同意了获取手机号
    isAgreeLogin: false,
    // 输入的手机号
    phone: "",
    // 输入的手机号验证码
    phoneCode: "",
    // 手机号验证码
    isPhoneCodeGetting: false,
    // 手机号验证码倒计时
    phoneCodeMinutes: maxTime,
    isPhoneCodeLoginDisable: true,
    queryParams: {
      // 是否返回原h5页面
      fromPath: ''
    }
  },

  onGlobalDataChange(globalData) {},

  handleChangePhone(event) {
    this.setData({
      phone: event.detail,
    });

    if (!!this.data.phone && !!this.data.phoneCode) {
      this.setData({
        isPhoneCodeLoginDisable: false,
      });
    } else {
      this.setData({
        isPhoneCodeLoginDisable: true,
      });
    }
  },

  handleChangePhoneCode(event) {
    this.setData({
      phoneCode: event.detail,
    });

    if (!!this.data.phone && !!this.data.phoneCode) {
      this.setData({
        isPhoneCodeLoginDisable: false,
      });
    } else {
      this.setData({
        isPhoneCodeLoginDisable: true,
      });
    }
  },

  async handleGetCode() {
    if (!this.data.phone) {
      wx.showToast({
        title: "请填写手机号",
        icon: "error",
      });
      return;
    }

    this.setData({
      isPhoneCodeGetting: true,
    });

    postRegisterWxApi({
      phone: this.data.phone,
    });

    const interval = setInterval(() => {
      if (this.data.phoneCodeMinutes === 0) {
        this.setData({
          phoneCodeMinutes: maxTime,
          isPhoneCodeGetting: false,
        });
        return clearInterval(interval);
      }

      this.setData({
        phoneCodeMinutes: --this.data.phoneCodeMinutes,
      });
    }, 1000);
  },

  clearToken() {
    this.globalDataProxy.token = ""
  },

  setOpenId() {
    wx.login({
      success: async (res) => {
        const result = await getOpenIdApi({
          type: "SC",
          jsCode: res.code,
        });
        this.globalDataProxy.openId = result.openid;
      },
    });
  },

  async handleShowCodeLogin() {
    this.setData({
      isQuickLogin: false,
    });
  },

  async handleCodeLogin() {
    if (!this.data.isAgreeLogin) {
      wx.showToast({
        title: "请选择用户协议",
        icon: "error",
      });
      return;
    }

    if (!this.data.phone) {
      wx.showToast({
        title: "请输入手机号",
      });
      return;
    }

    if (!this.data.phoneCode) {
      wx.showToast({
        title: "请输入短信验证码",
      });
      return;
    }

    const res = await postRegisterLoginCaptchaWxApi({
      phone: this.data.phone,
      captCha: this.data.phoneCode,
    });

    this.setOpenId();

    this.globalDataProxy.token = res.token;

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      loading: true,
      duration: 1000
    })

    setTimeout(
      () => {
        if (this.data.queryParams.fromPath) {
          redirectToTripMiniH5Webview(this.data.queryParams.fromPath)
        } else {
          wx.switchTab({
            url: '/pages/home/index'
          })
        }
      },
      500
    )
  },

  handlePreCheck(e) {
    wx.showToast({
      title: "请先同意相关协议",
      icon: "none",
    });
  },

  async handlePhoneNumber(e) {
    this.clearToken();
    const loginRsult = await postQuickLoginWxApi({
      code: e.detail.code,
    });

    this.setOpenId();

    this.globalDataProxy.token = loginRsult.token;

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      loading: true,
      duration: 1000
    })

    // 加缓存是因为状态管理需要时间
    setTimeout(
      () => {
        if (this.data.queryParams.fromPath) {
          // 活动页，直接跳转
          if (this.data.queryParams.fromPath === "activity-student") {
            wx.redirectTo({
              url: "/pages/web-view-special/activity-student/index"
            })
          } else {
            redirectToTripMiniH5Webview(this.data.queryParams.fromPath)
          }
        } else {
          wx.switchTab({
            url: '/pages/home/index'
          })
        }
      },
      500
    )
  },

  // 统一相关政策
  handleAgreeMobje() {
    this.setData({
      isAgreeLogin: !this.data.isAgreeLogin,
    });
  },

  // 跳转用户服务协议
  handleJumpUserAgreement() {
    wx.navigateTo({
      url:
        "/pages/web-view-normal/index?url=" + BASE_URL + "/static/mini/register.html",
    });
  },

  // 跳转隐私政策
  handleJumpPrivacyPolicy() {
    wx.openPrivacyContract({
      success: () => {},
      fail: () => {},
    });
  },

  // 摩捷租车小程序用户服务协议
  handleGoAgree() {
    wx.navigateTo({
      url:
        `/pages/web-view-normal/index?url=${ encodeURIComponent(BASE_URL + "/static/mini/register.html") }`,
    });
  },

  // 摩捷租车小程序隐私政策
  handleGoSecret() {
    wx.navigateTo({
      url:
        `/pages/web-view-normal/index?url=${ encodeURIComponent(BASE_URL + "/static/secret-mini.html") }`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const params = getOptions(options);
    this.data.queryParams.fromPath = params.fromPath
    // 进入到页面中，应该就清除token
    this.clearToken();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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
