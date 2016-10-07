let entryDB = []

// entry object contructor
function DbEntry (id, date) {
  this.id = id  // unique id
  this.date = date // creation date
  this.description = '' // general description
  this.comments = []  // each comment is an object with date and text
  this.state = false  // false = pending, true = fulfilled
}

function getNextEntryId () {
  if (entryDB.length === 0) {
    return 1
  }
  return entryDB.reduce((prev, curr) => { return prev.id > curr.id ? prev : curr }).id + 1
}

function addNewEntry (title, description, state) {
  let entry = new DbEntry(getNextEntryId(), new Date().toLocaleString())
  entry.title = title
  entry.description = description
  entry.state = state || false
  entryDB.push(entry)
  return entry.id
}

function addEntryComment (id, comment) {
  let entry = getEntryById(id)
  if (entry) {
    entry.comments.unshift({date: new Date().toLocaleString(), text: comment})
  }
}

function getEntryById (id) {
  return entryDB.find(val => { return val.id === id })
}

function dump () {
  console.log(entryDB)
}

function sort () {
  return entryDB.sort((a, b) => {
    if (a.state === b.state) {
      return b.id - a.id
    }
    return a.state ? 1 : -1
  })
}

module.exports = {addNew: addNewEntry, findEntry: getEntryById, sortDb: sort, addComment: addEntryComment, dump: dump}

