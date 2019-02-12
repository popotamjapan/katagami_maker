import * as Express from 'express'
import * as Log4js from 'log4js'
import * as multer from 'multer'
import * as PDFDocument from 'pdfkit'

type Request = Express.Request
type Response = Express.Response

Log4js.configure('log4js.json')

const SVGtoPDF = require('svg-to-pdfkit')

//  logger
const logger = Log4js.getLogger()

/**
 * CORS 対策用のヘッダをセット
 * @param res レスポンス
 */
function cors(res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*')
}

async function sayHello(res: Response): Promise<Response> {
  cors(res)
  const msg = 'hello'
  logger.info(`message: ${msg}`)
  return res.json(msg)
}

const uploader = multer({})

async function svg2pdf(req: Request, res: Response) {
  cors(res)
  const svg = req.body.svg
  const doc = new PDFDocument()
  SVGtoPDF(doc, svg, 0, 0)
  doc.pipe(res)
  doc.end()
}

//  Express でエントリポイントを作成する。
const app = Express()

app.use(Express.static('./public'))

app.get('/hello', (req: Request, res: Response) => sayHello(res))
app.post('/svg2pdf', uploader.single('svg'), (req: Request, res: Response) =>
  svg2pdf(req, res)
)

//  DBを初期化し、Webサーバを起動。
app.listen(3000, () => logger.info('Example app listening on port 3000!'))
