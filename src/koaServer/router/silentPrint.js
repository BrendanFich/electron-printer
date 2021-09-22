const Router = require('koa-router')
const router = new Router({ prefix: '/print' })

const pdfToPrint = require('../controller/pdfPrint')
const htmlToPrint = require('../controller/htmlPrint')

const { awaitWrapper } = require('../utils')
const { SuccessModel, ErrorModel } = require('../model/resultModel')

const handle = {
  pdf: () => pdfToPrint,
  html: () => htmlToPrint,
}

const types = Object.keys(handle)

/*
 * 打印
 * @type
 * @content
 * */
router.post('/silentPrint', async (ctx, next) => {
  const { request, mainWindow } = ctx
  const { content, deviceName="", pageSize = 'A4' } = request.body

	let {type = 'html', pcs = 1} = request.body
	type = type.toLowerCase()
	pcs = Number.parseInt(pcs)
	if (Number.isNaN(pcs)) pcs = 1

  const printList = mainWindow.webContents.getPrinters()

	if (!types.includes(type)) {
		ctx.body = new ErrorModel(`type只能为${types.join(',')}`)
		return
}
  if (!content) {
    ctx.body = new ErrorModel(`打印内容不能为空`)
    return
  }
  /* 校验打印机是否有效 */
  let printValid = true
	const defaultPrinter = printList.find((v) => !v.status)
  if (deviceName) {
    const valid = printList.find((v) => v.name === deviceName && !v.status)
    if (!valid) {
      printValid = false
      ctx.body = new ErrorModel(`【${deviceName}】打印机不可用`)
    }
  } else {
    if (!defaultPrinter) {
      printValid = false
      ctx.body = new ErrorModel(`打印机不能为空`)
    }
  }
  if (!printValid) return

  // 打印
  const [error] = await awaitWrapper(
    handle[type]()(content, deviceName || defaultPrinter.name , pageSize, pcs, type)
  )
  if (error) {
    // log.error(`【${deviceName}】 | ${error} | ${type} | ${content}`)
    console.log(`【${deviceName || defaultPrinter.name}】 | ${error} | ${type} | ${content}`)
    ctx.body = new ErrorModel(error)
  } else {
    // log.info(`【${deviceName}】 | 成功 | ${type} | ${content}`)
    console.log(`【${deviceName || defaultPrinter.name}】 | 成功 | ${type} | ${content}`)
    ctx.body = new SuccessModel('打印成功')
  }
})

module.exports = router
