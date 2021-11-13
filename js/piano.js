let noteHistory = [];
let keyHistory = [];
let suggestedMusic = {};
let savedMusic = {};

let keyMapping = {
  65: 'C',
  87: 'Csharp',
  83: 'D',
  69: 'Dsharp',
  68: 'E',
  70: 'F',
  84: 'Fsharp',
  71: 'G',
  89: 'Gsharp',
  72: 'A',
  85: 'Asharp',
  74: 'B',
  75: 'C2',
  79: 'C2sharp',
  76: 'D2',
  80: 'D2sharp',
  186: 'E2',
};

// Check if browser is mobile
function checkMobileBrowser() {
  test = navigator.userAgent || navigator.vendor || window.opera;
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      test
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      test.substr(0, 4)
    )
  ) {
    document.querySelector('.explanation').innerHTML = 'Tap on the keys to play the piano!';
  }
}

// Function to clear history
function clearHistory() {
  noteHistory = [];
  keyHistory = [];
  document.querySelector('.playingHistory').innerHTML = '';
}

const keys = document.querySelectorAll('.key'),
  note = document.querySelector('.nowplaying'),
  hints = document.querySelectorAll('.hints');

// Play a note on the piano
function getNoteAudio(e) {
  const keyCode = e.keyCode || e.target.dataset.key;
  const key = document.querySelector(`.key[data-key="${keyCode}"]`);

  if (!key) return;

  const keyNote = key.getAttribute('data-note');
  noteHistory.push(keyNote);
  keyHistory.push(key.getAttribute('data-key'));

  document.querySelector('.playingHistory').innerHTML = noteHistory.join(' ');

  playNote(keyCode);
}

async function playNote(keyCode) {
  const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${keyCode}"]`);

  if (!key) return;

  const keyNote = key.getAttribute('data-note');

  key.classList.add('playing');
  note.innerHTML = keyNote;
  audio.currentTime = 0;
  return new Promise((resolve) => {
    audio.play();
    setTimeout(resolve, 300);
  });
}

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  this.classList.remove('playing');
}

function hintsOn(e, index) {
  e.setAttribute('style', 'transition-delay:' + index * 50 + 'ms');
}

hints.forEach(hintsOn);

keys.forEach((key) => key.addEventListener('transitionend', removeTransition));

window.addEventListener('keydown', getNoteAudio);

// Log event when user taps on screen to play music
document.addEventListener('click', getNoteAudio);

// Play current piano history
async function playHistory() {
  for (let i = 0; i < noteHistory.length; i++) {
    await playNote(keyHistory[i]);
  }
}

// Function to play suggested music
async function playSuggested(musicName) {
  let musicData = suggestedMusic[musicName];
  for (const aNote of musicData['keys']) {
    await playNote(aNote);
  }
}

// Function to play suggested music
async function playSaved(musicName) {
  let musicData = savedMusic[musicName];
  for (const aNote of musicData['keys']) {
    await playNote(aNote);
  }
}

// Load saved music
async function loadSuggestedMusic() {
  const musicCollection = firebase.firestore().collection('Music');
  musicCollection.get().then((snapshot) => {
    document.getElementById('suggestedMusicList').innerHTML = '';
    snapshot.forEach((doc) => {
      let noteArray = doc.data().Notes ?? [];
      let keysArray = doc.data().Keys ?? [];
      let musicName = doc.data().name;
      suggestedMusic[musicName] = {
        notes: noteArray,
        keys: keysArray,
      };

      document.getElementById('suggestedMusicList').innerHTML +=
        `
      <div class='row m-3'>
    <div class="card container-fluid">
      <div class="card-body">
        <h5 class="card-title">` +
        musicName +
        `</h5>
        <h6 class="card-subtitle mb-2 text-muted">Notes</h6>
        <p class="card-text">` +
        noteArray.join(' ') +
        `</p>
      <button class="btn btn-primary" onclick="playSuggested('` +
        musicName +
        `')">Play</button>
      </div>
    </div>
    </div>
    `;
    });
  });
}

async function saveHistory() {
  if (noteHistory.length === 0) {
    alert('There is no music to save!');
    return;
  }
  let musicName = prompt('Enter a name for your music');

  if (musicName === null) {
    return;
  }

  let musicData = {
    name: musicName,
    Notes: noteHistory,
    Keys: keyHistory,
  };

  let userEmail = sessionStorage.getItem('email');

  const userMusicCollection = firebase.firestore().collection('Users/' + userEmail + '/Music');

  userMusicCollection.add(musicData).then(() => {
    alert('Music saved!');
  });
  loadSavedMusic();
}

// Function to load saved music
async function loadSavedMusic() {
  let userEmail = sessionStorage.getItem('email');
  let userMusicSnapshot = await firebase
    .firestore()
    .collection('Users/' + userEmail + '/Music')
    .get();
  if (userMusicSnapshot == null) {
    document.getElementById('savedMusicList').innerHTML = `
    <div class="row d-flex justify-content-center">
      <div class="h5">No saved music found</div>
    </div>`;
    return;
  }
  document.getElementById('savedMusicList').innerHTML = '';
  userMusicSnapshot.forEach((doc) => {
    let noteArray = doc.data().Notes ?? [];
    let keysArray = doc.data().Keys ?? [];
    let musicName = doc.data().name;
    savedMusic[musicName] = {
      notes: noteArray,
      keys: keysArray,
    };

    document.getElementById('savedMusicList').innerHTML +=
      `
      <div class='row m-3'>
    <div class="card container-fluid">
      <div class="card-body">
        <h5 class="card-title">` +
      musicName +
      `</h5>
        <h6 class="card-subtitle mb-2 text-muted">Notes</h6>
        <p class="card-text">` +
      noteArray.join(' ') +
      `</p>
      <button class="btn btn-primary" onclick="playSaved('` +
      musicName +
      `')">Play</button>
      </div>
    </div>
    </div>
    `;
  });
}

// run function on load
window.onload = function () {
  checkMobileBrowser();
  loadSuggestedMusic();
  loadSavedMusic();
};
