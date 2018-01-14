var demo = {};
var centerX = 1500 /2 ;
var centerY = 1000 /2 ;
var speed = 6;
var adam;

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.spritesheet('adam', './assets/spritesheets/adamSheet.png', 240, 370);
        game.load.image('tree', './assets/backgrounds/treeBG.png'); //2813 x 1000
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#000000'; 
        addChnageStateEventListeners();
        game.world.setBounds(0,0, 2813, 1000);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        var treeBG = game.add.sprite(0, 0, 'tree');
        
        adam = game.add.sprite(centerX, centerY , 'adam');
        // adam.anchor.x = 0.5;
        // adam.anchor.y = 0.5;
        adam.anchor.setTo(0.5,0.5);
        adam.scale.setTo(0.7, 0.7);
        game.physics.enable(adam);
        adam.body.collideWorldBounds = true;
        adam.animations.add('walk', [0,1,2,3,4]);
        
        game.camera.follow(adam); //now the camera follows adam
        game.camera.deadzone = new Phaser.Rectangle(centerX - 300, 0, 600, 1000);
    },
    update:function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            adam.scale.setTo(0.7, 0.7);
            adam.x += speed;
            adam.animations.play('walk', 14, true); // animation key, fps, looping?
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            adam.scale.setTo(-0.7, 0.7);
            adam.x -= speed;
            adam.animations.play('walk', 14, true); // animation key, fps, looping?
        } else {
            adam.animations.stop('walk');
            adam.frame = 0;
        } 
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            adam.y -= speed;
            if(adam.y < 395){
                adam.y = 395;
            }
        } else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            adam.y += speed;
        }
    }
};

