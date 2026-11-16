import { formatRational, parseRationalInput } from './fraction';
import { MathExercise, ValidationResult } from './types';

/**
 * Deterministically validates a student's answer against a MathExercise definition.
 * Never uses AI/LLM inference; strictly uses rational & numeric rules.
 */
export function validateMathAnswer(
  exercise: MathExercise,
  rawUserAnswer: string,
  attemptIndex = 0
): ValidationResult {
  const hintIdx = Math.min(Math.max(attemptIndex, 0), exercise.hints.length - 1);
  const currentHint = exercise.hints[hintIdx];

  const trimmed = rawUserAnswer.trim();
  if (!trimmed) {
    return {
      status: 'invalid_input',
      normalizedUserAnswer: '',
      expectedCanonicalAnswer: exercise.correctAnswer,
      feedback: {
        'es-AR': 'Escribí o elegí una respuesta antes de comprobar.',
        'en-US': 'Please enter or select an answer before checking.',
      },
      hintToDisplay: currentHint,
    };
  }

  // Multiple-choice or visual-choice exact matching
  if (
    exercise.answerType === 'multiple-choice' ||
    exercise.answerType === 'visual-choice'
  ) {
    const isMatch = trimmed.toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
    return {
      status: isMatch ? 'correct' : 'incorrect',
      normalizedUserAnswer: trimmed,
      expectedCanonicalAnswer: exercise.correctAnswer,
      feedback: isMatch
        ? {
            'es-AR': '¡Excelente! Elegiste la representación matemática exacta.',
            'en-US': 'Excellent! You selected the exact mathematical representation.',
          }
        : {
            'es-AR': 'Todavía no es esa opción. Mirá la pista visual e intentá de nuevo.',
            'en-US': 'Not quite that option yet. Check the visual hint and try again.',
          },
      hintToDisplay: isMatch ? undefined : currentHint,
    };
  }

  // Strip optional "x =" or "%" wrapper for equations and percentages
  let candidate = trimmed;
  if (exercise.answerType === 'equation') {
    candidate = candidate.replace(/^[a-zA-Z]\s*=\s*/, '').trim();
  }
  candidate = candidate.replace(/%$/, '').trim();

  const parsedUser = parseRationalInput(candidate);
  if (!parsedUser.valid || !parsedUser.rational) {
    if (parsedUser.errorReason === 'division_by_zero') {
      return {
        status: 'invalid_input',
        normalizedUserAnswer: trimmed,
        expectedCanonicalAnswer: exercise.correctAnswer,
        feedback: {
          'es-AR': 'No se puede dividir por cero (el denominador nunca puede ser 0).',
          'en-US': 'Division by zero is undefined (the denominator can never be 0).',
        },
        hintToDisplay: currentHint,
      };
    }
    return {
      status: 'invalid_input',
      normalizedUserAnswer: trimmed,
      expectedCanonicalAnswer: exercise.correctAnswer,
      feedback: {
        'es-AR': 'Ingresá un número válido o una fracción como 3/4.',
        'en-US': 'Please enter a valid number or a fraction such as 3/4.',
      },
      hintToDisplay: currentHint,
    };
  }

  const parsedExpected = parseRationalInput(
    exercise.correctAnswer.replace(/^[a-zA-Z]\s*=\s*/, '').replace(/%$/, '')
  );

  if (!parsedExpected.valid || !parsedExpected.rational) {
    // Fallback strict string match
    const ok = candidate === exercise.correctAnswer;
    return {
      status: ok ? 'correct' : 'incorrect',
      normalizedUserAnswer: candidate,
      expectedCanonicalAnswer: exercise.correctAnswer,
      feedback: ok
        ? { 'es-AR': '¡Correcto!', 'en-US': 'Correct!' }
        : { 'es-AR': 'Revisá los pasos e intentá otra vez.', 'en-US': 'Check the steps and try again.' },
      hintToDisplay: ok ? undefined : currentHint,
    };
  }

  const userRat = parsedUser.rational;
  const expRat = parsedExpected.rational;

  // Exact rational equality (normalized fractions match)
  const isRationalEqual =
    userRat.numerator === expRat.numerator &&
    userRat.denominator === expRat.denominator;

  // Numeric tolerance check if configured
  const userFloat = userRat.numerator / userRat.denominator;
  const expFloat = expRat.numerator / expRat.denominator;
  const tolerance = exercise.numericTolerance ?? 1e-6;
  const isWithinTolerance = Math.abs(userFloat - expFloat) <= tolerance;

  if (isRationalEqual || isWithinTolerance) {
    const isUnreduced =
      parsedUser.rawDenominator !== undefined &&
      parsedUser.rawDenominator !== expRat.denominator &&
      expRat.denominator >= 1;

    return {
      status: 'correct',
      normalizedUserAnswer: formatRational(userRat),
      expectedCanonicalAnswer: formatRational(expRat),
      isEquivalentUnreduced: isUnreduced,
      feedback: isUnreduced
        ? {
            'es-AR': `¡Correcto! Tu respuesta equivale exactamente a la fracción simplificada ${formatRational(expRat)}.`,
            'en-US': `Correct! Your answer is mathematically equivalent to the simplified form ${formatRational(expRat)}.`,
          }
        : {
            'es-AR': '¡Muy bien resuelto! Tu razonamiento matemático es exacto.',
            'en-US': 'Well solved! Your mathematical reasoning is spot on.',
          },
    };
  }

  // Constructive feedback on sign error
  const isOppositeSign =
    Math.abs(userFloat) > 0 &&
    Math.abs(Math.abs(userFloat) - Math.abs(expFloat)) <= tolerance;

  if (isOppositeSign) {
    return {
      status: 'incorrect',
      normalizedUserAnswer: formatRational(userRat),
      expectedCanonicalAnswer: formatRational(expRat),
      feedback: {
        'es-AR': '¡Casi! El valor numérico está bien, pero revisá el signo (+ o −).',
        'en-US': 'Almost! The magnitude is right, but check the sign (+ or −).',
      },
      hintToDisplay: currentHint,
    };
  }

  return {
    status: 'incorrect',
    normalizedUserAnswer: formatRational(userRat),
    expectedCanonicalAnswer: formatRational(expRat),
    feedback: {
      'es-AR': 'Todavía no da ese resultado. Leé la pista paso a paso y probá de nuevo.',
      'en-US': 'Not quite that result yet. Read the step-by-step hint and try again.',
    },
    hintToDisplay: currentHint,
  };
}
