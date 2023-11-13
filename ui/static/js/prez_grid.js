var prezCanv = document.getElementById('prez_grid'),
    context = prezCanv.getContext('2d');
prezCanv.width = 220
prezCanv.height = 220

var interval = 2000

/* ГЕНЕРИРОВАНИЕ И ВЫВОД ЛЕСНОГО МАССИВА */
var rows = Math.ceil(prezCanv.width / 25 - 2)
var cols = Math.ceil(prezCanv.height / 25 - 2)
var prezForest = new Forest(rows, cols)

/* СОЗДАНИЕ ТЕСТОВОГО УЧАСТКА ЛЕСА ВРУЧНУЮ */
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
        prezForest.forestArray[i][j] = new Plant(j, i, 0, getRandomElem([Colors.GRASS, Colors.DECIDUOUS_TREE, Colors.FIR]))
    }
}
//prezForest.drawForest(context)

var prezForestCopy = prezForest.cloneForest()

prezForestCopy.drawForest(context)

/* ДЕМОНСТРАЦИЯ ГОРЯЩЕГО ЛЕСА */
var prezStartButton = document.getElementById('prezStart')
var prezStartFlag = true
prezStartButton.addEventListener('click', function () {
    if (prezStartFlag) {
        prezStartButton.textContent = 'Стоп'
        prezStartFlag = false
    } else {
        prezStartButton.textContent = 'Старт'
        prezStartFlag = true
    }
    prezForestCopy.burnPlant(context, Math.floor(cols / 2), Math.floor(rows / 2))
    var intervalId = setInterval(function () {
        if (prezStartFlag) {
            clearInterval(intervalId)
        }

        //копирование списка ячеек
        var forestCopy = prezForestCopy.cloneForest()

        //распространение пожара на одну итерацию
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var pl = forestCopy.forestArray[i][j]
                if (pl.plantColor == Colors.FIRE) {
                    prezForestCopy.burnPlant(context, j, i)
                }
            }
        }

        //проверка на конец пожара
        var f = true
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (prezForestCopy.forestArray[i][j].plantColor == Colors.FIRE) {
                    f = false
                    break
                }
            }
        }

        //зацикливание анимации
        if (f) {
            prezForestCopy = prezForest.cloneForest()
            prezForestCopy.drawForest(context)
            prezForestCopy.burnPlant(context, Math.floor(cols / 2), Math.floor(rows / 2))
        }
    }, interval)
})