import type { APIRoute } from 'astro';
import { jsonResponse } from '../../../lib/db/d1Store';
import { TopicId } from '../../../math/core/types';
import { validateMathAnswer } from '../../../math/core/validator';
import { generateMathExercise, TOPICS_CATALOG } from '../../../math/topics/generators';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as {
      topicId?: TopicId;
      seed?: number;
      difficulty?: 1 | 2 | 3;
      userAnswer?: string;
    };

    const topicId = body.topicId;
    const seed = Number(body.seed);
    const difficulty = (Number(body.difficulty) || 1) as 1 | 2 | 3;
    const userAnswer = String(body.userAnswer ?? '');

    if (!topicId || !TOPICS_CATALOG.some((t) => t.id === topicId) || !Number.isFinite(seed)) {
      return jsonResponse({ error: 'Invalid exercise parameters.' }, 400);
    }

    const serverExercise = generateMathExercise(topicId, difficulty, seed);
    const validation = validateMathAnswer(serverExercise, userAnswer);

    return jsonResponse({
      exerciseId: serverExercise.id,
      serverVerifiedCorrect: validation.status === 'correct',
      normalizedUserAnswer: validation.normalizedUserAnswer,
      expectedCanonicalAnswer: validation.expectedCanonicalAnswer,
      status: validation.status,
      feedback: validation.feedback,
    });
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }
};
