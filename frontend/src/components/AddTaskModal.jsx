import { useState } from 'react'
// Components
import Modal from './ui/Modal'
import Button from './ui/Button'

const defaultCategories = [
    'work', 
    'study', 
    'reminders', 
    'urgent'
]

export default function AddTaskModal({ open, onClose, onSave, categories = defaultCategories }) {
    // States for form inputs
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [category, setCategory] = useState(categories[0])

    // Validation
    const canSubmit = title.trim() && date

    // Function to reset form
    const reset = () => {
        setTitle('')
        setDescription('')
        setDate('')
        setCategory(categories[0])
    }

    // Function to handle save
    const handleSave = (e) => {
        e.preventDefault()
        if (!canSubmit) return
        onSave({
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            date,
            category,
            completed: false
        })
        reset()
        onClose()
    }

    return (
        <Modal open={open} onClose={() => { reset(); onClose() }} title="Add New Task">
            <form className="modal-form" onSubmit={handleSave} aria-label="task-form">
                <label>
                    Title
                    <input 
                        aria-label="title-input" 
                        placeholder="Title" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                    />
                </label>
                <label>
                    Description
                    <textarea 
                        aria-label="description-input" 
                        placeholder="Description (optional)" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                    />
                </label>
                <label>
                    Date
                    <input 
                        aria-label="date-input" 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)} 
                    />
                </label>
                <label>
                    Category
                    <select 
                        aria-label="category-select" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                    >
                        {categories.map(c => 
                            <option key={c} value={c}>{c}</option>
                        )}
                    </select>
                </label>
                <div className="modal-actions">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => { reset(); onClose() }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={!canSubmit}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
