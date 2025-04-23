// prisma/seed.ts
import { Mood, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import journalsData from '../data/mentalHealthJournals.json';
const prisma = new PrismaClient();

async function main() {
  const userId = 'cm8xaedkp0000icdw1teb9yp5';
  const journals = journalsData.map((journal) => {
    const date = faker.date.between({
      from: '2023-01-01',
      to: new Date(),
    });
    const mood = journal.mood as keyof typeof Mood;
    return {
      userId,
      title: `Journal Entry: ${date.toLocaleDateString()}`,
      content: journal.content,
      mood: mood,
      addedAt: faker.date.recent({ days: 365 }),
    };
  });
  await prisma.journal.createMany({ data: journals });
  // Generate Glucose Logs (120 records - 20 per measurement type)
  const glucoseMeasurementTypes = [
    'FASTING',
    'POSTPRANDIAL',
    'BEFORE_MEAL',
    'AFTER_MEAL',
    'RANDOM',
    'BEDTIME',
  ] as const;
  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;

  for (const measurementType of glucoseMeasurementTypes) {
    for (let i = 0; i < 20; i++) {
      // Spread dates over 3 months (90 days)
      const loggedAt = faker.date.between({
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        to: new Date(),
      });

      const glucose = faker.number.float({ min: 3.5, max: 12.0 });
      const glucoseMgDl = Math.round(glucose * 18.0182);

      await prisma.glucoseLog.create({
        data: {
          userId,
          loggedAt,
          glucose,
          glucoseMgDl,
          measurementType,
          mealType: ['POSTPRANDIAL', 'AFTER_MEAL', 'BEFORE_MEAL'].includes(
            measurementType
          )
            ? faker.helpers.arrayElement(mealTypes)
            : null,
          timeSinceMeal: ['POSTPRANDIAL', 'AFTER_MEAL'].includes(
            measurementType
          )
            ? faker.number.int({ min: 30, max: 180 })
            : null,
          device: faker.helpers.arrayElement([
            'FreeStyle Libre',
            'Dexcom G6',
            'Accu-Chek',
            'OneTouch Verio',
            null,
          ]),
          insulinDose: faker.datatype.boolean()
            ? faker.number.float({ min: 0.5, max: 10 })
            : null,
          carbs: faker.datatype.boolean()
            ? faker.number.int({ min: 5, max: 100 })
            : null,
          notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        },
      });
    }
  }

  // Generate Blood Pressure Logs (90 records - about 1 per day for 3 months)
  const postureTypes = ['SITTING', 'STANDING', 'LYING_DOWN'] as const;
  const armTypes = ['LEFT', 'RIGHT'] as const;
  const commonSymptoms = [
    'Headache',
    'Dizziness',
    'Fatigue',
    'Chest pain',
    'Vision problems',
    'Nausea',
    'Shortness of breath',
  ];

  for (let i = 0; i < 90; i++) {
    // Spread dates evenly over 3 months
    const loggedAt = new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000);

    // Random time during the day
    loggedAt.setHours(faker.number.int({ min: 6, max: 22 }));
    loggedAt.setMinutes(faker.number.int({ min: 0, max: 59 }));

    // Generate 1-3 random symptoms
    const symptoms = faker.helpers.arrayElements(
      commonSymptoms,
      faker.number.int({ min: 0, max: 3 })
    );

    await prisma.bloodPressureLog.create({
      data: {
        userId,
        loggedAt,
        systolic: faker.number.int({ min: 90, max: 160 }), // Normal to stage 1 hypertension
        diastolic: faker.number.int({ min: 60, max: 100 }), // Normal to stage 1
        pulse: faker.datatype.boolean()
          ? faker.number.int({ min: 50, max: 100 })
          : null,
        posture: faker.helpers.arrayElement([...postureTypes, null]),
        arm: faker.helpers.arrayElement([...armTypes, null]),
        device: faker.helpers.arrayElement([
          'Omron Platinum',
          'Withings BPM Core',
          'iHealth Track',
          null,
        ]),
        symptoms,
        notes: faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
