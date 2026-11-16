import {runParkAdventureTests} from './parkAdventureSuite';
import {runOceanAdventureTests} from './oceanAdventureSuite.ts';
import {runMoonAdventureTests} from './moonAdventureSuite.ts';
import {runIslandAdventureTests} from './islandAdventureSuite.ts';
import { runGradeSevenTests } from './gradeSevenSuite.ts';
import { runGradeSixTests } from './gradeSixSuite.ts';
import { runGradeFiveTests } from './gradeFiveSuite.ts';
import { runUpperPrimaryTests } from './upperPrimarySuite.ts';
import { runAllVerificationTests } from './mathEngineSuite.ts';
import { runGradeOneTests } from './gradeOneSuite.ts';
import { runGradeTwoTests } from './gradeTwoSuite.ts';
import { runCityAdventureTests } from './cityAdventureSuite.ts';

runGradeOneTests();
runGradeTwoTests();
runCityAdventureTests();
runIslandAdventureTests();
runMoonAdventureTests();
runOceanAdventureTests();
runParkAdventureTests();
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
