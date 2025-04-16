generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql" // or "mysql", "sqlite", etc.
url = env("DATABASE_URL")
}

model User {
id Int @id @default(autoincrement())
email String @unique
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
mentalHealthEntries MentalHealthEntry[]
physicalHealthEntries PhysicalHealthEntry[]
}

model MentalHealthEntry {
id Int @id @default(autoincrement())
userId Int
user User @relation(fields: [userId], references: [id])
date DateTime @default(now()) // Date of the entry
mood Int // Mood rating (e.g., 1-10)
anxiety Int // Anxiety level (e.g., 1-10)
sleepQuality Int // Sleep quality rating (e.g., 1-10)
notes String? // Optional notes or journal entry
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model PhysicalHealthEntry {
id Int @id @default(autoincrement())
userId Int
user User @relation(fields: [userId], references: [id])
date DateTime @default(now()) // Date of the entry
weight Float // Weight in kg
heartRate Int // Heart rate in bpm
bloodPressure String // Blood pressure (e.g., "120/80")
notes String? // Optional notes
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}
