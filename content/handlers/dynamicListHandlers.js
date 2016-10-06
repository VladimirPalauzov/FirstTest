
const db = require('../../db')

const prefix = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><link rel="stylesheet" href="/content/styles/list.css"><title>TO DO List</title></head><body><ul>'
const suffix = '</ul><br><button onclick="history.go(-1)">Back</button></body></html>'

function dynlistHandler (path, res) {
  let list = db.sortDb()
  let pref = prefix
  for (let i = 0; i < list.length; i++) {
    let state = list[i].state ? 'Fulfilled' : 'Pending'
    let item = `<li><div><p><strong>Title:</strong>${list[i].title}</p><p><strong>Status:</strong>${state}</p><strong>Decription:</strong><textarea readonly>${list[i].description}</textarea><br><a href="/details/${list[i].id}">Details</a></div></li>`
    pref += item
  }
  pref += suffix
  res.writeHead(200, {
    'content-type': 'text/html'
  })
  res.end(pref)
}

function dynDetails (path, res) {

}

function dynChangeState (path, res) {

}

module.exports = {getListHandler: dynlistHandler, getDetailsHandler: dynDetails, getChangeStateHandler: dynChangeState}

