-- SQL requirement examples for rubric verification

-- SELECT with JOIN, WHERE, and ORDER BY
SELECT
  items.id,
  items.name,
  items.description,
  categories.name AS category_name,
  items.created_at
FROM items
JOIN categories ON items.category_id = categories.id
WHERE categories.name = 'Applied'
ORDER BY items.created_at DESC;

-- UPDATE example
UPDATE items
SET name = 'Backend Engineer - Stripe',
    description = 'Moved to recruiter screen and updated compensation notes'
WHERE id = 1;

-- DELETE example
DELETE FROM items
WHERE id = 1;
