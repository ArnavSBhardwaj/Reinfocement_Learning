/**
 * Basic test for the main App component.
 *
 * WHY: Verify that the app renders without crashing
 * HOW: Render the app and check for the main heading
 */

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders RL Playground app', () => {
  // Act - Render the app
  render(<App />);

  // Assert - Check that main heading is present
  const heading = screen.getByText(/RL Playground/i);
  expect(heading).toBeInTheDocument();
});
