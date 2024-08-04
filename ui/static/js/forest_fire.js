const Colors = {
    GRASS: '#5da130',
    DECIDUOUS_TREE: '#228b22',
    FIR: '#2a5c03',
    FIRE: 'yellow',
    ASH: 'gray',
    WATER: 'blue'
}

const Direction = {
    NORTH: 'north',
    SOUTH: 'south',
    EAST: 'east',
    WEST: 'west'
}

//получение изображений
var decdTree = document.getElementById('deciduous_tree')
var fire = document.getElementById('fire')
var burntTree = document.getElementById('burnt_tree')
var grass = document.getElementById('grass')
var fir = document.getElementById('fir')

class Plant {
    constructor(coordX, coordY, fireResistance, plantColor) {
        this.coordX = coordX
        this.coordY = coordY
        this.fireResistance = fireResistance
        this.plantColor = plantColor
    }

    clonePlant() {
        var newPlant = new Plant(this.coordX, this.coordY,
            this.fireResistance, this.plantColor)
        return newPlant
    }

    drawPlant(ctx, indent = 0, dimension = 25) {
        var originalFillStyle = ctx.fillStyle
        ctx.fillStyle = this.plantColor
        ctx.fillRect(indent + this.coordX * dimension,
            indent + this.coordY * dimension, dimension, dimension)
        ctx.fillStyle = originalFillStyle
        switch (this.plantColor) {
            case Colors.GRASS:
                ctx.drawImage(grass, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                this.fireResistance = 10
                break
            case Colors.DECIDUOUS_TREE:
                ctx.drawImage(decdTree, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                this.fireResistance = getRandomArbitrary(50, 60)
                break
            case Colors.FIR:
                ctx.drawImage(fir, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                this.fireResistance = getRandomArbitrary(40, 50)
                break
            case Colors.FIRE:
                ctx.drawImage(fire, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                break
            case Colors.ASH:
                ctx.drawImage(burntTree, indent + this.coordX * dimension, indent + this.coordY * dimension, dimension, dimension)
                break
        }
    }
}

class Forest {
    constructor(cols, rows) {
        this.forestArray = []
        this.cols = cols
        this.rows = rows

        for (var i = 0; i < this.rows; i++) {
            this.forestArray[i] = []
        }
    }

    generateAndDrawForest(ctx) {
        this.generateForest()
        this.drawForest(ctx)
    }

    generateForest() {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var plant = new Plant(j, i, 10, getRandomElem([Colors.GRASS, Colors.DECIDUOUS_TREE, Colors.FIR]))
                if (i == j) {
                    plant.plantColor = Colors.WATER
                }
                this.forestArray[i][j] = plant
            }
        }
    }

    drawForest(ctx) {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                this.forestArray[i][j].drawPlant(ctx)
            }
        }
    }

    cloneForest() {
        var newForest = new Forest(this.cols, this.rows)
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.rows; j++) {
                newForest.forestArray[i][j] = this.forestArray[i][j].clonePlant()
            }
        }
        return newForest
    }

    burnPlant(ctx, X, Y, windSpeed = 0, windDirection = Direction.WEST, fireCoefficient = 0) {
        var weatherCoefficient = 1 + fireCoefficient / 100
        weatherCoefficient = weatherCoefficient / 100 + 1

        ctx.fillStyle = Colors.ASH
        var t
        if (X < this.cols && Y < this.rows) {
            if (X >= 0 && Y >= 0) {
                t = this.forestArray[Y][X]
                if (t.plantColor != Colors.WATER) {
                    t.fireResistance = t.fireResistance - weatherCoefficient
                    if (t.fireResistance > 0) {
                        t.plantColor = Colors.FIRE
                    } else {
                        t.fireResistance = 0
                        t.plantColor = Colors.ASH
                    }
                    t.drawPlant(ctx)
                } else {
                    return
                }

                if (Y < this.rows - 1) {
                    if (windDirection != Direction.NORTH || windSpeed == 0) {
                        t = this.forestArray[Y + 1][X]
                        if (t.plantColor != Colors.WATER) {
                            t.fireResistance = t.fireResistance - weatherCoefficient
                            if (t.fireResistance > 0) {
                                t.plantColor = Colors.FIRE
                            } else {
                                t.fireResistance = 0
                                t.plantColor = Colors.ASH
                            }
                            t.drawPlant(ctx)
                        }
                    }
                }

                if (X < this.cols - 1) {
                    if (windDirection != Direction.WEST || windSpeed == 0) {
                        t = this.forestArray[Y][X + 1]
                        if (t.plantColor != Colors.WATER) {
                            t.fireResistance = t.fireResistance - weatherCoefficient
                            if (t.fireResistance > 0) {
                                t.plantColor = Colors.FIRE
                            } else {
                                t.fireResistance = 0
                                t.plantColor = Colors.ASH
                            }
                            t.drawPlant(ctx)
                        }
                    }
                }
            }

            if (X > 0 && Y >= 0) {
                if (windDirection != Direction.EAST || windSpeed == 0) {
                    t = this.forestArray[Y][X - 1]
                    if (t.plantColor != Colors.WATER) {
                        t.fireResistance = t.fireResistance - weatherCoefficient
                        if (t.fireResistance > 0) {
                            t.plantColor = Colors.FIRE
                        } else {
                            t.fireResistance = 0
                            t.plantColor = Colors.ASH
                        }
                        t.drawPlant(ctx)
                    }
                }
            }

            if (Y > 0 && X >= 0) {
                if (windDirection != Direction.SOUTH || windSpeed == 0) {
                    t = this.forestArray[Y - 1][X]
                    if (t.plantColor != Colors.WATER) {
                        t.fireResistance = t.fireResistance - weatherCoefficient
                        if (t.fireResistance > 0) {
                            t.plantColor = Colors.FIRE
                        } else {
                            t.fireResistance = 0
                            t.plantColor = Colors.ASH
                        }
                        t.drawPlant(ctx)
                    }
                }
            }
        }
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomElem(list) {
    return list[Math.floor((Math.random() * list.length))];
}