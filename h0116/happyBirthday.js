var text;

WebFontConfig = {
    google: {families: [ 'Candal', 'Montserrat' ] }
};

demo.happyBirthday = function(){};
demo.happyBirthday.prototype = {
    preload: function(){
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
        game.load.image('birthdayCake', './assets/hbd.jpg');
    },
    create: function(){
        game.stage.backgroundColor = '#8877FF'; 
        
        
        text = "雪影:  \n  祝妳生日快樂啊 雖然我們現在已經很久很久沒有講過話了 但我還是會常常想起妳。";
        text +=  "\n希望妳現在一切都順心 這個生日禮物希望妳會喜歡瞜XD 哈哈 祝妳生日快樂啦";
        this.spellOutText(100, 100, window.innerWidth/5, text, 50, 20, '#000', 'Montserrat');
        var cake = game.add.sprite(window.innerWidth/2, window.innerHeight*0.75, 'birthdayCake');
        cake.anchor.setTo(0.5);
        cake.scale.setTo(3,3);
        // cake.setAll('scale.x', 0.85);
        // cake.setAll('scale.y', 0.85);
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