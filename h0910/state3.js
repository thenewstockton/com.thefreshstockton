var sound;

demo.state3 = function(){};
demo.state3.prototype = {
    preload: function(){
        game.load.image('button1', 'assets/sprites/button1.png');
        game.load.image('button2', 'assets/sprites/button2.png');
        game.load.image('button3', 'assets/sprites/button3.png');
        game.load.audio('pops', 'assets/sounds/buttonPops.mp3');
    },
    create: function(){
        game.stage.backgroundColor = '#332211'; 
        addChnageStateEventListeners();
        
        sound = game.add.audio('pops');
        sound.addMarker('low', 0.15, 0.5);
        sound.addMarker('high', 1.1, 1.5);
        
        
        var bt1 = game.add.button(100,100, 'button1', function(){
            changeState(null, 1);
        });
        var bt2 = game.add.button(200,200, 'button2', function(){
            changeState(null, 2);
        });
        var bt3 = game.add.button(300,300, 'button3', function(){
        });
        bt1.onInputDown.add(this.tint, bt1);
        bt2.onInputDown.add(this.tint, bt2);
        bt3.onInputDown.add(this.tint, bt3);
        
        bt1.onInputUp.add(this.unTint,bt1);
        bt2.onInputUp.add(this.unTint,bt2);
        bt3.onInputUp.add(this.unTint,bt3);
    },
    update:function(){},
    tint:function(){
        this.tint = 0xbbbbbbbb;
        sound.play('low');
    },
    unTint:function(){
        this.tint = 0xFFFFFFFF;
        sound.play('high');
        
    }
};