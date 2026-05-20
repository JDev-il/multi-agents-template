#!/usr/bin/env node

/**
 * Multi-Agent Monorepo Template - Project Initializer
 * Run with: node .scaffold/init.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ── Colors ────────────────────────────────────────────────────────────────────

const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  blue:   '\x1b[34m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
};

const bold   = (s) => `${c.bold}${s}${c.reset}`;
const green  = (s) => `${c.green}${s}${c.reset}`;
const yellow = (s) => `${c.yellow}${s}${c.reset}`;
const dim    = (s) => `${c.dim}${s}${c.reset}`;
const cyan   = (s) => `${c.cyan}${s}${c.reset}`;
const blue   = (s) => `${c.blue}${s}${c.reset}`;

// ── Decision tree ─────────────────────────────────────────────────────────────

const CLIENT_FRAMEWORKS = [
  { label: 'Next.js',           value: 'Next.js',    language: 'TypeScript' },
  { label: 'Angular',           value: 'Angular',    language: 'TypeScript' },
  { label: 'Vue / Nuxt',        value: 'Nuxt',       language: 'TypeScript' },
  { label: 'SvelteKit',         value: 'SvelteKit',  language: 'TypeScript' },
  { label: 'Remix',             value: 'Remix',      language: 'TypeScript' },
  { label: 'Vite + React',      value: 'Vite+React', language: 'TypeScript' },
];

const BACKEND_FRAMEWORKS = [
  { label: 'NestJS',    value: 'NestJS',   language: 'TypeScript' },
  { label: 'Express',   value: 'Express',  language: 'TypeScript' },
  { label: 'Fastify',   value: 'Fastify',  language: 'TypeScript' },
  { label: 'Django',    value: 'Django',   language: 'Python'     },
  { label: 'Laravel',   value: 'Laravel',  language: 'PHP'        },
  { label: 'Rails',     value: 'Rails',    language: 'Ruby'       },
];

const STATE_OPTIONS = {
  'Next.js':    ['Zustand', 'Redux Toolkit', 'Jotai', 'TanStack Query'],
  'Vite+React': ['Zustand', 'Redux Toolkit', 'Jotai', 'TanStack Query'],
  'Remix':      ['Zustand', 'Redux Toolkit', 'Jotai', 'TanStack Query'],
  'Angular':    ['NgRx', 'Signals (built-in)', 'Akita'],
  'Nuxt':       ['Pinia', 'Vuex'],
  'SvelteKit':  ['Svelte stores (built-in)', 'Zustand'],
};

const UI_OPTIONS = {
  'Next.js':    ['shadcn/ui', 'Radix UI', 'MUI', 'Chakra UI', 'Ant Design'],
  'Vite+React': ['shadcn/ui', 'Radix UI', 'MUI', 'Chakra UI', 'Ant Design'],
  'Remix':      ['shadcn/ui', 'Radix UI', 'MUI', 'Chakra UI', 'Ant Design'],
  'Angular':    ['Angular Material', 'PrimeNG', 'Clarity'],
  'Nuxt':       ['Vuetify', 'PrimeVue', 'Naive UI'],
  'SvelteKit':  ['Skeleton', 'daisyUI', 'shadcn-svelte'],
};

const STYLING_OPTIONS = [
  'Tailwind CSS',
  'CSS Modules',
  'Styled Components',
  'SCSS / SASS',
  'UnoCSS',
];

const ORM_OPTIONS = {
  'NestJS':   ['TypeORM', 'Prisma', 'MikroORM', 'Drizzle'],
  'Express':  ['Prisma', 'TypeORM', 'Drizzle', 'Sequelize'],
  'Fastify':  ['Prisma', 'TypeORM', 'Drizzle'],
  'Django':   ['Django ORM (built-in)', 'SQLAlchemy'],
  'Laravel':  ['Eloquent (built-in)'],
  'Rails':    ['Active Record (built-in)'],
};

const AUTH_OPTIONS = {
  'NestJS':   ['Passport.js', 'JWT-only', 'OAuth2', 'Auth.js'],
  'Express':  ['Passport.js', 'JWT-only', 'OAuth2'],
  'Fastify':  ['fastify-jwt', 'Passport.js', 'OAuth2'],
  'Django':   ['Django Auth (built-in)', 'DRF TokenAuth', 'OAuth2'],
  'Laravel':  ['Laravel Sanctum', 'Laravel Passport', 'JWT'],
  'Rails':    ['Devise', 'JWT', 'OAuth2'],
};

// ── Readline ──────────────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, (a) => resolve(a.trim())));

// ── Selection helpers ─────────────────────────────────────────────────────────

const showList = (items, showSkip = false) => {
  items.forEach((item, i) => {
    const label = typeof item === 'string' ? item : item.label;
    console.log(`  ${dim(`${i + 1}.`)} ${label}`);
  });
  if (showSkip) console.log(`  ${dim('0.')} Skip ${dim('(agent will propose when needed)')}`);
};

const selectRequired = async (prompt, items) => {
  while (true) {
    console.log(`\n${bold(prompt)}`);
    showList(items);
    const input = await ask(`\n  ${bold('Select')} ${dim(`(1-${items.length})`)}: `);
    const index = parseInt(input) - 1;
    if (index >= 0 && index < items.length) return items[index];
    console.log(yellow(`  Please enter a number between 1 and ${items.length}.`));
  }
};

const selectOptional = async (prompt, items) => {
  console.log(`\n${bold(prompt)}`);
  showList(items, true);
  const input = await ask(`\n  ${bold('Select')} ${dim(`(0-${items.length})`)}: `);
  const index = parseInt(input) - 1;
  if (input === '0' || index < 0 || index >= items.length) return null;
  return typeof items[index] === 'string' ? items[index] : items[index].value;
};

const separator = () => console.log(`\n${dim('─'.repeat(60))}`);

// ── Config writer ─────────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..');

const writeConfig = (filePath, configs) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(configs)) {
    if (!value) continue;
    const regex = new RegExp(`(# @config ${key}\\s*:)([^\\n]*)`, 'g');
    content = content.replace(regex, `$1 ${value}`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
};

const ensureGitignore = (entry) => {
  const p = path.join(ROOT, '.gitignore');
  const content = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  if (!content.includes(entry)) fs.appendFileSync(p, `\n${entry}\n`);
};

// ── Summary line ──────────────────────────────────────────────────────────────

const summaryLine = (label, value) => {
  const padded = label.padEnd(20);
  if (!value) {
    console.log(`  ${dim(padded)}: ${yellow('(skipped - agent will propose when needed)')}`);
  } else {
    console.log(`  ${dim(padded)}: ${green(value)}`);
  }
};

// ── Main ──────────────────────────────────────────────────────────────────────

const main = async () => {
  console.log('\n');
  console.log(bold(cyan('  Multi-Agent Monorepo Template')));
  console.log(dim('  Project Initializer\n'));
  separator();

  console.log(`\n${bold('Let\'s configure your project.')}`);
  console.log(dim('  Required fields must be selected. Optional fields can be skipped.\n'));
  console.log(dim('  Skipped fields will be resolved by the agent when first needed.\n'));

  // ── Project name ────────────────────────────────────────────────────────────

  let projectName = '';
  while (!projectName) {
    projectName = await ask(`${bold('* Project name')}: `);
    if (!projectName) console.log(yellow('  Project name is required.'));
  }

  separator();

  // ── Client ──────────────────────────────────────────────────────────────────

  console.log(`\n${bold(blue('Client configuration'))}`);

  const clientFw     = await selectRequired('* Client framework (required):', CLIENT_FRAMEWORKS);
  const clientLang   = clientFw.language; // auto-derived
  const clientState  = await selectOptional('State management:', STATE_OPTIONS[clientFw.value] || []);
  const clientUi     = await selectOptional('UI library:', UI_OPTIONS[clientFw.value] || []);
  const clientStyle  = await selectOptional('Styling:', STYLING_OPTIONS);

  separator();

  // ── Backend ─────────────────────────────────────────────────────────────────

  console.log(`\n${bold(blue('Backend configuration'))}`);
  console.log(dim('  You can skip the backend framework and decide later.\n'));

  const backendFw   = await selectOptional('Backend framework:', BACKEND_FRAMEWORKS);
  const backendLang = backendFw ? BACKEND_FRAMEWORKS.find(f => f.value === backendFw)?.language : null;
  const backendOrm  = backendFw ? await selectOptional('ORM / database layer:', ORM_OPTIONS[backendFw] || []) : null;
  const backendAuth = backendFw ? await selectOptional('Auth strategy:', AUTH_OPTIONS[backendFw] || []) : null;

  separator();

  // ── Summary ─────────────────────────────────────────────────────────────────

  console.log(`\n${bold('Review your configuration:')}\n`);
  summaryLine('Project',           projectName);
  summaryLine('Client framework',  clientFw.value);
  summaryLine('Client language',   clientLang);
  summaryLine('State management',  clientState);
  summaryLine('UI library',        clientUi);
  summaryLine('Styling',           clientStyle);
  summaryLine('Backend framework', backendFw);
  summaryLine('Backend language',  backendLang);
  summaryLine('ORM',               backendOrm);
  summaryLine('Auth',              backendAuth);

  console.log('');
  const confirm = await ask(`${bold('Confirm and write to config files?')} ${dim('(y/n)')}: `);

  if (confirm.toLowerCase() !== 'y') {
    console.log(yellow('\n  Aborted. No files were changed.\n'));
    rl.close();
    return;
  }

  // ── Write ───────────────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold('Writing configuration...')}\n`);

  writeConfig(path.join(ROOT, 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
  });
  console.log(`  ${green('✓')} CLAUDE.md`);

  writeConfig(path.join(ROOT, 'client', 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
    FRAMEWORK:    clientFw.value,
    LANGUAGE:     clientLang,
    STATE:        clientState,
    UI_LIBRARY:   clientUi,
    STYLING:      clientStyle,
  });
  console.log(`  ${green('✓')} client/CLAUDE.md`);

  writeConfig(path.join(ROOT, 'backend', 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
    FRAMEWORK:    backendFw,
    LANGUAGE:     backendLang,
    ORM:          backendOrm,
    AUTH:         backendAuth,
  });
  console.log(`  ${green('✓')} backend/CLAUDE.md`);

  ensureGitignore('worktrees/');
  console.log(`  ${green('✓')} worktrees/ added to .gitignore`);

  // ── Next steps ───────────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold(green('  Project initialized successfully!'))}\n`);
  console.log(`  ${bold('What to do next:')}\n`);

  // Step 1 - always shown
  console.log(`  ${bold('1.')} Create your first client worktree:`);
  console.log(`     ${cyan('git worktree add worktrees/client-ui -b agent/client/ui')}\n`);

  // Step 2 - always shown
  console.log(`  ${bold('2.')} Open Claude Code inside ${cyan('worktrees/client-ui/')}\n`);

  // Step 3 - context-aware first task
  const styleHint  = clientStyle  ? ` with ${clientStyle} configured`  : '';
  const stateHint  = clientState  ? ` and ${clientState} for state`     : '';
  const uiHint     = clientUi     ? ` using ${clientUi}`                : '';
  const taskHint   = `scaffold the initial ${clientFw.value} project structure${styleHint}${uiHint}${stateHint}.`;
  console.log(`  ${bold('3.')} Run your first client task:`);
  console.log(`     ${cyan(`Use agents/UI.md. Task: ${taskHint}`)}\n`);

  // Step 4 - backend worktree (always shown)
  console.log(`  ${bold('4.')} When ready to start backend work:`);
  console.log(`     ${cyan('git worktree add worktrees/backend-api -b agent/backend/api')}`);
  console.log(`     Then open Claude Code in that folder.\n`);

  // Step 5 - backend context-aware
  if (!backendFw) {
    console.log(`  ${bold('5.')} ${yellow('Backend framework is not set.')}`);
    console.log(`     The agent will propose options when you start your first backend task.`);
    console.log(`     Reference: ${cyan('Use agents/API.md. Task: <your task here.')}\n`);
  } else {
    console.log(`  ${bold('5.')} Run your first backend task:`);
    const ormHint  = backendOrm  ? ` with ${backendOrm}`  : '';
    const authHint = backendAuth ? ` and ${backendAuth} for auth` : '';
    console.log(`     ${cyan(`Use agents/API.md. Task: scaffold the initial ${backendFw}${ormHint}${authHint} project structure.`)}\n`);
  }

  // Skipped fields reminder
  const skipped = [];
  if (!clientState)  skipped.push('State management');
  if (!clientUi)     skipped.push('UI library');
  if (!clientStyle)  skipped.push('Styling');
  if (!backendFw)    skipped.push('Backend framework');
  if (!backendOrm)   skipped.push('ORM');
  if (!backendAuth)  skipped.push('Auth strategy');

  if (skipped.length > 0) {
    console.log(`  ${dim('The following were skipped and will be resolved by the agent when needed:')}`);
    skipped.forEach(s => console.log(`  ${dim(`- ${s}`)}`));
    console.log('');
  }

  separator();
  console.log('');

  rl.close();
};

main().catch((err) => {
  console.error('\n  Error:', err.message);
  process.exit(1);
});