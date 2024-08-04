package models

/* Ветер */
type Wind struct {
	Speed     int //скорость ветра в м/c
	Direction     //направление ветра по сторонам света
}

func NewWind() Wind {
	return Wind{
		Speed:     0,
		Direction: North,
	}
}

func (w Wind) SpeedCoefficient() float64 {
	coefficients := map[int]float64{
		0: 1.00, 1: 1.02, 2: 1.04, 3: 1.07,
		4: 1.11, 5: 1.07, 6: 1.22, 7: 1.28,
		8: 1.32, 9: 1.36, 10: 1.39, 11: 1.41,
		12: 1.43, 13: 1.45, 14: 1.46, 15: 1.47,
		16: 1.48,
	}

	cof, ok := coefficients[w.Speed]
	if ok {
		return cof
	} else if w.Speed > 16 {
		return 1.99
	} else {
		return 0.0
	}
}

// func (w Wind) Speed() int {
// 	return w.speed
// }

// func (w Wind) SetSpeed(speed int) error {
// 	if speed >= 0 {
// 		w.speed = speed
// 		return nil
// 	} else {
// 		return errors.New("parameter < 0")
// 	}
// }
