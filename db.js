let entryDB = []

// entry object contructor
function DbEntry (id, date) {
  this.id = id
  this.date = date
  this.comment = ''
  this.state = false
}

function getNextEntryId () {
  if (entryDB.length === 0) {
    return 1
  }
  return entryDB.reduce((prev, curr) => { return prev.id > curr.id ? prev : curr }).id + 1
}

function addNewEntry (title, description, state) {
  let entry = new DbEntry(getNextEntryId(), new Date().toString())
  entry.title = title
  entry.description = description
  entry.state = state || false
  entryDB.push(entry)
  return entry.id
}

function updateEntryById (id, comment, state) {
  let entry = getEntryById(id)
  if (entry === undefined) {
    return false
  } else {
    if (comment) {
      entry.comment = comment
    }
    if (state !== undefined) {
      entry.state = state
    }
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

module.exports = {addNew: addNewEntry, findEntry: getEntryById, updateEntry: updateEntryById, sortDb: sort, dump: dump}

