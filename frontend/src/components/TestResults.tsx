import React from 'react';

interface TestResult {
  testId?: string;
  passed: boolean;
  visible: boolean;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

interface TestResultsProps {
  results: TestResult[];
  passedTests: number;
  failedTests: number;
  totalTests: number;
  error?: string;
  executionTime?: number;
}

export const TestResults: React.FC<TestResultsProps> = ({
  results,
  passedTests,
  failedTests,
  totalTests,
  error,
  executionTime,
}) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-bold text-red-900 mb-2">⚠️ Execution Error</h3>
        <p className="text-red-700 font-mono text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-900">{totalTests}</div>
          <div className="text-sm text-blue-700">Total Tests</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-900">{passedTests}</div>
          <div className="text-sm text-green-700">Passed ✅</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-900">{failedTests}</div>
          <div className="text-sm text-red-700">Failed ❌</div>
        </div>
      </div>

      {/* Individual Results */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              result.passed
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">
                {result.passed ? '✅' : '❌'}
              </span>
              <div className="flex-1">
                <p className={`font-bold ${result.passed ? 'text-green-900' : 'text-red-900'}`}>
                  Test {index + 1}
                  {!result.visible && ' (Hidden)'}
                </p>

                {result.error ? (
                  <div className="mt-2">
                    <p className="text-sm font-mono text-red-700">{result.error}</p>
                  </div>
                ) : (
                  <div className="mt-2 space-y-1">
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Expected Output:</p>
                      <p className="text-sm font-mono bg-white p-2 rounded mt-1 border border-gray-300">
                        {result.expectedOutput || '(empty)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600">Actual Output:</p>
                      <p className="text-sm font-mono bg-white p-2 rounded mt-1 border border-gray-300">
                        {result.actualOutput || '(empty)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Time */}
      {executionTime && (
        <div className="text-xs text-gray-600 text-center">
          Execution time: {executionTime}ms
        </div>
      )}
    </div>
  );
};
