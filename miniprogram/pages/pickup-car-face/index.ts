import { BASE_URL } from "@/const/config";
import { postWxUserkeyApi, postFaceResultApi, postOrderFaceResultApi } from '@/api/pages/pickup-car-face/index';
import { getPersonalDetailsApi } from "@/api/common/user/index";
import { getOptions } from "@/util/common-url";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepsConfig: {
      steps: [
        {
          text: '',
        },
        {
          text: '',
        }
      ],
      active: 1
    },
    faceUrl: "https://mobje-pro-04-cos.mobje.cn/mini/mini/face.png",
    queryParams: {
      vin: '',
      orderId: '',
      orderNo: ''
    },
    isAgree: false
  },

  startFace(userIdKey) {
    wx.checkIsSupportFacialRecognition({
      success: () => {
        wx.startFacialRecognitionVerify({
          userIdKey: userIdKey,
          success: async (res) => {
            const verifyResult = res.verifyResult;
            await postFaceResultApi({
              suppliers: 'tencent',
              scene: 'ORDER_CREATE',
              verifyResult: verifyResult
            });

            await postOrderFaceResultApi({
              orderNo: this.data.queryParams.orderNo,
              faceResult: true
            });

            wx.navigateBack();
          },
          fail(res) {
            console.log(res);
            wx.showToast({
              title: '人脸验证失败'
            });
          }
        });
      },
      fail(res) {
        console.log(res);
        wx.showToast({
          title: '该设备不支持人脸采集'
        });
      }
    });
  },

  handleChangeAgree() {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },

  handleGoAgreement() {
    wx.navigateTo({
      url:
        `/pages/web-view-normal/index?url=${ encodeURIComponent(BASE_URL + "/static/recognition.html") }`,
    });
  },

  async handleConfirm() {
    if (!this.data.isAgree) {
      return;
    }

    const userIdKey = await postWxUserkeyApi();

    this.startFace(userIdKey);
  },

  handleReject() {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const params = getOptions(options);
    this.data.queryParams.vin = params.vin;
    this.data.queryParams.orderId = params.orderId;
    this.data.queryParams.orderNo = params.orderNo;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})