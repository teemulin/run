import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestResults } from '../TestResults';

describe('TestResults Component', () => {
  const mockResults = [
    {
      testId: '1',
      passed: true,
      visible: true,
      expectedOutput: 'Hello',
      actualOutput: 'Hello',
    },
    {
      testId: '2',
      passed: false,
      visible: true,
      expectedOutput: 'World',
      actualOutput: 'Goodbye',
    },
  ];

  it('should display test summary', () => {
    render(
      <TestResults
        results={mockResults}
        passedTests={1}
        failedTests={1}
        totalTests={2}
        executionTime={100}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Total tests
    expect(screen.getByText('1')).toBeInTheDocument(); // Passed
    expect(screen.getByText('1')).toBeInTheDocument(); // Failed
  });

  it('should display individual test results', () => {
    render(
      <TestResults
        results={mockResults}
        passedTests={1}
        failedTests={1}
        totalTests={2}
        executionTime={100}
      />
    );

    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });

  it('should show execution error if provided', () => {
    render(
      <TestResults
        results={[]}
        passedTests={0}
        failedTests={0}
        totalTests={0}
        error="SyntaxError: Unexpected token"
        executionTime={0}
      />
    );

    expect(screen.getByText('Execution Error')).toBeInTheDocument();
    expect(screen.getByText(/SyntaxError/)).toBeInTheDocument();
  });

  it('should mark hidden tests correctly', () => {
    const hiddenTestResults = [
      {
        testId: '1',
        passed: true,
        visible: false,
        expectedOutput: 'Secret',
        actualOutput: 'Secret',
      },
    ];

    render(
      <TestResults
        results={hiddenTestResults}
        passedTests={1}
        failedTests={0}
        totalTests={1}
        executionTime={100}
      />
    );

    expect(screen.getByText(/Hidden/)).toBeInTheDocument();
  });
});