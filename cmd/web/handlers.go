package main

import (
	"fmt"
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

func (app *application) createSnippet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		app.clientError(w, http.StatusMethodNotAllowed)
		return
	}

	w.Write([]byte("Создание новой заметки..."))
}

func (app *application) showSnippet(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Query().Get("id")) //получение id из URL
	if err != nil || id < 1 {
		app.notFound(w)
		return
	}

	fmt.Fprintf(w, "Отображение определенной заметки с ID %d...", id)
}
