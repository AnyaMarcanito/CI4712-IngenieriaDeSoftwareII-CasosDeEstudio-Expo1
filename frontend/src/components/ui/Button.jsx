export default function Button({ 
    variant = 'primary', 
    className = '', 
    ...props 
}) {
  const classes = ['btn']
  if (variant) classes.push(`btn-${variant}`)
  if (className) classes.push(className)
  return (
    <button 
        {...props} 
        className={classes.join(' ').trim()} 
    />
  )
}
