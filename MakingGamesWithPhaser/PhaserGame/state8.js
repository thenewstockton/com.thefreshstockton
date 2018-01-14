var text;

WebFontConfig = {
    google: {families: [ 'Candal', 'Montserrat' ] }
};

demo.state8 = function(){};
demo.state8.prototype = {
    preload: function(){
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
    },
    create: function(){
        game.stage.backgroundColor = '#8877FF'; 
        addChnageStateEventListeners();
        
        text = " Hello WOlrd, this phaser thing is cool, but how do Titansoft people use this with typescript? I still need time to figure that out.";
        
        // this.speelOutText(100, 100, 1000, text, 40, 40, '#fff', 'Candal');
        // this.spellOutText(100, 600, 1000, text, 40 ,20, '#000', 'Montserrat');
        this.spellOutText(100, 100, 1000, text, 40, 40, '#fff', 'Candal');
        this.spellOutText(100, 300, 1000, text, 40, 20, '#000', 'Montserrat');
    },
    update:function(){},
    spellOutText: function(x, y, width, text, fontSize, speed, fill, font) {
        var sentence = game.add.text(x, y, '', {fontSize: fontSize + 'px', fill: fill, font: font});
        var currentLine = game.add.text(10, 10, '', {fontSize: fontSize + 'px', font: font});
        currentLine.alpha = 0;
        var loop = game.time.events.loop(speed, addChar);
        var index = 0;
        
        function addChar() {
            sentence.text += text[index];
            currentLine.text += text[index];
            
            if (currentLine.width > width && text[index] == ' ') {
                sentence.text += '\n';
                currentLine.text = '';
            }
            
            if(index >= text.length - 1){
                game.time.events.remove(loop);
                console.log('stop');
            }
            index++;
        }
    }
};