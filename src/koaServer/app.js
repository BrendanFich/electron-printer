const bodyParser = require('koa-bodyparser')
const http = require('http')
const Koa = require('koa')
const cors = require('koa2-cors')

const portSecurity = require('../utils/portSecurity')

const printApi = require('./router/print')
const silentPrintApi = require('./router/silentPrint')

const httpPort = 1006

const createKoaServer = (mainWindow) => {
    const app = new Koa()
    // 设置头部信息
    app.use(cors())
    app.use(bodyParser())
    //使用路由中间件
    app.use(async (ctx, next) => {
        ctx.mainWindow = mainWindow
        await next()
    })
    
    app.use(printApi.routes()).use(printApi.allowedMethods())
    app.use(silentPrintApi.routes()).use(silentPrintApi.allowedMethods())
    // app.listen(port, () => {
    //     console.log(`http run ${port}`)
    // })
    portSecurity(httpPort, () => {
        // 创建http服务器实例
        const httpServer = http.createServer(app.callback()).listen(httpPort)
    })
}


module.exports = createKoaServer
