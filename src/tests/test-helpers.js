function it(description, testFn) {
  const li = document.createElement('li');
  li.textContent = description;
  try {
    testFn();
    li.style.color = 'green';
  } catch (error) {
    li.style.color = 'red';
    const errorDiv = document.createElement('div');
    errorDiv.textContent = error.stack;
    errorDiv.style.fontSize = '0.8em';
    errorDiv.style.marginLeft = '1em';
    li.appendChild(errorDiv);
  }
  document.getElementById('test-results').appendChild(li);
}

function assertEqual(a, b) {
  if (a !== b) {
    throw new Error(`Assertion failed: ${a} !== ${b}`);
  }
}

function assert(value) {
  if (!value) {
    throw new Error(`Assertion failed: value is not truthy`);
  }
}
