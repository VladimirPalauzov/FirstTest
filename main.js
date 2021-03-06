const http = require('http')
const url = require('url')
const multiparty = require('multiparty')

// user-defined modules
const db = require('./db')
const htmlHandlers = require('./content/handlers/htmlFileHandler')
const cssHandlers = require('./content/handlers/cssFileHandler')
const postHandlers = require('./content/handlers/postRequestHandlers')
const listHandlers = require('./content/handlers/dynamicListHandlers')
const imageHandlers = require('./content/handlers/imageFileHandlers')

// misc.
let port = process.env.PORT || 8877

let handlerPostDescriptors = [
    {key: '/create', type: 'str', target: null, handler: postHandlers.createEntry},
    {key: /^\/details\/\d+\/comment$/i, type: 'rgx', target: '=', handler: postHandlers.getAddCommentHandler}
]

let handlerGetDescriptors = [
    {key: '/', type: 'str', target: './content/index.html', handler: htmlHandlers.htmlFileHandler, requireHeaders: false},
    {key: /^\/content\/[a-zA-Z0-9_]+\.html$/i, type: 'rgx', target: '=', handler: htmlHandlers.htmlFileHandler, requireHeaders: false},
    {key: /^\/content\/styles\/[a-zA-Z0-9_]+\.css$/i, type: 'rgx', target: '=', handler: cssHandlers.cssFileHandler, requireHeaders: false},
    {key: '/create', type: 'str', target: './content/newentry.html', handler: htmlHandlers.htmlFileHandler, requireHeaders: false},
    {key: '/all', type: 'str', target: '', handler: listHandlers.getListHandler, requireHeaders: false},
    {key: '/stats', type: 'str', target: '', handler: listHandlers.getStatisticsHandler, requireHeaders: true},
    {key: /^\/details\/\d+$/i, type: 'rgx', target: '=', handler: listHandlers.getDetailsHandler, requireHeaders: false},
    {key: /^\/details\/changestate\/\d+$/i, type: 'rgx', target: '=', handler: listHandlers.getChangeStateHandler, requireHeaders: false},
    {key: /^\/imageSrc\/\d+$/i, type: 'rgx', target: '=', handler: imageHandlers.imageFileHandler, requireHeaders: false},
    /*  {key: '/all', type: 'str', target: '', handler: listHtmlHandler},
    {key: /^\/details\/\d+$/i, type: 'rgx', target: './content/list.html', handler: htmlHandlers.htmlFileHandler},
    {key: '/stat', type: 'str', target: './stat.html', handler: htmlFileHandler},
    {key: /^\/details\/\d+$/i, type: 'regex', target: '', handler: entryHtmlHandler}, */
    {key: '', type: 'str', target: './content/error404.html', handler: htmlHandlers.htmlFileHandler} // !!! must be always the last index of the array
]

let errorDescriptorIndex = handlerGetDescriptors.length - 1    // index of error page descriptor

http.createServer((req, res) => {
  if (req.method === 'POST') {
    executePostHandler(req, res)
  } else {
    executeGetHnadler(req, res)
  }
}).listen(port)

function executeGetHnadler (req, res) {
  let parsedUrl = url.parse(req.url)
  let descriptor = handlerGetDescriptors.find(dr => {
    if (dr.type === 'str') { // hard-coded path
      return parsedUrl.pathname === dr.key
    } else { // regular expression
      return parsedUrl.pathname.search(dr.key) > -1
    }
  }) || handlerGetDescriptors[errorDescriptorIndex]
  descriptor.handler((descriptor.target === '=') ? '.' + parsedUrl.pathname : descriptor.target, res, descriptor.requireHeaders ? req.headers : null)
}

function executePostHandler (req, res) {
  let form = new multiparty.Form()
  let parts = [] // gather all parts of the form
  form.on('part', (part) => {
    let obj = {}
    obj.name = part.name
    parts.push(obj)
    if (part.filename) { // file input
      obj.fileName = part.filename
      obj.data = []
      part.on('data', data => {
        obj.data.push(new Buffer(data))
      })
    } else { // text input
      obj.data = ''
      part.on('data', data => { obj.data += data })
    }
  })

  form.on('close', () => {
    let parsedUrl = url.parse(req.url)
    let descriptor = handlerPostDescriptors.find(dr => {
      if (dr.type === 'str') { // hard-coded path
        return parsedUrl.pathname === dr.key
      } else { // regular expression
        return parsedUrl.pathname.search(dr.key) > -1
      }
    }) || handlerPostDescriptors[errorDescriptorIndex]
    descriptor.handler((descriptor.target === '=') ? '.' + parsedUrl.pathname : descriptor.target, res, parts)
  })

  form.parse(req)
}

db.addNew('First', 'Test fulfilled', true)
db.addNew('Second', 'Test pending', false)
db.addNew('Third', 'Test pending', false)
// db.dump()
console.log(`Server is listening on port ${port}`)
