const Koa = require("koa");
const app = new Koa();
const bodyParser = require("koa-bodyparser");

app.use(bodyParser());

app.use(async ctx => {
    if (ctx.url === "/restfull") {
        const method = ctx.method;
        console.log('method',method)
        switch (method) {
            case "GET":
                console.log("get", ctx.querystring);
                ctx.body = "get";
                break;
            case "POST":
                console.log("post", ctx.request.body);
                ctx.body = "post";

                break;
            case "PUT":
                console.log("put", ctx.request.body);
                ctx.body = "put";

                break;
            case "DELETE":
                console.log("delete", ctx.request.body);
                ctx.body = "delete";

                break;
            default:
                break;
        }
    }
});

app.listen(3000, () => {
    console.log("server is running at http://localhost:3000");
});
