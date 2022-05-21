

/**
 * 循环事件池，根据Id添加指定的循环时间，id唯一，重复会进行覆盖
 */
 export interface IntervalEventType {
  callback: () => void; // 回调
  times: number; // 间隔时间
  intervalInstance: any; // interval 对象
}
export default class IntervalPool {
  
  private eventMap: Map<string, IntervalEventType> = new Map();

  findById(id: string, forceError?: boolean) {
    const obj = this.eventMap.get(id);
    if (!obj && !forceError) throw Error(`循环事件id [${id}] 不存在`);
    return obj;
  }

  clearIntervalByObj(obj: IntervalEventType | undefined) {
    obj && obj.intervalInstance && clearInterval(obj.intervalInstance);
  }

  /**
   * 添加循环事件
   * @param id 循环事件标识
   * @param intervalEvent 循环回调
   * @param times 循环间隔
   * @param immediately 是否立即执行一次， 默认否
   */
  add(id: string, intervalEvent: () => void, times: number, immediately?: boolean) {
    // 添加的时候要先判断是否已经存在，如果存在需要先clear，不然interval就会一直存在 内存泄漏
    const oldObj = this.findById(id, true);
    if (oldObj) {
      this.clearIntervalByObj(oldObj);
      this.eventMap.delete(id);
    }
    let obj: IntervalEventType = {
      callback: intervalEvent, times, intervalInstance: undefined
    }
    obj.intervalInstance = setInterval(obj.callback, times);
    this.eventMap.set(id, obj);
    immediately && obj.callback?.();
  }

  /**
   * 移除指定的循环事件
   * @param id 循环事件标识
   */
  remove(id: string) {
    this.clearIntervalByObj(this.findById(id));
    this.eventMap.delete(id);
  }

  /**
   * 停止指定循环事件
   * @param id 循环事件标识
   */
  stop(id: string) {
    this.clearIntervalByObj(this.findById(id));
  }

  /**
   * 重启指定循环事件
   * @param id 循环事件标识
   * @param times 时间间隔，默认为初始的时间间隔
   */
  restart(id: string, times?: number) {
    const obj = this.findById(id);
    this.clearIntervalByObj(obj);
    obj!.intervalInstance = setInterval(obj!.callback, times || obj!.times);
  }

}