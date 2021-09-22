const { PosPrinter } = require('electron-pos-printer')

const htmlToPrint = (content, deviceName, pageSize, pcs, type) => {
	let width
	if (pageSize.width) {
		width = pageSize.width / 1000 + 'mm'
	}
  return new Promise((resolve, reject) => {
		const options = {
			preview: false, // Preview in window or print
			pageSize,
			width: width || '100vw',
			margin: '0 0 0 0', // margin of content body
			copies: pcs, // Number of copies to print
			printerName: '导出为WPS PDF',// deviceName, // printerName: string, check it at webContent.getPrinters() 导出为WPS PDF
			timeOutPerLine: 10000, // 每行解析时间，设置小了会有超时报错
			silent: true,
		}
		PosPrinter.print([{ type: type === 'html' ? 'text' : type, value: content }], options)
			.then(() => {
				resolve(true)
			})
			.catch(error => {
				reject(error)
			})
  })
}

module.exports = htmlToPrint
