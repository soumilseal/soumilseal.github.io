---
layout: layouts/project.njk
id: alumniconnect
title: "AlumniConnect: Student Mentorship Platform"
description: "Full-stack university web platform connecting BCA undergraduate students with industry alumni for career mentorship, code reviews, and mock interviews."
category: "Web & Fullstack"
date: 2026-06-15
order: 3
featured: true
image: "/assets/images/projects/alumniconnect.webp"
tags:
  - TypeScript
  - Tailwind CSS
  - PostgreSQL
  - Node.js
  - REST API
github: "https://github.com/soumilseal/alumniconnect"
demo: "https://alumniconnect-demo.soumilseal.dev"
highlights:
  - "Role-based authentication with session tokens and university email validation"
  - "Real-time calendar booking and timezone-aware schedule matching"
  - "Responsive accessibility-first UI tested across mobile and desktop"
stats:
  - label: "Database"
    value: "PostgreSQL 16"
  - label: "Auth Model"
    value: "RBAC + JWT"
  - label: "UI Framework"
    value: "Tailwind CSS"
  - label: "API Design"
    value: "RESTful"
gallery:
  - image: "/assets/images/projects/alumniconnect.webp"
    caption: "AlumniConnect Student Portal Overview"
  - image: "/assets/images/projects/alumniconnect-mentorship.webp"
    caption: "Interactive Mock Interview Booking Calendar & Mentor Directory"
---

## Overview

**AlumniConnect** is an open-source, full-stack mentorship and career development portal tailored specifically for undergraduate computer science and BCA students. The application bridges the gap between campus academics and the technology industry by enabling students to discover verified alumni mentors, schedule one-on-one code review sessions, and participate in mock technical interviews.

---

## Architectural Implementation

```
  React Frontend (TypeScript + Tailwind)
                  │
                  ▼
  Node.js REST API Layer (Express + Middleware)
  ┌───────────────────┐  ┌───────────────────────┐
  │ RBAC Guard        │  │ Timezone Coordinator  │
  └─────────┬─────────┘  └───────────┬───────────┘
            │                        │
            ▼                        ▼
  ┌──────────────────────────────────────────────┐
  │      PostgreSQL Relational Storage           │
  │  Users  /  Bookings  /  Feedback  /  Badges  │
  └──────────────────────────────────────────────┘
```

### Key Engineering Pillars

1. **Role-Based Access Control (RBAC)**: Distinct permissions for Students, Verified Alumni, and Faculty Coordinators with strict token-based authorization and university domain verification.
2. **Timezone-Aware Scheduling Engine**: An algorithm that computes overlapping availability windows across global timezones, eliminating manual calendar conversion errors for international alumni.
3. **Responsive Blueprint Interface**: Built with Tailwind CSS and accessibility-first WCAG 2.1 AA standards, featuring zero-overhead responsive grid layouts and dark/light mode toggles.
