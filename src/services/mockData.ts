export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  questionCount: number;
}

export interface Question {
  id: string;
  category_id: string;
  type: 'mcq' | 'fill_blank';
  question_text: string;
  options: string[] | null; // Array of options for MCQs, null for Blanks
  correct_answer: string;    // Correct option text or trimmed string for Blanks
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const mockCategories: Category[] = [
  {
    id: 'cat-core-java',
    name: 'Core Java',
    description: 'OOPs concepts, JVM internals, Collections, Streams, and Multithreading.',
    slug: 'core-java',
    questionCount: 4
  },
  {
    id: 'cat-spring-boot',
    name: 'Spring Boot',
    description: 'Dependency Injection, REST APIs, Security, and Cloud configuration.',
    slug: 'spring-boot',
    questionCount: 4
  },
  {
    id: 'cat-hibernate',
    name: 'Hibernate & JPA',
    description: 'Entity lifecycles, association mappings, lazy loading, and caching.',
    slug: 'hibernate-jpa',
    questionCount: 4
  },
  {
    id: 'cat-sql-db',
    name: 'SQL & Database',
    description: 'Relational database designs, indexes, transaction isolation levels, and joins.',
    slug: 'sql-database',
    questionCount: 4
  },
  {
    id: 'cat-frontend-integration',
    name: 'Frontend Integration',
    description: 'CORS, JWT authentication, state management, and REST/GraphQL integrations.',
    slug: 'frontend-integration',
    questionCount: 4
  }
];

export const mockQuestions: Question[] = [
  // --- Core Java ---
  {
    id: 'q-java-1',
    category_id: 'cat-core-java',
    type: 'mcq',
    question_text: 'What will be the output of the following Java program snippet?\n\n```java\nList<String> list = Arrays.asList("a", "b", "c");\nlist.stream()\n    .filter(s -> {\n        System.out.print(s);\n        return true;\n    });\n```',
    options: [
      'Prints "abc" immediately',
      'Throws an UnsupportedOperationException',
      'Prints nothing because streams are evaluated lazily',
      'Compiler error on filter statement'
    ],
    correct_answer: 'Prints nothing because streams are evaluated lazily',
    explanation: 'Java Streams are evaluated lazily. Intermediate operations (like `filter()`) are not processed until a terminal operation (like `collect()`, `forEach()`, or `count()`) is invoked on the stream. Since there is no terminal operation here, the printing statement inside filter is never executed.',
    difficulty: 'medium'
  },
  {
    id: 'q-java-2',
    category_id: 'cat-core-java',
    type: 'fill_blank',
    question_text: 'In Java, the keyword used to prevent a variable from being serialized during object serialization is `____________`.',
    options: null,
    correct_answer: 'transient',
    explanation: 'The `transient` keyword in Java is used to indicate that a field should not be serialized when the object containing it is serialized. When an object is deserialized, transient variables are initialized with their default values (e.g., null for objects, 0 for integers).',
    difficulty: 'easy'
  },
  {
    id: 'q-java-3',
    category_id: 'cat-core-java',
    type: 'mcq',
    question_text: 'Consider the following Java thread safety code snippet. Which of the following is TRUE about the `volatile` keyword in Java?\n\n```java\npublic class SharedFlag {\n    private volatile boolean active = true;\n    // getter and setter\n}\n```',
    options: [
      'It provides mutual exclusion, acting like a lightweight synchronized block.',
      'It guarantees visibility, ensuring reads always fetch the most recent write directly from main memory.',
      'It prevents variables from being accessed by more than one thread at a time.',
      'It automatically makes operations like compound increments (i++) atomic.'
    ],
    correct_answer: 'It guarantees visibility, ensuring reads always fetch the most recent write directly from main memory.',
    explanation: 'The `volatile` keyword guarantees that writes to a variable are immediately visible to all threads. It ensures that reads and writes go directly to/from main memory instead of CPU caches, but it does NOT provide atomicity or mutual exclusion (for example, `count++` is still unsafe).',
    difficulty: 'hard'
  },
  {
    id: 'q-java-4',
    category_id: 'cat-core-java',
    type: 'fill_blank',
    question_text: 'The memory region in the Java Virtual Machine (JVM) where all actual object instances are allocated is called the `______` memory.',
    options: null,
    correct_answer: 'heap',
    explanation: 'All object instances and arrays are allocated in the Heap memory in the JVM. Stack memory, on the other hand, is used for thread execution, local variables, and method call frames.',
    difficulty: 'easy'
  },

  // --- Spring Boot ---
  {
    id: 'q-spring-1',
    category_id: 'cat-spring-boot',
    type: 'mcq',
    question_text: 'In Spring Framework, what is the default scope of a declared Spring Bean?',
    options: [
      'prototype',
      'request',
      'singleton',
      'session'
    ],
    correct_answer: 'singleton',
    explanation: 'The default scope for a Spring Bean is `singleton`. Spring container creates exactly one instance of the bean and injects it into all collaborators. Prototype scope, on the other hand, creates a new instance every time a bean is requested.',
    difficulty: 'easy'
  },
  {
    id: 'q-spring-2',
    category_id: 'cat-spring-boot',
    type: 'fill_blank',
    question_text: 'To bootstrap a full Spring Boot application and enable auto-configuration, component scanning, and property binding, we annotate the main entrypoint class with `@_______________________`.',
    options: null,
    correct_answer: 'SpringBootApplication',
    explanation: 'The `@SpringBootApplication` annotation is a convenience annotation that combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan` with their default attributes.',
    difficulty: 'medium'
  },
  {
    id: 'q-spring-3',
    category_id: 'cat-spring-boot',
    type: 'mcq',
    question_text: 'When designing a REST controller in Spring Boot, which annotation is a composed shortcut mapping that handles HTTP DELETE requests?\n\n```java\n@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n    // Which annotation goes here for deletes?\n    public ResponseEntity<Void> deleteUser(@PathVariable Long id) { ... }\n}\n```',
    options: [
      '@RemoveMapping',
      '@DeleteMapping',
      '@RequestMapping(method = RequestMethod.REMOVE)',
      '@DeleteAction'
    ],
    correct_answer: '@DeleteMapping',
    explanation: '`@DeleteMapping` is a composed annotation that acts as a shortcut for `@RequestMapping(method = RequestMethod.DELETE)`. Similar shortcuts include `@GetMapping`, `@PostMapping`, `@PutMapping`, and `@PatchMapping`.',
    difficulty: 'easy'
  },
  {
    id: 'q-spring-4',
    category_id: 'cat-spring-boot',
    type: 'fill_blank',
    question_text: 'In Spring Security, the interface used to load user-specific data during authentication (typically by username) is `__________________`.',
    options: null,
    correct_answer: 'UserDetailsService',
    explanation: 'The `UserDetailsService` interface has a single method `loadUserByUsername(String username)` which is implemented to retrieve user credentials and roles from a database or storage during the authentication process.',
    difficulty: 'hard'
  },

  // --- Hibernate & JPA ---
  {
    id: 'q-hib-1',
    category_id: 'cat-hibernate',
    type: 'mcq',
    question_text: 'In Hibernate/JPA, which entity state represents a Java object that is not yet associated with a database row or active session context?',
    options: [
      'Managed (Persistent)',
      'Transient',
      'Detached',
      'Removed'
    ],
    correct_answer: 'Transient',
    explanation: 'A `Transient` state entity is a newly created Java object that has no database identity (primary key) and is not yet associated with a Hibernate Session. Once saved or persisted, it transitions to the `Managed` state.',
    difficulty: 'medium'
  },
  {
    id: 'q-hib-2',
    category_id: 'cat-hibernate',
    type: 'fill_blank',
    question_text: 'To configure a bidirectional One-to-Many relationship in JPA, we use the `____________` attribute on the `@OneToMany` side to point to the field name that owns the relationship on the `@ManyToOne` side.',
    options: null,
    correct_answer: 'mappedBy',
    explanation: 'The `mappedBy` attribute is used in JPA bidirectional relationships to specify the owning side of the association. It is placed on the inverse side (typically `@OneToMany`) and refers to the attribute name in the target entity.',
    difficulty: 'medium'
  },
  {
    id: 'q-hib-3',
    category_id: 'cat-hibernate',
    type: 'mcq',
    question_text: 'What exception is thrown in JPA if you attempt to access an uninitialized lazy-loaded relationship outside of an active Hibernate Session / Transaction context?\n\n```java\n// Session is closed here\nSystem.out.println(user.getOrders().size()); // Orders mapped with FetchType.LAZY\n```',
    options: [
      'NullPointerException',
      'LazyInitializationException',
      'EntityNotFoundException',
      'TransactionRequiredException'
    ],
    correct_answer: 'LazyInitializationException',
    explanation: 'Hibernate throws a `LazyInitializationException` when you access a lazily fetched association (like `FetchType.LAZY`) after the database session is closed. This occurs because Hibernate can no longer fire the SQL query required to fetch the records since the connection context is gone.',
    difficulty: 'hard'
  },
  {
    id: 'q-hib-4',
    category_id: 'cat-hibernate',
    type: 'fill_blank',
    question_text: 'In JPA, the base interface that represents the central contract for interacting with the persistence context (providing methods like persist, merge, and remove) is `____________`.',
    options: null,
    correct_answer: 'EntityManager',
    explanation: 'The `EntityManager` interface is the core interface of JPA. It represents a Session-like manager used to create, find, merge, delete, and query entities in a persistent database context.',
    difficulty: 'medium'
  },

  // --- SQL & Database ---
  {
    id: 'q-sql-1',
    category_id: 'cat-sql-db',
    type: 'mcq',
    question_text: 'Which transaction isolation level is the strictest, fully preventing Dirty Reads, Non-Repeatable Reads, and Phantom Reads?',
    options: [
      'READ_COMMITTED',
      'REPEATABLE_READ',
      'SERIALIZABLE',
      'READ_UNCOMMITTED'
    ],
    correct_answer: 'SERIALIZABLE',
    explanation: '`SERIALIZABLE` is the highest isolation level. It forces transactions to run in a way that produces the same results as if they were executed serially (sequentially), preventing all concurrency anomalies including Phantom Reads (by locking ranges of rows).',
    difficulty: 'hard'
  },
  {
    id: 'q-sql-2',
    category_id: 'cat-sql-db',
    type: 'fill_blank',
    question_text: 'In relational databases, an index that enforces uniqueness on the indexed column(s) while physically ordering the actual rows on disk to match is called a `_________` index.',
    options: null,
    correct_answer: 'clustered',
    explanation: 'A `clustered` index determines the physical order of data rows in a table. Because rows can only be sorted in one physical order, there can be only one clustered index per table (typically the Primary Key).',
    difficulty: 'medium'
  },
  {
    id: 'q-sql-3',
    category_id: 'cat-sql-db',
    type: 'mcq',
    question_text: 'Consider the SQL snippet. Which join type returns all records from the left table and the matched records from the right table, filling with NULL values on the right where no match occurs?\n\n```sql\nSELECT * FROM employees e _____ JOIN departments d ON e.dept_id = d.id;\n```',
    options: [
      'INNER',
      'RIGHT',
      'LEFT',
      'FULL OUTER'
    ],
    correct_answer: 'LEFT',
    explanation: 'A `LEFT JOIN` (or `LEFT OUTER JOIN`) returns all rows from the left table (`employees`), and matched rows from the right table (`departments`). If there is no match, the right side columns are filled with `NULL`.',
    difficulty: 'easy'
  },
  {
    id: 'q-sql-4',
    category_id: 'cat-sql-db',
    type: 'fill_blank',
    question_text: 'In SQL database transaction properties (ACID), the letter "C" stands for `___________`.',
    options: null,
    correct_answer: 'consistency',
    explanation: 'In ACID, C stands for Consistency. It ensures that a transaction takes the database from one valid state to another, satisfying all database constraints, triggers, and cascades.',
    difficulty: 'easy'
  },

  // --- Frontend Integration ---
  {
    id: 'q-fe-1',
    category_id: 'cat-frontend-integration',
    type: 'mcq',
    question_text: 'What security mechanism does the browser enforce to restrict web pages from making HTTP requests to a domain different from the one that served the web page?',
    options: [
      'CSRF (Cross-Site Request Forgery)',
      'CORS (Cross-Origin Resource Sharing)',
      'SOP (Same-Origin Policy)',
      'XSS (Cross-Site Scripting)'
    ],
    correct_answer: 'SOP (Same-Origin Policy)',
    explanation: 'The Same-Origin Policy (SOP) is a core web browser security mechanism that restricts a script loaded from one origin from interacting with resources on another origin. `CORS` is the mechanism used to relax or bypass this restriction in a controlled way.',
    difficulty: 'medium'
  },
  {
    id: 'q-fe-2',
    category_id: 'cat-frontend-integration',
    type: 'fill_blank',
    question_text: 'In full stack web tokens (JWT) authentication, the JWT is typically sent in the HTTP Request header named `_____________` using the prefix "Bearer ".',
    options: null,
    correct_answer: 'Authorization',
    explanation: 'JSON Web Tokens are sent in the `Authorization` header with the Bearer schema. For example: `Authorization: Bearer <token_string>`.',
    difficulty: 'easy'
  },
  {
    id: 'q-fe-3',
    category_id: 'cat-frontend-integration',
    type: 'mcq',
    question_text: 'When integrated with a Java REST backend, which HTTP status code is returned if the user tries to access a protected resource without a valid login token (unauthenticated)?',
    options: [
      '400 Bad Request',
      '401 Unauthorized',
      '403 Forbidden',
      '405 Method Not Allowed'
    ],
    correct_answer: '401 Unauthorized',
    explanation: 'Status code `401 Unauthorized` specifically indicates that the request requires user authentication (the user is not logged in or the token is invalid). `403 Forbidden` indicates the user is logged in but doesn\'t have the required roles or permissions (unauthorized access).',
    difficulty: 'easy'
  },
  {
    id: 'q-fe-4',
    category_id: 'cat-frontend-integration',
    type: 'fill_blank',
    question_text: 'To prevent Cross-Site Request Forgery (CSRF) when integrated with Spring Boot, the backend can issue unique tokens called `____` tokens to be included in POST/PUT requests from the frontend client.',
    options: null,
    correct_answer: 'csrf',
    explanation: 'CSRF (Cross-Site Request Forgery) tokens are unique, secret, and unpredictable tokens generated by the server-side application to protect state-changing requests by ensuring they originate from the legitimate user.',
    difficulty: 'easy'
  }
];
