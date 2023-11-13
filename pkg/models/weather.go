package models

import (
	"math"
)

/* Погодные условия */
type Weather struct {
	Wind                     Wind
	Temperature              Temperature
	AirHumidity              AirHumidity
	AtmosphericPrecipitation AtmosphericPrecipitation
}

//вычисление температуры точки росы
func (w Weather) DewPointTemperature() float64 {
	if w.Temperature.DegreesCelsius > 0 {
		//a, b - константные значения
		a := 17.27
		b := 237.7
		T := float64(w.Temperature.DegreesCelsius)
		RH := float64(w.AirHumidity.Percent)

		gamma := func(T float64, RH float64) float64 {
			return a*T/(b+T) + math.Log(RH/100)
		}

		dewPoint := b * gamma(T, RH) / (a - gamma(T, RH))

		return dewPoint
	} else {
		return 0
	}
}

//определение показателя пожарной опасности и класса пожарной опасности
func (w Weather) FireDangerCoefficientAndClass() (int, int) {
	dewPointTemperature := w.DewPointTemperature()
	dryTemperature := float64(w.Temperature.DegreesCelsius)
	sc := w.Wind.SpeedCoefficient()
	//вычисление КП
	fireCoefficient := int(sc * dryTemperature * (dryTemperature - dewPointTemperature))

	//потухнет ли пожар из-за атмосферных осадков?
	_, isGoneOut := w.AtmosphericPrecipitation.OverwhelmingPrecipitation(fireCoefficient)
	if isGoneOut {
		fireCoefficient = 0
	}

	class := fireClass(fireCoefficient)

	return fireCoefficient, class
}

//по коэффициенту пожарной опасности определяет
//класс пожарной опасности
func fireClass(fireCoefficient int) int {
	var class int

	if fireCoefficient < 1 {
		class = 0
	} else if fireCoefficient >= 1 && fireCoefficient <= 300 {
		class = 1
	} else if fireCoefficient <= 1000 {
		class = 2
	} else if fireCoefficient <= 4000 {
		class = 3
	} else if fireCoefficient <= 10000 {
		class = 4
	} else {
		class = 5
	}

	return class
}
