import { BASE_URL } from "@/const/config";
import { postFaceResultApi } from '@/api/pages/id-card-face-recognition/index';
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
      name: '',
      idCardNumber: '',
      // 来源页面，如果有需要，再加，也好做判断，暂时先不加
      fromSource: '',
    },
    checked: false
  },

  async faceSuccess() {
    const result = await getPersonalDetailsApi();

    const dirveType = result.licensingReviewType

    if (
      dirveType === 'REFUSED' ||
      dirveType === 'UNCOMMITTED' ||
      dirveType === 'EXPIRED'
    ) {
      wx.navigateBack();
    } else if (dirveType === 'APPROVED') {
      wx.showModal({
        title: '恭喜！审核已经通过',
        content: '您可以开始用车了，超多用车活动， 快快出发吧！',
        confirmText: '确定',
        showCancel: false,
        success: () => {
          wx.navigateBack();
        }
      })
    } else if (dirveType === 'REVIEWING') {
      wx.showToast({
        title: '身份证审核已通过，驾驶证正在审核，大约1个工作日完成'
      });
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    } else {
      wx.showToast({
        title: '身份证审核已通过'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000)
    }
  },

  handleChangeAgree() {
    this.setData({
      checked: !this.data.checked
    })
  },

  handleConfirm() {
    wx.checkIsSupportFacialRecognition({
      success: () => {
        wx.startFacialRecognitionVerify({
          name: this.data.queryParams.name,
          idCardNumber: this.data.queryParams.idCardNumber,
          success: async(res) => {
            const verifyResult = res.verifyResult
            await postFaceResultApi({
              suppliers: 'tencent',
              scene: 'AUTH',
              verifyResult: verifyResult
            })

            this.faceSuccess();
          },
          fail() {
            wx.showToast({
              title: '人脸验证失败'
            });
          }
        })
      },
      fail() {
        wx.showToast({
          title: '该设备不支持人脸采集'
        });
      }
    })
  },

  handleReject() {
    wx.navigateBack();
  },

  handleGoAgreement() {
    wx.navigateTo({
      url:
        `/pages/web-view-normal/index?url=${ encodeURIComponent(BASE_URL + "/static/recognition.html") }`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const params = getOptions(options);
    this.data.queryParams.name = params.name
    this.data.queryParams.idCardNumber = params.idCardNumber
    this.data.queryParams.fromSource = params.from
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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