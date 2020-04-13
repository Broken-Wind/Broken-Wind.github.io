var wordList = ['Pitch', 'King', 'Crane', 'Trip', 'Dog', 'Conductor', 'Part', 'Bugle', 'Witch', 'Ketchup', 'Press', 'Spine', 'Worm', 'Alps', 'Bond', 'Pan', 'Beijing', 'Racket', 'Cross', 'Seal', 'Aztec', 'Maple', 'Parachute', 'Hotel', 'Berry', 'Soldier', 'Ray', 'Post', 'Greece', 'Square', 'Mass', 'Bat', 'Wave', 'Car', 'Smuggler', 'England', 'Crash', 'Tail', 'Card', 'Horn', 'Capital', 'Fence', 'Deck', 'Buffalo', 'Microscope', 'Jet', 'Duck', 'Ring', 'Train', 'Field', 'Gold', 'Tick', 'Check', 'Queen', 'Strike', 'Kangaroo', 'Spike', 'Scientist', 'Engine', 'Shakespeare', 'Wind', 'Kid', 'Embassy', 'Robot', 'Note', 'Ground', 'Draft', 'Ham', 'War', 'Mouse', 'Center', 'Chick', 'China', 'Bolt', 'Spot', 'Piano', 'Pupil', 'Plot', 'Lion', 'Police', 'Head', 'Litter', 'Concert', 'Mug', 'Vacuum', 'Atlantis', 'Straw', 'Switch', 'Skyscraper', 'Laser', 'Scuba Diver', 'Africa', 'Plastic', 'Dwarf', 'Lap', 'Life', 'Honey', 'Horseshoe', 'Unicorn', 'Spy', 'Pants', 'Wall', 'Paper', 'Sound', 'Ice', 'Tag', 'Web', 'Fan', 'Orange', 'Temple', 'Canada', 'Scorpion', 'Undertaker', 'Mail', 'Europe', 'Soul', 'Apple', 'Pole', 'Tap', 'Mouth', 'Ambulance', 'Dress', 'Ice Cream', 'Rabbit', 'Buck', 'Agent', 'Sock', 'Nut', 'Boot', 'Ghost', 'Oil', 'Superhero', 'Code', 'Kiwi', 'Hospital', 'Saturn', 'Film', 'Button', 'Snowman', 'Helicopter', 'Loch Ness', 'Log', 'Princess', 'Time', 'Cook', 'Revolution', 'Shoe', 'Mole', 'Spell', 'Grass', 'Washer', 'Game', 'Beat', 'Hole', 'Horse', 'Pirate', 'Link', 'Dance', 'Fly', 'Pit', 'Server', 'School', 'Lock', 'Brush', 'Pool', 'Star', 'Jam', 'Organ', 'Berlin', 'Face', 'Luck', 'Amazon', 'Cast', 'Gas', 'Club', 'Sink', 'Water', 'Chair', 'Shark', 'Jupiter', 'Copper', 'Jack', 'Platypus', 'Stick', 'Olive', 'Grace', 'Bear', 'Glass', 'Row', 'Pistol', 'London', 'Rock', 'Van', 'Vet', 'Beach', 'Charge', 'Port', 'Disease', 'Palm', 'Moscow', 'Pin', 'Washington', 'Pyramid', 'Opera', 'Casino', 'Pilot', 'String', 'Night', 'Chest', 'Yard', 'Teacher', 'Pumpkin', 'Thief', 'Bark', 'Bug', 'Mint', 'Cycle', 'Telescope', 'Calf', 'Air', 'Box', 'Mount', 'Thumb', 'Antarctica', 'Trunk', 'Snow', 'Penguin', 'Root', 'Bar', 'File', 'Hawk', 'Battery', 'Compound', 'Slug', 'Octopus', 'Whip', 'America', 'Ivory', 'Pound', 'Sub', 'Cliff', 'Lab', 'Eagle', 'Genius', 'Ship', 'Dice', 'Hood', 'Heart', 'Novel', 'Pipe', 'Himalayas', 'Crown', 'Round', 'India', 'Needle', 'Shop', 'Watch', 'Lead', 'Tie', 'Table', 'Cell', 'Cover', 'Czech', 'Back', 'Bomb', 'Ruler', 'Forest', 'Bottle', 'Space', 'Hook', 'Doctor', 'Ball', 'Bow', 'Degree', 'Rome', 'Plane', 'Giant', 'Nail', 'Dragon', 'Stadium', 'Flute', 'Carrot', 'Wake', 'Fighter', 'Model', 'Tokyo', 'Eye', 'Mexico', 'Hand', 'Swing', 'Key', 'Alien', 'Tower', 'Poison', 'Cricket', 'Cold', 'Knife', 'Church', 'Board', 'Cloak', 'Ninja', 'Olympus', 'Belt', 'Light', 'Death', 'Stock', 'Millionaire', 'Day', 'Knight', 'Pie', 'Bed', 'Circle', 'Rose', 'Change', 'Cap', 'Triangle'];
var hostId = getHostId();
var currentPlayer = {
  isSpymaster: false
};
// stages: players_join, in_progress, finished
var gameState = {
  stage: 'players_join',
  players: [],
  redScore: 0,
  blueScore: 0
};
var connections = [];

document.querySelector('#submit-name').onclick = function () {
  var playerName = document.querySelector('#player-name').value;
  if (hostId !== '') {
    joinGame(hostId, playerName);
  } else {
    hostGame(playerName);
  }
  document.getElementById('player-name-container').style.display = 'none';
}

function addPlayer(player, connection) {
  gameState.players.push({
    'name': player.name,
    'id': connection.peer,
    'isHost': false
  });
  connections.push(connection);
}

function hostGame (playerName = 'Guest') {
  let host = new Peer();
  host.on('open', function(id) {
    currentPlayer.name = playerName;
    currentPlayer.id = id;
    currentPlayer.isHost = true;
    gameState.players.push({
      'name': playerName,
      'id': id,
      'isHost': true
    });
    var gameUrl = location.protocol + '//' + location.host + location.pathname + '?host-id=' + id;
    copyGameUrl(gameUrl);
    window.history.pushState({},"", gameUrl);
  });
  host.on('connection', function(connection) {
    console.log("Connected to: " + connection.peer);
    // Receive messages
    connection.on('data', function(data) {
      processDataReceivedFromPeer(data, connection);
    });

    // Send messages
    connection.send('Hello!');
  });
  updateGame(gameState);
}

function processDataReceivedFromPeer(data, connection) {
  if (typeof data === 'object' && data !== null) {
    if (data.type === 'player') {
      addPlayer(data.content, connection);
    } else if (data.type === 'cardClick') {
      cardClick(data.content);
    }

    broadcastGameState();
  }
  console.log('Received', data);
}

function cardClick(data) {
  let card = gameState.cards.find(card => {
    return card.id === data.cardId;
  })
  card.isRevealed = true;
  if (card.identity === 'assassin') {
    gameState.stage = 'finished';
    if (data.playerId === gameState.redSpymasterId) {
      gameState.winner = 'blue';
    } else {
      gameState.winner = 'red';
    }
  }
  gameState.redScore = gameState.cards.filter(card => {
    return card.identity === 'red-agent' && card.isRevealed;
  }).length;
  gameState.blueScore = gameState.cards.filter(card => {
    return card.identity === 'blue-agent' && card.isRevealed;
  }).length;

  if (gameState.redScore === 9 || ( gameState.redScore === 8 && gameState.startingTeam === 'blue')) {
    gameState.winner = 'red';
    gameState.stage = 'finished';
  }

  if (gameState.blueScore === 9 || ( gameState.blueScore === 8 && gameState.startingTeam === 'red')) {
    gameState.winner = 'blue';
    gameState.stage = 'finished';
  }
}

function processDataReceivedFromHost(data) {
  if (typeof data === 'object' && data !== null) {
    if (data.type === 'gameState') {
      updateGame(data.content.gameState);
    }
  }
  console.log('Received', data);

}

function broadcastGameState() {
  connections.forEach(connection => {
    connection.send({
      'type': 'gameState',
      'content': {
        gameState
      }
    });
  });
  updateGame(gameState);
}

function updateGame(gameState) {
  console.log('updating');
  console.log(gameState);
  if (gameState.stage === 'players_join') {
    updateFromPlayersJoin(gameState);
  }
  if (gameState.stage === 'in_progress') {
    updateFromInProgress(gameState);
  }
  if (gameState.stage === 'finished') {
    updateFromFinished(gameState);
  }
}

function updateFromFinished(gameState) {
  displayCards(gameState);
  alert(gameState.winner + " team wins!");
}

function updateFromInProgress(gameState) {
  checkIfSpymaster(gameState);
  displayCards(gameState);
  updateScores(gameState);
}

function updateScores(gameState) {
  document.getElementById('red-score').innerHTML = gameState.redScore;
  document.getElementById('blue-score').innerHTML = gameState.blueScore;
}

function checkIfSpymaster(gameState) {
  if (currentPlayer.id === gameState.redSpymasterId || currentPlayer.id === gameState.blueSpymasterId) {
    currentPlayer.isSpymaster = true;
  }
}

function displayCards(gameState) {
  let gameDiv = document.getElementById('game');
  gameDiv.innerHTML = '';
  for (rowNum=1; rowNum <=5; rowNum++) {
    let row = document.createElement('div');
    row.classList.add('row');
    row.style.height = '100px';
    row.id = 'card-row-' + rowNum;
    gameDiv.appendChild(row);
    for (colNum=1; colNum <=5; colNum++) {
      let word = gameState.cards[(rowNum-1)*5 + colNum - 1];
      let col = document.createElement('div');
      col.classList.add('col');
      col.classList.add('text-center');
      col.classList.add('h-100');
      col.id = word.id;
      if (currentPlayer.isSpymaster) {
        col.style.opacity = '.3';
        col.classList.add(word.identity)
        col.onclick = function () {
          handleCardClick(this);
        }
        addCardBackgroundClass(col, word.identity);
      }
      if (word.isRevealed || gameState.stage === 'finished') {
        col.style.opacity = '1';
        col.classList.add(word.identity)
        addCardBackgroundClass(col, word.identity);
      }
      row.appendChild(col);
      let h5 = document.createElement('h5');
      h5.innerHTML = word.word;
      col.appendChild(h5);
    }
  }
}

function addCardBackgroundClass(card, identity) {
  switch(identity) {
    case 'red-agent':
      card.classList.add('bg-danger');
      break;
    case 'blue-agent':
      card.classList.add('bg-primary');
      break;
      case 'innocent-bystander':
      card.classList.add('bg-light');
      break;
    case 'assassin':
      card.classList.add('bg-dark');
      card.classList.add('text-light');
      break;
    default:
      break;
  }
}

function handleCardClick(card) {
  if (currentPlayer.isHost) {
    cardClick({
      'cardId': card.id,
      'playerId': currentPlayer.id
    });
    broadcastGameState();
  } else {
    currentPlayer.connection.send({
      'type': 'cardClick',
      'content': {
        'cardId': card.id,
        'playerId': currentPlayer.id
      }
    });
  }
}

function updateFromPlayersJoin(gameState) {
  if (gameState.players.length > 1) {
    let playerList = document.getElementById('player-list');
    document.getElementById('player-list-container').style.display = 'block';
    playerList.innerHTML = '';
    if (currentPlayer.isHost) {
      document.getElementById('select-spymasters').style.display = 'block';
      document.getElementById('select-red-spymaster').innerHTML = '';
      document.getElementById('select-blue-spymaster').innerHTML = '';
      document.getElementById('start-game').onclick = function () {
        startGame();
      }
    }
    gameState.players.forEach(player => {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(player.name));
      document.getElementById('player-list').appendChild(li);
      if (currentPlayer.isHost) {
        let redOption = document.createElement('option');
        redOption.value = player.id;
        redOption.appendChild(document.createTextNode(player.name));
        blueOption = redOption.cloneNode(true);
        document.getElementById('select-red-spymaster').appendChild(redOption);
        document.getElementById('select-blue-spymaster').appendChild(blueOption);
      }
    });
  }
}

function startGame() {
  hideSpymasterSelect();
  identifySpymasters();
  setStartingTeam();
  displayScores();
  generateCards();
  setInProgress();
  broadcastGameState();
}

function displayScores() {
  document.getElementById('scores-container').style.display = 'block';
}

function hideSpymasterSelect() {
  document.getElementById('select-spymasters').style.display = 'none';
}

function identifySpymasters() {
  let selectRedSpymaster = document.getElementById('select-red-spymaster');
  let redSpymasterId = selectRedSpymaster.options[selectRedSpymaster.selectedIndex].value;
  let selectBlueSpymaster = document.getElementById('select-blue-spymaster');
  let blueSpymasterId = selectBlueSpymaster.options[selectBlueSpymaster.selectedIndex].value;
  gameState.redSpymasterId = redSpymasterId;
  gameState.blueSpymasterId = blueSpymasterId;
}

function setStartingTeam() {
  if (Math.random() >= 0.5) {
    gameState.startingTeam = 'red';
  } else {
    gameState.startingTeam = 'blue';
  }
}

function generateCards() {
  let words = [];
  let cards = [];
  while(words.length < 25) {
    let newWord = wordList[Math.floor(Math.random() * wordList.length)];
    if (!words.includes(newWord)) {
      words.push(newWord);
    }
  }
  let availableCardIdentities = ['assassin'];
  if (gameState.startingTeam === 'blue') {
    availableCardIdentities.push('blue-agent');
  } else {
    availableCardIdentities.push('red-agent');
  }
  for (n = 0; n < 8; n++) {
    if (n < 7) {
      availableCardIdentities.push('innocent-bystander');
    }
    availableCardIdentities.push('red-agent');
    availableCardIdentities.push('blue-agent');
  }
  for(var i = availableCardIdentities.length; i>0; i--){
    let identity = availableCardIdentities.splice(Math.floor(Math.random()*availableCardIdentities.length), 1)[0];
    let word = words.pop();
    cards.push({
      'word': word,
      'identity': identity,
      'id': 'card-' + i,
      'isRevealed': false
    });
  }
  gameState.cards = cards;
}

function setInProgress(){
  gameState.stage = 'in_progress';
}

function getHostId() {
  var url = window.location.href;
  var param = /host-id=([^&]+)/.exec(url);
  var captured = param ? param[1] : null;
  return captured ? captured : '';
}

function joinGame(hostId, playerName = 'Guest') {
  let peer = new Peer();
  console.log(peer);
  let connection = peer.connect(hostId);
  connection.on('open', function () {
    currentPlayer.name = playerName;
    currentPlayer.id = peer.id;
    currentPlayer.isHost = false;
    currentPlayer.connection = connection;

    connection.on('data', function(data) {
      processDataReceivedFromHost(data);
    });
    connection.send({
      'type': 'player',
      'content': {
        'name': playerName
      }
    });
  });
}

function copyGameUrl(gameUrl) {
  console.log('hit' + gameUrl);
  var copyText = document.createElement("input");
  copyText.type = "text";
  copyText.value = gameUrl;
  document.body.appendChild(copyText);
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  copyText.style.display = 'none';
  document.querySelector('#game-url-container').innerHTML = 'Your game URL has been copied to the clipboard. Share it with your friends! ' + gameUrl;

}

