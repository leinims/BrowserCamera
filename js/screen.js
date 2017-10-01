
function toggleFullScreen(element) {
    stateFullScreen = document.mozFullScreen || document.webkitFullScreen;
    element.requestFullScreen = element.mozRequestFullScreen || element.webkitRequestFullScreen;
    document.cancelFullScreen = document.mozCancelFullScreen || document.webkitCancelFullScreen
    !stateFullScreen ? element.requestFullScreen () : document.cancelFullScreen ();
  }