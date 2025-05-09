import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserTypeSelection from '../components/UserTypeSelection';

const mockOnContinue = jest.fn();

describe('UserTypeSelection Component', () => {
  beforeEach(() => {
    mockOnContinue.mockClear();
    localStorage.clear();
    // Mock window.alert
    window.alert = jest.fn();
  });

  test('displays selection buttons and prompts selection before continuing', () => {
    render(<UserTypeSelection onContinue={mockOnContinue} />);

    const organizationButton = screen.getByText('Organization');
    const userButton = screen.getByText('User');
    const continueButton = screen.getByText('Continue');

    expect(organizationButton).toBeInTheDocument();
    expect(userButton).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();

    // Attempt to continue without selection
    fireEvent.click(continueButton);

    // Check that onContinue was not called
    expect(mockOnContinue).not.toHaveBeenCalled();

    // Verify that window.alert was called with the expected message
    expect(window.alert).toHaveBeenCalledWith('Please select an option before continuing.');
  });

  test('allows toggling between User and Organization selection', () => {
    render(<UserTypeSelection onContinue={mockOnContinue} />);

    const organizationButton = screen.getByText('Organization');
    const userButton = screen.getByText('User');

    // Select "Organization"
    fireEvent.click(organizationButton);
    expect(organizationButton).toHaveClass('selected');
    expect(localStorage.getItem('userType')).toBe('Organization');

    // Toggle off "Organization"
    fireEvent.click(organizationButton);
    expect(organizationButton).not.toHaveClass('selected');
    expect(localStorage.getItem('userType')).toBeNull();

    // Select "User" and check
    fireEvent.click(userButton);
    expect(userButton).toHaveClass('selected');
    expect(localStorage.getItem('userType')).toBe('User');
  });

  test('calls onContinue with the selected type on Continue button click', () => {
    render(<UserTypeSelection onContinue={mockOnContinue} />);

    // Select "User" and continue
    const userButton = screen.getByText('User');
    fireEvent.click(userButton);
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    expect(mockOnContinue).toHaveBeenCalledWith('User');
  });

  test('loads initial selection from localStorage if it exists', () => {
    localStorage.setItem('userType', 'Organization');

    render(<UserTypeSelection onContinue={mockOnContinue} />);

    const organizationButton = screen.getByText('Organization');
    expect(organizationButton).toHaveClass('selected');
  });
});
