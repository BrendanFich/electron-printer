const { PosPrinter } = require('electron-pos-printer')

const htmlToPrint = (content, deviceName, pageSize, pcs, type) => {
  return new Promise((resolve, reject) => {
		const options = {
			preview: false, // Preview in window or print
			pageSize,
			margin: '0 0 0 0', // margin of content body
			copies: pcs, // Number of copies to print
			printerName: deviceName, // printerName: string, check it at webContent.getPrinters()
			timeOutPerLine: 10000,
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
