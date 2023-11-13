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

type WeatherDataInput struct {
	Speed                    string
	Direction                string
	AirHumidity              string
	Temperature              string
	AtmosphericPrecipitation string
}

type OutputData struct {
	Wind                     models.Wind
	Temperature              models.Temperature
	AirHumidity              models.AirHumidity
	AtmosphericPrecipitation models.AtmosphericPrecipitation
	TimeInterval             int
	FireCoefficient          int
	FireClass                int
}

func (app *application) getWeather(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		app.clientError(w, http.StatusMethodNotAllowed)
		return
	}

	//получение данных
	var weatherInput WeatherDataInput
	err := json.NewDecoder(r.Body).Decode(&weatherInput)
	if err != nil {
		app.serverError(w, err)
	}

	/*Получение вводных*/
	//ветер
	windOutput := models.NewWind()
	speed, err := strconv.Atoi(weatherInput.Speed)
	if err != nil {
		app.serverError(w, err)
		return
	}
	windOutput.Speed = speed

	switch weatherInput.Direction {
	case "North":
		windOutput.Direction = models.North
	case "East":
		windOutput.Direction = models.East
	case "South":
		windOutput.Direction = models.South
	case "West":
		windOutput.Direction = models.West
	}

	//температура
	temperature, err := strconv.Atoi(weatherInput.Temperature)
	if err != nil {
		app.serverError(w, err)
		return
	}
	temperatureOutput := models.Temperature{
		DegreesCelsius: temperature,
	}

	//влажность
	humidity, err := strconv.Atoi(weatherInput.AirHumidity)
	if err != nil {
		app.serverError(w, err)
		return
	}
	airHumidityOutput := models.AirHumidity{
		Percent: humidity,
	}

	//осадки
	precipitation, err := strconv.Atoi(weatherInput.AtmosphericPrecipitation)
	if err != nil {
		app.serverError(w, err)
		return
	}
	atmosphericPrecipitationOutput := models.AtmosphericPrecipitation{
		Millimeters: precipitation,
	}

	//погода в целом
	weatherOutput := models.Weather{
		Wind:                     windOutput,
		Temperature:              temperatureOutput,
		AirHumidity:              airHumidityOutput,
		AtmosphericPrecipitation: atmosphericPrecipitationOutput,
	}

	/* Формирование ответа браузерной части приложения */
	cof, class := weatherOutput.FireDangerCoefficientAndClass()
	q, _ := atmosphericPrecipitationOutput.OverwhelmingPrecipitation(cof)
	interval := 3000 - windOutput.Speed*100 + q*100
	outputData := OutputData{
		Wind:                     windOutput,
		Temperature:              temperatureOutput,
		AirHumidity:              airHumidityOutput,
		AtmosphericPrecipitation: atmosphericPrecipitationOutput,
		TimeInterval:             interval,
		FireCoefficient:          cof,
		FireClass:                class,
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(outputData)
}
