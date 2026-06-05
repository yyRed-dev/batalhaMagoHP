const state = {
  phase: 'loading',
  pack: [],
  selectedCards: [],
  playerDeck: [],
  cpuDeck: [],
  spells: [],
  playerSpells: [],
  round: 1,
  scoreP: 0,
  scoreC: 0,
  waiting: false
}

function renderPack() {
  var grid = document.getElementById('packGrid')

  grid.innerHTML = ''

  for (var i = 0; i < state.pack.length; i++) {
    var character = state.pack[i]

    var isSelected =
      state.selectedCards.indexOf(i) >= 0

    var div = document.createElement('div')

    div.className =
      'card' +
      (isSelected ? ' selected' : '')

    div.innerHTML = renderCard(character)

    div.setAttribute('data-idx', i)

    div.onclick = (function(index) {
      return function() {
        toggleDraftCard(index)
      }
    })(i)

    grid.appendChild(div)
  }

  document.getElementById('draftCount').textContent =
    state.selectedCards.length

  document.getElementById('btnConfirmDraft').disabled =
    state.selectedCards.length < 2
}

function toggleDraftCard(index) {
  var position =
    state.selectedCards.indexOf(index)

  if (position >= 0) {
    state.selectedCards.splice(position, 1)
  } else {
    if (state.selectedCards.length >= 2) {
      return
    }

    state.selectedCards.push(index)
  }

  renderPack()
}

function confirmDraft() {
  if (state.selectedCards.length < 2) {
    return
  }

  state.playerDeck = [
    state.pack[state.selectedCards[0]],
    state.pack[state.selectedCards[1]]
  ]

  startBattle()
}

function startBattle() {
  state.round = 1
  state.scoreP = 0
  state.scoreC = 0
  state.waiting = false

  document.getElementById('scoreP').textContent = '0'
  document.getElementById('scoreC').textContent = '0'
  document.getElementById('roundNum').textContent = '1'
  document.getElementById('battleLog').innerHTML = ''
  document.getElementById('btnNext').style.display = 'none'

  showScreen('screen-battle')

  renderBattleState()

  log(
    '⚔ O duelo começou! Escolha um feitiço para atacar.',
    'info'
  )

  setStatus(
    'Escolha um feitiço para atacar!'
  )
}

function getActiveIdx(deck) {
  for (var i = 0; i < deck.length; i++) {
    if (deck[i].hp > 0) {
      return i
    }
  }

  return -1
}

function renderBattleState() {
  var playerIndex =
    getActiveIdx(state.playerDeck)

  var cpuIndex =
    getActiveIdx(state.cpuDeck)

  if (playerIndex < 0 || cpuIndex < 0) {
    endGame()
    return
  }

  var playerCharacter =
    state.playerDeck[playerIndex]

  var cpuCharacter =
    state.cpuDeck[cpuIndex]

  document.getElementById(
    'playerActiveName'
  ).textContent = playerCharacter.name

  document.getElementById(
    'cpuActiveName'
  ).textContent = cpuCharacter.name

  var playerSlot =
    document.getElementById('playerCardSlot')

  var cpuSlot =
    document.getElementById('cpuCardSlot')

  var playerCard =
    document.createElement('div')

  playerCard.className =
    'card battle-card'

  playerCard.id = 'battleCardP'

  playerCard.innerHTML =
    renderCard(playerCharacter)

  playerSlot.innerHTML = ''
  playerSlot.appendChild(playerCard)

  var cpuCard =
    document.createElement('div')

  cpuCard.className =
    'card battle-card'

  cpuCard.id = 'battleCardC'

  cpuCard.innerHTML =
    renderCard(cpuCharacter)

  cpuSlot.innerHTML = ''
  cpuSlot.appendChild(cpuCard)

  renderDeckBadges(
    state.playerDeck,
    playerIndex,
    'playerDeckBadges'
  )

  renderDeckBadges(
    state.cpuDeck,
    cpuIndex,
    'cpuDeckBadges'
  )

  renderSpells(!state.waiting)
}

function castSpell(spellIndex) {
  if (state.waiting) {
    return
  }

  state.waiting = true

  renderSpells(false)

  var spell =
    state.playerSpells[spellIndex]

  var playerIndex =
    getActiveIdx(state.playerDeck)

  var cpuIndex =
    getActiveIdx(state.cpuDeck)

  var playerCharacter =
    state.playerDeck[playerIndex]

  var cpuCharacter =
    state.cpuDeck[cpuIndex]

  var playerDamage =
    Math.floor(
      spell.damage *
      (playerCharacter.magic / 100) *
      (Math.random() * 0.4 + 0.8)
    )

  if (spell.damage < 0) {
    var healAmount =
      Math.abs(playerDamage)

    playerCharacter.hp =
      Math.min(
        playerCharacter.maxHp,
        playerCharacter.hp + healAmount
      )

    log(
      '✨ ' +
      spell.name +
      ' — você curou ' +
      healAmount +
      ' HP!',
      'heal'
    )
  } else {
    cpuCharacter.hp =
      cpuCharacter.hp - playerDamage

    log(
      '⚡ ' +
      spell.name +
      ' → ' +
      cpuCharacter.name +
      ' perdeu ' +
      playerDamage +
      ' HP!',
      'win'
    )
  }

  setTimeout(function() {
    var cpuSpellIndex =
      Math.floor(
        Math.random() * state.spells.length
      )

    var cpuSpell =
      state.spells[cpuSpellIndex]

    var cpuDamage =
      Math.floor(
        cpuSpell.damage *
        (cpuCharacter.magic / 100) *
        (Math.random() * 0.4 + 0.8)
      )

    if (cpuSpell.damage < 0) {
      cpuCharacter.hp =
        Math.min(
          cpuCharacter.maxHp,
          cpuCharacter.hp + Math.abs(cpuDamage)
        )
    } else {
      playerCharacter.hp =
        playerCharacter.hp - cpuDamage
    }

    renderBattleState()

    var playerAlive =
      getActiveIdx(state.playerDeck)

    var cpuAlive =
      getActiveIdx(state.cpuDeck)

    if (playerAlive < 0 || cpuAlive < 0) {
      setTimeout(endGame, 800)
      return
    }

    state.waiting = false

    setStatus(
      'Escolha um feitiço para atacar!'
    )

    renderSpells(true)
  }, 800)
}

function nextRound() {
  document.getElementById(
    'btnNext'
  ).style.display = 'none'

  state.round++

  document.getElementById(
    'roundNum'
  ).textContent = state.round

  log(
  `— Rodada ${state.round} —`,
  'info'
)

  state.waiting = false

  renderBattleState()

  setStatus(
    'Escolha um feitiço para atacar!'
  )
}

function endGame() {
  var over =
    document.getElementById('screen-over')

  var glyph =
    document.getElementById('overGlyph')

  var title =
    document.getElementById('overTitle')

  var sub =
    document.getElementById('overSub')

  var score =
    document.getElementById('overScore')

  if (state.scoreP > state.scoreC) {
    glyph.textContent = '🏆'
    title.textContent = 'Vitória!'
    sub.textContent =
      'Você dominou o duelo!'
  } else if (state.scoreC > state.scoreP) {
    glyph.textContent = '💀'
    title.textContent = 'Derrota'
    sub.textContent =
      'O CPU foi mais poderoso desta vez.'
  } else {
    glyph.textContent = '✦'
    title.textContent = 'Empate'
    sub.textContent =
      'Bruxos igualmente poderosos.'
  }

  score.textContent =
    'Você ' +
    state.scoreP +
    ' × ' +
    state.scoreC +
    ' CPU'

  over.classList.add('active')
}

function restartGame() {
  document
    .getElementById('screen-over')
    .classList.remove('active')

  state.selectedCards = []
  state.pack = []
  state.playerDeck = []

  var loadingScreen =
    document.getElementById('screen-loading')

  loadingScreen.style.display = 'flex'
  loadingScreen.classList.remove('fade-out')

  document.getElementById(
    'loadBar'
  ).style.width = '0%'

  showScreen('')

  loadGame()
}

loadGame()