import storeBehavior from "@/behaviors/store/index"
import { getIsTimeValid } from "@/util/common-date"
import timeBehavior from "../../behaviors/time"
import dayjs from "dayjs";

Component({
  behaviors: [storeBehavior, timeBehavior],

  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 选车时间限制信息
    timeLimitInfo: {
      // 提前预约小时数 正整数 (备注: 后端返的为字符串类型, 获取后应转为数字类型)
      appointmentTime: "1",
      // 预约用车日历展示月数 正整数
      calendarMonthNum: "2",
      // 单次最长租期 单位:天 (备注: 用户可以选择的最长天数, 预约业务线所有城市一样)
      maxTenancyTerm: 30,
      // 展示的取车时间
      fetchTime: new Date(),
      // 展示的还车时间
      returnTime: new Date(),
      // 早上营业的时间，如09:00。切换的城市会有一个，选择网点的时候会有一个
      openTime: "00:00",
      // 晚上营业截止的时间，如18:00。切换的城市会有一个，选择网点的时候会有一个
      closeTime: "23:30",
    },
    maxDate: new Date().getTime(),
    defaultCalendate: [new Date().getTime(), new Date().getTime()],
    startSelectValue: "00:00",
    endSelectValue: "11:30",
    startHourTime: "00",
    startMinuteTime: "00",
    startHour: "00",
    startMinute: "00",
    endHour: "00",
    endMinute: "00",
    dateRsult: [], // 储存实际选择日期的范围
    timeRsult: [], // 储存实际选择时间的范围
    isInOneDay: false, // 是否在24小时内
    isSubmitDisabled: false,
    formatterCalendate(content) {
      if (content.type === 'start') {
        content.text = '取';
        content.bottomInfo = '';
      }
      if (content.type === 'end') {
        content.text = '还';
        content.bottomInfo = '';
      }
      return content
    },
    formatterHourMinute(type, value) {
      if (type === 'hour') {
        return `${value}时`;
      }
      if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
    filterMinutes(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option === "00"  || option === "30");
      }

      return options;
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGlobalDataChange(globalData) {
      this.setData({
        timeLimitInfo: globalData.timeLimitInfo
      })
      this.initDayTime(globalData.timeLimitInfo)
      this.initDataTime()
    },
    setSubmitDisabled() {
      const dateStart = this.data.dateRsult[0]
      const dateEnd = this.data.dateRsult[1]

      const timeStartHour = this.data.timeRsult[0].split(':')[0]
      const timeStartMinute = this.data.timeRsult[0].split(':')[1]

      const timeEndHour = this.data.timeRsult[1] && this.data.timeRsult[1].split(':')[0]
      const timeEndMinute = this.data.timeRsult[1] && this.data.timeRsult[1].split(':')[1]

      let startTime = dayjs(dateStart)
      startTime = startTime.hour(timeStartHour)
      startTime = startTime.minute(timeStartMinute)

      
      let endTime = ''
      if (dateEnd) {
        endTime = dayjs(dateEnd)
        endTime = endTime.hour(timeEndHour)
        endTime = endTime.minute(timeEndMinute)
  
        const isWithin24Hours = Math.abs(dayjs(startTime).diff(dayjs(endTime))) < 86400000;
  
        this.setData({
          isInOneDay: isWithin24Hours,
          isSubmitDisabled: isWithin24Hours
        })
      } else {
        this.setData({
          isInOneDay: true,
          isSubmitDisabled: true
        })
      }
    },
    setShowContent() {
      const dateStart = this.data.dateRsult[0]
      const dateEnd = this.data.dateRsult[1]

      const timeStartHour = this.data.timeRsult[0].split(':')[0]
      const timeStartMinute = this.data.timeRsult[0].split(':')[1]

      const timeEndHour = this.data.timeRsult[1] && this.data.timeRsult[1].split(':')[0]
      const timeEndMinute = this.data.timeRsult[1] && this.data.timeRsult[1].split(':')[1]

      let startTime = dayjs(dateStart)
      startTime = startTime.hour(timeStartHour)
      startTime = startTime.minute(timeStartMinute)

      let endTime = undefined
      let temp = undefined
      if (dateEnd) {
        endTime = dayjs(dateEnd)
        endTime = endTime.hour(timeEndHour)
        endTime = endTime.minute(timeEndMinute)
  
        temp = {
          fetchTime: startTime.valueOf(),
          returnTime: endTime.valueOf()
        }
      } else {
        temp = {
          fetchTime: startTime.valueOf()
        }
      }

      this.setStartDay(temp)
      this.setStartTime(temp)

      if (dateEnd) {
        this.setLongTime(temp)
        this.setEndDay(temp)
        this.setEndTime(temp)
      } else {
        this.setData({
          longTime: ' ',
          endTime: ' ',
          endDay: ' '
        })
      }
    },
    handleClear() {
      this.onGlobalDataChange(this.globalDataProxy)
    },
    initDataTime() {
      let curMonth = dayjs(this.data.timeLimitInfo.fetchTime)
      
      curMonth = curMonth.add(this.data.timeLimitInfo.calendarMonthNum, 'month')

      const startSelectValue = `${new Date(this.data.timeLimitInfo.fetchTime).getHours()}:${new Date(this.data.timeLimitInfo.fetchTime).getMinutes()}`
      const endSelectValue = `${new Date(this.data.timeLimitInfo.returnTime).getHours()}:${new Date(this.data.timeLimitInfo.returnTime).getMinutes()}`

      this.setData({
        maxDate: curMonth.valueOf(),
        startHourTime: new Date(this.data.timeLimitInfo.fetchTime).getHours(),
        startMinuteTime: new Date(this.data.timeLimitInfo.fetchTime).getMinutes(),

        startHour: this.data.timeLimitInfo.openTime.split(':')[0],
        startMinute: this.data.timeLimitInfo.openTime.split(':')[1],
        endHour: this.data.timeLimitInfo.closeTime.split(':')[0],
        endMinute: this.data.timeLimitInfo.closeTime.split(':')[1],
        defaultCalendate: [
          this.data.timeLimitInfo.fetchTime,
          this.data.timeLimitInfo.returnTime
        ],
        startSelectValue: startSelectValue,
        endSelectValue: endSelectValue,

        dateRsult: [
          this.data.timeLimitInfo.fetchTime,
          this.data.timeLimitInfo.returnTime
        ]
      })
    },
    handleClose() {
      this.triggerEvent('close');
    },

    handleCalendarSelect(value) {
      this.data.dateRsult = [...value.detail]

      this.setShowContent();

      this.setSubmitDisabled();
    },
    handleInputStart(value) {
      this.data.timeRsult[0] = value.detail

      this.setShowContent();

      this.setSubmitDisabled();
    },
    handleInputEnd(value) {
      this.data.timeRsult[1] = value.detail

      this.setShowContent();

      this.setSubmitDisabled();
    },
    async handleConfirm() {
      if (this.data.dateRsult[1] === null) {
        wx.showToast({ title: '请选择还车时间', icon: 'none' });
        return
      }

      const dateStart = this.data.dateRsult[0]
      const dateEnd = this.data.dateRsult[1]

      const timeStartHour = this.data.timeRsult[0].split(':')[0]
      const timeStartMinute = this.data.timeRsult[0].split(':')[1]

      const timeEndHour = this.data.timeRsult[1].split(':')[0]
      const timeEndMinute = this.data.timeRsult[1].split(':')[1]

      let startTime = dayjs(dateStart)
      startTime = startTime.hour(timeStartHour)
      startTime = startTime.minute(timeStartMinute)

      let endTime = dayjs(dateEnd)
      endTime = endTime.hour(timeEndHour)
      endTime = endTime.minute(timeEndMinute)

      const temp = this.data.timeLimitInfo
      temp.fetchTime = startTime.valueOf()
      temp.returnTime = endTime.valueOf()
      await getIsTimeValid(temp)

      this.globalDataProxy.timeLimitInfo.fetchTime = startTime.valueOf()
      this.globalDataProxy.timeLimitInfo.returnTime = endTime.valueOf()

      this.triggerEvent('close');
    }
  }
})