
import IntervalPool from '../../src/interval/pool';

const intervalInstance = new IntervalPool();

const testFn = () => {
  console.info("testFn => ", new Date().getTime());
}

intervalInstance.add('1', testFn, 1000);

// 模拟加入事件
setTimeout(() => {
  intervalInstance.add('2', () => {
    console.info('2 => ', new Date().getTime())
  }, 2000, false);
}, 3000);

// 8秒后停止事件1
setTimeout(() => {
  intervalInstance.stop('1');
}, 8000);