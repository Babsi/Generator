(function () {
  var
    fft = document.getElementById( 'fft' ),
    ctx = fft.getContext( '2d' ),
    dancer, kick;
  
  Dancer.setOptions({
    flashSWF : '../lib/soundmanager2.swf',
    flashJS  : '../lib/soundmanager2.js'
  });

  dancer = new Dancer();
  // kick = dancer.createKick({
  //   onKick: function () {
  //     ctx.fillStyle = '#000';
  //   },
  //   offKick: function () {
  //     ctx.fillStyle = '#ff00ff';
  //   }
  // }).on();

  dancer
    .fft( fft, { fillStyle: '#ff00ff' })
    .load(document.getElementsByTagName('audio')[0]);
  
  Dancer.isSupported() || loaded();
  !dancer.isLoaded() ? dancer.bind( 'loaded', loaded ) : loaded();

  function loaded () {
    dancer.play();
  }

  window.dancer = dancer;
})();


