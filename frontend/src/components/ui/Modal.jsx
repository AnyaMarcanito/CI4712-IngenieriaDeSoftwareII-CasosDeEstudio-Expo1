export default function Modal({ 
    open, 
    title, 
    onClose, 
    children 
}) {
    if (!open) return null
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal">
            <button 
                className="modal-close" 
                aria-label="close-modal" 
                onClick={onClose}
            >
                ×
            </button>
            {title && <h2 className="modal-title">{title}</h2>}
            {children}
        </div>
        </div>
    )
}
