# Job Application Tracker

A full-stack CRUD application for tracking job applications by application stage.

## Problem Statement

Students and early-career job seekers often juggle dozens of applications across different companies and interview stages. This app provides one place to create, view, update, delete, search, and filter application records.

## Target User

Students, recent graduates, and career changers who need a simple job search tracker.

## Features

- Full CRUD for job applications.
- View all applications and one individual application.
- Search by keyword (name/description).
- Filter by application stage.
- Sort by newest, oldest, A-Z, and Z-A.
- Application stage totals dashboard.
- Frontend loading, empty, and error states.
- Frontend and backend validation.
- Confirmation before delete.

## Technology

- React
- Vite
- JavaScript
- Node.js
- Express
- PostgreSQL
- Prisma ORM with `@prisma/adapter-pg`
- Docker Compose

## Project Proposal (Required Planning Document #1)

- What is the application?
  This is a job application tracking tool.
- What problem does it solve?
  It keeps job search activity organized across multiple companies and stages.
- Who is the target user?
  Students and job seekers managing ongoing applications.
- What is the main resource?
  `items`
- What CRUD actions are supported?
  Create application, read all/one application, update application, delete application.
- What are the two related tables?
  `categories` and `items`

## Database Design (Required Planning Document #2)

### Tables

- `categories`
  Represents application stages such as Applied, Interview Scheduled, Final Round, and Offer.
- `items`
  Represents each tracked job application record.

### Relationship

- One category has many items.
- `items.category_id` is a foreign key to `categories.id`.

### Why these columns and types?

- `id SERIAL`: simple auto-incrementing primary keys.
- `name VARCHAR(100)`: short required names.
- `description TEXT`: flexible longer notes.
- `created_at TIMESTAMP`: supports date sorting and timeline visibility.

### ER Diagram

```mermaid
erDiagram
  CATEGORIES ||--o{ ITEMS : contains

  CATEGORIES {
    int id PK
    string name
    timestamp created_at
  }

  ITEMS {
    int id PK
    string name
    text description
    int category_id FK
    timestamp created_at
  }
```

## API Plan (Required Planning Document #3)

| Method | Endpoint           | Purpose                                                  |
| ------ | ------------------ | -------------------------------------------------------- |
| GET    | `/api/health`      | Health check                                             |
| GET    | `/api/categories`  | Get all categories                                       |
| GET    | `/api/items`       | Get all items (supports search/filter/sort query params) |
| GET    | `/api/items/:id`   | Get one item by id                                       |
| POST   | `/api/items`       | Create an item                                           |
| PUT    | `/api/items/:id`   | Update an item                                           |
| DELETE | `/api/items/:id`   | Delete an item                                           |
| GET    | `/api/items/stats` | Aggregated count of items by category                    |

## Component Plan (Required Planning Document #4)

```text
App
├── Navbar
├── ItemForm
├── SearchBar
├── StatusMessage
├── ItemList
│   └── ItemCard
└── CategoryStats
```

## Backend Response Shape

Example success:

```json
{
  "message": "Item created successfully",
  "data": {
    "id": 12,
    "name": "USB-C Hub",
    "description": "7-port adapter",
    "categoryId": 1
  }
}
```

Example error:

```json
{
  "message": "name, description, and a valid categoryId are required"
}
```

## SQL Coverage

This project demonstrates:

- `CREATE TABLE`: [apps/backend/database/schema.sql](apps/backend/database/schema.sql)
- `INSERT`: [apps/backend/database/seed.sql](apps/backend/database/seed.sql)
- `SELECT`, `WHERE`, `ORDER BY`, `JOIN`: [apps/backend/server/controllers/itemController.js](apps/backend/server/controllers/itemController.js)
- `UPDATE` and `DELETE`: Prisma queries in [apps/backend/server/controllers/itemController.js](apps/backend/server/controllers/itemController.js)
- Explicit SQL examples for `SELECT`, `WHERE`, `ORDER BY`, `JOIN`, `UPDATE`, and `DELETE`: [apps/backend/database/query_examples.sql](apps/backend/database/query_examples.sql)

Join example used by the API:

```sql
SELECT
  items.id,
  items.name,
  items.description,
  items.category_id,
  items.created_at,
  categories.name AS category_name
FROM items
JOIN categories ON items.category_id = categories.id
WHERE items.id = $1
LIMIT 1;
```

## Environment Variables

Create [apps/backend/.env](apps/backend/.env) from [apps/backend/.env.example](apps/backend/.env.example).

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/backend-db?schema=public"
PORT=3001
```

`.env` is ignored by Git in [.gitignore](.gitignore).

## Installation and Local Development

1. Clone the repository.
2. Install backend dependencies:

```bash
cd apps/backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Configure environment variables:

```bash
cd ../backend
cp .env.example .env
```

5. Start PostgreSQL with Docker:

```bash
npm run db:up
```

6. Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

7. Seed data:

```bash
npm run db:seed
```

8. Start backend:

```bash
npm run dev
```

9. Start frontend (new terminal):

```bash
cd apps/frontend
npm run dev
```

## Manual Database Setup with SQL Files

If you prefer SQL files directly:

1. Ensure PostgreSQL is running.
2. Run schema:

```bash
cd apps/backend
npm run sql:schema
```

3. Run seed:

```bash
npm run sql:seed
```

## Validation Rules

### Frontend

- Required fields (`name`, `description`, `categoryId`).
- Input minimum length on name and description.

### Backend

- Rejects missing/invalid fields with `400`.
- Rejects invalid ids with `400`.
- Returns `404` when an item does not exist.

## HTTP Status Codes Used

- `200` successful reads/updates/deletes
- `201` successful create
- `400` invalid request data
- `404` record not found
- `500` unexpected server errors

## Testing Checklist

- Create item from form.
- View all items.
- View one item endpoint.
- Update an item.
- Delete an item (with confirmation).
- Search/filter/sort via backend query params.
- Verify loading/error/empty states in frontend.

## Presentation Talking Points

- Problem and target user.
- Live CRUD walkthrough.
- Explain table relationship and foreign key.
- Demonstrate SQL join endpoint.
- Technical challenge: syncing UI state after edit/delete while preserving filters.

## AI Reflection (Required)

Use this section before submission:

1. How did you use AI?
2. What did AI help you understand?
3. What incorrect or incomplete AI response did you encounter?
4. How did you test AI-generated code?
5. What part of the project can you explain without AI assistance?

## Repository Requirements Reminder

- Commit regularly with meaningful messages.
- Do not commit `node_modules`, `.env`, passwords, or API keys.
- Include schema, seed, `.env.example`, and README.
