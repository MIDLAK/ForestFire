var waterCanv = document.getElementById('water_prez_grid'),
    waterContext = waterCanv.getContext('2d');
waterCanv.width = 220
waterCanv.height = 220

/* ГЕНЕРИРОВАНИЕ И ВЫВОД ЛЕСНОГО МАССИВА */
var prezWaterForest = new Forest(rows, cols)
prezWaterForest.generateForest()

var prezWaterForestCopy = prezWaterForest.cloneForest()
prezWaterForestCopy.drawForest(waterContext)

/* ДЕМОНСТРАЦИЯ НЕРАСПРОСТРАНЕНИЯ ОГНЯ ЧЕРЕЗ РЕКУ */
var prezWaterStartButton = document.getElementById('prezWaterStart')
var waterStartFlag = true
prezWaterStartButton.addEventListener('click', function () {
    if (waterStartFlag) {
        prezWaterStartButton.textContent = 'Стоп'
        waterStartFlag = false
    } else {
        prezWaterStartButton.textContent = 'Старт'
        waterStartFlag = true
    }
    prezWaterForestCopy.burnPlant(waterContext, 6, 2)
    var waterIntervalId = setInterval(function () {
        if (waterStartFlag) {
            clearInterval(waterIntervalId)
        }

        //копирование списка ячеек
        var waterForestCopy = prezWaterForestCopy.cloneForest()

        //распространение пожара на одну итерацию
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var pl = waterForestCopy.forestArray[i][j]
                if (pl.plantColor == Colors.FIRE) {
                    prezWaterForestCopy.burnPlant(waterContext, j, i)
                }
            }
        }

        //проверка на конец пожара
        var f = true
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (prezWaterForestCopy.forestArray[i][j].plantColor == Colors.FIRE) {
                    f = false
                    break
                }
            }
        }

        //зацикливание анимации
        if (f) {
            prezWaterForestCopy = prezWaterForest.cloneForest()
            prezWaterForestCopy.drawForest(waterContext)
            prezWaterForestCopy.burnPlant(waterContext, 6, 2)
        }
    }, interval)
})