(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.weexRequest = factory());
}(this, function () { 'use strict';

	const stream = weex.requireModule('stream');
	/**
	 * Fetcher类
	 * Weex-request 是封装weex中的stream.fetch模块，实现了便捷方法和拦截请求，可以像axios一样使用。
	 * 文档地址: https://github.com/Jefxie/weex-request
	 */
	class Fetcher {
		constructor() {
			this.default = {};
			this.init();
		}
		init() {
			// 初始化属性
			this.default.baseURL = '';
			this.default.headers = {};
			this.interceptors = {
				request: null,
				response: null
			};
		}
		_fetch(opt) {
			// 调用weex fetch发请求
			return new Promise((resolve, reject) => {
				// 转成Promise
				stream.fetch(opt, response => {
					if (!response.ok) {
						reject(response);
						return;
					}
					resolve(response);
				});
			});
		}
		async all(opt) {
			// 合并参数
			opt = this._params(opt);
			try {
				// 拦截请求
				if (this.interceptors.request && typeof this.interceptors.request == 'function') {
					opt = await this.interceptors.request(opt);
				}

				this._body(opt);
				const res = await this._fetch(opt);
				// 拦截响应
				if (this.interceptors.response && typeof this.interceptors.response == 'function') {
					return this.interceptors.response(res);
				}

				// 正常返回
				return Promise.resolve(res);
			} catch (error) {
				return Promise.reject(error);
			}
		}
		_params(opt) {
			opt.method = opt.method || 'GET';
			opt.url = opt.url || '';
			opt.headers = opt.headers || {};
			opt.type = opt.type || 'json';
			// 合并请求头
			opt.headers = Object.assign({}, this.default.headers, opt.headers);

			// 合并url
			if (!(opt.url && opt.url.startsWith('http'))) {
				if (opt.url.startsWith('/')) {
					opt.url = opt.url.replace('/', '');
				}

				if (this.default.baseURL && !this.default.baseURL.endsWith('/')) {
					this.default.baseURL = this.default.baseURL + '/';
				}

				opt.url = this.default.baseURL + opt.url;
				opt.baseURL = this.default.baseURL;
			}
			// 默认类型
			opt.type = opt.type || 'json';
			return opt;
		}
		_body(opt) {
			opt.bodyParse = this.default.bodyParse || 'json';
			// 转换请求体为String
			switch (opt.bodyParse) {
				case 'json':
					if (opt.data && typeof opt.data == 'object') {
						opt.body = JSON.stringify(opt.data);
					}
					break;
				case 'query':
					if (opt.data && typeof opt.data == 'object') {
						const _arr = [];
						for (const key in opt.data) {
							_arr.push(`${key}=${opt.data[key]}`);
						}
						opt.body = _arr.join('&');
					}
					break;
				default:
					break;
			}
			delete opt.data;
		}
	}

	function methods(Ft) {
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

	return weexRequest;

}));
