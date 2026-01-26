package main

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestHealthHandler(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/api/health", nil)
    w := httptest.NewRecorder()

    healthHandler(w, req)

    if w.Code != http.StatusOK {
        t.Fatalf("expected status 200, got %d", w.Code)
    }

    var h Health
    if err := json.NewDecoder(w.Body).Decode(&h); err != nil {
        t.Fatalf("failed to decode response: %v", err)
    }

    if h.Status != "ok" {
        t.Fatalf("expected status 'ok', got '%s'", h.Status)
    }
}
