'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var AudioanalyserGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic Audioanalyser generator.'));

    var prompts = [{
      name: 'someOption',
      message: 'Welchen Analyser wollen Sie verwenden? (Dancer/WebAudio)',
      default: 'Dancer'
    }];

    this.prompt(prompts, function (props) {
      this.analyserName = props.someOption.toLowerCase();//tolowercase

      done();
    }.bind(this));
  },

  app: function () {

    switch(this.analyserName){
      case "webaudio":
        this.mkdir('app');
        this.mkdir('app/assets');
        this.copy('WebAudio/jquery-2.1.0.js','app/assets/jquery-2.1.0.js');
        this.copy('WebAudio/jquery-ui-1.10.3.custom.js','app/assets/jquery-ui-1.10.3.custom.js');
        this.copy('WebAudio/test.mp3','app/assets/test.mp3');
        this.copy('WebAudio/fft.html','app/index.html');
        this.copy('WebAudio/fft.js','app/fft.js');
        
      break;

      case "dancer":
        this.mkdir('app');
        this.mkdir('app/assets');
        this.mkdir('app/lib');
        this.mkdir('app/src');
        this.copy('Dancer/js/player.js','app/assets/player.js');
        this.copy('Dancer/lib/fft.js','app/lib/fft.js');
        this.copy('Dancer/lib/flash_detect.js','app/lib/flash_detect.js');
        this.copy('Dancer/lib/soundmanager2.js','app/lib/soundmanager2.js');
        this.copy('Dancer/lib/soundmanager2.swf','app/lib/soundmanager2.swf');
        this.copy('Dancer/src/adapterFlash.js', 'app/src/adapterFlash.js');
        this.copy('Dancer/src/adapterMoz.js', 'app/src/adapterMoz.js');
        this.copy('Dancer/src/adapterWebAudio.js', 'app/src/adapterWebAudio.js');
        this.copy('Dancer/src/dancer.js', 'app/src/dancer.js');
        this.copy('Dancer/src/kick.js', 'app/src/kick.js');
        this.copy('Dancer/src/support.js', 'app/src/support.js');
        this.copy('Dancer/songs/test.mp3','app/assets/test.mp3');
        this.copy('Dancer/fft.html','app/index.html');
        this.copy('Dancer/plugins/dancer.fft.js','app/fft.js');

      break;
    }



    this.log(chalk.magenta(this.analyserName));
    
    this.copy('Gruntfile.js', 'Gruntfile.js');

    this.copy('package.json', 'package.json');
    this.copy('bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = AudioanalyserGenerator;