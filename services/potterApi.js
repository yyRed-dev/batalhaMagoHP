const fetch = require('node-fetch')

const {
  MAX_CHARACTER_PAGE,
  CHARACTERS_PER_PAGE
} = require('../constants')

const { buildCharacter } = require('./statsCalculator')

function shuffleArray(array) {
  for (var currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
    var randomIndex = Math.floor(Math.random() * (currentIndex + 1))

    var temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

async function getCharacters() {
  var pageNumber = Math.floor(Math.random() * MAX_CHARACTER_PAGE) + 1

  var response = await fetch(
    'https://api.potterdb.com/v1/characters?page[size]=' +
    CHARACTERS_PER_PAGE +
    '&page[number]=' +
    pageNumber
  )

  var responseData = await response.json()

  var characters = []

  for (var index = 0; index < responseData.data.length; index++) {
    var characterData = buildCharacter(responseData.data[index])

    if (characterData) {
      characters.push(characterData)
    }
  }

  return shuffleArray(characters)
}

module.exports = {
  getCharacters,
  shuffleArray
}