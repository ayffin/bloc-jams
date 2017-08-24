var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {

    formats: ['mp3'],
    preload: true
  });
  setVolume(currentVolume);
};
var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};
var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">' +
    '  <td class="song-item-number" data-song-number="' + songNumber + '">' +
    songNumber + '</td>' + '  <td class="song-item-title">' + songName +
    '</td>' + '  <td class="song-item-duration">' + filterTimeCode(songLength) +
    '</td>' +
    '</tr>';

  var $row = $(template);



  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
      // Revert to song number for currently playing song because user started playing new song.
      var currentlyPlayingCell = getSongNumberCell(
        currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
    if (currentlyPlayingSongNumber !== songNumber) {
      // Switch from Play -> Pause button to indicate new song is playing.
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      updatePlayerBarSong();
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      // storing fill and thumb element of volume bar
      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      //setting css of volume bar to intial current volume
      $volumeFill.width(currentVolume + "%");
      $volumeThumb.css({
        left: currentVolume + '%'
      });
    } else if (currentlyPlayingSongNumber === songNumber) {
      // Switch from Pause -> Play button to pause currently playing song.

      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
      } else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }

    }
  };

  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(songNumber);
    }
  };
  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;

};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);

    $albumSongList.append($newRow);
  }

};
var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');
      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(currentSoundFile);
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;

  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);


  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({
    left: percentageString
  });
};
var filterTimeCode = function(timeInSeconds) {

  timeInSeconds = parseFloat(timeInSeconds);
  return Math.floor(timeInSeconds / 60) + ':' + Math.floor(timeInSeconds % 60);

};
var setCurrentTimeInPlayerBar = function(currentTime) {
  //set current-time class text to currentTime
  $('.current-time').text(filterTimeCode(currentTime.getTime()));
};

var setTotalTimeInPlayerBar = function(totalTime) {
  //set .total-time class text to totalTime
  $('.total-time').text(filterTimeCode(totalTime.duration));
};
var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {

    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();

    var seekBarFillRatio = offsetX / barWidth;

    if ($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);
  });
  $seekBars.find('.thumb').mousedown(function(event) {

    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });

};


var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Note that we're _incrementing_ the song here
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  // Save the last song number before changing it
  var lastSongNumber = currentlyPlayingSongNumber;


  setSong(currentSongIndex + 1);
  // currentlyPlayingSongNumber = currentSongIndex + 1;
  // currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  currentSoundFile.play();
  updateSeekBarWhileSongPlays();

  // Update the Player Bar information
  updatePlayerBarSong();
  // var $nextSongNumberCell = $('.song-item-number[data-song-number="' +
  //   currentlyPlayingSongNumber + '"]');
  // var $lastSongNumberCell = $('.song-item-number[data-song-number="' +
  //   lastSongNumber + '"]');
  var $nextSongNumberCell = getSongNumberCell(
    currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(
    lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(
    lastSongNumber);
};
var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Note that we're _decrementing_ the index here
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  // Save the last song number before changing it
  var lastSongNumber = currentlyPlayingSongNumber;

  setSong(currentSongIndex + 1);
  // currentlyPlayingSongNumber = currentSongIndex + 1;
  // currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();

  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);
  // var $previousSongNumberCell = $('.song-item-number[data-song-number="' +
  //   currentlyPlayingSongNumber + '"]');
  // var $lastSongNumberCell = $('.song-item-number[data-song-number="' +
  //   lastSongNumber + '"]');
  var $previousSongNumberCell = getSongNumberCell(
    currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(
    lastSongNumber);
  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title +
    " - " + currentAlbum.artist);
  $(".main-controls .play-pause").html(playerBarPauseButton);
  setTotalTimeInPlayerBar(currentSongFromAlbum);
};


var playButtonTemplate =
  '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate =
  '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
console.log("songNumber type is " + typeof songNumber +
  "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber
);

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);

});
