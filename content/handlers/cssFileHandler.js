let fs = require('fs')

function cssFileHandler (path, res) {
  res.writeHead(200, 'OK', {
    'content-type': 'text/css'
  })
  fs.createReadStream(path).pipe(res)
}

module.exports = {cssFileHandler: cssFileHandler}
