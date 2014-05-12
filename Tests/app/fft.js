(function() {
  Dancer.addPlugin( 'fft', function( canvasEl, options ) {
    options = options || {};
    var
      ctx     = canvasEl.getContext( '2d' ),
      h       = canvasEl.height,
      w       = canvasEl.width;

    ctx.fillStyle = options.fillStyle || "white";

    var canvasAmp = document.getElementById('amplitude');
    var drawAmp = canvasAmp.getContext('2d');
    
    this.bind( 'update', function() {
      var spectrum = this.getSpectrum();
      var sampleRate = this.audioAdapter.context.sampleRate;
      console.log(spectrum.length);
      ctx.clearRect( 0, 0, w, h );

      ctx.font = '12px sans-serif';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle='rgb(0,0,0)';
      ctx.fillText('frequencyBinCount', spectrum.length*3+10, h-10);

      ctx.fillText('Amplitude', 0, 13);

      drawAmp.beginPath();
      drawAmp.moveTo(20, h-20);
      drawAmp.lineWidth = 3;
      drawAmp.lineTo(20,15);
      drawAmp.stroke();

      ctx.beginPath();
      ctx.moveTo(0, h-20);
      ctx.lineWidth = 2;
      ctx.lineTo(spectrum.length*3,h-20);
      ctx.stroke();

      for(var j = 780; j >= 0; j--){
        if(j % 10 == 0){
          drawAmp.beginPath();
          drawAmp.moveTo(10, j);
          drawAmp.lineWidth = 2;
          drawAmp.lineTo(20,j);
          drawAmp.stroke();
        }
      }
      
      for ( var i = 0, l = spectrum.length; i < l; i++ ) {
        var value = spectrum[i]*10000;
        ctx.fillStyle='rgb(255,0,255)';
        ctx.fillRect( i * 3, h-22, 2, -value);
      }

      //Hilfslinien für Frequenzen zeichnen
      for(var l = 0; l <= spectrum.length; l++){
          if(l == 0){
              ctx.lineWidth = 3;
          }else{
              ctx.lineWidth = 2;
          }
          ctx.beginPath();
          ctx.moveTo(l*3+1,h-20);
          ctx.lineTo(l*3+1,h-10);
          ctx.stroke();
          ctx.save();
          if(l % 10 == 0){
              // drawFreq.textBaseline = 'bottom';
              // drawFreq.fillStyle = 'rgb(0,0,0)';
              // drawFreq.fillText(Math.floor(context.sampleRate / analyser.fftSize * i), i*3-12, 10);
              // drawFreq.save();
              ctx.moveTo(l*3,h-20);
              ctx.lineTo(l*3,h-5);

              ctx.stroke();
          }
             
      }

      // console.log(this.getFrequency(spectrum[1], spectrum.length));
    });

    return this;
  });
})();
