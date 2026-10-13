import http from 'http';

// Comprehensive multi-endpoint stress test
const BASE_URL = 'http://localhost:5000';
const ENDPOINTS = [
  { path: '/api/health', name: 'Health Check API' },
];

const CONCURRENT_REQUESTS = 250;

const makeRequest = (path) => {
  return new Promise((resolve) => {
    const startReq = Date.now();
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const latency = Date.now() - startReq;
        resolve({
          statusCode: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 400,
          latency,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        success: false,
        error: err.message,
        latency: Date.now() - startReq,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        statusCode: 408,
        success: false,
        error: 'Timeout',
        latency: 5000,
      });
    });
  });
};

async function executeModuleStressTest() {
  console.log('===============================================================');
  console.log('  PAYGATE (TRANSIQ) — MODULE STRESS TESTING HARNESS');
  console.log(`  Target: ${BASE_URL} | Concurrency: ${CONCURRENT_REQUESTS} parallel requests`);
  console.log('===============================================================\n');

  for (const ep of ENDPOINTS) {
    console.log(`[Testing] Endpoint: ${ep.name} (${ep.path})...`);
    const startSuite = Date.now();
    const tasks = [];

    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
      tasks.push(makeRequest(ep.path));
    }

    const results = await Promise.all(tasks);
    const duration = Date.now() - startSuite;

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const latencies = results.map((r) => r.latency);
    const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1);
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);
    const rps = ((CONCURRENT_REQUESTS / duration) * 1000).toFixed(2);

    console.log(`  -> Requests Executed: ${CONCURRENT_REQUESTS}`);
    console.log(`  -> Passed (2xx/3xx):  ${successful} (${((successful / CONCURRENT_REQUESTS) * 100).toFixed(1)}%)`);
    console.log(`  -> Failed:            ${failed}`);
    console.log(`  -> Total Duration:    ${duration} ms`);
    console.log(`  -> Throughput (RPS):  ${rps} req/sec`);
    console.log(`  -> Latency (min/avg/max): ${minLatency}ms / ${avgLatency}ms / ${maxLatency}ms\n`);
  }

  console.log('Stress test execution finished.');
  process.exit(0);
}

executeModuleStressTest();
