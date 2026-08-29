import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ExercisePage } from '../ExercisePage';
import { AuthContext } from '../../context/AuthContext';

const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' };

const mockAuthContext = {
  user: mockUser,
  login: () => {},
  logout: () => {},
  register: () => {},
};

describe('ExercisePage', () => {
  it('should render exercise title and description', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ExercisePage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Code Editor')).toBeInTheDocument();
    });
  });

  it('should have Run Code and Submit buttons', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ExercisePage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Run Code/)).toBeInTheDocument();
      expect(screen.getByText(/Submit/)).toBeInTheDocument();
    });
  });

  it('should display test results section', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <ExercisePage />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Results')).toBeInTheDocument();
    });
  });
});
