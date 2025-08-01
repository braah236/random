const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({position, velocity, color = 'red', offset}) {
    this.position = position;
    this.velocity = velocity
    this.width = 50;
    this.height = 150;
    this.lastKey
    this.attackBox = {
        position: {
            x: this.position.x,
            y: this.position.y
        },
        offset,
        width: 100,
        height: 50,
    }
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if(this.isAttacking) {

    c.fillStyle = 'green';
    c.fillRect(
        this.attackBox.position.x, 
        this.attackBox.position.y, 
        this.attackBox.width, 
        this.attackBox.height
        )

    }
}

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y 

        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        }
        else this.velocity.y += gravity
    }


    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }
}

const player = new Sprite({
    position:{
        x: 0,
        y: 0
     },
    
    velocity:{
        x: 0,
        y: 0
     },
     offset:{
        x: 0,
        y: 0
     }
})

player.draw();

const enemy = new Sprite({
    position:{
        x: 400,
        y: 150
     },
    
    velocity:{
        x: 0,
        y: 0
     },
     color:'blue',
     offset:{
        x: -50,
        y: 0
     }

})

enemy.draw();

// console.log(player);

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    s:{
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
}

let lastKey = '';
let playerDuck = false;
let enemyDuck = false;
let playerJump = false;
let enemyJump = false;

function rectangularCollision({rectangle1, rectangle2})  {
 return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
    rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
    rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId);
            document.querySelector('#displayText').style.display = 'flex';

    if(player.health === enemy.health) {
        console.log('draw');
        document.querySelector('#displayText').innerHTML = 'Draw';
    }
    else if(player.health > enemy.health) {
        console.log('Player 1 wins');
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    }
    else if(enemy.health > player.health) {
        console.log('Player 2 wins');
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
}

let timer = 60;
let timerId;
function decreaseTimer() {
    
    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if(timer === 0) {

    determineWinner({player, enemy});
}
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    // console.log(player.position.y);
    // console.log(player1Duck);

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5;
    }
    else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
    }
    
    
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
    }

    if(rectangularCollision({rectangle1: player,
        rectangle2: enemy}) && player.isAttacking)

            {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }
    if(rectangularCollision({rectangle1: enemy,
        rectangle2: player}) && enemy.isAttacking)

            {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';

    }
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId});
    }
    if(keys.s.pressed && player.lastKey === 's' && playerDuck === false && player.height === 150 && player.position.y >= 425) {
        player.height = 75;
        player.position.y = 500;
        keys.s.pressed = false;
        playerDuck = true;
    }
    if(player.lastKey !== 's' && playerDuck === true ) {
        player.height = 150;
        player.position.y = 425;
        playerDuck = false;
    }
    

    if(player.position.y >=420)
    {
        playerJump = false;

    }

    if(keys.ArrowDown.pressed && enemy.lastKey === 'ArrowDown' && enemyDuck === false && enemy.height === 150 && enemy.position.y >= 425) {
        enemy.height = 75;
        enemy.position.y = 500;
        keys.ArrowDown.pressed = false;
        enemyDuck = true;
    }
    if(enemy.lastKey !== 'ArrowDown' && enemyDuck === true ) {
        enemy.height = 150;
        enemy.position.y = 425;
        enemyDuck = false;
    }
    

    if(enemy.position.y >=420)
    {
        enemyJump = false;

    }

    
}

animate();

window.addEventListener('keydown', (event) => { 
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;

        case 'w':
            if(playerJump === false && player.height === 150) {
            player.velocity.y = -20;
            playerJump = true;
            }
            break;
            
        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;

        case 'ArrowUp':
            if(enemyJump === false && enemy.height === 150) {
                enemy.velocity.y = -20;
                enemyJump = true;
                }
            break;

        case 'ArrowDown':
            keys.ArrowDown.pressed = true;
            enemy.lastKey = 'ArrowDown';           
            break;

        case 's':
            keys.s.pressed = true;
            player.lastKey = 's';
            break;

        case 'k':
            enemy.attack();
            break;
    }
})

window.addEventListener('keyup', (event) => { 
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

    }

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

    }
})
