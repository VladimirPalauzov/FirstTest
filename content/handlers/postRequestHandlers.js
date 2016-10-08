const fs = require('fs')
let db = require('../../db')

// acceps data for new entry creation
function postCreateEntry (path, res, parts) {
  let title = ''
  let description = ''
  let imagePart = null
  for (let part of parts) {
    if (part.fileName) {
      imagePart = part
    } else if (part.name === 'title') {
      title = part.data
    } else if (part.name === 'description') {
      description = part.data
    }
  }
  if (title.length > 0 && description.length > 0) { // valid data - add new entry
    let id = db.addNew(title, description, false)
    res.writeHead(303, {
      'location': '/'
    })
    if (imagePart) {
      return acceptImage(id, imagePart, res)
    }
    res.end()
    // db.dump()
  } else { // validation not passed - show some error page
    res.writeHead(303, {
      'location': '/content/errorNewEntry.html'
    })
    res.end()
  }
}

// write image and finish request
function acceptImage (id, part, res) {
  let fullName = `./content/images/${part.fileName}`
  fs.exists(fullName, e => {
    if (e) { // file with this name already exists, try again
      let ar = part.fileName.split('.')
      part.fileName = ar[0] + getRandomInt(0, 1000).toString() + '.' + ar[1]
      return acceptImage(id, part, res)
    } else { // write image on disk
      let ws = fs.createWriteStream(fullName)
      for (let i = 0; i < part.data.length; i++) {
        ws.write(part.data[i])
      }
      ws.end()
      // update database entry
      db.findEntry(id).imgFile = part.fileName

      res.end()
    }
  })
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

// adds new comment to existing entry
function dynAddComment (path, res, parts) {
  let ar = path.split('/')
  ar.pop()
  let id = Number(ar.pop())
  for (let part of parts) {
    if (part.name === 'comment' && part.data !== '') {
      db.addComment(id, part.data)
    }
  }
  res.writeHead(303, {
    'location': `/details/${id}`
  })
  res.end()
}

module.exports = { createEntry: postCreateEntry, getAddCommentHandler: dynAddComment }
