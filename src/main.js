function getEmails (people, options) {
  options = options || {}
  var withNames = options.withNames || false
  var onlyActive = options.onlyActive || false

  if (onlyActive) {
    people = people.filter(isActive)
  }

  return people.map(function (person) {
    var result = ''

    if (withNames) {
      result = person.name + ' <' + person.email + '>'
    } else {
      result = person.email
    }

    return result
  }).join(', ')
}

function getAddresses (people, options) {
  options = options || {}
  var onlyActive = options.onlyActive || false

  if (onlyActive) {
    people = people.filter(isActive)
  }

  return people.map(function (person) {
    var address = person.address
    var fullAddress = person.name + '\n' + address.line1 + '\n'

    if (address.line2) {
      fullAddress += address.line2 + '\n'
    }

    fullAddress += address.city + ', ' + address.state
    return fullAddress
  }).join('\n\n')
}

function getYoungest (people) {
  people.sort(function (personA, personB) {
    return personA.age - personB.age
  })

  return {
    youngest: people[0],
    others: people.slice(1)
  }
}

function isActive (person) {
  return person.isActive
}

module.exports = {
  getEmails: getEmails,
  getAddresses: getAddresses,
  getYoungest: getYoungest
}
