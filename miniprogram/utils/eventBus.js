/**
 * 发布-订阅模式
 * 自定义的事件总线
 * 方法:
 * on: 绑定一个事件
 * once: 绑定一个一次性事件
 * off: 移除一个事件
 * emit: 触发一个事件
 * use: 添加一个中间件
 *
 * @author lizhiqiang
 * @since 2020-3-7
 * @constructor
 */
export function EventBus () {
    this.eventArr = [] // 事件列表
    this.useFunArr = [] // 添加的中间件列表
  }
  
  // 事件模板
  const eventTpl = {
    name: '', // 事件名
    isOnce: false, // 是否只执行一次
    // 回调
    callback: function () {
    }
  }
  console.log(eventTpl)
  
  /**
   * 创建一个事件
   * @param {String} name
   * @param {Function} callback
   * @return {eventTpl}
   */
  EventBus.prototype.createEvent = function (name, callback) {
    return {
      name: name, // 事件名
      isOnce: false, // 是否只执行一次
      callback: callback // 回调
    }
  }
  
  /**
   * 获取事件
   * @param {String} name
   * @param {Function} fn
   * @return {eventTpl}
   */
  EventBus.prototype.getEvent = function (name, fn) {
    const matchFn = fn && typeof fn === 'function'
    return this.eventArr.filter((e) => {
      let b = e.name === name
      if (matchFn) {
        b = b && e.fn === fn
      }
      return b
    })
  }
  
  /**
   * 移除一个事件
   * @param {String} name
   * @param {Function} fn fn为空则全部移除
   * @return {void}
   */
  EventBus.prototype.removeEvent = function (name, fn) {
    const matchFn = fn && typeof fn === 'function'
    this.eventArr = this.eventArr.filter((e) => {
      let b = e.name === name
      if (matchFn) {
        b = b && e.fn === fn
      }
      return !b
    })
  }
  
  /**
   * 移除一个事件, 同removeEvent
   * @param {String} name
   * @param {Function} fn fn为空则全部移除
   * @return {void}
   */
  EventBus.prototype.off = function (name, fn) {
    this.removeEvent(name, fn)
  }
  
  /**
   * 添加中间件
   * @param {function(string, object, ()=>{})} fn 中间件函数 fn(name, packet, next)
   * @return {void}
   */
  EventBus.prototype.use = function (fn) {
    this.useFunArr.push(fn)
  }
  
  /**
   * 中间件过滤, 只有添加的中间件执行next(),
   * 才会触发下一个中间件,
   * 否则终止触发事件
   * @param {String} name 触发事件名
   * @param {Object} packet 触发事件传入的数据
   * @return {boolean} b
   */
  EventBus.prototype.useFilter = function (name, packet) {
    const useFunArr = this.useFunArr
    const len = useFunArr.length
    let index = 0
    if (len) {
      // 从第一个中间件开始执行
      useFunArr[0](name, packet, next)
      // 执行过的中间件与中间件总数相比较
      if (index === len - 1) {
        return true
      } else {
        return false
      }
    }
    return true
  
    function next () {
      // 每执行一个中间件,指数+1
      index++
      if (index < len) {
        useFunArr[index](name, packet, next)
      }
    }
  }
  
  /**
   * 添加事件
   * @param {String} name 事件名
   * @param {Function} fn 执行的事件函数
   * @param {boolean} cover 是否覆盖之前的事件
   * @return {eventTpl}
   */
  EventBus.prototype.on = function (name, fn, cover = false) {
    const ev = this.createEvent(name, fn)
    if (cover) {
      const eventArr = this.getEvent(name)
      if (eventArr.length > 0) {
        this.removeEvent(name)
      }
    }
    this.eventArr.push(ev)
    return ev
  }
  
  /**
   * 添加事件, 执行完立即立即销毁
   * @param {String} name 事件名
   * @param {Function} fn 执行的事件函数
   * @param {boolean} cover 是否覆盖之前的事件
   * @return {void}
   */
  EventBus.prototype.once = function (name, fn, cover = false) {
    const ev = this.on(name, fn, cover)
    ev.isOnce = true
  }
  
  /**
   * 触发一个事件
   * @param {String} name 事件名
   * @param {Object} data 传入事件监听方法的数据
   * @return {void}
   */
  EventBus.prototype.emit = function (name, data) {
    const eventArr = this.getEvent(name)
    const b = this.useFilter(name, data)
    const global= this.getEvent("global");
    console.log('global=====',global);
    if(!!global){
        const len2 = global.length
        let ev2
        for (let i = 0; i < len2; i++) {
          ev2 = global[i]
          // 执行监听的事件
          if (typeof ev2.callback === 'function') {
              console.log('callback====',ev2.callback);
            console.log('this.eventArr ====',this.eventArr);
            ev2.callback(data);
          }
        }
    }
    if (!b) {
      return
    };
    const len = eventArr.length
    let ev
    for (let i = 0; i < len; i++) {
      ev = eventArr[i]
      // 执行监听的事件
      if (typeof ev.callback === 'function') {
        const b = ev.callback(data)
        if (ev.isOnce) {
          this.removeEvent(event)
        }
        if (typeof b !== 'undefined' && b === false) {
          return
        }
      }
    }
  }
  
  const EventBusInstance = new EventBus()
  export { EventBusInstance } // 默认导出一个实例
  