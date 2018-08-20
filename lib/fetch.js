const stream = weex.requireModule("stream");

class Fetcher {
    constructor() {
        this.default = {};
        this.init();
    }
    init() {
        // 初始化
        this.default.baseUrl = "";
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
    async _proxy(opt) {
        // 合并参数
        opt = this._params(opt);
        try {
            // 拦截请求
            if (
                this.interceptors.request &&
                typeof this.interceptors.request == "function"
            ) {
                opt = await this.interceptors.request(opt);
            }
            const res = await this._fetch(opt);
            // 拦截响应
            if (
                this.interceptors.response &&
                typeof this.interceptors.response == "function"
            ) {
                return this.interceptors.response(res);
            }
            // 正常返回
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    _params(opt) {
        opt.method = opt.method || "GET";
        opt.url = opt.url || "";
        opt.headers = opt.headers || {};
        opt.type = opt.type || "json";
        // 合并请求头
        Object.assign(opt.headers, this.default.headers);

        // 合并url
        if (!(opt.url && opt.url.startsWith("http"))) {
            if (opt.url.startsWith("/")) {
                opt.url = opt.url.replace("/", "");
            }
            if (this.default.baseUrl && !this.default.baseUrl.endsWith("/")) {
                this.default.baseUrl = this.default.baseUrl + "/";
            }
            opt.url = this.default.baseUrl + opt.url;
        }
        // 转换请求体
        if (opt.body && typeof opt.body == "object") {
            for (const key in opt.body) {
                opt.body[key] = opt.body[key] + "";
            }
        }
        // 默认类型
        opt.type = opt.type || "json";
        return opt;
    }
    get(url = "", config = {}) {
        const _opt = {
            method: "GET",
            url
        };
        Object.assign(_opt, config);
        return this._proxy(_opt);
    }
    post(url = "", data, config = {}) {
        const _opt = {
            method: "POST",
            url,
            body: data
        };
        Object.assign(_opt, config);
        return this._proxy(_opt);
    }
    put(url = "", data, config = {}) {
        const _opt = {
            method: "PUT",
            url,
            body: data
        };
        Object.assign(_opt, config);
        return this._proxy(_opt);
    }
    delete(url = "", data, config = {}) {
        const _opt = {
            method: "DELETE",
            url,
            body: data
        };
        Object.assign(_opt, config);
        return this._proxy(_opt);
    }
    patch(url = "", data, config = {}) {
        const _opt = {
            method: "PATCH",
            url,
            body: data
        };
        Object.assign(_opt, config);
        return this._proxy(_opt);
    }
}

module.exports = Fetcher;
