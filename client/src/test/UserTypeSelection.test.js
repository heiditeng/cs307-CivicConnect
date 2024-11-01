import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserTypeSelection from '../components/UserTypeSelection';

// mock the onContinue function
const mockOnContinue = jest.fn();

describe('UserTypeSelection Component', () => {
  beforeEach(() => {
    mockOnContinue.mockClear();
    localStorage.clear();
  });

  test('displays selection buttons and prompts selection before continuing', () => {
    // spy on window.alert to check if it is called
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<UserTypeSelection onContinue={mockOnContinue} />);

    const continueButton = screen.getByText('Continue');

    // attempt to continue without selection
    fireEvent.click(continueButton);

    // check that alert was called
    expect(alertSpy).toHaveBeenCalledWith('Please select an option before continuing.');

    // cleanup the spy
    alertSpy.mockRestore();
  });


  test('allows toggling between User and Organization selection', () => {
    render(<UserTypeSelection onContinue={mockOnContinue} />);

    const organizationButton = screen.getByText('Organization');
    const userButton = screen.getByText('User');

    // select "Organization"
    fireEvent.click(organizationButton);
    expect(organizationButton).toHaveClass('selected');
    expect(localStorage.getItem('userType')).toBe('Organization');

    // toggle off "Organization"
    fireEvent.click(organizationButton);
    expect(organizationButton).not.toHaveClass('selected');
    expect(localStorage.getItem('userType')).toBeNull();

    // select "User" and check
    fireEvent.click(userButton);
    expect(userButton).toHaveClass('selected');
    expect(localStorage.getItem('userType')).toBe('User');
  });

  test('calls onContinue with the selected type on Continue button click', () => {
    render(<UserTypeSelection onContinue={mockOnContinue} />);

    // select "user" and continue
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
