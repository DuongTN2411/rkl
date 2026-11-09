const base = process.env.BASE_URL || 'http://localhost:3000';

async function call(path) {
  const response = await fetch(base + path);
  return response.json();
}

async function main() {
  await call('/api/v1/report/fast');

  const slow = await call('/api/v1/report/slow');
  const fast = await call('/api/v1/report/fast');
  const fastSeparate = await call('/api/v1/report/fast?separate=true');

  console.table([
    { endpoint: '/slow', queryCount: slow.meta.queryCount, durationMs: slow.meta.durationMs },
    { endpoint: '/fast', queryCount: fast.meta.queryCount, durationMs: fast.meta.durationMs },
    {
      endpoint: '/fast?separate=true',
      queryCount: fastSeparate.meta.queryCount,
      durationMs: fastSeparate.meta.durationMs,
    },
  ]);

  const same = JSON.stringify(slow.data) === JSON.stringify(fast.data);
  console.log('Phan data cua slow va fast giong nhau:', same);
}

main().catch((err) => {
  console.error('Loi (server da chay chua?):', err.message);
  process.exitCode = 1;
});
