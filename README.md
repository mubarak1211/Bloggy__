# Bloggy

Bloggy is a MERN blog application where people can publish posts, browse the community feed, and manage their own writing. It includes a responsive React interface with light and dark themes and an Express REST API backed by MongoDB.

## Features

- Create an account and sign in with a password hash stored by the API.
- Receive a signed, seven-day authentication token after signing in.
- View your profile from the navigation bar, including your account name and email, and edit your name.
- Browse public posts from all authors.
- Create, edit, and delete only posts owned by the signed-in account.
- View an account's own posts on the **My blogs** page.
- Use responsive layouts, light/dark themes, and empty states for new accounts.

## Technology

- MongoDB and Mongoose
- Node.js and Express
- React 18 and React Router
- Redux Toolkit for UI state
- Material UI
- bcryptjs and Node.js crypto for password hashing and signed tokens

## Project structure

```text
client/                 React application
  src/api.js            Axios client that attaches the auth token
  src/components/       Page and blog components
server/                 Express API
  config/               MongoDB connection
  controller/           Request handlers
  middleware/           Authentication middleware
  model/                Mongoose models
  routes/               REST route definitions
  utils/                API responses and token signing
```

## Prerequisites

- Node.js 18 or later and npm
- A MongoDB Community Server running locally, or a MongoDB Atlas database

## Setup

1. Install backend dependencies and create its environment file:

   ```powershell
   cd server
   npm install
   Copy-Item .env.example .env
   ```

2. Edit `server/.env`. Set `MONGO_URI` to your MongoDB connection string and replace `JWT_SECRET` with a random secret of at least 32 characters. To generate one in Node.js, run:

   ```powershell
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   Keep `.env` private and do not commit it. The example file uses a local database at `mongodb://127.0.0.1:27017/Blog`.

3. Start the API from the `server` directory:

   ```powershell
   npm run dev
   ```

   The API listens on `http://localhost:5001` by default. Use `npm start` to run it without nodemon.

4. In a second terminal, install and start the React app:

   ```powershell
   cd client
   npm install
   npm start
   ```

   The client opens at `http://localhost:3000`. To use a different API URL, set `REACT_APP_API_URL` in `client/.env` before starting React.

## REST API

All successful responses use a consistent JSON envelope with `statusCode`, `data`, `message`, and `success` fields.

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/users/signup` | Public | Create an account |
| `POST` | `/api/users/login` | Public | Sign in and receive a token |
| `GET` | `/api/users/me` | Bearer token | Get the current account |
| `PATCH` | `/api/users/me` | Bearer token | Update the current account's name |
| `GET` | `/api/blogs` | Public | List all public posts |
| `GET` | `/api/blogs/:id` | Public | Get one post |
| `GET` | `/api/blogs/mine` | Bearer token | List the current account's posts |
| `POST` | `/api/blogs/add` | Bearer token | Create a post |
| `PUT` | `/api/blogs/update/:id` | Bearer token | Update an owned post |
| `DELETE` | `/api/blogs/:id` | Bearer token | Delete an owned post |

Send protected requests with `Authorization: Bearer <token>`. The API checks ownership on update and delete operations.

## Code0 and AI-assisted development

Code0 was used through its terminal for Git commits. AI assistance was used during development to inspect and implement features, investigate errors, and update project documentation. Review this description before submitting and keep only the parts that match your own workflow.

### Code0 tasks completed

- Used the Code0 terminal to create Git commits for project changes.
- Compared the README setup instructions with the backend and frontend package scripts and environment examples.
- Reviewed the blog form's loading, success, and error states on phone and desktop sizes, made one focused improvement, and tried both a successful and an invalid submission.
- Reviewed and improved validation for blog creation and editing, then tried valid and invalid requests and checked the responses.
- Traced blog creation and deletion through the API, controllers, and MongoDB models; checked that deleting a blog removes its reference from the user's blog list, fixed any issue found, and verified by creating and deleting a test blog.

The assessment asks for three to five specific Code0 tasks. Add more items here only after completing those tasks with Code0, and describe how you checked its suggestions. Do not present AI-assisted work from another environment as Code0 work.

## GitHub submission checklist

- Create a public repository for this project.
- Use the Code0 terminal for repository initialization and GitHub pushes, as required by the assessment. Commits were made with Code0.
- Keep `.env` and database credentials out of Git.
- Expand the Code0 task list to three to five accurate examples before submitting.
