import {runDetectiveAdventureTests} from './detectiveAdventureSuite';
import {runRaceAdventureTests} from './raceAdventureSuite.ts';
import {runGradeSixPracticeTests} from './gradeSixPracticeSuite.ts';
import {runMoonAdventureTests} from './moonAdventureSuite.ts';
import {runIslandAdventureTests} from './planeAdventureSuite.ts';
import { runGradeSevenTests } from './gradeSevenSuite.ts';
import { runGradeSixTests } from './gradeSixSuite.ts';
import { runGradeFiveTests } from './gradeFiveSuite.ts';
import { runUpperPrimaryTests } from './upperPrimarySuite.ts';
import { runAllVerificationTests } from './mathEngineSuite.ts';
import { runGradeOneTests } from './gradeOneSuite.ts';
import { runGradeTwoTests } from './gradeTwoSuite.ts';
import { runHouseAdventureTests } from './houseAdventureSuite.ts';

runGradeOneTests();
runGradeTwoTests();
runHouseAdventureTests();
runIslandAdventureTests();
runMoonAdventureTests();
runRaceAdventureTests();
runGradeSixPracticeTests();
runDetectiveAdventureTests();
runUpperPrimaryTests();
runGradeFiveTests();
runGradeSixTests();
runGradeSevenTests();

const summary = runAllVerificationTests();
console.log(`\n=== Mundoki Automated Verification Suite ===`);
for (const r of summary.results) {
  console.log(`${r.passed ? 'PASS' : 'FAIL'} [${r.category}] ${r.name}`);
  console.log(`     ${r.details}`);
}
console.log(
  `\nSummary: ${summary.passedCount}/${summary.totalCount} test assertions passed.\n`
);

if (summary.passedCount !== summary.totalCount) {
  process.exit(1);
}
