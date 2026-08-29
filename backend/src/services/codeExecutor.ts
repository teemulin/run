// Service for safely executing TypeScript/JavaScript code in a sandbox

interface TestCase {
  id?: string;
  input?: string;
  expectedOutput: string;
  visible: boolean;
  hint?: string;
}

interface TestResult {
  testId?: string;
  passed: boolean;
  visible: boolean;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

interface ExecutionResult {
  passedTests: number;
  failedTests: number;
  totalTests: number;
  results: TestResult[];
  error?: string;
  executionTime: number;
  consoleOutput: string[];
}

class CodeExecutionService {
  /**
   * Execute code with test cases
   * Captures console.log output and validates against expected outputs
   */
  static async executeCode(
    code: string,
    testCases: TestCase[]
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const consoleOutput: string[] = [];
    const results: TestResult[] = [];
    let error: string | undefined;

    try {
      // Create a sandbox environment
      const sandbox = this.createSandbox(consoleOutput);

      // Execute each test case
      for (const testCase of testCases) {
        try {
          // Create a function that captures output
          const wrappedCode = this.wrapCodeWithTest(code, testCase);

          // Execute the wrapped code in the sandbox
          const func = new Function(...Object.keys(sandbox), wrappedCode);
          const actualOutput = func(...Object.values(sandbox));

          // Check if output matches expected
          const passed =
            String(actualOutput).trim() === testCase.expectedOutput.trim();

          results.push({
            testId: testCase.id,
            passed,
            visible: testCase.visible,
            expectedOutput: testCase.expectedOutput,
            actualOutput: String(actualOutput),
          });
        } catch (testError: any) {
          results.push({
            testId: testCase.id,
            passed: false,
            visible: testCase.visible,
            expectedOutput: testCase.expectedOutput,
            actualOutput: '',
            error: testError.message,
          });
        }
      }
    } catch (err: any) {
      error = err.message || 'Unknown execution error';
    }

    const executionTime = Date.now() - startTime;
    const passedTests = results.filter((r) => r.passed).length;
    const failedTests = results.filter((r) => !r.passed).length;

    return {
      passedTests,
      failedTests,
      totalTests: results.length,
      results,
      error,
      executionTime,
      consoleOutput,
    };
  }

  /**
   * Create a sandbox object with console and other safe globals
   */
  private static createSandbox(
    consoleOutput: string[]
  ): Record<string, any> {
    return {
      console: {
        log: (...args: any[]) => {
          consoleOutput.push(args.map((arg) => String(arg)).join(' '));
        },
        error: (...args: any[]) => {
          consoleOutput.push('ERROR: ' + args.map((arg) => String(arg)).join(' '));
        },
        warn: (...args: any[]) => {
          consoleOutput.push('WARN: ' + args.map((arg) => String(arg)).join(' '));
        },
      },
      Math,
      Array,
      Object,
      String,
      Number,
      Boolean,
      Date,
      JSON,
    };
  }

  /**
   * Wrap user code to capture return value or last expression
   */
  private static wrapCodeWithTest(
    code: string,
    testCase: TestCase
  ): string {
    // If code contains a function definition or return statement, execute it
    if (code.includes('function') || code.includes('return')) {
      return `
        (function() {
          ${code}
          ${
            testCase.input
              ? `return eval(\`${code.match(/function\s+\w+/) ? code.match(/function\s+(\w+)/)?.[1] + '(' + testCase.input + ')' : code}\`)`
              : ''
          }
        })()
      `;
    }

    // Otherwise, treat the code as an expression
    return `
      (function() {
        ${code}
        return (${code.trim().split('\n').pop()})
      })()
    `;
  }

  /**
   * Validate if code is safe to execute (basic checks)
   */
  static validateCodeSafety(code: string): { safe: boolean; issues: string[] } {
    const issues: string[] = [];

    // Forbidden patterns
    const forbiddenPatterns = [
      { pattern: /eval\s*\(/i, message: 'eval() is not allowed' },
      { pattern: /Function\s*\(/i, message: 'Function constructor is not allowed' },
      { pattern: /require\s*\(/i, message: 'require() is not allowed' },
      { pattern: /import\s+/i, message: 'import statements are not allowed' },
      { pattern: /window\./i, message: 'window object access is not allowed' },
      { pattern: /document\./i, message: 'document object access is not allowed' },
    ];

    forbiddenPatterns.forEach((item) => {
      if (item.pattern.test(code)) {
        issues.push(item.message);
      }
    });

    return {
      safe: issues.length === 0,
      issues,
    };
  }
}

export default CodeExecutionService;
