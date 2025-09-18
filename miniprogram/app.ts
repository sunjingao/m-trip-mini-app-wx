import store from "@/store/global";

App<IAppOption>({
  onLaunch() {
    // 改版前存在 userPrivacyStatus，说明之前登录过，去掉相关内容
    if (wx.getStorageSync("userPrivacyStatus")) {
      wx.setStorageSync("userPrivacyStatus", false)
      wx.setStorageSync("token", "")
    }

    this.init();
  },

  initStore() {
    this.getGlobalDataProxy = store.getGlobalDataProxy;
    this.addGlobalDataChangeCb = store.addGlobalDataChangeCb;
    this.removeGlobalDataChangeCb = store.removeGlobalDataChangeCb;
    this.clearGlobalData = store.clearGlobalData;

    store.initGlobalData();
  },

  init() {
    this.initStore();
  },
});
