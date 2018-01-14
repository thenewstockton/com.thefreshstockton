var barrel, bullets;
var velocity = 1000;
var nextFire = 0;
var fireRate = 200;
var bullet;
var enemyGroup;
var hitCount = 0;

function checkWin(){
    if (hitCount >= 4){
        window.setTimeout(function(){
            changeState(0, 8);
        },1000);
    }
}

demo.state2 = function(){};
demo.state2.prototype = {
    preload: function(){
        game.load.image('base', './assets/sprites/cannonBase.png');
        game.load.image('barrel', './assets/sprites/cannonBarrel.png');
        game.load.image('bullet', './assets/sprites/bullet.png');
        game.load.image('adam', './assets/sprites/adam.png');
    },
    create: function(){
        game.stage.backgroundColor = '#99DDFF'; 
        addChnageStateEventListeners();
        
        var base = game.add.sprite(centerX, centerY, 'base');
        base.anchor.setTo(0.5);
        base.scale.setTo(0.4);
        
        
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(50, 'bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('scale.x', 0.85);
        bullets.setAll('scale.y', 0.85);
        
        barrel = game.add.sprite(centerX, centerY, 'barrel');
        barrel.scale.setTo(0.5);
        barrel.anchor.setTo(0.3,0.5);
        
        enemy = game.add.sprite(100, 200, 'adam');
        game.physics.enable(enemy);
        
        enemyGroup = game.add.group();
        enemyGroup.enableBody = true;
        enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
        
        for(var i = 0; i < 3; i++){
            enemyGroup.create(1300, 200 + i*200, 'adam');
        }
        enemyGroup.setAll('anchor.y', 0.5);
        enemyGroup.setAll('anchor.x', 0.5);
        enemyGroup.setAll('scale.x', 0.4);
        enemyGroup.setAll('scale.y', 0.4);
    },
    update:function(){
        barrel.rotation = game.physics.arcade.angleToPointer(barrel);
        if(game.input.activePointer.isDown){
            this.fire();
        }
        
        game.physics.arcade.overlap(bullets, enemy,  this.hitEnemy);
        game.physics.arcade.overlap(bullets, enemyGroup,  this.hitGroup);
    },
    fire: function(){
        if(game.time.now>nextFire){
            nextFire = game.time.now + fireRate;
            bullet = bullets.getFirstDead();
            bullet.reset(barrel.x, barrel.y);
            
            game.physics.arcade.moveToPointer(bullet, velocity);
            bullet.rotation = game.physics.arcade.angleToPointer(bullet);
        }
    },
    hitEnemy: function() {
        console.log("Hit")
        hitCount++;
        enemy.kill();
        bullet.kill();
        checkWin();
    },
    hitGroup: function(b, e){
        console.log("Hit2");
        hitCount++;
        b.kill();
        e.kill();
        checkWin();
    }  
};