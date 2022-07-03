package main

import (
	"GoTest/pkg/models"
	"encoding/json"
	"html/template"
	"net/http"
	"strconv"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	//реакция на несуществующие страницы
	if r.URL.Path != "/" {
		app.notFound(w)
		return
	}

	// Инициализируем срез содержащий пути к файлам
	// файл home.page.tmpl должен быть *первым* файлом в срезе
	files := []string{
		"./ui/html/home.page.html",
		"./ui/html/base.layout.html",
		"./ui/html/footer.partial.html",
	}

	//чтение файла из шаблона
	ts, err := template.ParseFiles(files...)
	if err != nil {
		app.serverError(w, err)
		return
	}

	//запись шаблона в тело HTTP запроса
	err = ts.Execute(w, nil)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

//обработчик /details
func (app *application) details(w http.ResponseWriter, r *http.Request) {
	files := []string{
		"./ui/html/details.page.html",
		"./ui/html/base.layout.html",
		"./ui/html/footer.partial.html",
	}

	//чтение файла из шаблона
	ts, err := template.ParseFiles(files...)
	if err != nil {
		app.serverError(w, err)
		return
	}

	//запись шаблона в тело HTTP запроса
	err = ts.Execute(w, nil)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

//обработчик /model
func (app *application) model(w http.ResponseWriter, r *http.Request) {
	files := []string{
		"./ui/html/model.page.html",
		"./ui/html/base.layout.html",
		"./ui/html/footer.partial.html",
	}

	//чтение файла из шаблона
	ts, err := template.ParseFiles(files...)
	if err != nil {
		app.serverError(w, err)
		return
	}

	//запись шаблона в тело HTTP запроса
	err = ts.Execute(w, nil)
	if err != nil {
		app.serverError(w, err)
		return
	}
}

type WindDataInput struct {
	Speed     string
	Direction string
}

func (app *application) getWeather(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		app.clientError(w, http.StatusMethodNotAllowed)
		return
	}

	//получение данных
	var windInput WindDataInput
	err := json.NewDecoder(r.Body).Decode(&windInput)
	if err != nil {
		app.serverError(w, err)
	}

	//формирование ответа
	windOutput := models.NewWind()
	speed, err := strconv.Atoi(windInput.Speed)
	if err != nil {
		app.serverError(w, err)
		return
	}
	windOutput.Speed = speed
	//err = windOutput.SetSpeed(14)
	// app.infoLog.Printf("speed = %d", speed)
	// app.infoLog.Printf("windOutput.Speed = %v", windOutput.Speed)

	if err != nil {
		app.serverError(w, err)
		return
	}

	switch windInput.Direction {
	case "North":
		windOutput.Direction = models.North
	case "East":
		windOutput.Direction = models.East
	case "South":
		windOutput.Direction = models.South
	case "West":
		windOutput.Direction = models.West
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(windOutput)
}
