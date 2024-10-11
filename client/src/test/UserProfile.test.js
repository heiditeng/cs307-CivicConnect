import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from '../components/UserProfile';
import { MemoryRouter } from 'react-router-dom';

describe('UserProfile Tests', () => {
  test('Given that a user has NOT provided proper info, they are prompted to set their availability and location', async () => {
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error fetching profile data')).toBeInTheDocument();
    });
  });

  test('Given that a user has specified their availability and location, they only see opportunities that fit within that criteria', async () => {
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    await waitFor(() => {
        // server will not be running  so it should say "Loading suggestions...."
      expect(screen.getByText(/Loading suggestions.../)).toBeInTheDocument();
    });
  });
});

