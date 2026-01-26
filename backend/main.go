package main

import (
    "encoding/json"
    "log"
    "net/http"
)

type Health struct {
    Status string `json:"status"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(Health{Status: "ok"})
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/api/health", healthHandler)

    log.Println("Backend listening on :8080")
    if err := http.ListenAndServe(":8080", mux); err != nil {
        log.Fatal(err)
    }
}
