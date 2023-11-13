var windCanvas = document.getElementById('wind_temperature_prez_grid'),
    windContext = windCanvas.getContext('2d');
windCanvas.width = 220
windCanvas.height = 220

var temperatureWindCanvas = document.getElementById('temperature_and_wind_grid'),
    temperatureContext = temperatureWindCanvas.getContext('2d');
temperatureWindCanvas.width = 220
temperatureWindCanvas.height = 220

/* ГЕНЕРИРОВАНИЕ И ВЫВОД ЛЕСНОГО МАССИВА */
var windForest = new Forest(rows, cols)
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
        windForest.forestArray[i][j] = new Plant(j, i, 0, getRandomElem([Colors.GRASS, Colors.DECIDUOUS_TREE, Colors.FIR]))
    }
}

var prezWindForestCopy = windForest.cloneForest()
prezWindForestCopy.drawForest(windContext)

var prezTemperatureCopy = windForest.cloneForest()
prezTemperatureCopy.drawForest(temperatureContext)

/* ДЕМОНСТРАЦИЯ ГОРЕНИЯ С НАПРАВЛЕНИЕМ ВЕТРА */
var windTemperatureStartButton = document.getElementById('windTemperatureStart')
windTemperatureStartButton.addEventListener('click', function () {
    prezWindForestCopy.burnPlant(windContext, 3, 3)
    prezTemperatureCopy.burnPlant(temperatureContext, 3, 3)
    var windIntervalId = setInterval(function () {
        var windForestCopy = prezWindForestCopy.cloneForest()
        var temperatureForestCopy = prezTemperatureCopy.cloneForest()

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var pl = windForestCopy.forestArray[i][j]
                var pl2 = temperatureForestCopy.forestArray[i][j]
                if (pl.plantColor == Colors.FIRE) {
                    prezWindForestCopy.burnPlant(windContext, j, i, 10, Direction.WEST,
                        0)
                }
                if (pl2.plantColor == Colors.FIRE) {
                    prezTemperatureCopy.burnPlant(temperatureContext, j, i, 10, 
                        Direction.WEST, 3107)
                }
            }
        }

        //проверка на конец пожара
        var f = true
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (prezWindForestCopy.forestArray[i][j].plantColor == Colors.FIRE) {
                    f = false
                    break
                }
            }
        }

        //зацикливание анимации
        if (f) {
            prezWindForestCopy = windForest.cloneForest()
            prezWindForestCopy.drawForest(windContext)
            prezWindForestCopy.burnPlant(windContext, 3, 3)

            prezTemperatureCopy = windForest.cloneForest()
            prezTemperatureCopy.drawForest(temperatureContext)
            prezTemperatureCopy.burnPlant(temperatureContext, 3, 3)
        }
    }, interval - 50)
})