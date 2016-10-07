let db = require('../../db')

// acceps data for new entry creation
function postCreateEntry (path, res, parts) {
  let title = ''
  let description = ''
  for (let part of parts) {
    if (part.name === 'title') {
      title = part.data
    } else if (part.name === 'description') {
      description = part.data
    }
  }
  if (title.length > 0 && description.length > 0) { // valid data - add new entry
    db.addNew(title, description, false)
    res.writeHead(303, {
      'location': '/'
    })
    res.end()
    // db.dump()
  } else { // validation not passed - show some error page
    res.writeHead(303, {
      'location': '/content/errorNewEntry.html'
    })
    res.end()
  }
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
