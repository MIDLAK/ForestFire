package models

/*Перечисление сторон света*/
type Direction int

const (
	North Direction = iota + 1 //EnumIndex = 1
	East                       //EnumIndex = 2
	South                      //EnumIndex = 3
	West                       //EnumIndex = 4
)

func (d Direction) String() string {
	return [...]string{"North", "East", "South", "West"}[d-1]
}

func (d Direction) EnumIndex() int {
	return int(d)
}

/*Модель ветра*/
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

/*Модель ячейки*/
type Cell struct {
	CoordX         int
	CoordY         int
	IsCanBurn      bool   //оно может гореть?
	FireResistance int    //огнеупорность
	Color          string //примеры: #228b22, 'black'
}
