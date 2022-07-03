const weatherButton = document.getElementById('weatherButton')
const weatgerUrl = '/get-weather'
var canv = document.getElementById('grid'),
    ctx = canv.getContext('2d');
canv.width = window.innerWidth / 2
canv.height = window.innerHeight / 1.5
var forest = [], //2d массив ячеек 
    cols = canv.width / 25 - 2,
    rows = canv.height / 25 - 2;
var wind = {}
var direction = {
    NORTH: 'north', //север
    SOUTH: 'south', //юг
    EAST: 'east', //восток
    WEST: 'west', //запад
}
let result

var c = true //флаг ожидания начала пожара

var decdTree = document.getElementById('deciduous_tree')
var fire = document.getElementById('fire')
var burntTree = document.getElementById('burnt_tree')
var grass = document.getElementById('grass')
var fir = document.getElementById('fir')

var plantTreeButton = document.getElementById('plantTree')
var plantFlag = false
plantTreeButton.addEventListener('click', function () {
    waterFlag = false
    firFlag = false
    plantFlag = !plantFlag
})

var pourWaterButton = document.getElementById('pourWater')
var waterFlag = false
pourWaterButton.addEventListener('click', function () {
    plantFlag = false
    firFlag = false
    waterFlag = !waterFlag
})

var firTreeBurron = document.getElementById('firTree')
var firFlag = false
firTreeBurron.addEventListener('click', function () {
    waterFlag = false
    plantFlag = false
    firFlag = !firFlag
})

drawForest()

/* НАЧАЛО ВЫПОЛНЕНИЯ МОДЕЛИ */
weatherButton.addEventListener('click', function () {
    const windDirection = document.getElementsByName('windDirection')
    const windSpeed = document.getElementById('windSpeed')
    var directions = ['North', 'East', 'South', 'West']
    var direction
    //определение выбранного направления
    for (var i = 0; windDirection.length; i++) {
        var wd = windDirection[i]
        if (wd.checked) {
            direction = directions[i]
            break
        }
    }

    if (windSpeed.value < 0 || windSpeed.value > 200) {
        alert('Скорость ветра не должна превышать 200 м/c и быть не менее 0 м/c')
    } else {
        var dataInput = {
            speed: windSpeed.value,
            direction: direction
        }
        //POST завпрос на сервер
        fetch('/get-weather', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(dataInput)
        }).then((response) => {
            let dataResp
            response.text().then(function (respData) {
                result = JSON.parse(respData)
                console.log(result)
                console.log(result["Speed"])
                run()
            })
        }).catch((error) => {
            console.log(error)
        })
    }
})

function run() {
    plantFlag = false
    waterFlag = false
    firFlag = false
    c = true

    //структура, определяющая ветер
    wind = {
        speed: result.Speed, //скорость ветра в м/c 0 - штиль
        direction: direction.WEST, //направление ветра (по сторонам света)
    }

    switch (result.Direction) {
        case 1:
            wind.direction = direction.NORTH
            break
        case 2:
            wind.direction = direction.EAST
            break
        case 3:
            wind.direction = direction.SOUTH
            break
        case 4:
            wind.direction = direction.WEST
            break
    }

    //drawForest()

    var testFlag = true

    /* ПРОЦЕСС РАЗГОРАНИЯ ПОЖАРА */
    var interval = 1000 - wind.speed * 10

    var intervalId = setInterval(function () {
        //копирования списка ячеек
        var forestCopy = []
        for (var i = 0; i < rows; i++) {
            forestCopy[i] = []
            for (var j = 0; j < cols; j++) {
                forestCopy[i][j] = {}
                var tree = forest[i][j]
                var copyTree = forestCopy[i][j]
                //копирование объекта
                for (var key in tree) {
                    copyTree[key] = tree[key]
                }
            }
        }

        //распространение пожара на одну итерацию
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var tr = forestCopy[i][j]
                if (tr.isBurning == true && tr.cellColor == 'yellow') {
                    bunrTree(tr)

                    if (testFlag) {
                        var sp = wind.speed
                        wind.speed = 0
                        bunrTree(tr)
                        wind.speed = sp
                    }
                }
                testFlag = false
                if (Math.ceil(Math.random() * wind.speed * 90) < wind.speed / 2) {
                    testFlag = true
                }
            }
        }

        //проверка на конeц пожара
        var f = true
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (forest[i][j].cellColor == 'yellow' || c) {
                    f = false
                    break
                }
            }
        }

        if (f) {
            alert('пожар закончился')
            clearInterval(intervalId)
        }
    }, interval)
}

//реакции на нажатие на ячейку
canv.addEventListener('mousedown', function (e) {
    var indent = 0
    var dimension = 25
    var coords = getCursorPosition(canv, e)
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var tree = forest[i][j]
            var X = indent + tree.coordX * dimension
            var Y = indent + tree.coordY * dimension
            if (coords.x >= X && coords.x <= X + dimension && coords.y >= Y && coords.y <= Y + dimension) {
                if (plantFlag) {
                    tree.cellColor = '#228b22'
                    tree.number = getRandomArbitrary(50, 60)
                    tree.drawCell()
                } else if (waterFlag) {
                    tree.cellColor = 'blue'
                    tree.drawCell()
                } else if (firFlag) {
                    tree.cellColor = '#2a5c03'
                    tree.number = getRandomArbitrary(40, 50)
                    tree.drawCell()
                } else {
                    c = false
                    bunrTree(tree)
                }
            }
        }
    }
    ctx.fill()
});

//формирование леса
function drawForest() {
    /* НАСТРОЙКА ПОЛЯ ДЛЯ ОТРИСОВКИ */
    canv.width = window.innerWidth / 2
    canv.height = window.innerHeight / 1.5

    for (var i = 0; i < rows; i++) {
        forest[i] = []
        for (var j = 0; j < cols; j++) {
            var tree = {
                coordX: j,
                coordY: i,
                isBurning: false,
                number: 10, //трава //Math.ceil(Math.random() * 50),
                cellColor: '#5da130',
                textColor: 'black',

                drawCell: function (indent = 0, dimension = 25) {
                    originalFillStyle = ctx.fillStyle
                    ctx.fillStyle = this.cellColor
                    //отрисовка ячейки
                    ctx.fillRect(indent + this.coordX * dimension,
                        indent + this.coordY * dimension, dimension, dimension)
                    // ctx.strokeRect(indent + this.coordX * dimension,
                    //     indent + this.coordY * dimension, dimension, dimension);
                    //заполнение ячеек цифрами
                    // ctx.fillStyle = this.textColor;
                    // ctx.fillText('' + this.number, indent + 4 + this.coordX * dimension,
                    //     indent + dimension / 2 + this.coordY * dimension);
                    ctx.fillStyle = originalFillStyle
                    switch (this.cellColor) {
                        case '#5da130':
                            ctx.drawImage(grass, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                            break
                        case '#228b22':
                            ctx.drawImage(decdTree, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                            break
                        case '#2a5c03':
                            ctx.drawImage(fir, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                            break
                        case 'yellow':
                            ctx.drawImage(fire, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                            break
                        case 'gray':
                            ctx.drawImage(burntTree, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                            break
                    }
                }
            }
            if (i == j) {
                tree.cellColor = 'blue'
            }
            tree.drawCell();
            forest[i][j] = tree
        }
    }
}

//"сжечь" деревья в окресности дерева (крестом +)
//с учётом ветра (логика распространения против ветра в другом месте)
function bunrTree(tree) {
    ctx.fillStyle = 'gray'
    var X = tree.coordX,
        Y = tree.coordY;
    var t
    if (X < cols && Y < rows) {
        if (X >= 0 && Y >= 0) {
            t = forest[Y][X]
            if (t.cellColor != 'blue') {
                if (t.number > 0) {
                    t.number = t.number - 1
                    t.cellColor = 'yellow'
                } else {
                    t.number = 0
                    t.cellColor = 'gray'
                }
                t.isBurning = true
                t.drawCell()
            } else {
                return
            }

            if (Y < rows - 1) {
                if (wind.direction != direction.NORTH || wind.speed == 0) {
                    t = forest[Y + 1][X]
                    if (t.cellColor != 'blue') {
                        if (t.number > 0) {
                            t.number = t.number - 1
                            t.cellColor = 'yellow'
                        } else {
                            t.number = 0
                            t.cellColor = 'gray'
                        }
                        t.isBurning = true
                        t.drawCell()
                    }
                }
            }

            if (X < cols - 1) {
                if (wind.direction != direction.WEST || wind.speed == 0) {
                    t = forest[Y][X + 1]
                    if (t.cellColor != 'blue') {
                        if (t.number > 0) {
                            t.number = t.number - 1
                            t.cellColor = 'yellow'
                        } else {
                            t.number = 0
                            t.cellColor = 'gray'
                        }
                        t.isBurning = true
                        t.drawCell()
                    }
                }
            }
        }

        if (X > 0 && Y >= 0) {
            if (wind.direction != direction.EAST || wind.speed == 0) {
                t = forest[Y][X - 1]
                if (t.cellColor != 'blue') {
                    if (t.number > 0) {
                        t.number = t.number - 1
                        t.cellColor = 'yellow'
                    } else {
                        t.number = 0
                        t.cellColor = 'gray'
                    }
                    t.isBurning = true
                    t.drawCell()
                }
            }
        }

        if (Y > 0 && X >= 0) {
            if (wind.direction != direction.SOUTH || wind.speed == 0) {
                t = forest[Y - 1][X]
                if (t.cellColor != 'blue') {
                    if (t.number > 0) {
                        t.number = t.number - 1
                        t.cellColor = 'yellow'
                    } else {
                        t.number = 0
                        t.cellColor = 'gray'
                    }
                    t.isBurning = true
                    t.drawCell()
                }
            }
        }
    }
}

//возвращает координаты относительно canvas
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return { x: x, y: y }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}