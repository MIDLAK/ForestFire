/* НАСТРОЙКА CANVAS */
var canv = document.getElementById('grid'),
    ctx = canv.getContext('2d');
canv.width = window.innerWidth / 2
canv.height = window.innerHeight / 1.4

/* ГЕНЕРИРОВАНИЕ И ВЫВОД ЛЕСНОГО МАССИВА */
var forest = new Forest(Math.ceil(canv.width / 25 - 2), Math.ceil(canv.height / 25 - 2))
forest.generateAndDrawForest(ctx)

var result
var direction
var rows = forest.rows
var cols = forest.cols
var intervalId

/* ВЫПОЛНЕНИЕ МОДЕЛИ */
var c = true //флаг ожидания начала пожара
var runFlag = false
function run(weather) {
    runFlag = true
    //обнуление флагов посадки деревьев
    plantFlag = false
    waterFlag = false
    firFlag = false
    grassPlantFlag = false

    fc = document.getElementById('fireClass')
    fc.textContent = 'Class = ' + weather.FireClass

    coef = document.getElementById('fireCoef')
    coef.textContent = 'FC = ' + weather.FireCoefficient + ' °С' 

    switch (weather.Wind.Direction) {
        case 1:
            direction = Direction.NORTH
            break
        case 2:
            direction = Direction.EAST
            break
        case 3:
            direction = Direction.SOUTH
            break
        case 4:
            direction = Direction.WEST
            break
        default:
            direction = Direction.WEST
            break
    }

    //процесс разгорания пожара
    var flag = true
    var interval = weather.TimeInterval
    rows = forest.rows
    cols = forest.cols
    intervalId = setInterval(function () {

        if (weather.FireClass == 0) {
            alert('Количество осадков достигло значения, при котором сходит на нет пожарная опасность\
            при данных прочих погодных условиях.')
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var plant = forest.forestArray[i][j]
                    if (plant.plantColor == Colors.FIRE) {
                        plant.plantColor = Colors.ASH
                        plant.fireResistance = 0
                        plant.drawPlant(ctx)
                    }
                }
            }
            clearInterval(intervalId)
        } else {

            //копирование списка ячеек
            var forestCopy = structuredClone(forest)

            //распространение пожара на одну итерацию
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var pl = forestCopy.forestArray[i][j]
                    if (pl.plantColor == Colors.FIRE) {
                        forest.burnPlant(ctx, j, i, weather.Wind.Speed,
                            direction, result.FireCoefficient)

                        if (flag) {
                            forest.burnPlant(ctx, j, i, 0,
                                direction, result.FireCoefficient)
                        }
                    }
                    flag = false
                    if (Math.ceil(Math.random() * 10000) < 50) {
                        flag = true
                    }
                }
            }

            //проверка на конец пожара
            var f = true
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (forest.forestArray[i][j].plantColor == Colors.FIRE || c) {
                        f = false
                        break
                    }
                }
            }

            if (f) {
                alert('пожар закончился')
                clearInterval(intervalId)
            }
        }
    }, interval)
}

/* СЛУШАТЕЛИ СОБЫТИЙ */
//начало выполнения модели
const weatherButton = document.getElementById('weatherButton')
weatherButton.addEventListener('click', function () {
    //получение вводных данных
    const windDirection = document.getElementsByName('windDirection')
    const windSpeed = document.getElementById('windSpeed')
    const airHumidity = document.getElementById('airHumidity')
    const temperature = document.getElementById('temperature')
    const atmosphericPrecipitation = document.getElementById('atmosphericPrecipitation')

    //определение выбранного направления
    var directions = ['North', 'East', 'South', 'West']
    var direction
    for (var i = 0; windDirection.length; i++) {
        var wd = windDirection[i]
        if (wd.checked) {
            direction = directions[i]
            break
        }
    }

    //выполнение запроса на сервер
    if (windSpeed.value < 0 || windSpeed.value > 200) {
        alert('Скорость ветра не должна превышать 200 м/c и быть не менее 0 м/c')
    } else {
        dataInput = {
            speed: windSpeed.value,
            direction: direction,
            airHumidity: airHumidity.value,
            temperature: temperature.value,
            atmosphericPrecipitation: atmosphericPrecipitation.value
        }
        //POST запрос на сервер
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
                if (!runFlag) {
                    run(result)
                } else {
                    //избежание наложения эффектов
                    clearInterval(intervalId)
                    run(result)
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    }
})

var grassPlantButton = document.getElementById('grassPlant')
var grassPlantFlag = false
grassPlantButton.addEventListener('click', function () {
    plantFlag = false
    firFlag = false
    waterFlag = false
    grassPlantFlag = !grassPlantFlag
})

var plantTreeButton = document.getElementById('plantTree')
var plantFlag = false
plantTreeButton.addEventListener('click', function () {
    waterFlag = false
    firFlag = false
    grassPlantFlag = false
    plantFlag = !plantFlag
})

var pourWaterButton = document.getElementById('pourWater')
var waterFlag = false
pourWaterButton.addEventListener('click', function () {
    plantFlag = false
    firFlag = false
    grassPlantFlag = false
    waterFlag = !waterFlag
})

var firTreeBurron = document.getElementById('firTree')
var firFlag = false
firTreeBurron.addEventListener('click', function () {
    waterFlag = false
    plantFlag = false
    grassPlantFlag = false
    firFlag = !firFlag
})

//реакция при нажатии на ячейку
canv.addEventListener('mousedown', function (e) {
    var indent = 0
    var dimension = 25
    var coords = getCursorPosition(canv, e)

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var plant = forest.forestArray[i][j]
            var X = indent + plant.coordX * dimension
            var Y = indent + plant.coordY * dimension

            if (coords.x >= X && coords.x <= X + dimension
                && coords.y >= Y && coords.y <= Y + dimension) {
                if (plantFlag) {
                    plant.plantColor = Colors.DECIDUOUS_TREE
                    plant.drawPlant(ctx)
                } else if (waterFlag) {
                    plant.plantColor = Colors.WATER
                    plant.drawPlant(ctx)
                } else if (firFlag) {
                    plant.plantColor = Colors.FIR
                    plant.drawPlant(ctx)
                } else if (grassPlantFlag) {
                    plant.plantColor = Colors.GRASS
                    plant.drawPlant(ctx)
                } else {
                    c = false
                    forest.burnPlant(ctx, j, i, result.Wind.Speed,
                        result.Temperature.DegreesCelsius,
                        result.AirHumidity.Percent,
                        result.AtmosphericPrecipitation.Millimeters,
                        direction)
                }
            }
        }
    }

})

//возвращает координаты относительно canvas
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return { x: x, y: y }
}