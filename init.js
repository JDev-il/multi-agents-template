#!/usr/bin/env node

/**
 * Multi-Agent Monorepo Template - Project Initializer
 * Run with: npm run init
 *
 * Runs once. Locked after completion via .scaffold/.initialized
 * Delete .scaffold/.initialized to re-run.
 */

const readline  = require('readline');
const fs        = require('fs');
const path      = require('path');
const { execSync, spawn } = require('child_process');

// ── Colors ────────────────────────────────────────────────────────────────────

const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  blue:   '\x1b[34m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  red:    '\x1b[31m',
};

const bold   = (s) => `${c.bold}${s}${c.reset}`;
const green  = (s) => `${c.green}${s}${c.reset}`;
const yellow = (s) => `${c.yellow}${s}${c.reset}`;
const dim    = (s) => `${c.dim}${s}${c.reset}`;
const cyan   = (s) => `${c.cyan}${s}${c.reset}`;
const blue   = (s) => `${c.blue}${s}${c.reset}`;
const red    = (s) => `${c.red}${s}${c.reset}`;

// ── Lock check ────────────────────────────────────────────────────────────────

const ROOT        = __dirname;
const RUNTIME_DIR = path.join(ROOT, '.scaffold');
const LOCK_FILE   = path.join(RUNTIME_DIR, '.initialized');

// Ensure .scaffold/ runtime dir exists
const fs_temp = require('fs');
if (!fs_temp.existsSync(path.join(__dirname, '.scaffold'))) {
  fs_temp.mkdirSync(path.join(__dirname, '.scaffold'), { recursive: true });
}

if (fs.existsSync(LOCK_FILE)) {
  (async () => {
    const ts = fs.readFileSync(LOCK_FILE, 'utf8').trim();
    const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask2 = (q) => new Promise((resolve) => rl2.question(q, (a) => resolve(a.trim())));

    console.log(`\n${yellow('  This project has already been initialized.')}`);
    console.log(dim(`  Initialized on: ${ts}\n`));
    console.log(`  ${dim('1.')} Continue  — run ${cyan('npm run launch')}`);
    console.log(`  ${dim('2.')} Reset     — delete config and re-run initialization`);
    console.log(`  ${dim('3.')} Exit\n`);

    const choice = await ask2(`  ${bold('Select')} ${dim('(1-3)')}: `);

    if (choice === '1') {
      console.log('');
      rl2.close();
      const child = spawn('node', [path.join(ROOT, '.workflow', 'launch.js')], {
        stdio: 'inherit',
        cwd: ROOT,
      });
      child.on('exit', (code) => process.exit(code));
    } else if (choice === '2') {
      console.log(yellow('\n  Resetting configuration...\n'));
      fs.unlinkSync(LOCK_FILE);
      const configPath = path.join(RUNTIME_DIR, '.config.json');
      if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
      rl2.close();
      console.log(green('  Reset complete. Re-running initialization...\n'));
      main();
    } else {
      console.log(dim('\n  Exited.\n'));
      rl2.close();
      process.exit(0);
    }
  })();
} else {
  main();
}

// ── Decision tree ─────────────────────────────────────────────────────────────

const CLIENT_FRAMEWORKS = [
  { label: 'Next.js',       value: 'Next.js',    language: 'TypeScript', integratedBackend: true  },
  { label: 'Angular',       value: 'Angular',    language: 'TypeScript', integratedBackend: false },
  { label: 'Vue / Nuxt',    value: 'Nuxt',       language: 'TypeScript', integratedBackend: true  },
  { label: 'SvelteKit',     value: 'SvelteKit',  language: 'TypeScript', integratedBackend: true  },
  { label: 'Remix',         value: 'Remix',      language: 'TypeScript', integratedBackend: true  },
  { label: 'Vite + React',  value: 'Vite+React', language: 'TypeScript', integratedBackend: false },
];

const BACKEND_FRAMEWORKS = [
  { label: 'NestJS',   value: 'NestJS',   language: 'TypeScript' },
  { label: 'Express',  value: 'Express',  language: 'TypeScript' },
  { label: 'Fastify',  value: 'Fastify',  language: 'TypeScript' },
  { label: 'Django',   value: 'Django',   language: 'Python'     },
  { label: 'Laravel',  value: 'Laravel',  language: 'PHP'        },
  { label: 'Rails',    value: 'Rails',    language: 'Ruby'       },
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
    if (!isNaN(index) && index >= 0 && index < items.length) return items[index];
    console.log(yellow(`  Please enter a number between 1 and ${items.length}.`));
  }
};

const selectOptional = async (prompt, items) => {
  if (!items || items.length === 0) return null;
  while (true) {
    console.log(`\n${bold(prompt)}`);
    showList(items, true);
    const input = await ask(`\n  ${bold('Select')} ${dim(`(0-${items.length})`)}: `);
    if (input === '0' || input === '') return null;
    const index = parseInt(input) - 1;
    if (!isNaN(index) && index >= 0 && index < items.length) {
      return typeof items[index] === 'string' ? items[index] : items[index].value;
    }
    console.log(yellow(`  Invalid selection. Please enter a number between 0 and ${items.length}.`));
  }
};

const separator = () => console.log(`\n${dim('─'.repeat(60))}`);

// ── Config writer ─────────────────────────────────────────────────────────────

const writeConfig = (filePath, configs) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  for (const [key, value] of Object.entries(configs)) {
    if (!value) continue;
    const regex = new RegExp(`(# @config ${key}\\s*:)([^\\n]*)`, 'g');
    content = content.replace(regex, `$1 ${value}`);
  }

  for (const [key, value] of Object.entries(configs)) {
    if (!value) continue;
    const token = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    content = content.replace(token, value);
  }

  fs.writeFileSync(filePath, content, 'utf8');
};

const ensureGitignore = (entry) => {
  const p = path.join(ROOT, '.gitignore');
  const content = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  if (!content.includes(entry)) fs.appendFileSync(p, `\n${entry}\n`);
};

const summaryLine = (label, value) => {
  const padded = label.padEnd(20);
  if (!value) {
    console.log(`  ${dim(padded)}: ${yellow('(skipped - agent will propose when needed)')}`);
  } else {
    console.log(`  ${dim(padded)}: ${green(value)}`);
  }
};

// ── Copy directory ────────────────────────────────────────────────────────────

const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src).forEach(file => {
    const srcFile  = path.join(src, file);
    const destFile = path.join(dest, file);
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
};

// ── Main ──────────────────────────────────────────────────────────────────────

const main = async () => {
  console.log('\n');
  console.log(bold(cyan('  Multi-Agent Monorepo Template')));
  console.log(dim('  Project Initializer\n'));
  separator();

  console.log(`\n${bold('Let\'s configure your project.')}`);
  console.log(dim('  Required fields must be selected. Optional fields can be skipped (press 0 or Enter).\n'));
  console.log(dim('  Skipped fields will be resolved by the agent when first needed.\n'));

  // ── Project name ────────────────────────────────────────────────────────────

  let projectName = '';
  while (!projectName) {
    projectName = await ask(`${bold('* Project name')}: `);
    if (!projectName) console.log(yellow('  Project name is required. Please enter a name.'));
  }

  separator();

  // ── Client ──────────────────────────────────────────────────────────────────

  console.log(`\n${bold(blue('Client configuration'))}`);

  const clientFw    = await selectRequired('* Client framework (required):', CLIENT_FRAMEWORKS);
  const clientLang  = clientFw.language;
  const clientState = await selectOptional('State management:', STATE_OPTIONS[clientFw.value] || []);
  const clientUi    = await selectOptional('UI library:', UI_OPTIONS[clientFw.value] || []);
  const clientStyle = await selectOptional('Styling:', STYLING_OPTIONS);

  separator();

  // ── Backend ─────────────────────────────────────────────────────────────────

  console.log(`\n${bold(blue('Backend configuration'))}`);

  // Check if client framework has integrated backend support
  let useIntegratedBackend = false;
  let backendFw   = null;
  let backendLang = null;
  let backendOrm  = null;
  let backendAuth = null;
  let backendType = null;

  if (clientFw.integratedBackend) {
    console.log(dim(`  ${clientFw.value} supports server-side rendering and API routes.\n`));
    const integratedAnswer = await ask(`  ${bold('Use integrated backend')} ${dim(`(${clientFw.value} API routes/SSR)`)} ${dim('instead of a separate backend? (y/n)')}: `);
    useIntegratedBackend = integratedAnswer.toLowerCase() === 'y';

    if (useIntegratedBackend) {
      backendType = 'integrated';
      console.log(dim(`\n  Using ${clientFw.value} integrated backend. No separate backend needed.\n`));
    }
  }

  if (!useIntegratedBackend) {
    console.log(dim('  You can skip the backend framework and decide later.\n'));

    const backendFwObj = await (async () => {
      console.log(`\n${bold('Backend framework:')}`);
      showList(BACKEND_FRAMEWORKS, true);
      const input = await ask(`\n  ${bold('Select')} ${dim(`(0-${BACKEND_FRAMEWORKS.length})`)}: `);
      if (input === '0' || input === '') return null;
      const index = parseInt(input) - 1;
      if (isNaN(index) || index < 0 || index >= BACKEND_FRAMEWORKS.length) return null;
      return BACKEND_FRAMEWORKS[index];
    })();

    backendFw   = backendFwObj ? backendFwObj.value    : null;
    backendLang = backendFwObj ? backendFwObj.language : null;
    backendOrm  = backendFw ? await selectOptional('ORM / database layer:', ORM_OPTIONS[backendFw] || []) : null;
    backendAuth = backendFw ? await selectOptional('Auth strategy:', AUTH_OPTIONS[backendFw] || []) : null;
    backendType = backendFw ? 'separate' : null;
  }

  separator();

  // ── Summary ─────────────────────────────────────────────────────────────────

  console.log(`\n${bold('Review your configuration:')}\n`);
  summaryLine('Project',           projectName);
  summaryLine('Client framework',  clientFw.value);
  summaryLine('Client language',   clientLang);
  summaryLine('State management',  clientState);
  summaryLine('UI library',        clientUi);
  summaryLine('Styling',           clientStyle);
  summaryLine('Backend type',     backendType === 'integrated' ? `${clientFw.value} integrated` : backendFw || '(skipped)');
  if (backendType !== 'integrated') {
    summaryLine('Backend language',  backendLang);
    summaryLine('ORM',               backendOrm);
    summaryLine('Auth',              backendAuth);
  }

  console.log('');
  console.log(dim('  y = confirm  |  n = abort  |  e = edit (start over)\n'));
  const confirm = await ask(`${bold('Confirm and write to config files?')} ${dim('(y/n/e)')}: `);

  if (confirm.toLowerCase() === 'e') {
    console.log(yellow('\n  Restarting configuration...\n'));
    rl.close();
    const { spawn } = require('child_process');
    const child = spawn('node', [__filename], { stdio: 'inherit', cwd: ROOT });
    child.on('exit', (code) => process.exit(code));
    return;
  }

  if (confirm.toLowerCase() !== 'y') {
    console.log(yellow('\n  Aborted. No files were changed.\n'));
    rl.close();
    return;
  }

  // ── Write configs ────────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold('Setting up your project...')}\n`);

  // ── Clone multi-agents-core ──────────────────────────────────────────────────

  const CORE_REPO = 'https://github.com/JDev-il/multi-agents-core.git';
  const CORE_DIR  = path.join(ROOT, '.agents-core');

  console.log(`  Fetching templates...`);
  try {
    execSync(`git clone "${CORE_REPO}" "${CORE_DIR}"`, { stdio: 'pipe' });
    console.log(`  ${green('✓')} Templates fetched`);
  } catch (err) {
    console.log(`  ${red('✗')} Failed to fetch templates. Check your internet connection.`);
    rl.close();
    process.exit(1);
  }

  const TEMPLATES = path.join(CORE_DIR, 'templates');

  copyDir(path.join(TEMPLATES, 'client'),  path.join(ROOT, 'client'));
  copyDir(path.join(TEMPLATES, 'shared'),  path.join(ROOT, 'shared'));
  if (backendType === 'separate') {
    copyDir(path.join(TEMPLATES, 'backend'), path.join(ROOT, 'backend'));
  }
  fs.copyFileSync(path.join(TEMPLATES, 'CLAUDE.md'),    path.join(ROOT, 'CLAUDE.md'));
  fs.copyFileSync(path.join(TEMPLATES, 'CONTRACTS.md'), path.join(ROOT, 'CONTRACTS.md'));
  console.log(`  ${green('✓')} Templates copied`);

  // ── Copy workflow scripts ────────────────────────────────────────────────────

  const WORKFLOW_SRC  = path.join(CORE_DIR, 'workflow');
  const WORKFLOW_DEST = path.join(ROOT, '.workflow');
  fs.mkdirSync(WORKFLOW_DEST, { recursive: true });
  copyDir(WORKFLOW_SRC, WORKFLOW_DEST);
  console.log(`  ${green('✓')} Workflow scripts copied (.workflow/)`);

  execSync(`rm -rf "${CORE_DIR}"`);
  console.log(`  ${green('✓')} Temporary files cleaned up`);

  // ── Write @config values ─────────────────────────────────────────────────────

  writeConfig(path.join(ROOT, 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
    PROJECT_ROOT: projectName,
  });
  console.log(`  ${green('✓')} CLAUDE.md configured`);

  writeConfig(path.join(ROOT, 'client', 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
    FRAMEWORK:    clientFw.value,
    LANGUAGE:     clientLang,
    STATE:        clientState,
    UI_LIBRARY:   clientUi,
    STYLING:      clientStyle,
  });
  console.log(`  ${green('✓')} client/CLAUDE.md configured`);

  if (backendType === 'separate') {
    writeConfig(path.join(ROOT, 'backend', 'CLAUDE.md'), {
      PROJECT_NAME: projectName,
      FRAMEWORK:    backendFw,
      LANGUAGE:     backendLang,
      ORM:          backendOrm,
      AUTH:         backendAuth,
    });
    console.log(`  ${green('✓')} backend/CLAUDE.md configured`);
  }

  ensureGitignore('worktrees/');
  ensureGitignore('.agents-core/');
  ensureGitignore('.scaffold/');
  ensureGitignore('.workflow/');
  console.log(`  ${green('✓')} .gitignore updated`);

  // ── Write .config.json ───────────────────────────────────────────────────────

  const config = {
    projectName,
    client: {
      framework: clientFw.value,
      language:  clientLang,
      state:     clientState,
      uiLibrary: clientUi,
      styling:   clientStyle,
    },
    backend: {
      type:      backendType,
      framework: backendFw,
      language:  backendLang,
      orm:       backendOrm,
      auth:      backendAuth,
    },
  };

  fs.writeFileSync(
    path.join(RUNTIME_DIR, '.config.json'),
    JSON.stringify(config, null, 2),
    'utf8'
  );
  console.log(`  ${green('✓')} .scaffold/.config.json written`);

  // ── Generate BUILD_STATE.md ──────────────────────────────────────────────────

  const backendDisplay = backendType === 'integrated'
    ? `${clientFw.value} integrated (API routes/SSR)`
    : backendFw || 'Not configured';

  const clientStack = [clientFw.value, clientLang, clientStyle, clientUi, clientState]
    .filter(Boolean).join(' + ');

  const backendStack = backendType === 'separate'
    ? [backendFw, backendLang, backendOrm, backendAuth].filter(Boolean).join(' + ')
    : backendDisplay;

  const buildState = `# BUILD_STATE.md
# Living project state. Read before every task. Update after completion.
# Every agent must read this file at session start.

## Project
Name      : ${projectName}
Initialized : ${new Date().toISOString()}

## Stack
Client  : ${clientStack}
Backend : ${backendStack}

## Client State
- [ ] Scaffold - framework initialized
- [ ] UI - components and layout
- [ ] LOGIC - state management and API client
- [ ] FORMS - form architecture
- [ ] ROUTING - route definitions
- [ ] TESTING - test suite
- [ ] ACCESSIBILITY - a11y compliance

## Backend State
${backendType === 'integrated'
  ? `Type: ${clientFw.value} integrated backend (API routes / SSR)
- [ ] API routes - server-side endpoints
- [ ] Auth - authentication strategy
- [ ] DB - data layer if needed`
  : backendType === 'separate'
  ? `Type: Separate backend (${backendFw})
- [ ] Scaffold - framework initialized
- [ ] DB - schema and entities
- [ ] API - endpoints and DTOs
- [ ] AUTH - authentication strategy
- [ ] LOGIC - business rules
- [ ] EVENTS - webhooks and queues
- [ ] JOBS - background tasks`
  : 'Not configured - run node .workflow/launch.js and select backend when ready'}

## Shared
- [ ] CONTRACTS.md - no shared types defined yet

## Dependency Rules
Before starting any task, verify:
- Client LOGIC requires: Client scaffold done
- Client FORMS requires: Client scaffold done
- Client ROUTING requires: Client scaffold done
- API calls in client require: Backend API endpoints done OR mocked
- Backend API requires: DB schema done (if using DB)
- Backend AUTH requires: DB User entity done
- Any cross-boundary types: Must exist in CONTRACTS.md first

If a dependency is not met:
  DEPENDENCY NOT MET - surface what is missing and propose options.
  Never proceed silently on a missing dependency.

## Agent Log
| Date | Agent | Scope | Task | Status | Branch |
|------|-------|-------|------|--------|--------|
`;

  fs.writeFileSync(path.join(ROOT, 'BUILD_STATE.md'), buildState, 'utf8');
  console.log(`  ${green('✓')} BUILD_STATE.md generated`);

  // ── Lock ─────────────────────────────────────────────────────────────────────

  fs.writeFileSync(LOCK_FILE, new Date().toISOString());
  console.log(`  ${green('✓')} Initialization locked`);

  // ── Auto-commit ───────────────────────────────────────────────────────────────

  try {
    execSync('git add .', { cwd: ROOT, stdio: 'pipe' });
    execSync('git commit -m "init: project configuration"', { cwd: ROOT, stdio: 'pipe' });
    console.log(`  ${green('✓')} Project configuration committed`);
  } catch (err) {
    console.log(`  ${yellow('!')} Could not auto-commit. Run manually:`);
    console.log(dim('     git add . && git commit -m "init: project configuration"'));
  }

  // ── Chain to launch.js ────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold(green('  Project initialized successfully!'))}\n`);

  const launchInput = await ask(`  ${bold('Ready to launch your first task?')} ${dim('(y/n — default: n)')}: `);
  const launch = launchInput.toLowerCase() || 'n';

  if (launch === 'y') {
    rl.close();
    console.log('');
    const child = spawn('node', [path.join(ROOT, '.workflow', 'launch.js')], {
      stdio: 'inherit',
      cwd: ROOT,
    });
    child.on('exit', (code) => process.exit(code));
  } else {
    console.log('');
    console.log(`  ${bold('When ready, run:')}`); 
    console.log(`  ${cyan('npm run launch')}\n`);
    separator();
    console.log('');
    rl.close();
  }
};

function runMain() {
  main().catch((err) => {
    console.error('\n  Error:', err.message);
    process.exit(1);
  });
}