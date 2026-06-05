const express = require('express')
const fetch = require('node-fetch')

const MAX_CHARACTER_PAGE = 8
const CHARACTERS_PER_PAGE = 100

const BASE_POWER = 50
const BASE_MAGIC = 50
const BASE_DEFENSE = 50

const GRYFFINDOR_POWER = 90
const SLYTHERIN_POWER = 85
const HUFFLEPUFF_POWER = 75
const RAVENCLAW_POWER = 80

const HUMAN_MAGIC = 70
const HALF_GIANT_MAGIC = 88
const GIANT_MAGIC = 95
const HOUSE_ELF_MAGIC = 82
const GHOST_MAGIC = 60
const WEREWOLF_MAGIC = 91
const VAMPIRE_MAGIC = 87
const CENTAUR_MAGIC = 78

const PURE_BLOOD_DEFENSE = 90
const HALF_BLOOD_DEFENSE = 75
const MUGGLE_BORN_DEFENSE = 70
const MUGGLE_DEFENSE = 40
const SQUIB_DEFENSE = 35

const BASE_HP = 80
const RANDOM_HP_BONUS = 20

const PACK_SIZE = 4
const SPELL_COUNT = 20
const CPU_DECK_SIZE = 2

const DEFAULT_DAMAGE = 30
const CHARM_DAMAGE = 45
const CURSE_DAMAGE = 90
const HEX_DAMAGE = 65
const JINX_DAMAGE = 55
const SPELL_DAMAGE = 50
const TRANSFIGURATION_DAMAGE = 40
const COUNTER_SPELL_DAMAGE = 35
const HEALING_DAMAGE = -40

const SERVER_PORT = 3000

const app = express()

app.use(express.static('public'))
app.use(express.json())

function shuffleArray(array) {
  for (var currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
    var randomIndex = Math.floor(Math.random() * (currentIndex + 1))

    var temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function calculatePower(house) {
  var power = BASE_POWER

  if (house == 'Gryffindor') power = GRYFFINDOR_POWER
  if (house == 'Slytherin') power = SLYTHERIN_POWER
  if (house == 'Hufflepuff') power = HUFFLEPUFF_POWER
  if (house == 'Ravenclaw') power = RAVENCLAW_POWER

  return power
}

function calculateMagic(species) {
  var magic = BASE_MAGIC

  if (species == 'human') magic = HUMAN_MAGIC
  if (species == 'half-giant') magic = HALF_GIANT_MAGIC
  if (species == 'giant') magic = GIANT_MAGIC
  if (species == 'house elf') magic = HOUSE_ELF_MAGIC
  if (species == 'ghost') magic = GHOST_MAGIC
  if (species == 'werewolf') magic = WEREWOLF_MAGIC
  if (species == 'vampire') magic = VAMPIRE_MAGIC
  if (species == 'centaur') magic = CENTAUR_MAGIC

  return magic
}

function calculateDefense(ancestry) {
  var defense = BASE_DEFENSE

  if (ancestry == 'pure-blood') defense = PURE_BLOOD_DEFENSE
  if (ancestry == 'half-blood') defense = HALF_BLOOD_DEFENSE
  if (ancestry == 'muggle-born') defense = MUGGLE_BORN_DEFENSE
  if (ancestry == 'muggle') defense = MUGGLE_DEFENSE
  if (ancestry == 'squib') defense = SQUIB_DEFENSE

  return defense
}

function buildCharacter(character) {
  var attributes = character.attributes

  if (!attributes.name || attributes.name == '' || !attributes.image) {
    return null
  }

  var power = calculatePower(attributes.house)
  var magic = calculateMagic(attributes.species)
  var defense = calculateDefense(attributes.ancestry)

  var hp =
    defense +
    Math.floor(Math.random() * RANDOM_HP_BONUS) +
    BASE_HP

  return {
    id: character.id,
    name: attributes.name,
    house: attributes.house || 'Unknown',
    species: attributes.species || 'Unknown',
    ancestry: attributes.ancestry || 'Unknown',
    image: attributes.image,
    power: power,
    magic: magic,
    defense: defense,
    hp: hp,
    maxHp: hp
  }
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

// pega pack de cartas aleatorias
app.get('/api/pack', async (req, res) => {
  try {
    var characters = await getCharacters()

    res.json({
      cards: characters.slice(0, PACK_SIZE)
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao buscar personagens' })
  }
})

// pega feiticos disponiveis
app.get('/api/spells', async (req, res) => {
  try {
    var response = await fetch(
      'https://api.potterdb.com/v1/spells?page[size]=' + CHARACTERS_PER_PAGE
    )

    var responseData = await response.json()

    var spells = []

    for (var index = 0; index < responseData.data.length; index++) {
      var spell = responseData.data[index]
      var attributes = spell.attributes

      if (!attributes.name || attributes.name == '') continue

      var damage = DEFAULT_DAMAGE

      if (attributes.category == 'Charm') damage = CHARM_DAMAGE
      if (attributes.category == 'Curse') damage = CURSE_DAMAGE
      if (attributes.category == 'Hex') damage = HEX_DAMAGE
      if (attributes.category == 'Jinx') damage = JINX_DAMAGE
      if (attributes.category == 'Spell') damage = SPELL_DAMAGE
      if (attributes.category == 'Transfiguration') damage = TRANSFIGURATION_DAMAGE
      if (attributes.category == 'Counter-spell') damage = COUNTER_SPELL_DAMAGE
      if (attributes.category == 'Healing spell') damage = HEALING_DAMAGE

      spells.push({
        id: spell.id,
        name: attributes.name,
        effect: attributes.effect || 'Efeito desconhecido',
        category: attributes.category || 'Spell',
        light: attributes.light || 'Unknown',
        damage: damage
      })
    }

    shuffleArray(spells)

    res.json({
      spells: spells.slice(0, SPELL_COUNT)
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao buscar feiticos' })
  }
})

// monta deck cpu com personagens aleatorios
app.post('/api/cpu-deck', async (req, res) => {
  try {
    var characters = await getCharacters()

    res.json({
      deck: characters.slice(0, CPU_DECK_SIZE)
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao montar deck cpu' })
  }
})

app.listen(SERVER_PORT, () => {
  console.log('rodando na porta 3000')
})
