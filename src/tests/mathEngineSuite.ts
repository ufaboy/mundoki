import {
  applyExerciseOutcome,
  INITIAL_GAME_STATE,
} from '../game/core/gameState';
import {
  computeTotpCode,
  generateBackupCodes,
  generateBase32Secret,
  verifyTotpCode,
} from '../lib/auth/totp';
import { buildGradeUrl } from '../i18n/routes';
import { normalizeRational, parseRationalInput } from '../math/core/fraction';
import { TopicId } from '../math/core/types';
import { validateMathAnswer } from '../math/core/validator';
import {
  getGradesByBlock,
  GRADES_CATALOG,
  SCHOOL_BLOCKS,
} from '../math/curriculum';
import { generateMathExercise, TOPICS_CATALOG } from '../math/topics/generators';

export interface TestCaseResult {
  id: string;
  category:
    | 'Math Engine'
    | 'Fractions & Decimals'
    | 'Edge Cases'
    | 'Game Progression'
    | 'Auth & 2FA Security'
    | 'Curriculum & Grades';
  name: string;
  passed: boolean;
  details: string;
}

export function runAllVerificationTests(): {
  passedCount: number;
  totalCount: number;
  results: TestCaseResult[];
} {
  const results: TestCaseResult[] = [];

  // 1. Deterministic seed reproducibility across all 6 topics
  const allTopics: TopicId[] = TOPICS_CATALOG.map((t) => t.id);
  for (const topic of allTopics) {
    const exA = generateMathExercise(topic, 2, 424242);
    const exB = generateMathExercise(topic, 2, 424242);
    const same =
      exA.correctAnswer === exB.correctAnswer &&
      exA.expressionLatex === exB.expressionLatex &&
      exA.hints.length === 3 &&
      exA.solutionSteps.length >= 2;
    const validCheck = validateMathAnswer(exA, exA.correctAnswer, 0);
    const wrongCheck = validateMathAnswer(exA, '999999', 0);

    results.push({
      id: `gen-${topic}`,
      category: 'Math Engine',
      name: `Deterministic generator & validation for [${topic}]`,
      passed:
        same &&
        validCheck.status === 'correct' &&
        wrongCheck.status === 'incorrect',
      details: `Seed 424242 -> "${exA.expressionLatex}" | Ans: ${exA.correctAnswer}`,
    });
  }

  // 2. Equivalent fractions acceptance (e.g., 2/4 == 1/2, 4/8 == 1/2)
  const fracEx = generateMathExercise('fractions', 1, 1001);
  const parsedCanonical = parseRationalInput(fracEx.correctAnswer);
  const unreducedAnswer = parsedCanonical.rational
    ? `${parsedCanonical.rational.numerator * 3}/${parsedCanonical.rational.denominator * 3}`
    : fracEx.correctAnswer;
  const eqCheck = validateMathAnswer(fracEx, unreducedAnswer, 0);
  results.push({
    id: 'frac-equivalent',
    category: 'Fractions & Decimals',
    name: 'Accepts equivalent unreduced fractions (e.g. 3a/3b == a/b)',
    passed: eqCheck.status === 'correct' && eqCheck.isEquivalentUnreduced === true,
    details: `Submitted ${unreducedAnswer} for canonical ${fracEx.correctAnswer} -> status=${eqCheck.status}`,
  });

  // 3. Sign normalization in rational numbers (-2/-4 == 1/2)
  const signNorm = normalizeRational(-2, -4);
  results.push({
    id: 'frac-sign-norm',
    category: 'Fractions & Decimals',
    name: 'Normalizes negative signs in numerator and denominator (-2/-4 -> 1/2)',
    passed:
      signNorm !== null &&
      signNorm.numerator === 1 &&
      signNorm.denominator === 2,
    details: `normalizeRational(-2, -4) -> ${signNorm?.numerator}/${signNorm?.denominator}`,
  });

  // 4. Locale decimal separators: es-AR comma ("0,75") vs en-US dot ("0.75")
  const commaParsed = parseRationalInput('0,75');
  const dotParsed = parseRationalInput('0.75');
  results.push({
    id: 'locale-decimal',
    category: 'Fractions & Decimals',
    name: 'Parses es-AR comma ("0,75") and en-US dot ("0.75") identically as 3/4',
    passed:
      commaParsed.valid &&
      dotParsed.valid &&
      commaParsed.rational?.numerator === 3 &&
      commaParsed.rational?.denominator === 4 &&
      dotParsed.rational?.numerator === 3 &&
      dotParsed.rational?.denominator === 4,
    details: `"0,75" -> ${commaParsed.rational?.numerator}/${commaParsed.rational?.denominator}`,
  });

  // 5. Division by zero protection
  const zeroDivCheck = validateMathAnswer(fracEx, '3/0', 0);
  results.push({
    id: 'edge-div-zero',
    category: 'Edge Cases',
    name: 'Rejects division by zero ("3/0") with explicit invalid_input status',
    passed: zeroDivCheck.status === 'invalid_input',
    details: `Feedback: ${zeroDivCheck.feedback['en-US']}`,
  });

  // 6. Empty & malformed input handling
  const emptyCheck = validateMathAnswer(fracEx, '   ', 0);
  const malformedCheck = validateMathAnswer(fracEx, 'abc/def', 0);
  results.push({
    id: 'edge-empty-malformed',
    category: 'Edge Cases',
    name: 'Handles empty strings and non-numeric inputs safely without throwing',
    passed:
      emptyCheck.status === 'invalid_input' &&
      malformedCheck.status === 'invalid_input',
    details: `empty=${emptyCheck.status}, malformed=${malformedCheck.status}`,
  });

  // 7. Equation syntax flexibility ("x = 4" and "4")
  const eqEx = generateMathExercise('linear-equations', 1, 777);
  const withPrefix = validateMathAnswer(eqEx, `x = ${eqEx.correctAnswer}`, 0);
  const bareNumber = validateMathAnswer(eqEx, eqEx.correctAnswer, 0);
  results.push({
    id: 'edge-equation-syntax',
    category: 'Edge Cases',
    name: 'Accepts both "x = N" and bare "N" in Linear Equations',
    passed:
      withPrefix.status === 'correct' && bareNumber.status === 'correct',
    details: `Tested "x = ${eqEx.correctAnswer}" and "${eqEx.correctAnswer}"`,
  });

  // 8. Game progression: Incorrect answers never award energy or rewards
  const wrongOutcome = applyExerciseOutcome(
    INITIAL_GAME_STATE,
    {
      attemptId: 'test-wrong-1',
      exerciseId: 'ex-1',
      topicId: 'addition-subtraction',
      seed: 123,
      difficulty: 1,
      userAnswer: '999',
      isCorrect: false,
      timestamp: new Date().toISOString(),
      syncedToServer: false,
    },
    false
  );
  results.push({
    id: 'game-no-reward-on-wrong',
    category: 'Game Progression',
    name: 'Incorrect answers do not grant energy, stars, or unlocks',
    passed:
      wrongOutcome.nextState.energy === INITIAL_GAME_STATE.energy &&
      wrongOutcome.nextState.stars === INITIAL_GAME_STATE.stars &&
      wrongOutcome.events.length === 0,
    details: `Energy remained ${wrongOutcome.nextState.energy}⚡, events=${wrongOutcome.events.length}`,
  });

  // 9. Game progression: 3 correct answers defeat topic guardian & unlock planet/outfit
  let state = INITIAL_GAME_STATE;
  let allEventsCount = 0;
  for (let i = 1; i <= 3; i++) {
    const step = applyExerciseOutcome(
      state,
      {
        attemptId: `test-ok-${i}`,
        exerciseId: `ex-ok-${i}`,
        topicId: 'multiplication-division',
        seed: 100 + i,
        difficulty: 2,
        userAnswer: '12',
        isCorrect: true,
        timestamp: new Date().toISOString(),
        syncedToServer: false,
      },
      false
    );
    state = step.nextState;
    allEventsCount += step.events.length;
  }
  results.push({
    id: 'game-milestone-unlocks',
    category: 'Game Progression',
    name: '3 solved challenges defeat guardian, unlock Suit & Multi-Ring Station',
    passed:
      state.topicMastery['multiplication-division'].guardianDefeated === true &&
      state.unlockedCosmetics.includes('suit-explorer') &&
      state.unlockedPlanets.includes('planet-multi') &&
      allEventsCount >= 5,
    details: `Energy=${state.energy}⚡, Suit unlocked=${state.unlockedCosmetics.includes('suit-explorer')}, Planet unlocked=${state.unlockedPlanets.includes('planet-multi')}`,
  });

  // 10. RFC 6238 TOTP 2FA & Backup Recovery Code generation and verification
  const secret = generateBase32Secret(16);
  const fixedTime = 1762850000000;
  const codeNow = computeTotpCode(secret, fixedTime);
  const validSameStep = verifyTotpCode(secret, codeNow, fixedTime);
  const validDriftStep = verifyTotpCode(secret, codeNow, fixedTime + 29000);
  const invalidWrongCode = verifyTotpCode(
    secret,
    codeNow === '000000' ? '111111' : '000000',
    fixedTime
  );
  const backupCodes = generateBackupCodes(6);

  results.push({
    id: 'auth-totp-2fa',
    category: 'Auth & 2FA Security',
    name: 'RFC 6238 TOTP 6-digit code & Backup Recovery Codes verification',
    passed:
      secret.length === 16 &&
      /^\d{6}$/.test(codeNow) &&
      validSameStep === true &&
      validDriftStep === true &&
      invalidWrongCode === false &&
      backupCodes.length === 6,
    details: `Secret=${secret.slice(0, 6)}... | TOTP=${codeNow} | Backup[0]=${backupCodes[0]}`,
  });

  // 11. CABA primary years 1–7 and secondary years 1–5, grouped for navigation
  const primaryGrades = getGradesByBlock('primary');
  const middleGrades = getGradesByBlock('middle');
  const highGrades = getGradesByBlock('high');
  const allGradesHaveLessons = GRADES_CATALOG.every((g) => g.lessons.length > 0);
  const sampleEsUrl = buildGradeUrl('es-AR', 'grade-1');
  const sampleEnUrl = buildGradeUrl('en-US', 'grade-7');

  results.push({
    id: 'curriculum-blocks-grades',
    category: 'Curriculum & Grades',
    name: 'CABA primary 1–7, secondary 1–5, and 12 schooling-year pages',
    passed:
      SCHOOL_BLOCKS.length === 3 &&
      GRADES_CATALOG.length === 12 &&
      primaryGrades.length === 7 &&
      middleGrades.length === 2 &&
      highGrades.length === 3 &&
      allGradesHaveLessons &&
      sampleEsUrl === '/es-ar/matematicas/grado/1-grado/' &&
      sampleEnUrl === '/en-us/mathematics/grade/grade-7/',
    details: `Blocks=3 | Grades=${GRADES_CATALOG.length} (Primary:${primaryGrades.length}, Middle:${middleGrades.length}, High:${highGrades.length}) | URLs: ${sampleEsUrl}, ${sampleEnUrl}`,
  });

  const passedCount = results.filter((r) => r.passed).length;
  return {
    passedCount,
    totalCount: results.length,
    results,
  };
}
