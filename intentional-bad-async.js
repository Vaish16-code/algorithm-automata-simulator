// Intentionally bad async patterns for static analysis/testing tools.

async function missingAwaitCall() {
  fetchData();
}

async function silentCatch() {
  try {
    await fetchData();
  } catch {}
}

function asyncExecutorInPromise() {
  return new Promise(async (resolve) => {
    doSomething();
    resolve();
  });
}

function fetchData() {
  return Promise.resolve("ok");
}

function doSomething() {
  return "done";
}

module.exports = {
  missingAwaitCall,
  silentCatch,
  asyncExecutorInPromise,
};
