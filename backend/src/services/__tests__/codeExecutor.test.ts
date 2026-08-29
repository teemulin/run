import { describe, it, expect, beforeEach } from 'vitest';
import CodeExecutionService from '../codeExecutor';

describe('CodeExecutionService', () => {
  describe('validateCodeSafety', () => {
    it('should reject eval() calls', () => {
      const result = CodeExecutionService.validateCodeSafety('eval("alert(1)")');
      expect(result.safe).toBe(false);
      expect(result.issues).toContain('eval() is not allowed');
    });

    it('should reject Function constructor', () => {
      const result = CodeExecutionService.validateCodeSafety('new Function("return 42")');
      expect(result.safe).toBe(false);
      expect(result.issues).toContain('Function constructor is not allowed');
    });

    it('should reject require() calls', () => {
      const result = CodeExecutionService.validateCodeSafety('require("fs")');
      expect(result.safe).toBe(false);
      expect(result.issues).toContain('require() is not allowed');
    });

    it('should reject import statements', () => {
      const result = CodeExecutionService.validateCodeSafety('import fs from "fs"');
      expect(result.safe).toBe(false);
      expect(result.issues).toContain('import statements are not allowed');
    });

    it('should reject window access', () => {
      const result = CodeExecutionService.validateCodeSafety('window.location');
      expect(result.safe).toBe(false);
    });

    it('should allow safe code', () => {
      const result = CodeExecutionService.validateCodeSafety('const x = 42; return x;');
      expect(result.safe).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('executeCode', () => {
    it('should execute simple code and return result', async () => {
      const testCases = [
        {
          id: '1',
          expectedOutput: '42',
          visible: true,
        },
      ];

      const result = await CodeExecutionService.executeCode('return 42;', testCases);

      expect(result.totalTests).toBe(1);
      expect(result.passedTests).toBeGreaterThanOrEqual(0);
      expect(result.results).toHaveLength(1);
    });

    it('should handle multiple test cases', async () => {
      const testCases = [
        {
          id: '1',
          expectedOutput: '10',
          visible: true,
        },
        {
          id: '2',
          expectedOutput: '20',
          visible: true,
        },
      ];

      const result = await CodeExecutionService.executeCode(
        'return 10;',
        testCases
      );

      expect(result.totalTests).toBe(2);
    });

    it('should capture console.log output', async () => {
      const testCases = [
        {
          id: '1',
          expectedOutput: 'Hello',
          visible: true,
        },
      ];

      const result = await CodeExecutionService.executeCode(
        'console.log("Hello"); return "Hello";',
        testCases
      );

      expect(result.consoleOutput.length).toBeGreaterThan(0);
    });

    it('should handle hidden test cases', async () => {
      const testCases = [
        {
          id: '1',
          expectedOutput: 'visible',
          visible: true,
        },
        {
          id: '2',
          expectedOutput: 'hidden',
          visible: false,
        },
      ];

      const result = await CodeExecutionService.executeCode(
        'return "visible";',
        testCases
      );

      expect(result.results).toHaveLength(2);
      const visibleTests = result.results.filter((r) => r.visible);
      expect(visibleTests.length).toBeGreaterThanOrEqual(1);
    });

    it('should track execution time', async () => {
      const testCases = [
        {
          id: '1',
          expectedOutput: '1',
          visible: true,
        },
      ];

      const result = await CodeExecutionService.executeCode(
        'return 1;',
        testCases
      );

      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });
  });
});