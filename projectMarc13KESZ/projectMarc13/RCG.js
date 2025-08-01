console.log("test");

const canvas = document.getElementById('game-area');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth * 0.80;
canvas.height = window.innerHeight * 0.60;

const roadImage = new Image();
roadImage.src = 'images/RCG/TestRoad.png';

let carImgSrc = "images/RCG/PixelCar1.png";
const carImage = new Image();
carImage.src = carImgSrc; 

const TruckRightImage = new Image();
TruckRightImage.src = 'images/RCG/Truck1Right.png';

const TruckLeftImage = new Image();
TruckRightImage.src = 'images/RCG/Truck1Left.png';

let roadX = 0; 
let carX = canvas.width / 2 - 350;
let carY = canvas.height - 220;
let carGear = 1;
let carSpeed = 7 * carGear;
let roadSpeed = 1;

let gameOver = false;

let targetCarGear = carGear;
const maxCarGear = 6;
const gearIncrement = 0.1;

function update() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    roadX -= roadSpeed;
    if (roadX <= -canvas.width) {
        roadX = 0;
    }


    if (keys['ArrowLeft'] && carX > 0) {
        carX -= carSpeed;
    }
    if (keys['ArrowRight'] && carX < canvas.width - 220) {
        carX += carSpeed;
    }
    if (keys['ArrowUp'] && carY > 0) {
        carY -= carSpeed;
    }
    if (keys['ArrowDown'] && carY < canvas.height - 150) {
        carY += carSpeed;
    }


    if (keys['Shift']) {
        if (targetCarGear < maxCarGear) {
            targetCarGear += gearIncrement;
        }
    } else if(keys['Control']){
        if (targetCarGear > 1) {
            targetCarGear -= gearIncrement;
        }
    }


    carGear = Math.round(targetCarGear);
    carSpeed = 7 * carGear;
    roadSpeed = carGear * 5;


    ctx.drawImage(roadImage, roadX, 0, canvas.width, canvas.height);
    ctx.drawImage(roadImage, roadX + canvas.width, 0, canvas.width, canvas.height);


    ctx.drawImage(carImage, carX, carY, 240, 150);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Speed: ' + (carSpeed * 4).toFixed(1) + ' km/h', 20, 30);
    ctx.fillText('Gear: ' + carGear, 20, 60);


    traffic();

    requestAnimationFrame(update);
}

const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

roadImage.onload = () => {
    carImage.onload = () => {
        update();
    };
};

let trucks = [];
let truckSpeed;

function traffic() {

    let randomNumberRightY = Math.floor(Math.random() * (410 - 280 + 1)) + 280;
    let randomNumberLeftY = Math.floor(Math.random() * (140 - 20 + 1)) + 20;

    let truckRightSpawnLineY = randomNumberRightY;
    let truckLeftSpawnLineY = randomNumberLeftY;

    if (Math.random() * 10000 < 100) {                                                                                  
        console.log("Truck spawned");

        let truckImage = new Image();
        let spawnY;
        if (Math.random() < 0.50) {
            truckImage.src = 'images/RCG/Truck1Right.png';
            spawnY = truckRightSpawnLineY;
            truckSpeed = 3;
        } else {
            truckImage.src = 'images/RCG/Truck1Left.png';
            spawnY = truckLeftSpawnLineY;
            truckSpeed = 7;
         }

         trucks.push({
             image: truckImage,
             x: canvas.width,
             y: spawnY,
             width: 240,
             height: 150,
             speed: truckSpeed
         });
     }  

    
    for (let i = 0; i < trucks.length; i++) {
        let truck = trucks[i];

        truck.x -= truck.speed;

        if (truck.x + truck.width < 0) {
            trucks.splice(i, 1);
            i--; 
        }

        let car = {
            image: carImage,
            x: carX,
            y: carY,
            width: 240,
            height: 150,
            speed: carSpeed
        }; 

        ctx.drawImage(truck.image, truck.x, truck.y, truck.width, truck.height);
    }
}
