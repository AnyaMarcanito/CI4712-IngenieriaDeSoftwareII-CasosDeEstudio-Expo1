import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskBoard from '../components/TaskBoard'

// Dataset mock 
// Objeto o función simulada que reemplaza a la real para controlar 
// el comportamiento en pruebas
const mockTasks = [
  { id: 1, title: 'Video del ambiente', description: 'Grabar un video del ambiente de trabajo funcional', date: '2026-01-29', category: 'reminders', completed: false },
  { id: 2, title: 'Investigacion para la expo', description: 'Buscar información relevante para la exposición', date: '2026-01-30', category: 'study', completed: false },
  { id: 3, title: 'Finalizar el reporte', description: '', date: '2026-01-30', category: 'study', completed: true }
]

// Mock para la API fetch
beforeEach(() => {
  // Mock de fetch para diferentes endpoints y métodos HTTP
  global.fetch = jest.fn((url, options = {}) => {
    // Determina el método HTTP, por defecto es GET
    const method = (options.method || 'GET').toUpperCase()
    // Si es una solicitud GET a /api/tasks, devuelve las tareas mockeadas
    if (url.endsWith('/api/tasks') && method === 'GET') {
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify(mockTasks))
      })
    }
    // Si es una solicitud POST a /api/tasks, simula la creación de una tarea
    if (url.endsWith('/api/tasks') && method === 'POST') {
      const body = JSON.parse(options.body || '{}')
      return Promise.resolve({
        ok: true,
        status: 201, // Created
        json: () => Promise.resolve({ ...body, id: 999 })
      })
    }
    // Si es una solicitud DELETE a /api/tasks/:id, simula la eliminación
    if (url.includes('/api/tasks/') && method === 'DELETE') {
      return Promise.resolve({ 
        ok: true, 
        status: 204, // No Content
        text: () => Promise.resolve('') })
    }
    // Respuesta por defecto para otras solicitudes
    return Promise.resolve({ 
      ok: false, 
      status: 500, 
      text: () => Promise.resolve('error') 
    })
  })
})

// Reseteamos los mocks después de cada prueba
afterEach(() => {
  jest.resetAllMocks()
})

// 1) Render inicial y cambio de tabs (ToDo/Done)
it('renders initial tasks and switches tabs', async () => {
  // Renderiza el componente TaskBoard
  render(<TaskBoard />)
  // Espera a que aparezca una tarea específica en la lista ToDo
  // El selector asegura que el texto: "Video del ambiente" esté 
  // dentro de un elemento con clase "task-title"
  await screen.findByText(/Video del ambiente/i, { selector: '.task-title' })
  // Verifica que la tarea "Finalizar el reporte" no esté en ToDo
  expect(screen.queryByText(/Finalizar el reporte/i)).not.toBeInTheDocument()
  // Cambia a la pestaña Done
  await userEvent.click(screen.getByRole('tab', { name: /Done/i }))
  // Verifica que la tarea "Finalizar el reporte" ahora esté visible
  expect(screen.getByText(/Finalizar el reporte/i)).toBeInTheDocument()
})

// 2) Agrega una tarea y la muestra en la lista
it('adds a task and appears in todo list', async () => {
  // Renderiza el componente TaskBoard
  render(<TaskBoard />)
  // Espera a que aparezca una tarea específica en la lista ToDo
  await screen.findByText(/Video del ambiente/i, { selector: '.task-title' })
  // Abre el modal para agregar una nueva tarea
  await userEvent.click(screen.getByLabelText('add-task'))
  // Rellena el formulario del modal
  await userEvent.type(screen.getByLabelText('title-input'), 'New Task')
  await userEvent.type(screen.getByLabelText('description-input'), 'desc')
  await userEvent.type(screen.getByLabelText('date-input'), '2026-02-01')
  await userEvent.selectOptions(screen.getByLabelText('category-select'), 'work')
  // Guarda la nueva tarea
  await userEvent.click(screen.getByRole('button', { name: /Save/i }))
  // Verifica que la nueva tarea aparezca en la lista ToDo
  expect(await screen.findByText(/New Task/i)).toBeInTheDocument()
})

// 3) Filtra por categoría y por búsqueda
it('filters by category and search', async () => {
  // Renderiza el componente TaskBoard
  render(<TaskBoard />)
  // Espera a que aparezca una tarea específica en la lista ToDo
  await screen.findByText(/Video del ambiente/i, { selector: '.task-title' })
  // Filtra por categoría "reminders"
  await userEvent.click(screen.getByRole('button', { name: /reminders/i }))
  // Verifica que solo aparezca la tarea correspondiente a esa categoría
  expect(screen.getByText(/Video del ambiente/i, { selector: '.task-title' })).toBeInTheDocument()
  // Filtra por búsqueda "Investigacion"
  await userEvent.click(screen.getByRole('button', { name: /^all$/i }))
  await userEvent.type(screen.getByLabelText('search-input'), 'Investigacion')
  // Verifica que solo aparezca la tarea correspondiente a la búsqueda
  expect(screen.getByText(/Investigacion para la expo/i, { selector: '.task-title' })).toBeInTheDocument()
})

// 4) Marca completada y la mueve a Done
it('mark task complete moves it to done', async () => {
  // Renderiza el componente TaskBoard
  render(<TaskBoard />)
  // Espera a que aparezca una tarea específica en la lista ToDo
  await screen.findByText(/Investigacion para la expo/i, { selector: '.task-title' })
  // Encuentra "Investigacion para la expo" y marca como completada
  // Usamos closest para obtener el contenedor del ítem de tarea para poder marcarla como completada
  const item = screen.getByText(/Investigacion para la expo/i, { selector: '.task-title' }).closest('[aria-label="task-item"]')
  const checkbox = item.querySelector('[aria-label="complete-checkbox"]')
  await userEvent.click(checkbox)
  // Verifica que la tarea ya no esté en ToDo
  expect(screen.queryByText(/Investigacion para la expo/i)).not.toBeInTheDocument()
  // Cambia a la pestaña "Done"
  await userEvent.click(screen.getByRole('tab', { name: /Done/i }))
  // Verifica que la tarea ahora esté en Done
  expect(screen.getByText(/Investigacion para la expo/i)).toBeInTheDocument()
})

// 5) Elimina una tarea
it('deletes a task', async () => {
  // Renderiza el componente TaskBoard
  render(<TaskBoard />)
  // Espera a que aparezca una tarea específica en la lista ToDo
  await screen.findByText(/Video del ambiente/i, { selector: '.task-title' })
  // Encuentra "Video del ambiente" y la elimina
  const item = screen.getByText(/Video del ambiente/i, { selector: '.task-title' }).closest('[aria-label="task-item"]')
  // Selecciona el botón de eliminar dentro del ítem de tarea
  const delBtn = item.querySelector('[aria-label="delete-button"]')
  await userEvent.click(delBtn)
  // Verifica que la tarea ya no esté en el documento
  // Usamos waitFor porque la eliminación puede ser asíncrona
  await waitFor(() => {
    expect(screen.queryByText(/Video del ambiente/i)).not.toBeInTheDocument()
  })
})
