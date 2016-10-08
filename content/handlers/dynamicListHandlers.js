
const db = require('../../db')

function dynlistHandler (path, res) {
  let list = db.sortDb()
  let pref = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><link rel="stylesheet" href="/content/styles/list.css"><title>TO DO List</title></head><body><ul>'
  for (let i = 0; i < list.length; i++) {
    let state = list[i].state ? 'Fulfilled' : 'Pending'
    let item = `<li><div><p><strong>Title:</strong>${list[i].title}</p><p><strong>Status:</strong>${state}</p><strong>Decription:</strong><textarea readonly>${list[i].description}</textarea><br><a href="/details/${list[i].id}">Details</a></div></li>`
    pref += item
  }
  pref += `</ul><br><button onclick='window.location.href="/"'>Back</button></body></html>`
  res.writeHead(200, {
    'content-type': 'text/html'
  })
  res.end(pref)
}

function dynDetails (path, res) {
  let id = Number(path.split('/').pop())
  let task = db.findEntry(id)
  if (task) {
    res.writeHead(200, {
      'content-type': 'text/html',
      'Cache-Control': 'no-cache'
    })
    res.end(generateDetailsBody(task))
  } else { // not found
    res.writeHead(303, {
      'location': '/content/error404.html'
    })
    res.end()
  }
}

function dynChangeState (path, res) {
  let id = Number(path.split('/').pop())
  let task = db.findEntry(id)
  if (task) {
    task.state = !task.state
    res.writeHead(303, {
      'location': `/details/${id}`
    })
    res.end()
  } else { // not found
    res.writeHead(303, {
      'location': '/content/error404.html'
    })
    res.end()
  }
}

function generateDetailsBody (task) {
  let body = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><link rel="stylesheet" href="/content/styles/details.css"><title>Details</title></head><body>'
  // generate body
  body += `<p>Id: <strong>${task.id}</strong></p><p>From: <strong>${task.date}</strong></p><p>Status: <button onclick='window.location.href="${'/details/changestate/' + task.id}"'>${task.state ? 'Fulfilled' : 'Pending'}</button></p>`
  body += `<p>Description: <strong><textarea readonly rows="3">${task.description}</textarea></strong></p>`
  if (task.imgFile) {
    body += `<img src = '/imageSrc/${task.id}' >`
  }
  body += `<form action="/details/${task.id}/comment"  method="POST"  enctype="multipart/form-data"><p><label for="comment">Comment:</label><textarea name="comment" rows="3"></textarea><br><input type="submit"value="AddComment"></p></form><button onclick="window.location.href='/all'">Back</button><hr>`
  for (let i = task.comments.length - 1; i >= 0; i--) {
    body += `<div><span><i>${task.comments[i].date}</i></span><p>${task.comments[i].text}</p></div>`
  }
  // complete and send html
  body += '</body></html>'
  return body
}

function getStatistics (path, res, headers) {
  if ((headers['my-authorization'] && headers['my-authorization'] === 'Admin') || 
    (headers['My-Authorization'] && headers['My-Authorization'] === 'Admin')) {
    let body = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Error</title></head><body>'
    let stat = db.getStat()
    body += `<p>Number of items: ${stat.entries}</p>`
    body += `<p>Number of comments: ${stat.comments}</p>`
    body += `<button onclick='window.location.href="/"'>Back</button></body></html>`
    res.writeHead(200, {
      'content-type': 'text/html'
    })
    res.end(body)
  } else {
    res.writeHead(403, {
      'content-type': 'text/plain'
    })
    res.end('Forbidden')
  }
}

module.exports = {getListHandler: dynlistHandler, getDetailsHandler: dynDetails, getChangeStateHandler: dynChangeState, getStatisticsHandler: getStatistics}

