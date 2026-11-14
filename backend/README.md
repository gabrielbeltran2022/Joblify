---

### Backend README (`backend/README.md`)

```markdown
# Joblify Backend (MERN API)

The RESTful API server for **Joblify**, built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization:** JWT-based user authentication and role-based access control (Employers vs. Job Seekers).
- **Job Management:** Full CRUD operations for creating, updating, and listing job postings.
- **Employer & Candidate Profiles:** Endpoints for managing company details and searching applicant profiles.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- MongoDB (Local instance or MongoDB Atlas URI)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend