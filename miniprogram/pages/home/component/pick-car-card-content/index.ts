import storeBehavior from "@/behaviors/store/index";
import { getCityLocationValidApi } from "@/api/pages/main/index";
import { getIsTimeValid } from "@/util/common-date";
import { jumpTripMiniH5Webview } from "@/util/common-url";

Component({
  behaviors: [storeBehavior],

  /**
   * 页面的初始数据
   */
  data: {},
  methods: {
    async getIsPointValid(selectedPointInfo) {
      return new Promise((resolve, reject) => {
        if (!selectedPointInfo.pickUpPointInfo.no) {
          wx.showToast({
            title: `请选择取车网点`,
            icon: "none",
          });
          reject();
        }

        if (
          selectedPointInfo.isDifferent &&
          !selectedPointInfo.returnPointInfo.no
        ) {
          wx.showToast({
            title: `请选择还车网点`,
            icon: "none",
          });
          reject();
        }

        resolve();
      });
    },

    async handleSelectCar() {
      // await getIsTimeValid(this.globalDataProxy.timeLimitInfo); // sja

      await this.getIsPointValid(this.globalDataProxy.selectedPointInfo);

      await getCityLocationValidApi(
        this.globalDataProxy.selectedPointInfo.cityInfo.cityCode,
        this.globalDataProxy.selectedPointInfo.pickUpPointInfo.no,
        this.globalDataProxy.selectedPointInfo.returnPointInfo.no
      );

      jumpTripMiniH5Webview("select-car");
    },
  },
});
