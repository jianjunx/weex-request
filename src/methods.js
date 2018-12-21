export default function(Ft) {
	// 初始化便捷方法
	const methodKey = `get,post,delete,put,patch,head`.split(',');
	for (const key of methodKey) {
		// 为类添加上便捷方法
		Ft.prototype[key] = function(url = '', data, config = {}) {
			const _opt = Object.assign({
				method: key.toUpperCase(),
				url,
				data
			}, config);
			return this(_opt);
		};
	}
}
