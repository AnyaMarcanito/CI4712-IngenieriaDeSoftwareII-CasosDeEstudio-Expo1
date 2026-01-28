package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Task represents a task item
type Task struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"`
	Category    string `json:"category"`
	Completed   bool   `json:"completed"`
}

// tasksFile is the path to the JSON file storing tasks
// tasksMu protects access to the tasks file when concurrent requests occur
var (
	tasksFile = filepath.Join("data", "tasks.json")
	tasksMu   sync.Mutex
)

// loadTasks reads tasks from the JSON file
func loadTasks() ([]Task, error) {
	// Read the file
	data, err := os.ReadFile(tasksFile)

	// If file does not exist, return empty slice
	if err != nil {
		if os.IsNotExist(err) {
			return []Task{}, nil
		}
		return nil, err
	}

	// If file is empty, return empty slice
	if len(data) == 0 {
		return []Task{}, nil
	}

	// If file has data, unmarshal it
	var tasks []Task
	if err := json.Unmarshal(data, &tasks); err != nil {
		return nil, err
	}

	// Sort tasks by date
	sort.SliceStable(tasks, func(i, j int) bool {
		return tasks[i].Date < tasks[j].Date
	})
	return tasks, nil
}

// saveTasks writes tasks to the JSON file
func saveTasks(tasks []Task) error {
	// Ensure the directory exists
	if err := os.MkdirAll(filepath.Dir(tasksFile), 0o755); err != nil {
		return err
	}
	// Marshal and write the file
	data, err := json.MarshalIndent(tasks, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(tasksFile, data, 0o644)
}

// parseTaskID extracts the task ID from the request URL
// or query parameters
func parseTaskID(r *http.Request) (int64, error) {
	idStr := r.URL.Query().Get("id")
	// If not in query, try to extract from URL path
	if idStr == "" {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) >= 3 && parts[0] == "api" && parts[1] == "tasks" {
			idStr = parts[2]
		}
	}
	// If still empty, return error
	if idStr == "" {
		return 0, errors.New("missing id")
	}
	return strconv.ParseInt(idStr, 10, 64)
}

// tasksHandler handles /api/tasks endpoint for GET, POST, DELETE methods
func tasksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case http.MethodGet:
		tasksMu.Lock()
		defer tasksMu.Unlock()
		tasks, err := loadTasks()
		if err != nil {
			http.Error(w, "failed to load tasks", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(tasks)
	case http.MethodPost:
		var t Task
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, "invalid json", http.StatusBadRequest)
			return
		}
		if strings.TrimSpace(t.Title) == "" || strings.TrimSpace(t.Date) == "" {
			http.Error(w, "title and date are required", http.StatusBadRequest)
			return
		}
		if t.ID == 0 {
			t.ID = time.Now().UnixMilli()
		}

		tasksMu.Lock()
		defer tasksMu.Unlock()
		tasks, err := loadTasks()
		if err != nil {
			http.Error(w, "failed to load tasks", http.StatusInternalServerError)
			return
		}
		tasks = append([]Task{t}, tasks...)
		if err := saveTasks(tasks); err != nil {
			http.Error(w, "failed to save task", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(t)
	case http.MethodDelete:
		id, err := parseTaskID(r)
		if err != nil {
			http.Error(w, "missing id", http.StatusBadRequest)
			return
		}
		tasksMu.Lock()
		defer tasksMu.Unlock()
		tasks, err := loadTasks()
		if err != nil {
			http.Error(w, "failed to load tasks", http.StatusInternalServerError)
			return
		}
		next := make([]Task, 0, len(tasks))
		found := false
		for _, t := range tasks {
			if t.ID == id {
				found = true
				continue
			}
			next = append(next, t)
		}
		if !found {
			http.Error(w, "task not found", http.StatusNotFound)
			return
		}
		if err := saveTasks(next); err != nil {
			http.Error(w, "failed to save tasks", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

// main sets up the HTTP server and routes
func main() {
	// Set up HTTP routes
	mux := http.NewServeMux()

	// Here we register the handlers to their respective endpoints
	mux.HandleFunc("/api/tasks", tasksHandler)
	mux.HandleFunc("/api/tasks/", tasksHandler)

	log.Println("Backend listening on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}
}
