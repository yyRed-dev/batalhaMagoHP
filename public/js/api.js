async function loadGame() {
  var bar = document.getElementById('loadBar')
  var msg = document.getElementById('loadMsg')

  msg.textContent = 'Invocando personagens...'
  bar.style.width = '20%'

  var packRes = await fetch('/api/pack')
  var packData = await packRes.json()
  state.pack = packData.cards

  bar.style.width = '55%'
  msg.textContent = 'Consultando o livro de feitiços...'

  var spellRes = await fetch('/api/spells')
  var spellData = await spellRes.json()
  state.spells = spellData.spells

  bar.style.width = '85%'
  msg.textContent = 'Preparando o adversário...'

  var cpuRes = await fetch('/api/cpu-deck', {
    method: 'POST'
  })

  var cpuData = await cpuRes.json()
  state.cpuDeck = cpuData.deck

  var shuffledSpells = state.spells.slice()

  for (var currentIndex = shuffledSpells.length - 1; currentIndex > 0; currentIndex--) {
    var randomIndex = Math.floor(Math.random() * (currentIndex + 1))

    var temporaryValue = shuffledSpells[currentIndex]
    shuffledSpells[currentIndex] = shuffledSpells[randomIndex]
    shuffledSpells[randomIndex] = temporaryValue
  }

  state.playerSpells = shuffledSpells.slice(0, 5)

  bar.style.width = '100%'
  msg.textContent = 'Pronto!'

  setTimeout(function () {
    document
      .getElementById('screen-loading')
      .classList
      .add('fade-out')

    setTimeout(function () {
      document.getElementById('screen-loading').style.display = 'none'

      showScreen('screen-draft')
      renderPack()
    }, 600)
  }, 400)
}

async function rerollPack() {
  state.selectedCards = []

  document.getElementById('packGrid').innerHTML =
    '<div style="text-align:center;padding:40px;font-family:Cinzel,serif;font-size:0.7rem;letter-spacing:2px;color:var(--parchment-dark);grid-column:1/-1">Invocando novos bruxos...</div>'

  var response = await fetch('/api/pack')
  var data = await response.json()

  state.pack = data.cards

  renderPack()
}