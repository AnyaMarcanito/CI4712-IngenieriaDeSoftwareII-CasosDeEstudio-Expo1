package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Middleware simple para habilitar CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Permite que el frontend (puerto 5173 o 4173) acceda a la API
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Si es una peticion de verificacion (Preflight), respondemos OK y salimos
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// En backend/cmd/api/main.go
	// Esto busca el .env en la raiz, subiendo niveles segun sea necesario
    _ = godotenv.Load("../../../.env") // Si ejecutas desde cmd/api
    _ = godotenv.Load("../../.env")    // Si ejecutas desde backend
    _ = godotenv.Load(".env")          // Si ejecutas desde la raiz

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        getEnv("DB_HOST", "localhost"),
        getEnv("DB_PORT", "5435"),
        getEnv("DB_USER", "user_admin"),
        getEnv("DB_PASSWORD", "secret_password"),
        getEnv("DB_NAME", "mi_base_de_datos"),
    )

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Error de configuracion: ", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Printf("Aviso: No se pudo conectar a Postgres: %v", err)
	} else {
		fmt.Println("Conexion exitosa con PostgreSQL")
	}

	// Creamos un "Mux" (enrutador) para organizar las rutas
	mux := http.NewServeMux()

	mux.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"message": "API funcionando. Servidor activo."}`)
	})

	// Aplicamos el middleware de CORS a todas nuestras rutas
	handler := enableCORS(mux)

	addr := ":8080"
	fmt.Printf("Servidor escuchando en http://localhost%s\n", addr)
	
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal("El servidor no pudo iniciar: ", err)
	}
}

// Funcion auxiliar para dar valores por defecto si el .env falla
	func getEnv(key, fallback string) string {
		if value, ok := os.LookupEnv(key); ok {
			return value
		}
		return fallback
	}