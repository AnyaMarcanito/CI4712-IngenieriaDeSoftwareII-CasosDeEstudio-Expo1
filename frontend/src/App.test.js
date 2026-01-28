import { render, screen } from '@testing-library/react';
import App from './App';

// Test para verificar que el componente App renderiza correctamente el 
// TaskBoard
test('renders task board', async () => {
  // Renderiza el componente App
  render(<App />);
  // Verifica que el texto "Task Board" esté en el documento
  expect(await screen.findByText(/Task Board/i)).toBeInTheDocument();
});
