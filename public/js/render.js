function getHouseColor(h) {
  if (h == 'Gryffindor') return '#6b1010'
  if (h == 'Slytherin') return '#0a3018'
  if (h == 'Hufflepuff') return '#3a2800'
  if (h == 'Ravenclaw') return '#0a1a3a'
  return '#1e1040'
}

function getHouseEmoji(h) {
  if (h == 'Gryffindor') return '🦁'
  if (h == 'Slytherin') return '🐍'
  if (h == 'Hufflepuff') return '🦡'
  if (h == 'Ravenclaw') return '🦅'
  return '✦'
}

function hpColor(pct) {
  if (pct > 0.6) return 'linear-gradient(90deg,#0a4a2a,#22cc77)'
  if (pct > 0.3) return 'linear-gradient(90deg,#4a3a00,#ccaa22)'
  return 'linear-gradient(90deg,#4a0a0a,#cc2222)'
}

function log(msg, type) {
  type = type || 'info'

  var el = document.getElementById('battleLog')
  var span = document.createElement('span')

  span.className = 'log-entry ' + type
  span.textContent = msg

  el.appendChild(span)
  el.scrollTop = el.scrollHeight
}

function setStatus(msg) {
  document.getElementById('battleStatus').textContent = msg
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(screen) {
    screen.classList.remove('active')
  })

  var el = document.getElementById(id)

  if (el) {
    el.classList.add('active')
  }
}

function renderCard(char) {
  var pct = char.hp / char.maxHp
  var houseColor = getHouseColor(char.house)
  var houseEmoji = getHouseEmoji(char.house)

  var html = '<div class="card-img">'
  html += '<img src="' + char.image + '" alt="' + char.name + '" onerror="this.src=\'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png\'">'
  html += '<div class="house-badge" style="background:' + houseColor + '">' + houseEmoji + '</div>'
  html += '</div>'

  html += '<div class="card-body">'
  html += '<div class="card-name">' + char.name + '</div>'
  html += '<div class="card-meta">' + char.species + ' · ' + char.house + '</div>'

  html += '<div class="hp-bar-wrap">'
  html += '<span class="hp-label">HP</span>'
  html += '<div class="hp-track">'
  html += '<div class="hp-fill" style="width:' + Math.max(0, pct * 100) + '%;background:' + hpColor(pct) + '"></div>'
  html += '</div>'
  html += '<span class="hp-val">' + Math.max(0, char.hp) + '/' + char.maxHp + '</span>'
  html += '</div>'

  html += '<div class="mini-stats">'
  html += '<div class="mini-stat"><span class="mini-stat-icon">⚡</span><span class="mini-stat-val">' + char.power + '</span><span class="mini-stat-lbl">Poder</span></div>'
  html += '<div class="mini-stat"><span class="mini-stat-icon">🔮</span><span class="mini-stat-val">' + char.magic + '</span><span class="mini-stat-lbl">Magia</span></div>'
  html += '<div class="mini-stat"><span class="mini-stat-icon">🛡</span><span class="mini-stat-val">' + char.defense + '</span><span class="mini-stat-lbl">Defesa</span></div>'
  html += '</div>'

  html += '</div>'

  return html
}

function renderDeckBadges(deck, activeIdx, elementId) {
  var el = document.getElementById(elementId)

  var html = ''

  for (var i = 0; i < deck.length; i++) {
    var className =
      deck[i].hp <= 0
        ? 'deck-thumb dead'
        : (i == activeIdx ? 'deck-thumb active' : 'deck-thumb')

    html += '<div class="' + className + '">'
    html += '<img src="' + deck[i].image + '" onerror="this.src=\'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png\'">'
    html += '</div>'
  }

  el.innerHTML = html
}

function renderSpells(enabled) {
  var el = document.getElementById('spellList')

  var html = ''

  for (var i = 0; i < state.playerSpells.length; i++) {
    var spell = state.playerSpells[i]

    var isHeal = spell.damage < 0

    var damageLabel =
      isHeal
        ? '💚 +' + Math.abs(spell.damage) + ' HP'
        : '💀 ' + spell.damage + ' dmg'

    var damageClass =
      isHeal
        ? 'spell-dmg heal'
        : 'spell-dmg attack'

    var disabled = enabled ? '' : 'disabled'

    html += '<button class="spell-btn" ' + disabled + ' onclick="castSpell(' + i + ')">'
    html += '<div>'
    html += '<span class="spell-name">' + spell.name + '</span>'
    html += '<span class="spell-effect">' + spell.effect + '</span>'
    html += '</div>'
    html += '<span class="' + damageClass + '">' + damageLabel + '</span>'
    html += '</button>'
  }

  el.innerHTML = html
}