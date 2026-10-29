const SITE = 'https://mirislamus.github.io';
const PAGES = ['/', '/ru/', '/uz/', '/no-such-page/'];
const VALIDATOR = 'https://validator.w3.org/nu/';

const failures = [];

for (const path of PAGES) {
  const page = `${SITE}${path}`;
  const response = await fetch(`${VALIDATOR}?out=json&doc=${encodeURIComponent(page)}`, {
    headers: { 'user-agent': 'mirislamus.github.io production check' },
  });
  if (!response.ok) {
    failures.push(`${page}: the validator answered ${response.status}`);
    continue;
  }
  const { messages } = await response.json();
  const errors = messages.filter(
    message => (message.type === 'error' || message.subType === 'fatal') && !message.message.startsWith('CSS:'),
  );
  console.log(`${page} ${errors.length === 0 ? 'valid' : `${errors.length} errors`}`);
  for (const error of errors) failures.push(`${page}:${error.lastLine ?? '?'} ${error.message}`);
}

console.log(
  '\nBy hand: https://search.google.com/test/rich-results and https://validator.schema.org for the same pages.',
);

if (failures.length > 0) {
  console.error(`\nW3C Nu HTML Checker:\n${failures.join('\n')}`);
  process.exit(1);
}
