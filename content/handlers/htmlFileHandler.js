let fs = require('fs')

function htmlFileHandler (path, res) {
  res.writeHead(200, 'OK', {
    'content-type': 'text/html'
  })
  fs.createReadStream(path).pipe(res)
}

module.exports = {htmlFileHandler: htmlFileHandler}
