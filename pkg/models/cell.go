package models

/* Ячейка */
type Cell struct {
	CoordX         int
	CoordY         int
	IsCanBurn      bool   //она может гореть?
	FireResistance int    //огнеупорность
	Color          string //примеры: #228b22, 'black'
}
