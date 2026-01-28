import { useEffect, useMemo, useState } from 'react'
// Components
import AddTaskModal from './AddTaskModal'
import TaskItem from './TaskItem'
import noTaskGif from '../assets/noTask.gif'
// Services
import { fetchTasks, createTask, deleteTask as deleteTaskApi } from '../services/taskService'
// Styles
import './TaskBoard.css'

const categories = [
    'work', 
    'study', 
    'reminders', 
    'urgent'
]

export default function TaskBoard() {
    // States
    const [tasks, setTasks] = useState([])
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [tab, setTab] = useState('todo')
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        let active = true
        fetchTasks()
            .then((data) => {
                if (active) setTasks(data)
            })
            .catch((err) => {
                console.error(err)
            })
        return () => { active = false }
    }, [])

    // Handlers
    const addTask = async (t) => {
        try {
            const created = await createTask(t)
            setTasks(prev => [created, ...prev])
        } catch (err) {
            console.error(err)
        }
    }
    const deleteTask = async (id) => {
        try {
            await deleteTaskApi(id)
            setTasks(prev => prev.filter(t => t.id !== id))
        } catch (err) {
            console.error(err)
        }
    }
    const toggleComplete = (id) => 
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))

    // Filtered tasks based on tab, category and search
    const filtered = useMemo(() => {
        const byTab = tasks.filter(t => tab === 'todo' ? !t.completed : t.completed)
        const byCat = filterCategory === 'all' ? byTab : byTab.filter(t => t.category === filterCategory)
        const q = search.trim().toLowerCase()
        if (!q) return byCat
        return byCat.filter(t => (t.title + ' ' + (t.description || '')).toLowerCase().includes(q))
    }, [tasks, tab, filterCategory, search])

    return (
        <div className="tb-root">
            <header className="tb-header">
                <h2 className="tb-title">Task Board</h2>
                <div className="tb-header-right">
                    <button 
                        className="add-btn" 
                        aria-label="add-task" 
                        onClick={() => setModalOpen(true)}
                    >
                        +
                    </button>
                </div>
            </header>

            <div className="tb-controls">
                <div className="search-wrap">
                    <span className="search-icon" aria-hidden="true">🔍</span>
                    <input 
                        aria-label="search-input" 
                        className="input search-input" 
                        placeholder="Search tasks" 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                    />
                </div>
            </div>

            <div className="tb-filters" role="group" aria-label="filter-category">
                <button 
                    className={filterCategory === 'all' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilterCategory('all')}
                >
                    all
                </button>
                {categories.map(c => (
                    <button
                        key={c}
                        className={filterCategory === c ? 'filter-btn active' : 'filter-btn'}
                        onClick={() => setFilterCategory(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="tb-switch-row">
                <div 
                    className="tb-switch" 
                    role="tablist" 
                    aria-label="tablist"
                >
                    <button 
                        role="tab" 
                        aria-selected={tab==='todo'} 
                        className={tab==='todo' ? 'switch-btn active' : 'switch-btn'} 
                        onClick={() => setTab('todo')}
                    >
                        ToDo
                    </button>
                    <button 
                        role="tab" 
                        aria-selected={tab==='done'} 
                        className={tab==='done' ? 'switch-btn active' : 'switch-btn'} 
                        onClick={() => setTab('done')}
                    >
                        Done
                    </button>
                </div>
            </div>

            <div role="list" aria-label="task-list" className="task-list">
                {filtered.length === 0 ? (
                <div className="task-empty">
                    <img src={noTaskGif} alt="No tasks" className="task-empty-gif" />
                    <div className="task-empty-text">No Tasks</div>
                </div>
                ) : 
                    filtered.map(t => (
                    <TaskItem 
                        key={t.id} 
                        task={t} 
                        onToggleComplete={toggleComplete} 
                        onDelete={deleteTask} 
                    />
                ))}
            </div>

            <AddTaskModal 
                open={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onSave={addTask} 
                categories={categories} 
            />
        </div>
    )
}
