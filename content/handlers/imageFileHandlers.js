'use strict'

const fs = require('fs')
const zlib = require('zlib')
const db = require('../../db')

function imgCustomHandler (path, res) {
  // find image file location
  let index = Number(path.split('/').pop())
  let item = db.findEntry(index)
  if (item && item.imgFile) {
    let fileName = './content/images/' + item.imgFile
    // send image
    fs.exists(fileName, exists => {
      if (exists) {
        let ext = fileName.split('.').pop().toLowerCase()
        if (ext === 'jpg') {
          ext = 'jpeg'
        }
        res.writeHead(200, {
          'content-type': 'image/' + ext,
          'content-encoding': 'gzip'
        })
        let rs = fs.createReadStream(fileName)
        let gzip = zlib.createGzip()
        rs.pipe(gzip).pipe(res)
      } else {
        res.writeHead(303, {
          'location': '/content/error404.html'
        })
        res.end()
      }
    })
  } else {
    res.writeHead(303, {
      'location': '/content/error404.html'
    })
    res.end()
  }
}

module.exports = {imageFileHandler: imgCustomHandler}
