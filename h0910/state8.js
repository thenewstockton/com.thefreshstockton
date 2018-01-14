var text;

WebFontConfig = {
    google: {families: [ 'Candal', 'Montserrat' ] }
};

demo.state8 = function(){};
demo.state8.prototype = {
    preload: function(){
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
        game.load.image('birthdayCake', './assets/hbdJenny.jpg');
    },
    create: function(){
        game.stage.backgroundColor = '#8877FF'; 
        addChnageStateEventListeners();
        
        text = "苑庭:  \n\n     生日快樂啊! 雖然妳都一直不怎麼理我，但是我還是記得 妳的生日喔:) 之前答應過妳要給妳生日禮物，但是你沒有給我 可以見妳的權限，所以 只能給這種禮物 哈哈。";
        text +=  "\n希望妳生日之後越來越快樂!也就是名符其實的生日快樂!";
        
        // this.speelOutText(100, 100, 1000, text, 40, 40, '#fff', 'Candal');
        // this.spellOutText(100, 600, 1000, text, 40 ,20, '#000', 'Montserrat');
        //this.spellOutText(100, 100, 1000, text, 40, 40, '#fff', 'Candal');
        this.spellOutText(100, 100, 1000, text, 50, 20, '#000', 'Montserrat');
        game.add.sprite(500, 500, 'birthdayCake');
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