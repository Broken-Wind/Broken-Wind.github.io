var hostId = getHostId();

if (hostId !== '') {
    console.log('yo');
    document.querySelector('#player-name-container').style.display = 'block';
    document.querySelector('#submit-name').onclick = function () {
      var playerName = document.querySelector('#player-name').value;
      joinGame(hostId, playerName);
  }
} else {
    console.log('nada');
}



document.querySelector('#host-game').onclick = function () {
    let host = new Peer({key: 'lwjd5qra8257b9'});
    host.on('open', function(id) {
        var gameUrl = location.protocol + '//' + location.host + location.pathname + '?host-id=' + id;
        document.querySelector('#game-url-container').innerHTML = 'Your game URL: <input id="game-url" value="' + gameUrl + '" />';
        copyGameUrl();
        window.history.pushState({},"", gameUrl);
    });
    host.on('connection', function(peer) {
        console.log("Connected to: " + peer.peer);
        // Receive messages
        peer.on('data', function(data) {
            console.log('Received', data);
        });

        // Send messages
        peer.send('Hello!');
      });
}

document.querySelector('#join-game').onclick = function () {
    joinGame(document.querySelector('#host-id').value);
}

function getHostId() {
    var url = window.location.href;
    var param = /host-id=([^&]+)/.exec(url);
    var captured = param ? param[1] : null;
    return captured ? captured : '';
}

function joinGame(hostId, playerName = 'Guest') {
    let peer = new Peer({key: 'lwjd5qra8257b9'});
    let conn = peer.connect(hostId);
    conn.on('open', function () {
        console.log('connected as ' + playerName);
        conn.send('Hello meatboy! I am ' + playerName);
    });
}

function copyGameUrl() {
  /* Get the text field */
  var copyText = document.getElementById('game-url');

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the text: " + copyText.value);
}

