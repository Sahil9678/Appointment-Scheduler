import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppointmentScheduler from './AppointmentScheduler';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          dates: [
            { displayDate: '2024-08-09', displayTime: '09:00 AM', startTimeUtc: '2024-08-09T09:00:00Z' },
            { displayDate: '2024-08-09', displayTime: '10:00 AM', startTimeUtc: '2024-08-09T10:00:00Z' },
            { displayDate: '2024-08-10', displayTime: '11:00 AM', startTimeUtc: '2024-08-10T11:00:00Z' },
            { displayDate: '2024-08-10', displayTime: '12:00 PM', startTimeUtc: '2024-08-10T12:00:00Z' },
          ],
        }),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('AppointmentScheduler', () => {
  test('renders date buttons', async () => {
    render(<AppointmentScheduler />);

    await waitFor(() => {
      const dateButtons = screen.getAllByRole('button', { name: /\d{2}/ });
      expect(dateButtons.length).toBeGreaterThanOrEqual(2); 
    });
  });

  test('renders time slots after selecting a date', async () => {
    render(<AppointmentScheduler />);

    await waitFor(() => screen.getByRole('button', { name: /09\s+Fri/ }));    
    fireEvent.click(screen.getByRole('button', { name: /09\s+Fri/ }));
 
    await waitFor(() => {
      expect(screen.getByText('09:00 AM')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    });
  });

  test('highlights selected date', async () => {
    render(<AppointmentScheduler />);

    await waitFor(() => screen.getByRole('button', { name: /09\s+Fri/ }));
    const dateButton = screen.getByRole('button', { name: /09\s+Fri/ });
    fireEvent.click(dateButton);

    expect(dateButton).toHaveClass('selected');
  });

  test('highlights selected time slot', async () => {
    render(<AppointmentScheduler />);

    
    await waitFor(() => screen.getByRole('button', { name: /09\s+Fri/ }));
    fireEvent.click(screen.getByRole('button', { name: /09\s+Fri/ }));

    const timeSlotButton = screen.getByText('09:00 AM');
    fireEvent.click(timeSlotButton);

    expect(timeSlotButton).toHaveClass('selected');
  });

  test('disables prev button when at the start', async () => {
    render(<AppointmentScheduler />);

    await waitFor(() => screen.getByRole('button', { name: /09\s+Fri/ }));

    const prevButton = screen.getByRole('button', { name: /</ });
    expect(prevButton).toBeDisabled();
  });

  test('disables next button when at the end', async () => {
    render(<AppointmentScheduler />);

    await waitFor(() => screen.getByRole('button', { name: /09\s+Fri/ }));
    const nextButton = screen.getByRole('button', { name: />/ });

    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    await waitFor(() => expect(nextButton).toBeDisabled());
  });
});
