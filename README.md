# AI Snippets Service

A full-stack AI-powered service to summarize raw text using **Google Gemini AI API.**
Built with a **Remix frontend**, an **Express backend**, **JWT authentication** and **MongoDB** for persistence.

---

## Features

- Create and store text snippets
- AI-powered summary generation (Google Gemini)
- Real-time streaming summaries (SSE)
- User authentication via JWT
- MongoDB data persistence
- End-to-end testing (Jest + Supertest)
- Full Dockerized stack (frontend, backend, MongoDB)

---

## Tech Stack

- **Frontend**: Remix (TypeScript)
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT
- **AI**: Google Gemini API
- **Testing**: Jest + Supertest
- **Docker**: Docker, docker-compose

---

## Local Setup

### Prerequisites

- Node.js v20+
- Docker & Docker Compose
- Gemini API key
- MongoDB connection URI (can be local or cloud)

### Installation

Clone the repository:
```bash
git clone https://github.com/raphaelAndrade/ai-snippet-service.git
cd ai-snippet-service
```

Create a .env file at the project root:
```bash
MONGO_URI=mongodb://mongo:27017/ai_snippets
PORT=3000
GOOGLE_API_KEY=AIzaSyDC4oMiMlp4DRju1jjKWLsNaOvH1QHaTeA
JWT_SECRET=aa584f9fa8f6acb14ad6418499b2053cdae27c64aeee69f4c4eaf20562524ac6df8eff6744714950861961c071d89f88f5fea1d3551ba471ca6d54a8e2fea5ae

```

Create a .env file at the root of the frontend folder:
```bash
NODE_ENV=development
API_URL=http://backend:3000

```

---

## Running with Docker

Use Docker Compose to start all services:

```bash
docker-compose up --build
```

This will:
- Spin up MongoDB
- Start the backend API at http://localhost:3000
- Serve the frontend at http://localhost:3030

---

## Usage

1. Navigate to [http://localhost:3030/login](http://localhost:3030/login) and log in using the following mock users:

   - **User 1**:  
     - Email: `user1@example.com`  
     - Password: `123456`
     - Role: `user`
   
   - **User 2**:  
     - Email: `user2@example.com`  
     - Password: `123456`
     - Role: `user`

   - **Admin**:  
     - Email: `admin@example.com`  
     - Password: `123456`
     - Role: `admin`
     
   **Note**: Each user can only view the snippets they created, while the admin can view all snippets.

2. After logging in, enter some text into the summarizer to create a snippet.
3. View the list of your snippets with AI summaries.
4. Click on any snippet in the list to view it in detail on the snippet details page.
5. Log out and verify that the snippet list is cleared.

---

## Running Tests

Create a .env.test file for test environment:
```bash
GOOGLE_API_KEY=AIzaSyDC4oMiMlp4DRju1jjKWLsNaOvH1QHaTeA
MONGO_URI=mongodb://localhost:27017/ai-snippet-service-test
JWT_SECRET=aa584f9fa8f6acb14ad6418499b2053cdae27c64aeee69f4c4eaf20562524ac6df8eff6744714950861961c071d89f88f5fea1d3551ba471ca6d54a8e2fea5ae
```

Run tests with:
```bash
npm test
```

Tests will cover:
- Auth routes and protection
- Snippet creation and summary
- SSE endpoint validation
- Unauthorized access protection
- Error scenarios and edge cases

---

## API Usage (Examples with curl)

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user1@example.com", "code": "123456"}'
```

### Create a snippet:
```bash
curl -X POST http://localhost:3000/snippets \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"text": "Some long text to summarize"}'
```

### Stream AI summary:
```bash
curl http://localhost:3000/snippets/stream?text=Test+text \
  -H "Authorization: Bearer <your_token>"
```

---

## API Key & .env.example
Add a `.env` file based on `.env.example`

You can use this as a starting point for local configuration:
```env
GOOGLE_API_KEY=AIzaSyDC4oMiMlp4DRju1jjKWLsNaOvH1QHaTeA
MONGO_URI=mongodb://localhost:27017/ai-snippet-service-test
JWT_SECRET=aa584f9fa8f6acb14ad6418499b2053cdae27c64aeee69f4c4eaf20562524ac6df8eff6744714950861961c071d89f88f5fea1d3551ba471ca6d54a8e2fea5ae
API_URL=http://localhost:3000
```

---

## Final Thoughts: What I Would Do With More Time 

- Implement refresh tokens and auto-expiry handling 
- Implement full authentication system
- Add pagination and sorting for snippet history 
- Improve accessibility and keyboard navigation 
- Implement logout endpoint with token invalidation (blacklisting or short expiry)
- Improve error boundaries, toast notifications, loading states 
- Polish UI & visual feedback (typing animations, success/failure states)

**Backend Focus:** Since the AI service is integrated into the backend, in a real-world application, I would create a separate Python environment for it. This would allow for better prompt configuration before sending it to Gemini, better logging management, easier scalability, and using the AI in different applications.

**Monorepo Decision:** For this project, I opted for a monorepo. However, in a production-ready app, I would split the frontend and backend into separate repositories to better handle scaling and deployment.

**Frontend:** If I had more time, I would add unit tests to the frontend and improve the UI, but I focused on keeping it simple for testing purposes, while exploring Remix.

---

## Author

Raphael Andrade - Full Stack Developer - LinkedIn: https://www.linkedin.com/in/raphaelandrade1/