const express = require('express')

const { SERVER_PORT } = require('./constants')

const charactersRoutes = require('./routes/characters')
const spellsRoutes = require('./routes/spells')

const app = express()

app.use(express.static('public'))
app.use(express.json())

app.use(charactersRoutes)
app.use(spellsRoutes)

app.listen(SERVER_PORT, () => {
  console.log('rodando na porta 3000')
})
