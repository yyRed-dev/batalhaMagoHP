const express = require('express')
const fetch = require('node-fetch')

const router = express.Router()

const {
  CHARACTERS_PER_PAGE,
  SPELL_COUNT,
  DEFAULT_DAMAGE,
  CHARM_DAMAGE,
  CURSE_DAMAGE,
  HEX_DAMAGE,
  JINX_DAMAGE,
  SPELL_DAMAGE,
  TRANSFIGURATION_DAMAGE,
  COUNTER_SPELL_DAMAGE,
  HEALING_DAMAGE
} = require('../constants')

const { shuffleArray } = require('../services/potterApi')

router.get('/api/spells', async (req, res) => {
  try {
    var response = await fetch(
      'https://api.potterdb.com/v1/spells?page[size]=' +
      CHARACTERS_PER_PAGE
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
        damage
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

module.exports = router