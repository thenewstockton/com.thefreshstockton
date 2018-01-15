var game = new Phaser.Game(window.innerWidth,window.innerHeight, Phaser.AUTO);

game.state.add('h0116', demo.h0116);
game.state.add('happyBirthday', demo.happyBirthday);
game.state.start('h0116'); 

function changeState(i, stateName){ 
    game.state.start(stateName);
}