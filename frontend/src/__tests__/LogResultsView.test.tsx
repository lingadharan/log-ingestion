import React from 'react';
import { render, screen } from '@testing-library/react';
import LogResultsView from './components/LogResultsView';

describe('LogResultsView', () => {
  const logs = [
    {
      level: 'error',
      message: 'Failed to connect to database',
      resourceId: 'server-1234',
      timestamp: '2023-09-15T08:00:00Z',
      traceId: 'abc-xyz-123',
      spanId: 'span-456',
      commit: '5e5342f',
      metadata: { parentResourceId: 'server-5678' },
    },
    {
      level: 'info',
      message: 'User logged in',
      resourceId: 'server-1234',
      timestamp: '2023-09-15T09:00:00Z',
      traceId: 'abc-xyz-456',
      spanId: 'span-789',
      commit: '5e5342f',
      metadata: { parentResourceId: 'server-5678' },
    },
  ];

  test('renders logs in a table', () => {
    render(<LogResultsView logs={logs} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // 1 header row + 2 data rows

    const errorLog = screen.getByText(/Failed to connect to database/i);
    expect(errorLog).toBeInTheDocument();
    expect(errorLog.closest('tr')).toHaveClass('log-error');

    const infoLog = screen.getByText(/User logged in/i);
    expect(infoLog).toBeInTheDocument();
    expect(infoLog.closest('tr')).toHaveClass('log-info');
  });
});
