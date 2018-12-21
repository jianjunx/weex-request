import Fetcher from './fetcher';
import methods from './methods';

// 初始化便捷方法
methods(Fetcher);

// 创建一个fetcher实例
const fetcher = new Fetcher();

// 让weexRequest默认等于all方法
const weexRequest = fetcher.all.bind(fetcher);

// 给weexRequest添加getter，并代理对便捷应方法到weexRequest
for (const key in fetcher) {
	Object.defineProperty(weexRequest, key, {
		configurable: true,
		get: () => fetcher[key],
		set() {}
	});
}

export default weexRequest;
