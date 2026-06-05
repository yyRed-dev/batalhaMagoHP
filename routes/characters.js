const express = require('express')

const router = express.Router()

const {
  PACK_SIZE,
  CPU_DECK_SIZE
} = require('../constants')

const { getCharacters } = require('../services/potterApi')

router.get('/api/pack', async (req, res) => {
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

router.post('/api/cpu-deck', async (req, res) => {
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

module.exports = router