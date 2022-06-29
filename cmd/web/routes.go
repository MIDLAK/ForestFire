package main

import "net/http"

//регистрация маршрутов
func (app *application) routes() *http.ServeMux {
	mux := http.NewServeMux() //создание мультиплексора
	//регистрация обработчиков
	mux.HandleFunc("/", app.home)
	mux.HandleFunc("/snippet", app.showSnippet)
	mux.HandleFunc("/details", app.details)
	mux.HandleFunc("/model", app.model)
	mux.HandleFunc("/snippet/create", app.createSnippet)

	fileServer := http.FileServer(neuteredFileSystem{http.Dir("./ui/static")})
	mux.Handle("/static", http.NotFoundHandler())
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))

	return mux
}