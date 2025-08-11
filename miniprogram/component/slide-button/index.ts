import { throttle } from 'lodash-es';

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    initTop: {
      type: String
    },
    initRight: {
      type: String,
      value: '20px'
    },
    initBottom: {
      type: String,
      value: '100px'
    },
    initLeft: {
      type: String,
      value: null
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 模仿节流操作
    enableMove: true,
    diffDisX: 0,
    diffDisY: 0,
    top: null,
    right: null,
    bottom: null,
    left: null,
  },

  // 暂时没用，仅为后面参考
  observers: {
    'initTop': function(val) {
      // console.log("initTop", this.properties.initTop);
    },
    'top': function(val) {
      // console.log("top", val);
    }
  },

  lifetimes: {
    created() {
      if (this.properties.initTop) {
        this.setData({
          top: this.properties.initTop
        })
      }

      if (this.properties.initRight) {
        this.setData({
          right: this.properties.initRight
        })
      }

      if (this.properties.initBottom) {
        this.setData({
          bottom: this.properties.initBottom
        })
      }

      if (this.properties.initLeft) {
        this.setData({
          left: this.properties.initLeft
        })
      }
    },
    detached() {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTouchstart(e) {
      const targetOffsetTop = e.target.offsetTop
      const targetOffsetLeft = e.target.offsetLeft

      const offsetTop = e.touches[0].clientY;
      const offsetLeft = e.touches[0].clientX;


      this.setData({
        diffDisX: offsetLeft - targetOffsetLeft,
        diffDisY: offsetTop - targetOffsetTop
      })
    },

    handleMove(e) {
      // 模仿节流操作
      if (!this.data.enableMove) {
        setTimeout(
          () => {
            this.data.enableMove = true
          },
          60
        )
        return;
      }

      this.data.enableMove = false;

      const offsetTop = e.touches[0].clientY;
      const offsetLeft = e.touches[0].clientX;

      this.setData({
        top: `${offsetTop - this.data.diffDisY}px`,
        left: `${offsetLeft - this.data.diffDisX}px`,
        right: null,
        bottom: null,
      })

      // 留着这个事件的目的是方便以后参考
      this.triggerEvent(
        'position',
        {
          top: `${offsetTop - this.data.diffDisY}px`,
          left: `${offsetLeft - this.data.diffDisX}px`,
        }
      )
    }
  }
})