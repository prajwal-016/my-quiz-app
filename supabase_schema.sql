-- Supabase Database Schema for "Java Full Stack Development" Quiz Application
-- You can run this script directly in your Supabase SQL Editor!

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('mcq', 'fill_blank')),
  question_text TEXT NOT NULL,
  options JSONB, -- Array of strings for MCQ, NULL for fill_blank
  correct_answer TEXT NOT NULL, -- Correct option text or trimmed string for fill_blank
  explanation TEXT,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  time_taken INT NOT NULL, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) - Optional but recommended for production
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create public read policies (Allow everyone to read categories and questions)
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Allow public read access to questions" ON questions FOR SELECT TO public USING (true);
CREATE POLICY "Allow public write access to quiz_attempts" ON quiz_attempts FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read access to quiz_attempts" ON quiz_attempts FOR SELECT TO public USING (true);

-- =========================================================================
-- SEED DATA (Inserts high-quality Java Full Stack questions)
-- =========================================================================

-- Clear existing data if re-running
TRUNCATE TABLE questions CASCADE;
TRUNCATE TABLE categories CASCADE;

-- Insert Categories and capture IDs
INSERT INTO categories (id, name, description, slug) VALUES
('a0000000-0000-0000-0000-000000000001', 'Core Java', 'OOPs concepts, JVM internals, Collections, Streams, and Multithreading.', 'core-java'),
('a0000000-0000-0000-0000-000000000002', 'Spring Boot', 'Dependency Injection, REST APIs, Security, and Cloud configuration.', 'spring-boot'),
('a0000000-0000-0000-0000-000000000003', 'Hibernate & JPA', 'Entity lifecycles, association mappings, lazy loading, and caching.', 'hibernate-jpa'),
('a0000000-0000-0000-0000-000000000004', 'SQL & Database', 'Relational database designs, indexes, transaction isolation levels, and joins.', 'sql-database'),
('a0000000-0000-0000-0000-000000000005', 'Frontend Integration', 'CORS, JWT authentication, state management, and REST/GraphQL integrations.', 'frontend-integration');

-- Insert Core Java Questions
INSERT INTO questions (category_id, type, question_text, options, correct_answer, explanation, difficulty) VALUES
('a0000000-0000-0000-0000-000000000001', 'mcq', 
 'What will be the output of the following Java program snippet?\n\n```java\nList<String> list = Arrays.asList("a", "b", "c");\nlist.stream()\n    .filter(s -> {\n        System.out.print(s);\n        return true;\n    });\n```', 
 '["Prints \"abc\" immediately", "Throws an UnsupportedOperationException", "Prints nothing because streams are evaluated lazily", "Compiler error on filter statement"]', 
 'Prints nothing because streams are evaluated lazily', 
 'Java Streams are evaluated lazily. Intermediate operations (like filter()) are not processed until a terminal operation (like collect(), forEach(), or count()) is invoked on the stream. Since there is no terminal operation here, the printing statement inside filter is never executed.', 
 'medium'),

('a0000000-0000-0000-0000-000000000001', 'fill_blank', 
 'In Java, the keyword used to prevent a variable from being serialized during object serialization is `____________`.', 
 NULL, 
 'transient', 
 'The transient keyword in Java is used to indicate that a field should not be serialized when the object containing it is serialized. When an object is deserialized, transient variables are initialized with their default values.', 
 'easy'),

('a0000000-0000-0000-0000-000000000001', 'mcq', 
 'Consider the following Java thread safety code snippet. Which of the following is TRUE about the `volatile` keyword in Java?\n\n```java\npublic class SharedFlag {\n    private volatile boolean active = true;\n    // getter and setter\n}\n```', 
 '["It provides mutual exclusion, acting like a lightweight synchronized block.", "It guarantees visibility, ensuring reads always fetch the most recent write directly from main memory.", "It prevents variables from being accessed by more than one thread at a time.", "It automatically makes operations like compound increments (i++) atomic."]', 
 'It guarantees visibility, ensuring reads always fetch the most recent write directly from main memory.', 
 'The volatile keyword guarantees that writes to a variable are immediately visible to all threads. It ensures that reads and writes go directly to/from main memory instead of CPU caches, but it does NOT provide atomicity or mutual exclusion.', 
 'hard'),

('a0000000-0000-0000-0000-000000000001', 'fill_blank', 
 'The memory region in the Java Virtual Machine (JVM) where all actual object instances are allocated is called the `______` memory.', 
 NULL, 
 'heap', 
 'All object instances and arrays are allocated in the Heap memory in the JVM. Stack memory is used for thread execution, local variables, and method call frames.', 
 'easy');

-- Insert Spring Boot Questions
INSERT INTO questions (category_id, type, question_text, options, correct_answer, explanation, difficulty) VALUES
('a0000000-0000-0000-0000-000000000002', 'mcq', 
 'In Spring Framework, what is the default scope of a declared Spring Bean?', 
 '["prototype", "request", "singleton", "session"]', 
 'singleton', 
 'The default scope for a Spring Bean is singleton. Spring container creates exactly one instance of the bean and injects it into all collaborators.', 
 'easy'),

('a0000000-0000-0000-0000-000000000002', 'fill_blank', 
 'To bootstrap a full Spring Boot application and enable auto-configuration, component scanning, and property binding, we annotate the main entrypoint class with `@_______________________`.', 
 NULL, 
 'SpringBootApplication', 
 'The @SpringBootApplication annotation is a convenience annotation that combines @Configuration, @EnableAutoConfiguration, and @ComponentScan with their default attributes.', 
 'medium'),

('a0000000-0000-0000-0000-000000000002', 'mcq', 
 'When designing a REST controller in Spring Boot, which annotation is a composed shortcut mapping that handles HTTP DELETE requests?', 
 '["@RemoveMapping", "@DeleteMapping", "@RequestMapping(method = RequestMethod.REMOVE)", "@DeleteAction"]', 
 '@DeleteMapping', 
 '@DeleteMapping is a composed annotation that acts as a shortcut for @RequestMapping(method = RequestMethod.DELETE).', 
 'easy'),

('a0000000-0000-0000-0000-000000000002', 'fill_blank', 
 'In Spring Security, the interface used to load user-specific data during authentication (typically by username) is `__________________`.', 
 NULL, 
 'UserDetailsService', 
 'The UserDetailsService interface has a single method loadUserByUsername(String username) which is implemented to retrieve user credentials and roles from a database.', 
 'hard');

-- Insert Hibernate & JPA Questions
INSERT INTO questions (category_id, type, question_text, options, correct_answer, explanation, difficulty) VALUES
('a0000000-0000-0000-0000-000000000003', 'mcq', 
 'In Hibernate/JPA, which entity state represents a Java object that is not yet associated with a database row or active session context?', 
 '["Managed (Persistent)", "Transient", "Detached", "Removed"]', 
 'Transient', 
 'A Transient state entity is a newly created Java object that has no database identity and is not yet associated with a Hibernate Session.', 
 'medium'),

('a0000000-0000-0000-0000-000000000003', 'fill_blank', 
 'To configure a bidirectional One-to-Many relationship in JPA, we use the `____________` attribute on the `@OneToMany` side to point to the field name that owns the relationship on the `@ManyToOne` side.', 
 NULL, 
 'mappedBy', 
 'The mappedBy attribute is used in JPA bidirectional relationships to specify the owning side of the association, residing on the inverse side.', 
 'medium'),

('a0000000-0000-0000-0000-000000000003', 'mcq', 
 'What exception is thrown in JPA if you attempt to access an uninitialized lazy-loaded relationship outside of an active Hibernate Session / Transaction context?', 
 '["NullPointerException", "LazyInitializationException", "EntityNotFoundException", "TransactionRequiredException"]', 
 'LazyInitializationException', 
 'Hibernate throws a LazyInitializationException when you access a lazily fetched association after the database session is closed.', 
 'hard'),

('a0000000-0000-0000-0000-000000000003', 'fill_blank', 
 'In JPA, the base interface that represents the central contract for interacting with the persistence context (providing methods like persist, merge, and remove) is `____________`.', 
 NULL, 
 'EntityManager', 
 'The EntityManager interface is the core interface of JPA. It represents a persistence session used to create, find, merge, and delete entities.', 
 'medium');

-- Insert SQL & Database Questions
INSERT INTO questions (category_id, type, question_text, options, correct_answer, explanation, difficulty) VALUES
('a0000000-0000-0000-0000-000000000004', 'mcq', 
 'Which transaction isolation level is the strictest, fully preventing Dirty Reads, Non-Repeatable Reads, and Phantom Reads?', 
 '["READ_COMMITTED", "REPEATABLE_READ", "SERIALIZABLE", "READ_UNCOMMITTED"]', 
 'SERIALIZABLE', 
 'SERIALIZABLE is the highest isolation level. It forces transactions to run sequentially, preventing all concurrency anomalies.', 
 'hard'),

('a0000000-0000-0000-0000-000000000004', 'fill_blank', 
 'In relational databases, an index that enforces uniqueness on the indexed column(s) while physically ordering the actual rows on disk to match is called a `_________` index.', 
 NULL, 
 'clustered', 
 'A clustered index determines the physical order of data rows in a table. There can be only one clustered index per table (typically the Primary Key).', 
 'medium'),

('a0000000-0000-0000-0000-000000000004', 'mcq', 
 'Consider the SQL snippet. Which join type returns all records from the left table and the matched records from the right table, filling with NULL values on the right where no match occurs?\n\n```sql\nSELECT * FROM employees e _____ JOIN departments d ON e.dept_id = d.id;\n```', 
 '["INNER", "RIGHT", "LEFT", "FULL OUTER"]', 
 'LEFT', 
 'A LEFT JOIN returns all rows from the left table, and matched rows from the right. If there is no match, the right side is filled with NULL.', 
 'easy'),

('a0000000-0000-0000-0000-000000000004', 'fill_blank', 
 'In SQL database transaction properties (ACID), the letter "C" stands for `___________`.', 
 NULL, 
 'consistency', 
 'In ACID, C stands for Consistency. It ensures that a transaction takes the database from one valid state to another, satisfying all constraints.', 
 'easy');

-- Insert Frontend Integration Questions
INSERT INTO questions (category_id, type, question_text, options, correct_answer, explanation, difficulty) VALUES
('a0000000-0000-0000-0000-000000000005', 'mcq', 
 'What security mechanism does the browser enforce to restrict web pages from making HTTP requests to a domain different from the one that served the web page?', 
 '["CSRF (Cross-Site Request Forgery)", "CORS (Cross-Origin Resource Sharing)", "SOP (Same-Origin Policy)", "XSS (Cross-Site Scripting)"]', 
 'SOP (Same-Origin Policy)', 
 'The Same-Origin Policy (SOP) is a core browser security mechanism that restricts a script loaded from one origin from interacting with resources on another origin.', 
 'medium'),

('a0000000-0000-0000-0000-000000000005', 'fill_blank', 
 'In full stack web tokens (JWT) authentication, the JWT is typically sent in the HTTP Request header named `_____________` using the prefix "Bearer ".', 
 NULL, 
 'Authorization', 
 'JSON Web Tokens are sent in the Authorization header with the Bearer schema. e.g. Authorization: Bearer <token_string>', 
 'easy'),

('a0000000-0000-0000-0000-000000000005', 'mcq', 
 'When integrated with a Java REST backend, which HTTP status code is returned if the user tries to access a protected resource without a valid login token (unauthenticated)?', 
 '["400 Bad Request", "401 Unauthorized", "403 Forbidden", "405 Method Not Allowed"]', 
 '401 Unauthorized', 
 'Status code 401 Unauthorized specifically indicates that the request requires user authentication. 403 Forbidden indicates the user is logged in but doesn''t have permissions.', 
 'easy'),

('a0000000-0000-0000-0000-000000000005', 'fill_blank', 
 'To prevent Cross-Site Request Forgery (CSRF) when integrated with Spring Boot, the backend can issue unique tokens called `____` tokens to be included in POST/PUT requests from the frontend client.', 
 NULL, 
 'csrf', 
 'CSRF tokens are unique, secret, and unpredictable tokens generated by the server-side application to verify that the request originates from the legitimate user.', 
 'easy');
