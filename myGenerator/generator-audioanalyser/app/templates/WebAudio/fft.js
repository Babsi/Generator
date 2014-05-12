jQuery(function () {
    // Future-proofing...
    var context;
    if (typeof AudioContext !== "undefined") {
        context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
        context = new webkitAudioContext();
    } else {
        jQuery(".hideIfNoApi").hide();
        jQuery(".showIfNoApi").show();
        return;
    }

    var WIDTH = 1800;
    var HEIGHT = 500;

    // Overkill - if we've got Web Audio API, surely we've got requestAnimationFrame. Surely?...
    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    // if (!window.cancelAnimationFrame)
    //     window.cancelAnimationFrame = function (id) {
    //         clearTimeout(id);
    //     };
    
    // Create the analyser
    var analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    // Get the frequency data and update the visualisation

   
    function update() {
        requestAnimationFrame(update);

        analyser.getByteFrequencyData(frequencyData);

        // console.log('length: '+analyser.frequencyBinCount);
        // console.log('frequenz: '+frequencyData[0]);
        var canvas = document.getElementById('fft');
        var drawContext = canvas.getContext('2d');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        // drawContext.strokeStyle = 'rgb(0,0,0)';
        // drawContext.lineWidth = 1;

        var canvasFreq = document.getElementById('frequenz');
        var drawFreq = canvasFreq.getContext('2d');

        var canvasAmp = document.getElementById('amplitude');
        var drawAmp = canvasAmp.getContext('2d');

        drawContext.font = '12px sans-serif';
        drawContext.textBaseline = 'bottom';
        drawContext.fillStyle='rgb(0,0,0)';
        drawContext.fillText('Frequenz in Hz', analyser.frequencyBinCount*3+10, HEIGHT-10);

        drawContext.fillText('Amplitude', 0, 13);

        drawAmp.beginPath();
        drawAmp.moveTo(20, HEIGHT-20);
        drawAmp.lineWidth = 3;
        drawAmp.lineTo(20,15);
        drawAmp.stroke();

        drawContext.beginPath();
        drawContext.moveTo(0, HEIGHT-20);
        drawContext.lineWidth = 2;
        drawContext.lineTo(analyser.frequencyBinCount*3,HEIGHT-20);
        drawContext.stroke();
        

        for(var j = 480; j >= 0; j--){
            if(j % 10 === 0){
                drawAmp.beginPath();
                drawAmp.moveTo(10, j);
                drawAmp.lineWidth = 2;
                drawAmp.lineTo(20,j);
                drawAmp.stroke();
            }
        }
        
        // Draw the frequency domain chart.

        for (var i = 0; i < analyser.frequencyBinCount; i++) {
            var value = frequencyData[i];
            var barWidth = 2;
        
            drawContext.fillStyle = 'rgb(255,0,255)';
            drawContext.fillRect(i*3, HEIGHT-22, barWidth, -value);
        }

        //Hilfslinien für Frequenzen zeichnen
        for(var l = 0; l <= analyser.frequencyBinCount; l++){
            if(l === 0){
                drawContext.lineWidth = 3;
            }else{
                drawContext.lineWidth = 2;
            }
            drawContext.beginPath();
            // drawContext.lineWidth = 2;
            drawContext.moveTo(l*3+1,HEIGHT-20);
            drawContext.lineTo(l*3+1,HEIGHT-10);
            drawContext.stroke();
            drawContext.save();
            if(l % 10 === 0){
                // drawFreq.textBaseline = 'bottom';
                // drawFreq.fillStyle = 'rgb(0,0,0)';
                // drawFreq.fillText(Math.floor(context.sampleRate / analyser.fftSize * i), i*3-12, 10);
                // drawFreq.save();
                drawContext.moveTo(l*3,HEIGHT-20);
                drawContext.lineTo(l*3,HEIGHT-5);

                drawContext.stroke();
            }
               
        }
    }


    // Hook up the audio routing...
    // player -> analyser -> speakers
  // (Do this after the player is ready to play)
  jQuery("#player").bind('canplay', function() {
    var source = context.createMediaElementSource(this);
    source.connect(analyser);
    analyser.connect(context.destination);
  });

    // Kick it off...
    update();
});