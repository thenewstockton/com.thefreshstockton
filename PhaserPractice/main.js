
var WIDTH = 1280;
var HEIGHT = 720;

var game = new Phaser.Game(WIDTH,HEIGHT,Phaser.CANVAS,'gameDiv');

var spacefield;
var backgroundv;


var player;

var cursors;

var bullets;
var bulletTime = 0;
var fireButton;

var enemies;

var score = 0;
var scoreText;
var bulletText;
var winText;

var mainState =
{
	preload: 
		function()
		{
			game.load.image('starfield', "assets/starfield.png");
			game.load.image('player', "assets/spaceship.png");
			game.load.image('bullet', "assets/bullets.png");
			game.load.image('enemy', 'assets/enemy.png');
			
			game.load.image('cake', 'assets/cake.png');
			//game.load.image('enemy', 'assets/enemy.png');
		}
		
	,
	
	create:
		function()
		{
			spacefield = game.add.tileSprite(0,0,WIDTH,HEIGHT,'starfield');
			backgroundv = 2;
			
			player = game.add.sprite(game.world.centerX,game.world.centerY + 250, 'player');
			game.physics.enable(player,Phaser.Physics.ARCADE);
			
			cake = game.add.sprite(game.world.centerX - 250 ,game.world.centerY - 200, 'cake');
			game.physics.enable(cake,Phaser.Physics.ARCADE);
			cake.visible = false;
			cursors = game.input.keyboard.createCursorKeys();
			bullets = game.add.group();
			bullets.enableBody = true;
			bullets.physicsBodyType = Phaser.Physics.ARCADE;
			bullets.createMultiple(50, 'bullet'); //we have 30 bullets
			bullets.setAll('anchor.x', 0.5);
			bullets.setAll('anchor.y', 1);
			//bullets.setAll('outOfBoundsKill', true);
			//bullets.setAll('checkWorldBounds', true);
			
			fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //space button
			
			
			enemies = game.add.group();
			enemies.enableBody = true;
			enemies.PhysicsBodyType = Phaser.Physics.ARCADE;
			
			createEnemies();
			
			
			scoreText = game.add.text(0,650, 'Score:', {font: '32px Arial', fill : '#fff'});
			bulletText = game.add.text(1000,650, 'Bullets:', {font: '32px Arial', fill : '#fff'});
			console.log(game.world.centerX);
			winText = game.add.text(game.world.centerX/3, game.world.centerY-350, 'Happy Birthday! Kevin!', {font: '96px Arial', fill: '#fff'});
			winText.visible = false;
		}
	,
	
	update:
		function()
		{
			
			game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);
			player.body.velocity.x = 0;
			
			spacefield.tilePosition.y += backgroundv;
			// console.log(player.x);
			// console.log(player.y);
			if(cursors.left.isDown && player.x > 20)
			{
				player.body.velocity.x = -350;
			}
			if (cursors.right.isDown && player.x < 1200)
			{
				player.body.velocity.x = 350;
			}
			
			if (fireButton.isDown) //space button
			{
				fireBullet();
			}
			scoreText.text = 'Score:' + score;
			bulletText.text = 'Bullets:' + bullets.countDead();
			if (score > 17500)
			{
				winText.visible = true;
				cake.visible = true;
			}
		}
}

function fireBullet()
{
	
	if (game.time.now > bulletTime)
	{ 
		//console.log("Living: " + bullets.countLiving());
		//console.log("Dead: " + bullets.countDead());
		bullet = bullets.getFirstExists(false); 
		if(bullet)
		{  
			bullet.reset(player.x + player.body.halfWidth, player.y);
			bullet.body.velocity.y = -400;
			bulletTime = game.time.now + 200;
		} 
	}
}

function createEnemies()
{
	for(var y = 0 ; y < 15; y++)
	{
		for(var x = 0 ; x < 50; x++)
		{
			var enemy;
			//letter 'S'
			if (x == 10 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 10 && y == 3) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 3) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 8 && y == 0) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 8 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 8 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 7 && y == 0) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 7 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 6 && y == 0) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 6 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 0) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 3) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 3 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 3 && y == 3) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 3 && y == 4) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 4) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 3 && y == 5) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 5) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 5) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 6 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 6 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 7 && y == 8) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 7 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 7 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 8 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 8 && y == 8) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 8) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 9) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 10 && y == 9) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 10 && y == 8) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 10 && y == 10) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 10) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 10 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 8 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 8 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 9 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 7 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 7 && y == 13) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 8 && y == 13) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 6 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 6 && y == 13) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 13) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 5 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 3 && y == 10) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 3 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 4 && y == 10) enemy = enemies.create(x*20, y*20, 'enemy');
			
			else if ( (x == 15 || x == 16) && y < 12)
			{
				enemy = enemies.create(x*20, y*20, 'enemy');
			}
			else if (x == 16 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 17 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 17 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 17 && y == 13) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 18 && y == 13) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 18 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 19 && y == 13) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 19 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 20 && y == 13) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 20 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			
			else if (x == 20 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 21 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 21 && y == 12) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 21 && y == 10) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 22 && y == 10) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 22 && y == 11) enemy = enemies.create(x*20, y*20, 'enemy');
			
			
			//letter 'P'
			else if ( (x == 22 || x == 21) && y < 12)
			{
				enemy = enemies.create(x*20, y*20, 'enemy');
			}
			else if ( (x == 27 || x == 28) && y < 14)
			{
				enemy = enemies.create(x*20, y*20, 'enemy');
			}
			else if (x == 29 && y == 0) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 29 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 30 && y == 0) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 30 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 31 && y == 0) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 31 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 32 && y == 0) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 32 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 32 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 33 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 33 && y == 1) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 33 && y == 3) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 34 && y == 3) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 34 && y == 2) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 33 && y == 4) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 34 && y == 4) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 33 && y == 5) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 34 && y == 5) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 32 && y == 5) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 32 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 33 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 31 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 31 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 32 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 30 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 30 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 29 && y == 6) enemy = enemies.create(x*20, y*20, 'enemy');
			else if (x == 29 && y == 7) enemy = enemies.create(x*20, y*20, 'enemy');
			else 
			{
				//enemy = enemies.create(x*20, y*20, 'enemy');
			}
			if (enemy !== undefined)
				enemy.anchor.setTo(0.5,0.5);
		}
	}
	
	enemies.x = 50;
	enemies.y = 50;
	
	var tween = game.add.tween(enemies).to({x:500},2000,Phaser.Easing.Linear.None,true,0,1000,true);
	tween.onLoop.add(descend,this);
}

function descend()
{
	enemies.y += 10;
}

function collisionHandler(bullet,enemy)
{
	bullet.kill();
	enemy.kill();
	
	score += 100;
}


game.state.add('mainState',mainState);
game.state.start('mainState');
