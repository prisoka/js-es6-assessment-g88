const fs = require('fs')
const path = require('path')
const people = require('../fixtures/people')
const main = require('../src/main')
const expect = require('chai').expect

describe('main file', function () {
  before(function () {
    this.file = fs.readFileSync(path.join(__dirname, '..', 'src', 'main.js'), 'utf-8')
  })

  it('should not concatenate strings with the + operator', function () {
    const actual = this.file.match(/\'(.*)?\+|\+(.*)?\'/g)
    expect(actual, 'Do not use the + character to concatenate strings').to.be.null
  })

  it('should not include the keyword var', function () {
    const actual = this.file.match(/var/g)
    expect(actual, 'Do not use the var keyword').to.be.null
  })

  it('should not include the keyword function', function () {
    const actual = this.file.match(/function/g)
    expect(actual, 'Do not use the function keyword').to.be.null
  })

  it('should use default parameters and not declare defaults in the function body', function () {
    const actual = this.file.match(/\=.*\|\| false/g)
    expect(actual, 'Should use default parameters').to.be.null
  })

  it('should use object shorthand to declare and destructure objects', function () {
    const declarations = [
      this.file.match(/module\.exports.*/g),
      this.file.match(/\=\>.*\{([^}]*)\}/g),
    ].filter(match => match)

    if (declarations) {
      const decText = declarations.reduce((a, b) => a.concat(b)).join('')
      const actual = decText.split('\n').filter(el => !el.match(/\?.*\:/g)).join('').match(/\:/g)

      expect(actual, 'Use object shorthand throughout the file').to.be.null
    }
  })

  it('should use destructuring', function () {
    const actual = this.file.match(/\[.*,.*\]( )?\=|\{.*,.*\}( )?\=|\(.*\=.*\)/g)
    expect(actual, 'Use destructuring in the function signature or body').to.not.be.null
  })

  it('should use the spread and rest operator', function () {
    const actual = this.file.match(/\.\.\./g)
    expect(actual, 'Should use the spread or rest operator').to.not.be.null
  })

  describe('#getEmails', function () {
    it('should return a list of emails as a comma separated list', function () {
      const actual = main.getEmails(people)
      const expected = `etta.sweet@beadzza.com, mcconnell.terry@magmina.com, kim.mccarthy@splinx.com, frederick.stokes@telpod.com, david.richmond@sulfax.com, ophelia.head@cablam.com`

      expect(actual).to.equal(expected)
    })

    it('if given an option of onlyActive, it will prepare only active users emails', function () {
      const actual = main.getEmails(people, { onlyActive: true })
      const expected = `etta.sweet@beadzza.com, mcconnell.terry@magmina.com, kim.mccarthy@splinx.com, ophelia.head@cablam.com`

      expect(actual).to.equal(expected)
    })

    it('if given an option of withNames, it will prepare the emails to be copy pasted', function () {
      const actual = main.getEmails(people, { withNames: true })
      const expected = `Etta Sweet <etta.sweet@beadzza.com>, Mcconnell Terry <mcconnell.terry@magmina.com>, Kim Mccarthy <kim.mccarthy@splinx.com>, Frederick Stokes <frederick.stokes@telpod.com>, David Richmond <david.richmond@sulfax.com>, Ophelia Head <ophelia.head@cablam.com>`

      expect(actual).to.equal(expected)
    })

    it('if given both options, it will perform both functions', function () {
      const actual = main.getEmails(people, { onlyActive: true, withNames: true })
      const expected = `Etta Sweet <etta.sweet@beadzza.com>, Mcconnell Terry <mcconnell.terry@magmina.com>, Kim Mccarthy <kim.mccarthy@splinx.com>, Ophelia Head <ophelia.head@cablam.com>`

      expect(actual).to.equal(expected)
    })
  })

  describe('#getAddresses', function () {
    it('should return a list of addresses', function () {
      const actual = main.getAddresses(people)
      const expected = `Etta Sweet\n566 Myrtle Avenue\nApt 65\nKenvil, Florida\n\nMcconnell Terry\n417 Rapelye Street\nApt 34\nRobinette, Ohio\n\nKim Mccarthy\n740 Classon Avenue\nApt 45\nBawcomville, Indiana\n\nFrederick Stokes\n181 Garden Place\nApt 52\nRoeville, Washington\n\nDavid Richmond\n701 Aberdeen Street\nApt 33\nBalm, Michigan\n\nOphelia Head\n437 Love Lane\nWestphalia, Mississippi`

      expect(actual).to.equal(expected)
    })

    it('if given the option of onlyActive, it will prepare only active users addresses', function () {
      const actual = main.getAddresses(people, { onlyActive: true })
      const expected = `Etta Sweet\n566 Myrtle Avenue\nApt 65\nKenvil, Florida\n\nMcconnell Terry\n417 Rapelye Street\nApt 34\nRobinette, Ohio\n\nKim Mccarthy\n740 Classon Avenue\nApt 45\nBawcomville, Indiana\n\nOphelia Head\n437 Love Lane\nWestphalia, Mississippi`

      expect(actual).to.equal(expected)
    })
  })

  describe('#getYoungest', function () {
    it('should return the youngest person', function () {
      const actual = main.getYoungest(people)
      const expected = {
        youngest: {
          id: "eade21e5-6935-4733-a34d-4676e73db450",
          isActive: true,
          age: 24,
          name: "Etta Sweet",
          company: "BEADZZA",
          address: {
            line1: "566 Myrtle Avenue",
            line2: "Apt 65",
            city: "Kenvil",
            state: "Florida"
          },
          email: "etta.sweet@beadzza.com",
          location: {
            latitude: 45.718105,
            longitude: -155.472722
          },
          greeting: "Hello, Etta Sweet! You have 9 unread messages."
        },
        others: [
          {
            id: "63067f7c-9cb1-439e-8010-4abde50a565f",
            isActive: true,
            age: 28,
            name: "Ophelia Head",
            company: "CABLAM",
            address: {
              line1: "437 Love Lane",
              line2: "",
              city: "Westphalia",
              state: "Mississippi"
            },
            email: "ophelia.head@cablam.com",
            location: {
              latitude: 34.694779,
              longitude: -152.566643
            },
            greeting: "Hello, Ophelia Head! You have 6 unread messages."
          },
          {
            id: "eab87413-ab10-4fe0-b4c4-69e5789f75e8",
            isActive: false,
            age: 37,
            name: "David Richmond",
            company: "SULFAX",
            address: {
              line1: "701 Aberdeen Street",
              line2: "Apt 33",
              city: "Balm",
              state: "Michigan"
            },
            email: "david.richmond@sulfax.com",
            location: {
              latitude: 28.723604,
              longitude: 177.048793
            },
            greeting: "Hello, David Richmond! You have 7 unread messages."
          },
          {
            id: "64458461-d5eb-4c89-bf75-af37eb7f09c2",
            isActive: true,
            age: 53,
            name: "Kim Mccarthy",
            company: "SPLINX",
            address: {
              line1: "740 Classon Avenue",
              line2: "Apt 45",
              city: "Bawcomville",
              state: "Indiana"
            },
            email: "kim.mccarthy@splinx.com",
            location: {
              latitude: 15.98262,
              longitude: -137.86649
            },
            greeting: "Hello, Kim Mccarthy! You have 7 unread messages."
          },
          {
            id: "eb270cef-433f-42be-a84c-0036e6e70e6d",
            isActive: false,
            age: 54,
            name: "Frederick Stokes",
            company: "TELPOD",
            address: {
              line1: "181 Garden Place",
              line2: "Apt 52",
              city: "Roeville",
              state: "Washington"
            },
            email: "frederick.stokes@telpod.com",
            location: {
              latitude: -6.323152,
              longitude: 50.381855
            },
            greeting: "Hello, Frederick Stokes! You have 8 unread messages."
          },
          {
            id: "9cb99dc6-bc71-4832-a910-93a3a477df2f",
            isActive: true,
            age: 55,
            name: "Mcconnell Terry",
            company: "MAGMINA",
            address: {
              line1: "417 Rapelye Street",
              line2: "Apt 34",
              city: "Robinette",
              state: "Ohio"
            },
            email: "mcconnell.terry@magmina.com",
            location: {
              latitude: -87.04779,
              longitude: 6.978688
            },
            greeting: "Hello, Mcconnell Terry! You have 7 unread messages."
          }
        ]
      }

      expect(actual).to.deep.equal(expected)
    })
  })
})
