# BE Assessment Backend

This is the backend for the **BE Assessment** project, built with **Node.js, Express, and MongoDB**. It supports event booking, seat reservation, user management, QR code generation, and email notifications.

---

## Features

- Event listing and seat selection
- Booking with wallet validation
- QR code generation for tickets
- Email notifications with ticket attachment
- Cron job to release reserved seats automatically
- Fully compatible with Docker for containerized deployment

---

## Getting Started

### Local Development

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd be_assement
Install dependencies

bash
Copy code
npm install
Create .env file

Create a .env file in the root of the project and add your environment variables. Example:

env
Copy code
PORT=3000
MONGO_URL=mongodb://mongo:27017/Event-booking   // when you are using docker
MONGO_URL=mongodb://localhost:27017/Event-booking  // when you are using local mechine
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
Run the server in development mode (with hot-reload)

bash
Copy code
npm run dev
The server will start at http://localhost:3000 and automatically reload on changes.

Production / Docker Deployment
Build and start containers

bash
Copy code
docker-compose up --build
Access the backend

Backend API: http://localhost:3000

MongoDB: mongodb://mongo:27017/be_assement (internal Docker hostname)

Stop containers

bash
Copy code
docker-compose down