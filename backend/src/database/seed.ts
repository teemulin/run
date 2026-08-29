import pool from './db.js';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Insert languages
    const langResult = await pool.query(
      `INSERT INTO languages (name, icon_emoji, description) VALUES
       ($1, $2, $3),
       ($4, $5, $6)
       RETURNING id, name`,
      ['TypeScript', '📘', 'Learn modern JavaScript with type safety',
       'PHP', '🐘', 'Master server-side web development']
    );

    const typescript = langResult.rows[0];
    const php = langResult.rows[1];

    console.log(`✅ Created languages: ${typescript.name}, ${php.name}`);

    // Insert TypeScript courses
    const tsCourseResult = await pool.query(
      `INSERT INTO courses (language_id, title, description, difficulty, "order") VALUES
       ($1, $2, $3, $4, $5)
       RETURNING id`,
      [typescript.id, 'TypeScript Fundamentals', 'Master the basics of TypeScript', 'beginner', 1]
    );

    const tsCourse = tsCourseResult.rows[0];

    // Insert TypeScript lessons
    const tsLessons = await pool.query(
      `INSERT INTO lessons (course_id, title, content, "order") VALUES
       ($1, $2, $3, $4),
       ($5, $6, $7, $8),
       ($9, $10, $11, $12)
       RETURNING id, title`,
      [tsCourse.id, 'Variables and Types', 'Learn how to declare and use variables in TypeScript', 1,
       tsCourse.id, 'Functions', 'Master function declaration and type annotations', 2,
       tsCourse.id, 'Arrays and Objects', 'Work with complex data structures', 3]
    );

    console.log(`✅ Created ${tsLessons.rows.length} TypeScript lessons`);

    // Insert TypeScript exercises
    await pool.query(
      `INSERT INTO exercises (lesson_id, type, title, description, starter_code, hints, "order") VALUES
       ($1, $2, $3, $4, $5, $6, $7),
       ($8, $9, $10, $11, $12, $13, $14),
       ($15, $16, $17, $18, $19, $20, $21),
       ($22, $23, $24, $25, $26, $27, $28),
       ($29, $30, $31, $32, $33, $34, $35)`,
      [
        // Lesson 1 exercises
        tsLessons.rows[0].id, 'multiple_choice', 'What is a variable?',
        'A variable is a named container that holds a value. Which statement is true?',
        null, { tip: 'Think about what variables do in programming' }, 1,
        
        tsLessons.rows[0].id, 'coding', 'Declare a variable',
        'Declare a variable named age with type number and assign it value 25',
        'let age: number = ', { tip: 'Use let keyword with type annotation' }, 2,
        
        // Lesson 2 exercises
        tsLessons.rows[1].id, 'multiple_choice', 'Why use functions?',
        'Functions help us organize code. What is a benefit?',
        null, { tip: 'Functions make code reusable and organized' }, 1,
        
        tsLessons.rows[1].id, 'coding', 'Write a simple function',
        'Create a function named greet that returns a greeting message',
        'function greet(): string {\n  return "Hello, World!";\n}', { tip: 'Functions use function keyword' }, 2,
        
        // Lesson 3 exercises
        tsLessons.rows[2].id, 'coding', 'Create an array',
        'Create an array of numbers [1, 2, 3] and access the first element',
        'const numbers: number[] = [1, 2, 3];\nconst first = ', { tip: 'Arrays are accessed by index starting at 0' }, 1
      ]
    );

    console.log('✅ Created TypeScript exercises');

    // Insert PHP courses
    const phpCourseResult = await pool.query(
      `INSERT INTO courses (language_id, title, description, difficulty, "order") VALUES
       ($1, $2, $3, $4, $5)
       RETURNING id`,
      [php.id, 'PHP Fundamentals', 'Get started with PHP web development', 'beginner', 1]
    );

    const phpCourse = phpCourseResult.rows[0];

    // Insert PHP lessons
    const phpLessons = await pool.query(
      `INSERT INTO lessons (course_id, title, content, "order") VALUES
       ($1, $2, $3, $4),
       ($5, $6, $7, $8),
       ($9, $10, $11, $12)
       RETURNING id, title`,
      [phpCourse.id, 'Variables and Echo', 'Learn PHP basics and output', 1,
       phpCourse.id, 'String Operations', 'Master string manipulation', 2,
       phpCourse.id, 'Arrays', 'Work with PHP arrays', 3]
    );

    console.log(`✅ Created ${phpLessons.rows.length} PHP lessons`);

    // Insert PHP exercises
    await pool.query(
      `INSERT INTO exercises (lesson_id, type, title, description, starter_code, hints, "order") VALUES
       ($1, $2, $3, $4, $5, $6, $7),
       ($8, $9, $10, $11, $12, $13, $14),
       ($15, $16, $17, $18, $19, $20, $21),
       ($22, $23, $24, $25, $26, $27, $28)`,
      [
        // Lesson 1 exercises
        phpLessons.rows[0].id, 'multiple_choice', 'What does echo do?',
        'The echo statement outputs text. Which is correct?',
        null, { tip: 'echo is used to display output in PHP' }, 1,
        
        phpLessons.rows[0].id, 'coding', 'Echo a variable',
        'Create a variable $name with your name and echo it',
        '$name = "John";\necho ', { tip: 'Use $ prefix for PHP variables' }, 2,
        
        // Lesson 2 exercises
        phpLessons.rows[1].id, 'coding', 'Concatenate strings',
        'Join "Hello" and "World" with a space between them',
        '$greeting = "Hello" . ', { tip: 'Use . operator to concatenate strings' }, 1,
        
        // Lesson 3 exercises
        phpLessons.rows[2].id, 'coding', 'Create an array',
        'Create an array of fruit names and access the first one',
        '$fruits = array("Apple", "Banana", "Orange");\necho ', { tip: 'Arrays are accessed by index starting at 0' }, 1
      ]
    );

    console.log('✅ Created PHP exercises');

    console.log('✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
