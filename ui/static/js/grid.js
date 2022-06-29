var canv = document.getElementById('grid'),
    ctx = canv.getContext('2d');
canv.width = window.innerWidth/1.5;
canv.height = window.innerHeight/1.5;

ctx.fillStyle = '#228b22'; //цвет кисти
ctx.strokeStyle = 'black'; //цвет карандаша

var cols = 24,
	x = 20,
	y = 20,
    rows = 20,
    dimension = 25;
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
        ctx.fillRect(x+i*dimension, x+j*dimension, dimension, dimension);
        ctx.strokeRect(y+i*dimension, y+j*dimension, dimension, dimension);
    }
}