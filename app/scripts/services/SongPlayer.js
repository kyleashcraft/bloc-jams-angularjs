(function(){
  function SongPlayer($rootScope, Fixtures) {

    /**
    * @desc empty songplayer object, returned at end of SongPlayer function to make properties and methods public to other js files
    * @type object
    */

    var SongPlayer = {};

//----------------------------------------------------------------------------------------------------------------------

    /**
    * @desc buzz object
    * @type object
    */

    var currentBuzzObject = null;

//----------------------------------------------------------------------------------------------------------------------

    /**
    * @desc contains entire album
    * @type object
    */

    var currentAlbum = Fixtures.getAlbum();

//----------------------------------------------------------------------------------------------------------------------

    /**
    * @function getSongIndex
    * @desc searches current album for song, returns index of song if found, -1 if not found
    * @param {object} song
    * @return {number}
    */

    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    }

//----------------------------------------------------------------------------------------------------------------------

    /**
    * @function setSong
    * @desc checks if something is already playing, if it is it stops, sets playing attr to null. sets currentBuzzObject to new buzz sound, sets currentSong to song
    * @param {object} song
    */

    var setSong = function(song) {
      if (currentBuzzObject) {
        currentBuzzObject.stop();
        SongPlayer.currentSong.playing = null;
      }
      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

      currentBuzzObject.bind('timeupdate', function() {
        $rootScope.$apply(function() {
          SongPlayer.currentTime = currentBuzzObject.getTime();
        });
      });

      SongPlayer.currentSong = song;
    }

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @function playSong
    * @desc plays currentBuzzObject, sets song.playing attribute to true
    * @param {object} song
    */

    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    }

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @desc object that stores exact copy of song that is playing (minus additional attribute song.playing)
    * @type {object}
    */

    SongPlayer.currentSong = null;

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @desc Current playback time (in seconds) of currently playing song
    * @type {number}
    */
    SongPlayer.currentTime = null;

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @desc variable to hold volume, should be value between 0 and 100
    * @type {number}
    */
    SongPlayer.volume = 50;

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @desc maximum possible volume for player
    * @type {number}
    */
    SongPlayer.maxVolume = 100;

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @function SongPlayer.play
    * @desc plays song passed to the function
    * @param {object} song
    */

    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song){ //if the song that is clicked doesn't equal current song...
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) { //if currentSong = clicked song...
        if (currentBuzzObject.isPaused() ) { //... and if currentSong is paused ...
          playSong(song);
        }
      }
    };

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @function SongPlayer.pause
    * @desc pauses current song. Param only needed when accessed from angular directive not directly bootstrapped to SongPlayer.js
    * @param {object} song
    */

    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    }

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @function SongPlayer.previous
    * @desc changes current song to one previous (according to songs index in fixtures.js), and plays it
    */

    SongPlayer.previous = function() {
        var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        if (currentBuzzObject && currentSongIndex === currentAlbum.songs.length - 1 && SongPlayer.currentSong.playing === null) {
          playSong(SongPlayer.currentSong);
        } else {
          currentSongIndex--;
          if (currentSongIndex < 0) {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
          } else {
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
          }
        }
    };

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @function SongPlayer.next
    * @desc changes current song to next song (according to songs index in fixtures.js), and plays it
    */

    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      if (currentBuzzObject && currentSongIndex === 0 && SongPlayer.currentSong.playing === null){ 
        playSong(SongPlayer.currentSong);
      } else {
        currentSongIndex++;
        if (currentSongIndex >= currentAlbum.songs.length) {
          currentBuzzObject.stop();
          SongPlayer.currentSong.playing = null;
        } else {
          var song = currentAlbum.songs[currentSongIndex];
          setSong(song);
          playSong(song);
        }
      }
    };

//--------------------------------------------------------------------------------------------------------------------

    /**
    * @function setCurrentTime
    * @desc Set current time (in seconds) of currently playing song
    * @param {number} time
    */

    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };

//---------------------------------------------------------------------------------------------------------------------

    /**
    * @function SongPlayer.setVolume
    * @desc SongPlayer function that wraps the buzz function of setVolume to make it a songPLayer method. Accepts one argument, volume, which should be between 0 and 100
    * @param {number} volume
    */
    SongPlayer.setVolume = function(newVolume) {
      if (currentBuzzObject) {
        currentBuzzObject.setVolume(newVolume);
      }
    };

//--------------------------------------------------------------------------------------------------------------------
  return SongPlayer;
}
angular
.module('blocJams')
.factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);

})();
