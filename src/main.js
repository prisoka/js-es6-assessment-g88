const isActive = (person) => {return person.isActive};

const getEmails = (people,
                  { withNames, onlyActive }={ withNames: false, onlyActive: false } ) => {
  if (onlyActive) {
    people = people.filter(isActive)
  }

  return people.map(person => {
    let result = ''

    if (withNames) {
      result = `${person.name} <${person.email}>`
    } else {
      result = person.email
    }

    return result
  }).join(', ')
}

const getAddresses = (people,
                      { onlyActive }={ onlyActive: false } ) => {
  if (onlyActive) { people = people.filter(isActive) };

  return people.map(({ name, address: { line1, line2, city, state} }) => {
    const apt = line2 ? `${line2}\n` : ''
    return `${name}\n${line1}\n${apt}${city}, ${state}`
  }).join('\n\n')
}

const getYoungest = (people) => {
  const [ youngest, ...others ] = people.sort((personA, personB) => {
    return personA.age - personB.age
  })

  return { youngest, others }
}

module.exports = { getEmails, getAddresses, getYoungest }
