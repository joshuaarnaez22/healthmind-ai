# Database Schema

Current Prisma schema (`prisma/schema.prisma`). Database: Neon PostgreSQL.

## Models

### User

Synced from Clerk via webhook on `user.created` / `user.updated`.

| Field               | Type          | Notes           |
| ------------------- | ------------- | --------------- |
| id                  | String (cuid) | PK              |
| clerkUserId         | String        | unique, indexed |
| email               | String        | unique          |
| role                | Role          | USER \| ADMIN   |
| firstName, lastName | String?       |                 |
| username            | String?       | unique          |
| profileImageUrl     | String?       |                 |

### Journal

Used for both mood entries and journal entries (mood field distinguishes purpose in mood tracker).

| Field   | Type            | Notes               |
| ------- | --------------- | ------------------- |
| id      | String (cuid)   |                     |
| userId  | String          | FK → User           |
| title   | String          |                     |
| content | String          | rich HTML           |
| mood    | Mood            | enum                |
| addedAt | DateTime (Date) | indexed with userId |

### BloodPressureLog

| Field               | Type         |
| ------------------- | ------------ |
| systolic, diastolic | Int (mmHg)   |
| pulse               | Int? (BPM)   |
| posture             | PostureType? |
| arm                 | ArmType?     |
| symptoms            | String[]     |
| device, notes       | String?      |

### GlucoseLog

| Field           | Type            |
| --------------- | --------------- |
| glucose         | Decimal         |
| measurementType | MeasurementType |
| mealType        | MealType?       |
| timeSinceMeal   | Int? (minutes)  |
| insulinDose     | Decimal?        |
| carbs           | Int? (grams)    |

### File

S3-compatible file storage for PDF uploads.

| Field                  | Type   |
| ---------------------- | ------ |
| key, bucket            | String |
| originalName, mimeType | String |
| size                   | Int    |

### Goal + CheckIn

Goal: title, emotion, frequency, duration, targetCount, completedCount, isCompleted, why
CheckIn: actualEmotion, reflection, rating, completedAt

### TherapyModule + TherapyStep + ModuleCompletion

TherapyModule: therapyType (CBT/DBT/ACT), title, description, audience, difficulty, estimatedTime, overview[], safetyDisclaimer, color, icon, isDone
TherapyStep: order, title, explanation, exercise, exerciseResponse, reflection, reflectionResponse, isDone
ModuleCompletion: recap, praise, nextSuggestion

## Enums

```
Mood:            TERRIBLE | BAD | NEUTRAL | GOOD | GREAT
Role:            USER | ADMIN
Emotion:         CALM | ENERGIZED | FOCUSED | CONNECTED | GRATEFUL | CONFIDENT | PEACEFUL | INSPIRED
Frequency:       DAILY | WEEKLY | CUSTOM
GoalDuration:    1-week | 2-weeks | 1-month
PostureType:     SITTING | STANDING | LYING_DOWN
ArmType:         LEFT | RIGHT
MeasurementType: FASTING | POSTPRANDIAL | BEFORE_MEAL | AFTER_MEAL | RANDOM | BEDTIME
MealType:        BREAKFAST | LUNCH | DINNER | SNACK
```
