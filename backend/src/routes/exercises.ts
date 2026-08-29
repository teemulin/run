import { Router, Request, Response } from 'express';
import pool from '../database/db.js';

const router = Router();

// Get exercises for a lesson
router.get('/lesson/:lessonId', async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query(
      'SELECT id, lesson_id, type, title, description, starter_code, hints, "order" FROM exercises WHERE lesson_id = $1 ORDER BY "order"',
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
    let passed = true;
    let score = 0;
    
    // For now, basic validation
    if (exercise.type === 'coding' && code.trim()) {
      score = 100;
      passed = true;
    } else if (exercise.type === 'multiple_choice') {
      score = 100;
      passed = true;
    }
    
    // Save submission
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
      feedback: passed ? '✅ Great job!' : '❌ Keep trying!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Submission failed' });
  }
});

export default router;
