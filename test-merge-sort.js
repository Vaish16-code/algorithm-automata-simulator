// Quick test to verify the merge sort components work
const { mergeSort } = require('./src/app/utils/divideConquer.ts');

console.log('Testing merge sort...');
try {
  const result = mergeSort([64, 34, 25, 12, 22, 11, 90]);
  console.log('✅ Merge sort test passed!');
  console.log('Sorted array:', result.sortedArray);
  console.log('Total steps:', result.steps.length);
  console.log('Tree structure exists:', !!result.tree);
} catch (error) {
  console.error('❌ Test failed:', error.message);
}
