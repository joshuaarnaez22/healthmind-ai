# HealthMind AI

An AI-powered health companion for symptom checking and mental health support.

## Development Tasks

### 1. Project Setup

- [x] Set up Next.js project.
- [x] Integrate Tailwind CSS and shadcn/ui for styling.
- [x] Configure Neon/Supabase database.
- [x] Set up Prisma for database schema management.
- [x] Deploy initial setup to Vercel.

### 2. Core Features: Symptom Checker

- [x] Create a form for users to input symptoms.
- [x] Integrate OpenAI GPT or Deepseek for symptom analysis.
- [ ] Display preliminary diagnoses and recommendations.
- [x] Store symptom logs in Supabase using Prisma.
- [] Add disclaimers about the app not replacing professional medical advice.

### 3. Core Features: Health Tracking

- [x] Create a dashboard for users to log vitals (e.g., blood pressure, glucose levels).
- [ ] Use AI to detect trends and provide insights.
- [x] Store health logs in Neon/Supabase using Prisma.

### 4. Advanced Feature: AI-Powered Mental Health Support

- [ ] **Mood Tracking**:
  - [x] Create a form for users to log their mood daily.
  - [ ] Use AI to analyze mood patterns and provide insights.
- [ ] **AI Chatbot**:
  - [ ] Integrate OpenAI GPT for empathetic responses.
  - [ ] Fine-tune the model for mental health-related queries.
- [ ] **Journaling**:
  - [x] Create a journaling interface for users to write entries.
  - [ ] Use AI to generate reflective prompts.
- [ ] **Sentiment Analysis**:
  - [x] Use AI to analyze journal entries and mood logs.
- [ ] **Personalized Recommendations**:
  - [x] Use AI to suggest articles, videos, or exercises based on user data.

### 5. Additional Features

- [ ] **Medication Reminders**:
  - [ ] Create a form for users to input medications and dosages.
  - [ ] Use Neon/Supabase Edge Functions or Vercel Cron Jobs to send reminders.
- [ ] **Appointment Scheduling**:
  - [ ] Integrate with a scheduling API (e.g., Calendly) for users to book appointments.
- [ ] **Privacy and Security**:
  - [ ] Ensure all user data is encrypted and stored securely.
  - [ ] Add clear privacy policies and disclaimers.

### 6. Testing and Refinement

- [ ] Test the app for usability, performance, and security.
- [ ] Refine AI models based on user feedback.
- [ ] Optimize the app for mobile and desktop.

### 7. Deployment

- [ ] Deploy the app to Vercel.
- [ ] Set up monitoring and error tracking (e.g., Sentry).
- [ ] Gather user feedback for future improvements.
