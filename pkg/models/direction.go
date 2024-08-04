package models

/* Перечисление сторон света */
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
