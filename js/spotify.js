firebase.initializeApp(firebaseConfig);
const spotifyRefs = firebase.firestore().collection("Spotify")
const uid = sessionStorage.getItem('uid');
const email = sessionStorage.getItem('email')

// random songs 
var playlist_arr = [
    "https://open.spotify.com/embed/playlist/37i9dQZF1DWYBO1MoTDhZI",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DWUAZoWydCivZ",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DX1IeqVkK7Ebc",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DX2QWdoTGeQgx",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DXa1BeMIGX5Du",
    "https://open.spotify.com/embed/playlist/1XRPDjvRdNh8cnDB0UlVYS",
    "https://open.spotify.com/embed/playlist/5TTmUXMKK07ZuQ4RCBEwO4",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DWTx0xog3gN3q",
    "https://open.spotify.com/embed/playlist/2rN3mSrzUcgjlj1TcEDTX7",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DWZCkamcYMQkz",
    "https://open.spotify.com/embed/playlist/7AZuDiVAVNfBQCI1cnUfMX",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DWU0ScTcjJBdj",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DX2TRYkJECvfC",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DX9XIFQuFvzM4",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DWXRvPx3nttRN",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DX18vEkgMAyAR",
    ];


var nums = [];
for (let i in playlist_arr) {
    nums.push(i);
}
console.log(nums); /* ['0', '1', '2', '3', '4', '5', '6', '7', '8'] */

var rand_playlist_index = [];
j = nums.length;
k = 0;
while (j--) {
    k = Math.floor(Math.random() * (j+1));
    rand_playlist_index.push(nums[k]);
    nums.splice(k,1);
}
console.log(rand_playlist_index); 

var rand_playlist = [];
for (let index of rand_playlist_index) {
    rand_playlist.push(playlist_arr[index])
}
console.log(rand_playlist);


document.getElementById('playlist1').src = rand_playlist[0];
document.getElementById('playlist2').src = rand_playlist[1];
document.getElementById('playlist3').src = rand_playlist[2];


function get_song_1() {
    var link = document.getElementById('playlist1').src
    console.log(link)
    return link  
}

function get_song_2() {
    var link = document.getElementById('playlist2').src
    console.log(link)
    return link
}

function get_song_3() {
    var link = document.getElementById('playlist3').src
    console.log(link)
    return link
}

// saving data
const playlist_1 = document.querySelector('#playlist_1')
playlist_1.addEventListener('click', (e) => {
    e.preventDefault();
    spotifyRefs.doc(email).set({
        userID: uid,
        song: get_song_1(),
        email: email
    })
    document.cookie = 'song=' + get_song_1();
})

const playlist_2 = document.querySelector('#playlist_2')
playlist_2.addEventListener('click', (e) => {
    e.preventDefault();
    spotifyRefs.doc(email).set({
        userID: uid,
        song: get_song_2(),
        email: email
    })
    document.cookie = 'song=' + get_song_2();
})

const playlist_3 = document.querySelector('#playlist_3')
playlist_3.addEventListener('click', (e) => {
    e.preventDefault();
    spotifyRefs.doc(email).set({
        userID: uid,
        song: get_song_3(),
        email: email
    })
    document.cookie = 'song=' + get_song_3();
})

// console.log(document.cookie)
