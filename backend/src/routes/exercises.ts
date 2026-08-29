import { Router, Request, Response } from 'express';
import pool from '../database/db.js';
import CodeExecutionService from '../services/codeExecutor.js';

const router = Router();

// Get exercises for a lesson
router.get('/lesson/:lessonId', async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(
      'SELECT id, lesson_id, type, title, description, starter_code, test_cases, hints, "order" FROM exercises WHERE lesson_id = $1 ORDER BY "order"',
      [lessonId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Get single exercise
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM exercises WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

// Run code against test cases (without submitting)
router.post('/:exerciseId/run', async (req: Request, res: Response) => {
  try {
    const { exerciseId } = req.params;
    const { code } = req.body;

    if (!code) {
      res.status(400).json({ error: 'Missing code' });
      return;
    }

    // Get exercise with test cases
    const exerciseResult = await pool.query(
      'SELECT * FROM exercises WHERE id = $1',
      [exerciseId]
    );

    if (exerciseResult.rows.length === 0) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }

    const exercise = exerciseResult.rows[0];

    // Validate code safety
    const safetyCheck = CodeExecutionService.validateCodeSafety(code);
    if (!safetyCheck.safe) {
      res.status(400).json({
        error: 'Code contains unsafe operations',
        issues: safetyCheck.issues,
      });
      return;
    }

    // Execute code
    const testCases = exercise.test_cases || [];
    const executionResult = await CodeExecutionService.executeCode(code, testCases);

    res.json({
      message: 'Code executed successfully',
      ...executionResult,
      visibleResults: executionResult.results.filter((r: any) => r.visible),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Code execution failed', details: error.message });
  }
});

// Submit exercise solution
router.post('/:exerciseId/submit', async (req: Request, res: Response) => {
  try {
    const { exerciseId } = req.params;
    const { code, userId } = req.body;

    if (!code || !userId) {
      res.status(400).json({ error: 'Missing code or userId' });
      return;
    }

    // Get exercise to validate
    const exerciseResult = await pool.query(
      'SELECT * FROM exercises WHERE id = $1',
      [exerciseId]
    );

    if (exerciseResult.rows.length === 0) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }

    const exercise = exerciseResult.rows[0];

    // Validate code safety
    const safetyCheck = CodeExecutionService.validateCodeSafety(code);
    if (!safetyCheck.safe) {
      res.status(400).json({
        error: 'Code contains unsafe operations',
        issues: safetyCheck.issues,
      });
      return;
    }

    let passed = true;
    let score = 0;
    let executionResult: any = null;

    // For coding exercises, run test cases
    if (exercise.type === 'coding') {
      const testCases = exercise.test_cases || [];
      executionResult = await CodeExecutionService.executeCode(code, testCases);

      passed = executionResult.failedTests === 0 && !executionResult.error;
      score = passed ? 100 : Math.max(0, 100 - executionResult.failedTests * 20);
    } else if (exercise.type === 'multiple_choice') {
      // For multiple choice, just check if code is not empty
      passed = code.trim().length > 0;
      score = passed ? 100 : 0;
    }

    // Get current attempt number
    const progressResult = await pool.query(
      'SELECT attempts FROM user_progress WHERE user_id = $1 AND exercise_id = $2',
      [userId, exerciseId]
    );

    const attemptNumber = (progressResult.rows[0]?.attempts || 0) + 1;

    // Save test results
    if (executionResult) {
      await pool.query(
        `INSERT INTO test_results (user_id, exercise_id, attempt_number, passed_tests, failed_tests, total_tests, results, error, execution_time_ms, submitted_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          userId,
          exerciseId,
          attemptNumber,
          executionResult.passedTests,
          executionResult.failedTests,
          executionResult.totalTests,
          JSON.stringify(executionResult.results),
          executionResult.error || null,
          executionResult.executionTime,
          code,
        ]
      );
    }

    // Update user progress
    await pool.query(
      `INSERT INTO user_progress (user_id, exercise_id, completed, score, attempts, submitted_code, attempted_at)
       VALUES ($1, $2, $3, $4, 1, $5, NOW())
       ON CONFLICT (user_id, exercise_id) DO UPDATE SET
       completed = $3, score = $4, attempts = attempts + 1, submitted_code = $5, attempted_at = NOW()`,
      [userId, exerciseId, passed, score, code]
    );

    res.json({
      message: 'Exercise submitted successfully',
      passed,
      score,
      feedback: passed ? '✅ Great job!' : '❌ Keep trying!',
      testResults: executionResult
        ? {
            passedTests: executionResult.passedTests,
            failedTests: executionResult.failedTests,
            totalTests: executionResult.totalTests,
            visibleResults: executionResult.results.filter((r: any) => r.visible),
          }
        : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Submission failed', details: error.message });
  }
});

// Get test results for an exercise
router.get('/:exerciseId/results/:userId', async (req: Request, res: Response) => {
  try {
    const { exerciseId, userId } = req.params;

    const result = await pool.query(
      `SELECT * FROM test_results 
       WHERE exercise_id = $1 AND user_id = $2 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [exerciseId, userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

export default router;
