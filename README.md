# 🚀 AI Website Analyzer

An AI-powered full-stack web application that analyzes websites for performance, SEO, accessibility, and best-practice issues. It uses automated browser analysis, Lighthouse metrics, and Gemini AI to generate actionable optimization recommendations.

## 🌐 Live Demo

(Add your deployed URL here)

---

# 📌 Overview

Developers and businesses often need quick insights into website quality without manually inspecting performance metrics, SEO issues, or accessibility problems.

AI Website Analyzer solves this by automatically crawling a website, collecting technical metrics, identifying problems, and generating AI-powered recommendations to improve website quality.

---

# ✨ Features

## 🔐 Authentication

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- User-specific analysis history

---

## 🔍 Website Analysis Engine

The application analyzes websites using:

- Puppeteer for browser automation and screenshots
- Cheerio for HTML parsing
- Lighthouse metrics for performance auditing

It evaluates:

- SEO
- Performance
- Accessibility
- Best Practices
- Core Web Vitals

---

## 📊 Detailed Reports

Each analysis provides:

- Overall website score
- Grade and health status
- SEO score
- Performance score
- Accessibility score
- Best practices score

Additional metrics:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time To Interactive (TTI)
- Total Blocking Time (TBT)
- DOM size
- Network requests
- Render blocking resources

---

## 🤖 Gemini AI Website Recommendations

Integrated Google Gemini AI to transform technical analysis into developer-friendly insights.

AI generates:

- Website summary
- Strength analysis
- Priority improvements
- Engineering recommendations

Example:

> "Optimize JavaScript delivery and remove render-blocking resources to improve Core Web Vitals."

---

## 📸 Screenshot Generation

Automatically captures website screenshots during analysis using Puppeteer.

---

## 📁 Dashboard

Users can:

- View total analyzed websites
- Track average scores
- See recent reports

---

## 🕒 Analysis History

Users can:

- View previous reports
- Open detailed analysis
- Delete old reports

All data is isolated per authenticated user.

---

## 📄 PDF Report Export

Generate downloadable PDF reports containing:

- Website metrics
- Issues
- Recommendations
- AI insights

---

# 🏗️ System Architecture
