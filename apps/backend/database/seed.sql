INSERT INTO categories (name)
VALUES
  ('Frontend'),
  ('Backend'),
  ('Database');

INSERT INTO items (name, description, category_id)
VALUES
  ('Build a React page', 'Create a component that fetches data from the Express API.', 1),
  ('Create an Express route', 'Add a REST endpoint that returns JSON from PostgreSQL.', 2),
  ('Design a table', 'Practice creating related tables with primary and foreign keys.', 3);
