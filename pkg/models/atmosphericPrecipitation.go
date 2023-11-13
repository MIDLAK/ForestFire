package models

/* Атмосферные осадки */
type AtmosphericPrecipitation struct {
	Millimeters int
}

//количество осадков, при которых сбрасывается пожарная опасность
func (a AtmosphericPrecipitation) OverwhelmingPrecipitation(fireCoefficient int) (int, bool) {
	var quantity int

	if fireCoefficient <= 300 {
		quantity = 3
	} else if fireCoefficient <= 1000 {
		quantity = 6
	} else if fireCoefficient <= 2000 {
		quantity = 4
	} else if fireCoefficient <= 3000 {
		quantity = 5
	} else if fireCoefficient <= 4000 {
		quantity = 6
	} else if fireCoefficient <= 5000 {
		quantity = 7
	} else if fireCoefficient <= 6000 {
		quantity = 8
	} else if fireCoefficient <= 7000 {
		quantity = 9
	} else if fireCoefficient <= 8000 {
		quantity = 10
	} else if fireCoefficient <= 9000 {
		quantity = 11
	} else if fireCoefficient <= 10000 {
		quantity = 12
	} else if fireCoefficient <= 11000 {
		quantity = 13
	} else if fireCoefficient <= 12000 {
		quantity = 14
	} else {
		quantity = 15
	}

	var isGoneOut = false //пожар погаснет?
	if a.Millimeters >= quantity {
		isGoneOut = true
	}

	return quantity, isGoneOut
}
