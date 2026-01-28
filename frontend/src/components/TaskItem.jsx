import Button from './ui/Button'

export default function TaskItem({ 
    task, 
    onToggleComplete, 
    onDelete 
}) {
    return (
        <div 
            role="listitem" 
            aria-label="task-item" 
            className={task.completed ? 'task-item is-completed' : 'task-item'}
        >
            <input 
                aria-label="complete-checkbox" 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => onToggleComplete(task.id)} 
            />
            <div className="task-main">
                <strong className="task-title">{task.title}</strong>
                {task.description && 
                    <span className="task-desc">{task.description}</span>
                }
            </div>
            <span className="task-date">{task.date}</span>
            <span className={`task-cat cat-${task.category}`}>{task.category}</span>
            <Button 
                aria-label="delete-button" 
                variant="danger" 
                onClick={() => onDelete(task.id)}
            >
                Delete
            </Button>
        </div>
    )
}
