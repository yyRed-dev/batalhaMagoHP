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

// pega pack de cartas aleatorias
app.get('/api/pack', async (req, res) => {
  try {
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
      var character = responseData.data[index]
      var attributes = character.attributes

      if (!attributes.name || attributes.name == '' || !attributes.image) continue

      var power = BASE_POWER

      if (attributes.house == 'Gryffindor') power = GRYFFINDOR_POWER
      if (attributes.house == 'Slytherin') power = SLYTHERIN_POWER
      if (attributes.house == 'Hufflepuff') power = HUFFLEPUFF_POWER
      if (attributes.house == 'Ravenclaw') power = RAVENCLAW_POWER

      var magic = BASE_MAGIC

      if (attributes.species == 'human') magic = HUMAN_MAGIC
      if (attributes.species == 'half-giant') magic = HALF_GIANT_MAGIC
      if (attributes.species == 'giant') magic = GIANT_MAGIC
      if (attributes.species == 'house elf') magic = HOUSE_ELF_MAGIC
      if (attributes.species == 'ghost') magic = GHOST_MAGIC
      if (attributes.species == 'werewolf') magic = WEREWOLF_MAGIC
      if (attributes.species == 'vampire') magic = VAMPIRE_MAGIC
      if (attributes.species == 'centaur') magic = CENTAUR_MAGIC

      var defense = BASE_DEFENSE

      if (attributes.ancestry == 'pure-blood') defense = PURE_BLOOD_DEFENSE
      if (attributes.ancestry == 'half-blood') defense = HALF_BLOOD_DEFENSE
      if (attributes.ancestry == 'muggle-born') defense = MUGGLE_BORN_DEFENSE
      if (attributes.ancestry == 'muggle') defense = MUGGLE_DEFENSE
      if (attributes.ancestry == 'squib') defense = SQUIB_DEFENSE

      var hp =
        defense +
        Math.floor(Math.random() * RANDOM_HP_BONUS) +
        BASE_HP

      var characterData = {}

      characterData.id = character.id
      characterData.name = attributes.name
      characterData.house = attributes.house || 'Unknown'
      characterData.species = attributes.species || 'Unknown'
      characterData.ancestry = attributes.ancestry || 'Unknown'
      characterData.image = attributes.image
      characterData.power = power
      characterData.magic = magic
      characterData.defense = defense
      characterData.hp = hp
      characterData.maxHp = hp

      characters.push(characterData)
    }

    for (var currentIndex = characters.length - 1; currentIndex > 0; currentIndex--) {
      var randomIndex = Math.floor(Math.random() * (currentIndex + 1))

      var temporaryValue = characters[currentIndex]
      characters[currentIndex] = characters[randomIndex]
      characters[randomIndex] = temporaryValue
    }

    res.json({ cards: characters.slice(0, PACK_SIZE) })
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

      var spellData = {}

      spellData.id = spell.id
      spellData.name = attributes.name
      spellData.effect = attributes.effect || 'Efeito desconhecido'
      spellData.category = attributes.category || 'Spell'
      spellData.light = attributes.light || 'Unknown'
      spellData.damage = damage

      spells.push(spellData)
    }

    for (var currentIndex = spells.length - 1; currentIndex > 0; currentIndex--) {
      var randomIndex = Math.floor(Math.random() * (currentIndex + 1))

      var temporaryValue = spells[currentIndex]
      spells[currentIndex] = spells[randomIndex]
      spells[randomIndex] = temporaryValue
    }

    res.json({ spells: spells.slice(0, SPELL_COUNT) })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao buscar feiticos' })
  }
})

// monta deck cpu com personagens aleatorios
app.post('/api/cpu-deck', async (req, res) => {
  try {
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
      var character = responseData.data[index]
      var attributes = character.attributes

      if (!attributes.name || attributes.name == '' || !attributes.image) continue

      var power = BASE_POWER

      if (attributes.house == 'Gryffindor') power = GRYFFINDOR_POWER
      if (attributes.house == 'Slytherin') power = SLYTHERIN_POWER
      if (attributes.house == 'Hufflepuff') power = HUFFLEPUFF_POWER
      if (attributes.house == 'Ravenclaw') power = RAVENCLAW_POWER

      var magic = BASE_MAGIC

      if (attributes.species == 'human') magic = HUMAN_MAGIC
      if (attributes.species == 'half-giant') magic = HALF_GIANT_MAGIC
      if (attributes.species == 'giant') magic = GIANT_MAGIC
      if (attributes.species == 'house elf') magic = HOUSE_ELF_MAGIC
      if (attributes.species == 'ghost') magic = GHOST_MAGIC
      if (attributes.species == 'werewolf') magic = WEREWOLF_MAGIC
      if (attributes.species == 'vampire') magic = VAMPIRE_MAGIC
      if (attributes.species == 'centaur') magic = CENTAUR_MAGIC

      var defense = BASE_DEFENSE

      if (attributes.ancestry == 'pure-blood') defense = PURE_BLOOD_DEFENSE
      if (attributes.ancestry == 'half-blood') defense = HALF_BLOOD_DEFENSE
      if (attributes.ancestry == 'muggle-born') defense = MUGGLE_BORN_DEFENSE
      if (attributes.ancestry == 'muggle') defense = MUGGLE_DEFENSE
      if (attributes.ancestry == 'squib') defense = SQUIB_DEFENSE

      var hp =
        defense +
        Math.floor(Math.random() * RANDOM_HP_BONUS) +
        BASE_HP

      var characterData = {}

      characterData.id = character.id
      characterData.name = attributes.name
      characterData.house = attributes.house || 'Unknown'
      characterData.species = attributes.species || 'Unknown'
      characterData.ancestry = attributes.ancestry || 'Unknown'
      characterData.image = attributes.image
      characterData.power = power
      characterData.magic = magic
      characterData.defense = defense
      characterData.hp = hp
      characterData.maxHp = hp

      characters.push(characterData)
    }

    for (var currentIndex = characters.length - 1; currentIndex > 0; currentIndex--) {
      var randomIndex = Math.floor(Math.random() * (currentIndex + 1))

      var temporaryValue = characters[currentIndex]
      characters[currentIndex] = characters[randomIndex]
      characters[randomIndex] = temporaryValue
    }

    res.json({ deck: characters.slice(0, CPU_DECK_SIZE) })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'erro ao montar deck cpu' })
  }
})

app.listen(SERVER_PORT, () => {
  console.log('rodando na porta 3000')
})
