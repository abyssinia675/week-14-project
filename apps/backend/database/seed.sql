INSERT INTO categories (name)
VALUES
  ('Applied'),
  ('Interview Scheduled'),
  ('Final Round'),
  ('Offer');

INSERT INTO items (name, description, category_id)
VALUES
  ('Software Engineer Intern - Shopify', 'Application submitted through the careers portal. Waiting for recruiter response.', 1),
  ('Frontend Developer - Figma', 'Recruiter screen completed. Technical interview scheduled for next Tuesday.', 2),
  ('Product Analyst - Notion', 'Completed take-home assignment and preparing for final panel interview.', 3),
  ('UX Research Assistant - Duolingo', 'Received a verbal offer and waiting for the written details.', 4);
