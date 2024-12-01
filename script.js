function toggleMenu() {
    const navbarCollapse = document.getElementById('navbarNav');
    navbarCollapse.classList.toggle('show');
}

function closeMenu() {
    const navbarCollapse = document.getElementById('navbarNav');
    navbarCollapse.classList.remove('show');
}
function changeButtonColor(button) {
if (button.style.backgroundColor === '#fff') {
    button.style.backgroundColor = ''; 
} else {
    button.style.backgroundColor = '#fff';
}
}


document.addEventListener('DOMContentLoaded', () => {
const accordions = document.querySelectorAll('.accordion-item');

accordions.forEach(accordion => {
const button = accordion.querySelector('.accordion-button');
const ccmain = accordion.querySelector('.ccmain');
const accordionBody = accordion.querySelector('.accordion-body');

const originalColor = '#FFFFFF';
const activeColor = '#F2F2F2'; 

accordion.addEventListener('show.bs.collapse', () => {
    ccmain.style.backgroundColor = activeColor;
    accordionBody.style.backgroundColor = activeColor;
});

accordion.addEventListener('hide.bs.collapse', () => {
    ccmain.style.backgroundColor = originalColor;
    accordionBody.style.backgroundColor = originalColor;
    });
});
});


var ang = 0;
var panels = document.querySelectorAll('.panel');
var currentIndex = 0; // Start with the first panel
var totalPanels = panels.length;

function updatePanels() {
panels.forEach((panel, index) => {
// Calculate the panel's progress (position in animation)
var progress = Math.abs(currentIndex - index) % totalPanels;

if (progress === 0) {
    panel.style.opacity = "1";
    panel.style.visibility = "visible";
    panel.style.transform = `rotateY(${index * 90}deg) translateZ(250px) scale(1)`;
} else if (progress === 1) {
    panel.style.opacity = "0.0";
    panel.style.visibility = "visible";
    panel.style.transform = `rotateY(${index * 90}deg) translateZ(250px) scale(1)`;
} else {
    panel.style.opacity = "0.0"; // Dim inactive panels
    panel.style.visibility = "hidden";
    panel.style.transform = `rotateY(${index * 90}deg) translateZ(250px) scale(0.8)`;
}
});
}

setInterval(function () {
ang -= 90;
document.documentElement.style.setProperty('--ang', ang + 'deg');

// Update the current index for the panel
currentIndex = (currentIndex + 1) % panels.length;
updatePanels();
}, 2000);

updatePanels();


(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Terrain and background animation code
var background = document.getElementById("bgCanvas"),
    bgCtx = background.getContext("2d"),
    mainContent = document.querySelector(".main-content");

function resizeCanvas() {
    var width = mainContent.offsetWidth;
    var height = mainContent.offsetHeight;

    background.width = width;
    background.height = height;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Terrain object setup
function Terrain(options) {
    options = options || {};
    this.terrain = document.createElement("canvas");
    this.terCtx = this.terrain.getContext("2d");
    this.scrollDelay = options.scrollDelay || 90;
    this.lastScroll = new Date().getTime();
    this.terrain.width = background.width;
    this.terrain.height = background.height;
    this.fillStyle = options.fillStyle || "#191D4C";
    this.mHeight = options.mHeight || background.height;
    this.points = [];

    var displacement = options.displacement || 140,
        power = Math.pow(2, Math.ceil(Math.log(background.width) / (Math.log(2))));

    this.points[0] = this.mHeight;
    this.points[power] = this.points[0];

    for (var i = 1; i < power; i *= 2) {
        for (var j = (power / i) / 2; j < power; j += power / i) {
            this.points[j] = ((this.points[j - (power / i) / 2] + this.points[j + (power / i) / 2]) / 2) + Math.floor(Math.random() * -displacement + displacement);
        }
        displacement *= 0.6;
    }

    document.body.appendChild(this.terrain);
}

Terrain.prototype.update = function () {
    this.terCtx.clearRect(0, 0, background.width, background.height);
    this.terCtx.fillStyle = this.fillStyle;

    if (new Date().getTime() > this.lastScroll + this.scrollDelay) {
        this.lastScroll = new Date().getTime();
        this.points.push(this.points.shift());
    }

    this.terCtx.beginPath();
    for (var i = 0; i <= background.width; i++) {
        if (i === 0) {
            this.terCtx.moveTo(0, this.points[0]);
        } else if (this.points[i] !== undefined) {
            this.terCtx.lineTo(i, this.points[i]);
        }
    }

    this.terCtx.lineTo(background.width, this.terrain.height);
    this.terCtx.lineTo(0, this.terrain.height);
    this.terCtx.lineTo(0, this.points[0]);
    this.terCtx.fill();
}

// Star animation setup
bgCtx.fillStyle = '#05004c';
bgCtx.fillRect(0, 0, background.width, background.height);

function Star(options) {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = options.x;
    this.y = options.y;
}

Star.prototype.reset = function () {
    this.size = Math.random() * 2;
    this.speed = Math.random() * .05;
    this.x = background.width;
    this.y = Math.random() * background.height;
}

Star.prototype.update = function () {
    this.x -= this.speed;
    if (this.x < 0) {
        this.reset();
    } else {
        bgCtx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function ShootingStar() {
    this.reset();
}

ShootingStar.prototype.reset = function () {
    this.x = Math.random() * background.width;
    this.y = 0;
    this.len = (Math.random() * 80) + 10;
    this.speed = (Math.random() * 10) + 6;
    this.size = (Math.random() * 1) + 0.1;
    this.waitTime = new Date().getTime() + (Math.random() * 3000) + 500;
    this.active = false;
}

ShootingStar.prototype.update = function () {
    if (this.active) {
        this.x -= this.speed;
        this.y += this.speed;
        if (this.x < 0 || this.y >= background.height) {
            this.reset();
        } else {
            bgCtx.lineWidth = this.size;
            bgCtx.beginPath();
            bgCtx.moveTo(this.x, this.y);
            bgCtx.lineTo(this.x + this.len, this.y - this.len);
            bgCtx.stroke();
        }
    } else {
        if (this.waitTime < new Date().getTime()) {
            this.active = true;
        }
    }
}

// Initialize stars and shooting stars
var entities = [];
for (var i = 0; i < background.height; i++) {
    entities.push(new Star({
        x: Math.random() * background.width,
        y: Math.random() * background.height
    }));
}

// Add shooting stars
entities.push(new ShootingStar());
entities.push(new ShootingStar());
entities.push(new Terrain({ mHeight: (background.height / 2) - 120 }));
entities.push(new Terrain({ displacement: 120, scrollDelay: 50, fillStyle: "rgb(17,20,40)", mHeight: (background.height / 2) - 60 }));
entities.push(new Terrain({ displacement: 100, scrollDelay: 20, fillStyle: "rgb(10,10,5)", mHeight: background.height / 2 }));

// Animate the background
function animate() {
    bgCtx.fillStyle = '#110E19';
    bgCtx.fillRect(0, 0, background.width, background.height);
    bgCtx.fillStyle = '#ffffff';
    bgCtx.strokeStyle = '#ffffff';
    

    var entLen = entities.length;
    while (entLen--) {
        entities[entLen].update();
    }
    requestAnimationFrame(animate);
}

animate();

