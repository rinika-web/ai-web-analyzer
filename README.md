# 🤖 AI Website Analyzer

An AI-powered website auditing platform that analyzes websites across **performance, SEO, accessibility, and best practices**, then generates actionable recommendations using **Google Gemini AI**.

The application combines **Lighthouse/PageSpeed Insights, Puppeteer, Cheerio, PostgreSQL, Prisma, JWT authentication, and Gemini AI** into a full-stack website analysis pipeline.

---

## 🚀 Live Demo

**Live:** `YOUR_DEPLOYED_URL`

**Repository:** `YOUR_GITHUB_REPOSITORY_URL`

---

## 📌 Overview

AI Website Analyzer allows users to enter a website URL and receive a detailed technical audit.

The platform analyzes:

* ⚡ Performance
* 🔎 SEO
* ♿ Accessibility
* 🛡️ Best Practices
* 📊 Core Web Vitals
* 🔗 Links and metadata
* 🐛 Website issues
* 💡 Performance recommendations
* 🤖 AI-powered analysis

Users can also:

* Create an account
* Log in securely
* View previous analyses
* Open saved reports
* View AI-generated insights
* Delete analysis history
* Download reports as PDF

---

## ✨ Features

### 🔐 Authentication

* User registration and login
* Password hashing with bcrypt
* JWT-based authentication
* Protected API routes
* User-specific analysis history
* Authorization checks to prevent users from accessing other users' reports

### 🔍 Website Analysis

The application performs a multi-stage website audit using:

* Puppeteer for browser automation
* Google PageSpeed Insights / Lighthouse
* Cheerio for HTML parsing
* Custom analysis modules

The analyzer extracts information such as:

* Page title
* SEO metadata
* Heading structure
* Links
* Images
* Missing alt attributes
* Core Web Vitals
* Performance metrics
* DOM size
* Network requests
* Render-blocking resources
* Unused CSS
* Unused JavaScript
* Image optimization opportunities

### 📊 Scoring System

The analyzer generates scores for:

| Category       | Description                             |
| -------------- | --------------------------------------- |
| Performance    | Website loading and runtime performance |
| SEO            | Search engine optimization              |
| Accessibility  | Accessibility compliance                |
| Best Practices | Modern web development practices        |
| Overall        | Combined website health                 |

The report also provides:

* Overall grade
* Website health status
* Performance metrics
* Issues
* Recommendations

### 🤖 AI Website Analysis

Google Gemini analyzes the collected website data and generates:

* AI summary
* Website strengths
* Highest-priority improvements
* Final engineering recommendation

Instead of simply displaying raw Lighthouse data, the AI layer converts technical findings into a more understandable engineering summary.

### 📚 Analysis History

Authenticated users can:

* View previous analyses
* Open individual reports
* View saved AI analysis
* Review previous issues
* Review recommendations
* Delete reports

Each analysis is associated with the authenticated user's database ID.

### 📄 PDF Reports

Users can generate downloadable PDF reports containing the website's analysis results.

PDF generation is handled using Puppeteer.

### 🛡️ Request Validation

API input is validated using **Zod** before processing.

This prevents malformed requests from reaching the analysis pipeline.

Example validation flow:

```text
Request
   ↓
Zod validation
   ↓
Authentication
   ↓
Website analysis
```

### 🚦 Rate Limiting

Rate limiting is implemented to help prevent excessive requests to the analysis endpoint and protect expensive operations such as:

* Puppeteer
* PageSpeed API
* Gemini API
* Database operations

---

# 🏗️ Architecture

## Current Architecture

The current application uses a synchronous analysis pipeline suitable for an MVP and low-to-moderate traffic.

```text
                    ┌──────────────┐
                    │    Client    │
                    │   Next.js    │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  API Server     │
                  │  /api/analyze   │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Puppeteer     PageSpeed      Cheerio
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                    Analysis Engine
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Gemini        PostgreSQL    Screenshot
             │             │
             └─────────────┼─────────────┘
                           ▼
                       Response
```

---

# 🧠 Analysis Pipeline

When a user submits a website:

```text
1. User submits URL
        ↓
2. Zod validates request
        ↓
3. JWT authentication
        ↓
4. Puppeteer loads website
        ↓
5. PageSpeed/Lighthouse analysis
        ↓
6. HTML extracted with Cheerio
        ↓
7. SEO information analyzed
        ↓
8. Performance metrics calculated
        ↓
9. Issues identified
        ↓
10. Recommendations generated
        ↓
11. Gemini analyzes collected results
        ↓
12. Analysis stored in PostgreSQL
        ↓
13. Report returned to client
```

---

# 📈 Scalability Design

The current implementation intentionally keeps the architecture simple while documenting a path toward a distributed system.

Website analysis is computationally and I/O intensive because it involves:

* Browser automation
* External APIs
* Screenshot generation
* AI inference
* Database operations

At higher traffic volumes, running all of these operations synchronously inside an API request would increase latency and consume API server resources.

## Future Asynchronous Architecture

The next scalability step would be moving the analysis pipeline into background workers.

```text
                         Client
                           │
                           ▼
                    ┌─────────────┐
                    │ API Server  │
                    └──────┬──────┘
                           │
                    Create Analysis Job
                           │
                           ▼
                    ┌─────────────┐
                    │ Message     │
                    │ Queue       │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Worker    │
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        Puppeteer      PageSpeed      Gemini
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                      PostgreSQL
                           │
                           ▼
                    Analysis Complete
```

This architecture would allow:

* Horizontal worker scaling
* Better handling of traffic spikes
* Retryable failed jobs
* Isolation of Puppeteer workloads
* Lower API request latency
* Independent scaling of API and worker services

The asynchronous architecture is currently documented as a future scalability improvement rather than implemented prematurely.

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React
* Tailwind CSS
* JavaScript

## Backend

* Next.js API Routes
* Node.js
* Puppeteer
* Cheerio

## Database

* PostgreSQL
* Prisma ORM

## Authentication & Security

* JWT
* bcrypt
* Zod
* Rate limiting

## AI

* Google Gemini
* `@google/genai`

## Website Auditing

* Google PageSpeed Insights
* Lighthouse

## PDF Generation

* Puppeteer

---

# 📂 Project Structure

```text
src/
│
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── history/
│   │   └── report/
│   │
│   ├── dashboard/
│   ├── history/
│   ├── login/
│   ├── register/
│   ├── report/
│   └── score/
│
├── lib/
│   ├── analyzer/
│   │   ├── issues.js
│   │   ├── links.js
│   │   ├── metrics.js
│   │   ├── recommendations.js
│   │   ├── screenshot.js
│   │   ├── scores.js
│   │   ├── seo.js
│   │   └── summary.js
│   │
│   ├── auth.js
│   ├── gemini.js
│   ├── pagespeed.js
│   ├── prisma.js
│   └── validations/
│       └── analyze.js
│
└── generated/
    └── prisma/
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone YOUR_REPOSITORY_URL

cd ai-website-analyzer
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_database_url"

JWT_SECRET="your_secret_key"

GEMINI_API_KEY="your_gemini_api_key"
```

### Environment Variables

| Variable         | Description                    |
| ---------------- | ------------------------------ |
| `DATABASE_URL`   | PostgreSQL connection string   |
| `JWT_SECRET`     | Secret used to sign JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key          |

**Never commit your `.env` file to GitHub.**

---

# 🗄️ Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

Validate the Prisma schema:

```bash
npx prisma validate
```

---

# ▶️ Run the Application

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔒 Security Considerations

The application includes several security mechanisms:

### Password Security

Passwords are hashed using bcrypt before being stored.

```text
Plain Password
      ↓
    bcrypt
      ↓
Hashed Password
      ↓
 PostgreSQL
```

### Authentication

JWT tokens are used to authenticate protected API requests.

```http
Authorization: Bearer <token>
```

### Authorization

Analysis records are associated with a specific user:

```text
Analysis.userId → User.id
```

API routes verify ownership before allowing users to access or delete reports.

### Input Validation

Zod validates incoming API data before the analysis pipeline executes.

### Rate Limiting

Rate limiting helps protect expensive analysis and AI operations from excessive requests.

---

# 🧪 Example Analysis

A typical report can contain:

```text
Overall Score: 98
Grade: A
Health: Excellent

SEO: 100
Performance: 97
Accessibility: 95
Best Practices: 100
```

The AI layer then converts these results into actionable engineering recommendations such as:

```text
Summary
Strengths
Highest Priority Improvements
Final Recommendation
```

---

# 💡 Engineering Challenges

Some of the main engineering challenges addressed in this project include:

### Long-running operations

Website analysis can take significantly longer than a normal API request because multiple external and computational operations are involved.

### Browser automation

Puppeteer requires browser resources and careful lifecycle management to avoid leaving browser processes running.

### External API dependencies

The analysis pipeline depends on external services such as PageSpeed and Gemini, requiring error handling and validation.

### User data isolation

Each analysis must be associated with the authenticated user to prevent cross-account access.

### Persistent AI results

AI-generated summaries are stored alongside the analysis so reports can be viewed later without repeatedly calling the Gemini API.

### Scalability

The current synchronous architecture is intentionally designed with a future migration path toward queue-based asynchronous workers.

---

# 📊 Database Model

The core relationship is:

```text
User
 │
 └─── Analysis
        │
        ├── Issues
        │
        └── Recommendations
```

Each analysis stores:

* Website URL
* Screenshot
* Overall score
* SEO score
* Performance score
* Accessibility score
* Best Practices score
* Grade
* Health
* AI summary
* Creation timestamp
* User ID

---

# 🚀 Future Improvements

Potential future improvements include:

* [ ] Asynchronous analysis workers
* [ ] Message queue
* [ ] Redis caching
* [ ] Distributed worker scaling
* [ ] Job progress tracking
* [ ] Retry and dead-letter queues
* [ ] Analysis comparison
* [ ] Advanced report exports
* [ ] Automated testing
* [ ] Observability and metrics
* [ ] Production monitoring

These features are intentionally separated from the current MVP to keep the system maintainable and avoid unnecessary infrastructure before it is required.

---

# 🎯 Learning Goals

This project was built to gain practical experience with:

* Full-stack application architecture
* Next.js
* REST API design
* Authentication and authorization
* PostgreSQL
* Prisma ORM
* Browser automation
* Lighthouse/PageSpeed
* AI API integration
* Input validation
* Rate limiting
* Data persistence
* PDF generation
* Scalability and distributed-system design

---

# 👩‍💻 Author

**Rinika Koley**

Full-Stack Developer focused on building scalable web applications with React, Next.js, Node.js, PostgreSQL, and modern AI technologies.

---

# ⭐ Project Status

**Status: MVP Complete**

The core website analysis, authentication, persistence, AI analysis, history, reporting, validation, and security features are implemented.

The architecture has also been designed with a documented path toward asynchronous, horizontally scalable processing.
