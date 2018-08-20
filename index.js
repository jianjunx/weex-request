const Fetcher = require("./lib/fetch");

const fetcher = new Fetcher();

const weexRequest = fetcher._proxy;

// 全局设置
weexRequest.default = fetcher.default;
// 拦截请求
weexRequest.interceptors = fetcher.interceptors;
// get 方法
weexRequest.get = fetcher.get;
// post 方法
weexRequest.post = fetcher.post;
// put 方法
weexRequest.put = fetcher.put;
// delete 方法
weexRequest.delete = fetcher.delete;
// patch 方法
weexRequest.patch = fetcher.patch;

module.exports = weexRequest;
