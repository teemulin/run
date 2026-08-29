-- Seed data for Exercise Engine testing

-- Insert sample exercises with test cases
INSERT INTO exercises (lesson_id, type, title, description, starter_code, test_cases, hints, "order")
VALUES
(
  1,
  'coding',
  'Hello World',
  'Write code that returns the string "Hello World"',
  'function helloWorld() {\n  // Return "Hello World"\n  return "";\n}',
  '[
    {"id": "test-1", "expectedOutput": "Hello World", "visible": true, "hint": "Use string literal"},
    {"id": "test-2", "expectedOutput": "Hello World", "visible": false}
  ]'::jsonb,
  '{"tip": "String values must match exactly including spaces"}'::jsonb,
  1
),
(
  1,
  'coding',
  'Simple Addition',
  'Write a function that adds two numbers and returns the result',
  'function add(a, b) {\n  // Your code here\n  return 0;\n}',
  '[
    {"id": "test-1", "input": "add(2, 3)", "expectedOutput": "5", "visible": true, "hint": "Return a + b"},
    {"id": "test-2", "input": "add(10, 20)", "expectedOutput": "30", "visible": true},
    {"id": "test-3", "input": "add(-5, 5)", "expectedOutput": "0", "visible": false},
    {"id": "test-4", "input": "add(100, -50)", "expectedOutput": "50", "visible": false}
  ]'::jsonb,
  '{"tip": "The + operator adds two numbers"}'::jsonb,
  2
),
(
  1,
  'coding',
  'Array Sum',
  'Write a function that returns the sum of all numbers in an array',
  'function sumArray(arr) {\n  // Use a loop or reduce\n  return 0;\n}',
  '[
    {"id": "test-1", "input": "sumArray([1, 2, 3])", "expectedOutput": "6", "visible": true, "hint": "1+2+3=6"},
    {"id": "test-2", "input": "sumArray([10, 20, 30])", "expectedOutput": "60", "visible": true},
    {"id": "test-3", "input": "sumArray([])", "expectedOutput": "0", "visible": false},
    {"id": "test-4", "input": "sumArray([-1, 1, -1, 1])", "expectedOutput": "0", "visible": false}
  ]'::jsonb,
  '{"tip": "Use a for loop or Array.reduce() to accumulate values"}'::jsonb,
  3
),
(
  1,
  'coding',
  'String Reverse',
  'Write a function that returns a string reversed',
  'function reverseString(str) {\n  // Reverse the string\n  return "";\n}',
  '[
    {"id": "test-1", "input": "reverseString(\"hello\")", "expectedOutput": "olleh", "visible": true, "hint": "reverse characters"},
    {"id": "test-2", "input": "reverseString(\"world\")", "expectedOutput": "dlrow", "visible": true},
    {"id": "test-3", "input": "reverseString(\"\")", "expectedOutput": "", "visible": false},
    {"id": "test-4", "input": "reverseString(\"a\")", "expectedOutput": "a", "visible": false}
  ]'::jsonb,
  '{"tip": "Split into array, reverse, and join"}'::jsonb,
  4
);

-- Verify insertion
SELECT COUNT(*) as total_exercises FROM exercises;
