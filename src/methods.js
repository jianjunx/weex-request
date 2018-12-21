export default function(Ft) {
	// 初始化便捷方法
	const methodKey = `get,post,delete,put,patch,head`.split(',');
	for (const key of methodKey) {
		// 为Ft类添加上get,post,delete,put,patch,head便捷方法
		Ft.prototype[key] = function(url = '', data, config = {}) {
			const _opt = Object.assign({
				method: key.toUpperCase(),
				url,
				data
			}, config);
			// 这里的this就是man.js中的weexRequest = fetcher.all.bind(fetcher)
			return this(_opt);
		};
	}
}
