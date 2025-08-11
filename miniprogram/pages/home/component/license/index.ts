import storeBehavior from "@/behaviors/store/index"
import { jumpNormalWebview } from "@/util/common-url";
import { BASE_URL } from "@/const/config";

Component({

  behaviors: [storeBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
  },

  lifetimes: {
    ready() {
    }
  },

  methods: {
    handleClose() {
      wx.exitMiniProgram()
    },
    handleConfirm() {
      this.globalDataProxy.isAgreePrivacy = true
    },
    handleGoPrivacy() {
      jumpNormalWebview(`${BASE_URL}/static/secret-mini.html`);
    }
  }
})