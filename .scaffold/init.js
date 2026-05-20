#!/usr/bin/env node

/**
 * Multi-Agent Monorepo Template - Project Initializer
 * Run with: node .scaffold/init.js
 *
 * Runs once. Locked after completion via .scaffold/.initialized
 * Delete .scaffold/.initialized to re-run.
 */

const readline = require('readline');
const fs       = require('fs');
const path     = require('path');
const { execSync } = require('child_process');

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

const LOCK_FILE = path.join(__dirname, '.initialized');
const ROOT      = path.join(__dirname, '..');

if (fs.existsSync(LOCK_FILE)) {
  const ts = fs.readFileSync(LOCK_FILE, 'utf8').trim();
  console.log(`\n${yellow('  This project has already been initialized.')}`);
  console.log(dim(`  Initialized on: ${ts}`));
  console.log(dim('  To re-run, delete .scaffold/.initialized first.\n'));
  process.exit(0);
}

// ── Decision tree ─────────────────────────────────────────────────────────────

const CLIENT_FRAMEWORKS = [
  { label: 'Next.js',       value: 'Next.js',    language: 'TypeScript' },
  { label: 'Angular',       value: 'Angular',    language: 'TypeScript' },
  { label: 'Vue / Nuxt',    value: 'Nuxt',       language: 'TypeScript' },
  { label: 'SvelteKit',     value: 'SvelteKit',  language: 'TypeScript' },
  { label: 'Remix',         value: 'Remix',      language: 'TypeScript' },
  { label: 'Vite + React',  value: 'Vite+React', language: 'TypeScript' },
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

const IDE_OPTIONS = [
  { label: 'VS Code',                           value: 'vscode',   cmd: 'code'      },
  { label: 'Cursor',                            value: 'cursor',   cmd: 'cursor'    },
  { label: 'WebStorm / IntelliJ',               value: 'webstorm', cmd: 'webstorm'  },
  { label: 'Other (manual - path will be shown)', value: 'other',  cmd: null        },
];

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
  console.log(`\n${bold(prompt)}`);
  showList(items, true);
  const input = await ask(`\n  ${bold('Select')} ${dim(`(0-${items.length})`)}: `);
  if (input === '0' || input === '') return null;
  const index = parseInt(input) - 1;
  if (isNaN(index) || index < 0 || index >= items.length) return null;
  return typeof items[index] === 'string' ? items[index] : items[index].value;
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
  console.log(dim('  Required fields must be selected. Optional fields can be skipped (press 0 or Enter).\n'));
  console.log(dim('  Skipped fields will be resolved by the agent when first needed.\n'));

  // ── Project name ────────────────────────────────────────────────────────────

  let projectName = '';
  while (!projectName) {
    projectName = await ask(`${bold('* Project name')}: `);
    if (!projectName) console.log(yellow('  Project name is required. Please enter a name.'));
  }

  separator();

  // ── IDE ─────────────────────────────────────────────────────────────────────

  console.log(`\n${bold(blue('IDE configuration'))}`);
  console.log(dim('  This is used to auto-open your IDE when launching a new task.\n'));
  console.log(dim('  Note for WebStorm/IntelliJ users: requires shell script enabled'));
  console.log(dim('  via Tools -> Create Command-line Launcher\n'));

  const ideChoice = await selectRequired('* Which IDE are you using?', IDE_OPTIONS);

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

  const backendFw   = backendFwObj ? backendFwObj.value    : null;
  const backendLang = backendFwObj ? backendFwObj.language : null;
  const backendOrm  = backendFw ? await selectOptional('ORM / database layer:', ORM_OPTIONS[backendFw] || []) : null;
  const backendAuth = backendFw ? await selectOptional('Auth strategy:', AUTH_OPTIONS[backendFw] || []) : null;

  separator();

  // ── Summary ─────────────────────────────────────────────────────────────────

  console.log(`\n${bold('Review your configuration:')}\n`);
  summaryLine('Project',           projectName);
  summaryLine('IDE',               ideChoice.label);
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

  // ── Write configs ────────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold('Writing configuration...')}\n`);

  // ── Clone multi-agents-core ─────────────────────────────────────────────────

  const CORE_REPO  = 'https://github.com/JDev-il/multi-agents-core.git';
  const CORE_DIR   = path.join(ROOT, '.agents-core');

  console.log(`  Fetching templates from multi-agents-core...`);
  try {
    execSync(`git clone ${CORE_REPO} "${CORE_DIR}"`, { stdio: 'pipe' });
    console.log(`  ${green('✓')} Templates fetched`);
  } catch (err) {
    console.log(`  ${red('✗')} Failed to fetch templates. Check your internet connection.`);
    rl.close();
    process.exit(1);
  }

  const TEMPLATES = path.join(CORE_DIR, 'templates');

  // ── Copy templates into project ───────────────────────────────────────────────

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

  copyDir(path.join(TEMPLATES, 'client'),  path.join(ROOT, 'client'));
  copyDir(path.join(TEMPLATES, 'backend'), path.join(ROOT, 'backend'));
  copyDir(path.join(TEMPLATES, 'shared'),  path.join(ROOT, 'shared'));
  fs.copyFileSync(path.join(TEMPLATES, 'CLAUDE.md'),     path.join(ROOT, 'CLAUDE.md'));
  fs.copyFileSync(path.join(TEMPLATES, 'CONTRACTS.md'),  path.join(ROOT, 'CONTRACTS.md'));
  console.log(`  ${green('✓')} Templates copied into project`);

  // ── Clean up cloned core ──────────────────────────────────────────────────────

  execSync(`rm -rf "${CORE_DIR}"`);
  console.log(`  ${green('✓')} Temporary files cleaned up`);

  // ── Write @config values into generated files ────────────────────────────────

  writeConfig(path.join(ROOT, 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
    PROJECT_ROOT: projectName,
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
  ensureGitignore('.agents-core/');
  console.log(`  ${green('✓')} worktrees/ added to .gitignore`);

  // ── Write .config.json ───────────────────────────────────────────────────────

  const config = {
    projectName,
    ide: {
      value: ideChoice.value,
      label: ideChoice.label,
      cmd:   ideChoice.cmd,
    },
    client: {
      framework: clientFw.value,
      language:  clientLang,
      state:     clientState,
      uiLibrary: clientUi,
      styling:   clientStyle,
    },
    backend: {
      framework: backendFw,
      language:  backendLang,
      orm:       backendOrm,
      auth:      backendAuth,
    },
  };

  fs.writeFileSync(
    path.join(__dirname, '.config.json'),
    JSON.stringify(config, null, 2),
    'utf8'
  );
  console.log(`  ${green('✓')} .scaffold/.config.json`);

  // ── Lock ─────────────────────────────────────────────────────────────────────

  fs.writeFileSync(LOCK_FILE, new Date().toISOString());
  console.log(`  ${green('✓')} Initialization locked (.scaffold/.initialized)`);

  // ── Next steps ────────────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold(green('  Project initialized successfully!'))}\n`);
  console.log(`  ${bold('What to do next:')}\n`);
  console.log(`  ${bold('1.')} Launch your first task:`);
  console.log(`     ${cyan('node .workflow/launch.js')}\n`);
  console.log(`  ${bold('2.')} Follow the prompts to select scope, agent, and task`);
  console.log(`     The launcher will create the worktree, open your IDE,`);
  console.log(`     and generate the exact Claude Code prompt for you.\n`);
  separator();
  console.log('');

  rl.close();
};

main().catch((err) => {
  console.error('\n  Error:', err.message);
  process.exit(1);
});