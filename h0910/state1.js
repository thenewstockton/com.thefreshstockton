demo.state1 = function(){};
var cursors, rocks, grass;
var velocity = 500;

demo.state1.prototype = {
    preload: function(){
        game.load.tilemap('field', './assets/tilemaps/field.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('grassTiles', './assets/tilemaps/grassTiles.png');
        game.load.image('rockTiles', './assets/tilemaps/rockTiles.png');
        game.load.image('adam', './assets/sprites/adam.png');
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#336699'; 
        addChnageStateEventListeners();    
        
        var map = game.add.tilemap('field');
        map.addTilesetImage('grassTiles');
        map.addTilesetImage('rockTiles');
        
        grass = map.createLayer('grass');
        rocks = map.createLayer('rocks');
        
        map.setCollisionBetween(1, 9, true, 'rocks');
        map.setCollision(11, true, 'grass');
        
        adam = game.add.sprite(250, 200 , 'adam');
        adam.scale.setTo(0.2, 0.2);
        game.physics.enable(adam);
        
        cursors = game.input.keyboard.createCursorKeys();
    },
    update:function(){
        game.physics.arcade.collide(adam, rocks, function(){console.log("hitting rock");});
        game.physics.arcade.collide(adam, grass, function(){console.log("hitting grass");});
        
        if(cursors.up.isDown){
            adam.body.velocity.y = -velocity;
        } else if(cursors.down.isDown){
            adam.body.velocity.y = velocity;
        } else {
            adam.body.velocity.y = 0;
        } 
        if(cursors.left.isDown){
            adam.body.velocity.x = -velocity;
        } else if(cursors.right.isDown){
            adam.body.velocity.x = velocity;
        } else {
            adam.body.velocity.x = 0;
        }
    }
};