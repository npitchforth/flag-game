// Test for enhanced content filtering
import { filterPlayerNameForDisplay, containsInappropriateContent } from './src/utils/contentFilter.js';

// Test cases including creative misspellings
const testCases = [
  { name: 'John', expected: 'John' },
  { name: 'Alice Smith', expected: 'Alice Smith' },
  { name: 'fuck', expected: 'Anonymous Player' },
  { name: 'My name is shit', expected: 'Anonymous Player' },
  { name: 'f*ck', expected: 'Anonymous Player' },
  { name: 'fuk', expected: 'Anonymous Player' },
  { name: 'FUCK', expected: 'Anonymous Player' },
  { name: 'C*nt Bob', expected: 'Anonymous Player' }, // This should now be caught
  { name: 'f*cking', expected: 'Anonymous Player' },
  { name: 'sh1t', expected: 'Anonymous Player' },
  { name: 'b!tch', expected: 'Anonymous Player' },
  { name: 'a$$', expected: 'Anonymous Player' },
  { name: 'd!ck', expected: 'Anonymous Player' },
  { name: 'p!ss', expected: 'Anonymous Player' },
  { name: 'f**k', expected: 'Anonymous Player' },
  { name: 's**t', expected: 'Anonymous Player' },
  { name: 'b**ch', expected: 'Anonymous Player' },
  { name: 'a**', expected: 'Anonymous Player' },
  { name: 'd**k', expected: 'Anonymous Player' },
  { name: 'test123', expected: 'test123' },
  { name: '', expected: 'Anonymous Player' },
  { name: null, expected: 'Anonymous Player' },
  { name: undefined, expected: 'Anonymous Player' },
  { name: '   ', expected: 'Anonymous Player' },
  { name: 'normal name', expected: 'normal name' },
  { name: 'noob', expected: 'Anonymous Player' },
  { name: 'hacker', expected: 'Anonymous Player' },
  { name: 'idiot', expected: 'Anonymous Player' },
  { name: 'aaaaa', expected: 'Anonymous Player' }, // excessive repetition
  { name: '!!!!!', expected: 'Anonymous Player' }, // excessive special chars
];

console.log('Testing enhanced content filter...\n');

testCases.forEach((testCase, index) => {
  const result = filterPlayerNameForDisplay(testCase.name);
  const passed = result === testCase.expected;
  
  console.log(`Test ${index + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  Input: "${testCase.name}"`);
  console.log(`  Expected: "${testCase.expected}"`);
  console.log(`  Got: "${result}"`);
  console.log('');
});

console.log('Enhanced content filtering test completed!'); 