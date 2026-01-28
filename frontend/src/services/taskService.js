const baseUrl = '/api/tasks'

// Fetch all tasks from the backend
export async function fetchTasks() {
  const res = await fetch(baseUrl)
  if (!res.ok) {
    const text = await res.text()
    console.error('Fetch tasks failed:', res.status, text)
    throw new Error('Failed to fetch tasks')
  }
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch (err) {
    console.error('Fetch tasks response (raw):', text)
    throw err
  }
}

// Create a new task in the backend
export async function createTask(task) {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('Create task failed:', res.status, text)
    throw new Error('Failed to create task')
  }
  return res.json()
}

// Delete a task by ID in the backend
export async function deleteTask(id) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok && res.status !== 204) {
    const text = await res.text()
    console.error('Delete task failed:', res.status, text)
    throw new Error('Failed to delete task')
  }
}
