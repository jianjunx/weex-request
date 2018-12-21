import Fetcher from './fetcher';
import methods from './methods';

// 初始化便捷方法
methods(Fetcher);

// 创建一个fetcher实例
const fetcher = new Fetcher();

// 给让wq默认等于all方法
const weexRequest = fetcher.all.bind(fetcher);

// 给wq上绑定便捷方法
for (const key in fetcher) {
	Object.defineProperty(weexRequest, key, {
		configurable: true,
		get: () => fetcher[key],
		set() {}
	});
}

export default weexRequest;
