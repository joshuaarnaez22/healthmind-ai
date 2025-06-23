'use server';

import { prisma } from '@/lib/client';

export async function markStepAsDone(
  stepId: string,
  exerciseResponse: string,
  reflectionResponse: string
) {
  try {
    const updatedStep = await prisma.therapyStep.update({
      where: { id: stepId },
      data: { isDone: true, reflectionResponse, exerciseResponse },
    });

    return { success: true, step: updatedStep };
  } catch (error) {
    console.error('Error updating step:', error);
    return { success: false, error: 'Failed to update step' };
  }
}

export async function markModuleAsDone(moduleId: string) {
  try {
    const updatedModule = await prisma.therapyModule.update({
      where: { id: moduleId },
      data: { isDone: true },
    });

    return { success: true, module: updatedModule };
  } catch (error) {
    console.error('Error updating step:', error);
    return { success: false, error: 'Failed to update module' };
  }
}
