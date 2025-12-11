let currentList = document.getElementById('test-results');

export function describe(moduleName, fn) {
  const h2 = document.createElement('h2');
  h2.textContent = moduleName;
  document.body.appendChild(h2);

  const ul = document.createElement('ul');
  document.body.appendChild(ul);

  const previousList = currentList;
  currentList = ul;

  try {
    fn();
  } finally {
    currentList = previousList;
  }
}

export async function it(description, testFn) {
  const targetList = currentList || document.getElementById('test-results') || document.body;
  const li = document.createElement('li');
  li.textContent = description;
  targetList.appendChild(li); // Append immediately to show progress

  try {
    await testFn();
    li.style.color = 'green';
  } catch (error) {
    li.style.color = 'red';
    const errorDiv = document.createElement('div');
    errorDiv.textContent = error.stack;
    errorDiv.style.fontSize = '0.8em';
    errorDiv.style.marginLeft = '1em';
    li.appendChild(errorDiv);
  }
}

export function assertEqual(a, b, message) {
  if (a !== b) {
    throw new Error(`Assertion failed: ${a} !== ${b}` + (message ? ` - ${message}` : ''));
  }
}

export function assert(value, message) {
  if (!value) {
    throw new Error('Assertion failed: value is not truthy' + (message ? ` - ${message}` : ''));
  }
}

export const assertTrue = assert;
