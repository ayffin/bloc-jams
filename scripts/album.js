var albumPicasso = {
  title: "The Colors",
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [{
    title: 'Blue',
    duration: '4:26'
  }, {
    title: 'Green',
    duration: '3:14'
  }, {
    title: 'Red',
    duration: '5:01'
  }, {
    title: 'Pink',
    duration: '3:21'
  }, {
    title: 'Magenta',
    duration: '2:15'
  }]
};
// second album
var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [{
    title: 'Hello, Operator?',
    duration: '1:01'
  }, {
    title: 'Ring, ring, ring',
    duration: '5:01'
  }, {
    title: 'Fits in your pocket',
    duration: '3:21'
  }, {
    title: 'Can you hear me now?',
    duration: '3:14'
  }, {
    title: 'Wrong phone number',
    duration: '2:15'
  }]
};
var albumJayZ = {
  title: '4:14',
  artist: 'Jay Z',
  label: '© 2017 Roc Nation / Jay-Z',
  year: '2017',
  albumArtUrl: 'https://lh3.googleusercontent.com/FW8hKo0Cw_gBK0uqO5Z88G8-nR3z6lhY10A1Dh6Ddp0UR6fwtSRSpzx4pLHlxPOzhYg9EB4K3A=w300-rw',
  songs: [{
    title: 'Moonligh',
    duration: '3:55'
  }, {
    title: 'Marcy Me',
    duration: '2:54'
  }, {
    title: 'Legacy',
    duration: '2:57'
  }, {
    title: 'Kill Jay Z',
    duration: '2:58'
  }, {
    title: 'Smile',
    duration: '3:51'
  }]
};

var albumImage = document.getElementsByClassName('album-cover-art')[0];
var setCurrentAlbum = function(album) {
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName(
    'album-view-release-info')[0];

  var albumSongList = document.getElementsByClassName('album-view-song-list')[
    0];

  var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">' +
      '  <td class="song-item-number">' +
      songNumber + '</td>' + '  <td class="song-item-title">' + songName +
      '</td>' + '  <td class="song-item-duration">' + songLength + '</td>' +
      '</tr>';

    return template;

  };


  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);
  albumSongList.innerHTMl = '';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title,
      album.songs[i].duration);
  }
};

window.onload = function() {

  // first method using 3 different callback functions
  function thr() {
    setCurrentAlbum(albumMarconi);
    albumImage.removeEventListener("click", thr);
    albumImage.addEventListener("click", once);
  }

  function twic() {
    setCurrentAlbum(albumJayZ);
    albumImage.removeEventListener("click", twic);
    albumImage.addEventListener("click", thr);
  }

  function once() {
    setCurrentAlbum(albumPicasso);
    albumImage.removeEventListener("click", once);
    albumImage.addEventListener("click", twic);
  }
  albumImage.addEventListener("click", once);


  //secong method using Math.random;
  //   albumImage.addEventListener("click", myFunction);
  //
  //   function myFunction() {
  //     var myArray = [albumJayZ, albumMarconi, albumPicasso];
  //     var rand = myArray[Math.floor(Math.random() * myArray.length)];
  //     console.log(setCurrentAlbum(rand));
  //   }
  //
};
