import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

describe('Exercise Engine API', () => {
  const testUserId = 1;
  const testExerciseId = 1;

  describe('POST /api/exercises/:exerciseId/run', () => {
    it('should run code and return test results', async () => {
      const response = await axios.post(
        `${API_URL}/api/exercises/${testExerciseId}/run`,
        {
          code: 'return 42;',
          userId: testUserId,
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('passedTests');
      expect(response.data).toHaveProperty('failedTests');
      expect(response.data).toHaveProperty('results');
    });

    it('should reject unsafe code', async () => {
      try {
        await axios.post(`${API_URL}/api/exercises/${testExerciseId}/run`, {
          code: 'eval("alert(1)")',
          userId: testUserId,
        });
        expect.fail('Should have rejected unsafe code');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error');
      }
    });

    it('should require code parameter', async () => {
      try {
        await axios.post(`${API_URL}/api/exercises/${testExerciseId}/run`, {
          userId: testUserId,
        });
        expect.fail('Should have required code parameter');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('POST /api/exercises/:exerciseId/submit', () => {
    it('should submit code and save results', async () => {
      const response = await axios.post(
        `${API_URL}/api/exercises/${testExerciseId}/submit`,
        {
          code: 'return 42;',
          userId: testUserId,
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('passed');
      expect(response.data).toHaveProperty('score');
      expect(response.data).toHaveProperty('message');
    });

    it('should require both code and userId', async () => {
      try {
        await axios.post(`${API_URL}/api/exercises/${testExerciseId}/submit`, {
          code: 'return 42;',
        });
        expect.fail('Should have required userId');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should validate exercise exists', async () => {
      try {
        await axios.post(`${API_URL}/api/exercises/99999/submit`, {
          code: 'return 42;',
          userId: testUserId,
        });
        expect.fail('Should have returned 404 for non-existent exercise');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('GET /api/exercises/:exerciseId/results/:userId', () => {
    it('should retrieve test results for user', async () => {
      const response = await axios.get(
        `${API_URL}/api/exercises/${testExerciseId}/results/${testUserId}`
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should return results ordered by creation date', async () => {
      const response = await axios.get(
        `${API_URL}/api/exercises/${testExerciseId}/results/${testUserId}`
      );

      if (response.data.length > 1) {
        const times = response.data.map((r: any) => new Date(r.created_at).getTime());
        for (let i = 1; i < times.length; i++) {
          expect(times[i]).toBeLessThanOrEqual(times[i - 1]);
        }
      }

      expect(response.status).toBe(200);
    });
  });
});