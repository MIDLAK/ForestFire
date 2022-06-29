package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

//зависимости веб-приложения
type application struct {
	errorLog *log.Logger
	infoLog  *log.Logger
}

func main() {
	//флаг командной строки для адреса со значениями по умолчанию
	addr := flag.String("addr", ":3000", "Сетевой адрес HTTP")
	flag.Parse()

	//создание логгеров
	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errorLog := log.New(os.Stderr, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	//инициализация структуры с зависимостями приложения
	app := &application{
		errorLog: errorLog,
		infoLog:  infoLog,
	}

	//инициализация новвй структуры http.Server
	srv := &http.Server{
		Addr:     *addr,
		ErrorLog: errorLog,
		Handler:  app.routes(), //получение маршрутизатора
	}

	infoLog.Printf("Запуск веб-сервера на %v", *addr)
	err := srv.ListenAndServe()
	errorLog.Fatal(err)
}

type neuteredFileSystem struct {
	fs http.FileSystem
}

//вызвается каждый раз, когда FileServer получает запрос
//и защищает от прямого перехода в папку со статическими файлами
func (nfs neuteredFileSystem) Open(path string) (http.File, error) {
	f, err := nfs.fs.Open(path)
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	s, _ := f.Stat()
	if s.IsDir() {
		index := filepath.Join(path, "index.html")
		if _, err := nfs.fs.Open(index); err != nil {
			closeErr := f.Close()
			if closeErr != nil {
				return nil, closeErr
			}

			return nil, err
		}
	}

	return f, nil
}
