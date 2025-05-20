# PulseBoard

**PulseBoard** is a full-featured project management SaaS application designed to help teams and individuals organize their work efficiently. It combines powerful project management features similar to Notion and Linear with a user-friendly interface.

---

## Features

- Multi-workspace support — manage multiple teams or projects within separate workspaces
- Task and project management with boards, lists, and customizable statuses
- User onboarding and authentication system
- Subscription-based billing integrated with Khalti
- Admin dashboard for workspace and user management
- Real-time notifications 
- Responsive and modern UI built with Next.js and React
- Data persistence with PostgreSQL using Prisma ORM

---

## Tech Stack

- **Frontend:** Next.js, React  
- **Backend:** Node.js, Hono.js API routes with Next.js  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Queue & Notifications:** BullMQ with ioredis  
- **Payments:** Khalti
- **Hosting:** Vercel (frontend), any compatible backend for serverless or containerized deployment

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- PostgreSQL database  
- Redis server for queue management  
- Stripe account for billing integration  

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/project-management.git
   cd project-management
