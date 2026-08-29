import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CodeEditor } from '../components/CodeEditor';
import { TestResults } from '../components/TestResults';
import { AuthContext } from '../context/AuthContext';

interface Exercise {
  id: number;
  type: string;
  title: string;
  description: string;
  starter_code: string;
  test_cases: any[];
  hints: any;
}

interface ExecutionResult {
  passedTests: number;
  failedTests: number;
  totalTests: number;
  results: any[];
  error?: string;
  executionTime: number;
  visibleResults?: any[];
}

export const ExercisePage: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const { user } = useContext(AuthContext) || {};
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/exercises/${exerciseId}`);
        setExercise(response.data);
        setCode(response.data.starter_code || '');
      } catch (error) {
        console.error('Failed to fetch exercise:', error);
      } finally {
        setLoading(false);
      }
    };

    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId, apiUrl]);

  const handleRunCode = async () => {
    if (!user?.id || !exerciseId) {
      alert('User not authenticated');
      return;
    }

    setRunning(true);
    try {
      const response = await axios.post(`${apiUrl}/api/exercises/${exerciseId}/run`, {
        code,
        userId: user.id,
      });
      setExecutionResult(response.data);
    } catch (error: any) {
      setExecutionResult({
        passedTests: 0,
        failedTests: 0,
        totalTests: 0,
        results: [],
        error: error.response?.data?.error || error.message,
        executionTime: 0,
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id || !exerciseId) {
      alert('User not authenticated');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${apiUrl}/api/exercises/${exerciseId}/submit`, {
        code,
        userId: user.id,
      });
      setExecutionResult(response.data.testResults);
      setSubmitted(response.data.passed);
      alert(response.data.feedback);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading exercise...</div>;
  }

  if (!exercise) {
    return <div className="text-center py-8">Exercise not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-8">
      <div className="container max-w-6xl">
        {/* Exercise Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{exercise.title}</h1>
          <p className="text-gray-600">{exercise.description}</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Code Editor */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Code Editor</h2>
              <CodeEditor
                initialCode={code}
                onChange={setCode}
                language={exercise.type === 'coding' ? 'typescript' : 'javascript'}
              />
            </div>

            {/* Hints */}
            {exercise.hints && Object.keys(exercise.hints).length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-900 mb-2">💡 Hints</h3>
                <p className="text-sm text-yellow-800">{exercise.hints.tip}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRunCode}
                disabled={running}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {running ? 'Running...' : '▶️ Run Code'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {submitting ? 'Submitting...' : '✅ Submit'}
              </button>
            </div>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-900 font-bold">🎉 Exercise Completed!</p>
              </div>
            )}
          </div>

          {/* Right: Test Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Test Results</h2>
            {executionResult ? (
              <TestResults
                results={executionResult.results || []}
                passedTests={executionResult.passedTests}
                failedTests={executionResult.failedTests}
                totalTests={executionResult.totalTests}
                error={executionResult.error}
                executionTime={executionResult.executionTime}
              />
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
                <p>Click "Run Code" to test your solution</p>
              </div>
            )}
          </div>
        </div>

        {/* Starter Code Info */}
        {exercise.starter_code && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">📝 Starter Code Provided</h3>
            <p className="text-sm text-blue-800">
              A starter code template has been provided. Modify it to complete the exercise.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};