const {
  BASE_POWER,
  BASE_MAGIC,
  BASE_DEFENSE,
  GRYFFINDOR_POWER,
  SLYTHERIN_POWER,
  HUFFLEPUFF_POWER,
  RAVENCLAW_POWER,
  HUMAN_MAGIC,
  HALF_GIANT_MAGIC,
  GIANT_MAGIC,
  HOUSE_ELF_MAGIC,
  GHOST_MAGIC,
  WEREWOLF_MAGIC,
  VAMPIRE_MAGIC,
  CENTAUR_MAGIC,
  PURE_BLOOD_DEFENSE,
  HALF_BLOOD_DEFENSE,
  MUGGLE_BORN_DEFENSE,
  MUGGLE_DEFENSE,
  SQUIB_DEFENSE,
  BASE_HP,
  RANDOM_HP_BONUS
} = require('../constants')

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
    power,
    magic,
    defense,
    hp,
    maxHp: hp
  }
}

module.exports = {
  buildCharacter
}