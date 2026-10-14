import http from 'http';

const STRESS_URL = 'http://localhost:5000/api/health';
const CONCURRENT_REQUESTS = 100;

console.log(`Starting stress test against ${STRESS_URL} with ${CONCURRENT_REQUESTS} concurrent requests...`);

let successCount = 0;
let errorCount = 0;
const start = Date.now();

const makeRequest = () => {
  return new Promise((resolve) => {
    http.get(STRESS_URL, (res) => {
      if (res.statusCode === 200) successCount++;
      else errorCount++;
      res.resume();
      resolve();
    }).on('error', (err) => {
      errorCount++;
      resolve();
    });
  });
};

async function runStressTest() {
  const requests = [];
  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    requests.push(makeRequest());
  }
  
  await Promise.all(requests);
  const duration = Date.now() - start;
  
  console.log('--- Stress Test Results ---');
  console.log(`Total Requests: ${CONCURRENT_REQUESTS}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log(`Time taken: ${duration}ms`);
  console.log(`Requests per second: ${((CONCURRENT_REQUESTS / duration) * 1000).toFixed(2)}`);
  
  process.exit(0);
}

runStressTest();
