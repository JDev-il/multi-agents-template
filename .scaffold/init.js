#!/usr/bin/env node

/**
 * Multi-Agent Monorepo Template - Project Initializer
 * Run with: npm run init
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Colors ───────────────────────────────────────────────────────────────────

const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  blue:   '\x1b[34m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
};

const bold   = (s) => `${c.bold}${s}${c.reset}`;
const green  = (s) => `${c.green}${s}${c.reset}`;
const blue   = (s) => `${c.blue}${s}${c.reset}`;
const yellow = (s) => `${c.yellow}${s}${c.reset}`;
const dim    = (s) => `${c.dim}${s}${c.reset}`;
const cyan   = (s) => `${c.cyan}${s}${c.reset}`;

// ─── Readline setup ───────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));

const askOptional = async (question, hint) => {
  const answer = await ask(`${question} ${dim(`(optional - ${hint})`)}: `);
  return answer || '';
};

// ─── Config writer ────────────────────────────────────────────────────────────

const writeConfig = (filePath, configs) => {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  for (const [key, value] of Object.entries(configs)) {
    if (!value) continue;
    // Replace blank @config line with confirmed value
    const regex = new RegExp(`(# @config ${key}\\s*:)([^\\n]*)`, 'g');
    content = content.replace(regex, `$1 ${value}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ensureGitignore = (entry) => {
  const gitignorePath = path.join(process.cwd(), '..', '.gitignore');
  const content = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf8')
    : '';
  if (!content.includes(entry)) {
    fs.appendFileSync(gitignorePath, `\n${entry}\n`);
  }
};

const separator = () => console.log(dim('─'.repeat(60)));

// ─── Main ─────────────────────────────────────────────────────────────────────

const main = async () => {
  console.log('\n');
  console.log(bold(cyan('  Multi-Agent Monorepo Template')));
  console.log(dim('  Project Initializer\n'));
  separator();

  console.log(`\n${bold('Let\'s configure your project.')}`);
  console.log(dim('Required fields are marked with *. Press Enter to skip optional fields.\n'));

  // ── Project name ─────────────────────────────────────────────────────────────

  let projectName = '';
  while (!projectName) {
    projectName = await ask(`${bold('* Project name')}: `);
    if (!projectName) console.log(yellow('  Project name is required.'));
  }

  separator();

  // ── Client config ─────────────────────────────────────────────────────────────

  console.log(`\n${bold(blue('Client configuration'))}\n`);

  let clientFramework = '';
  let clientLanguage  = '';

  clientFramework = await ask(`${bold('* Client framework')} ${dim('(e.g. Next.js, Angular, SvelteKit)')}: `);

  if (!clientFramework) {
    console.log(yellow('  No framework set. Language is required to resolve it later.'));
    while (!clientLanguage) {
      clientLanguage = await ask(`${bold('* Client language')} ${dim('(e.g. TypeScript, JavaScript)')}: `);
      if (!clientLanguage) console.log(yellow('  At least one of framework or language is required.'));
    }
  }

  const clientUiLibrary = await askOptional(`  UI library`, 'e.g. shadcn/ui, Angular Material, Radix');
  const clientState     = await askOptional(`  State management`, 'e.g. Zustand, NgRx, Pinia');
  const clientStyling   = await askOptional(`  Styling`, 'e.g. Tailwind CSS, CSS Modules');

  separator();

  // ── Backend config ────────────────────────────────────────────────────────────

  console.log(`\n${bold(blue('Backend configuration'))}\n`);
  console.log(dim('  Leave blank to let the agent propose a framework when you start a backend task.\n'));

  const backendFramework = await askOptional(`  Backend framework`, 'e.g. NestJS, Django, Laravel');
  const backendLanguage  = await askOptional(`  Backend language`, 'e.g. TypeScript, Python, C#');
  const backendOrm       = await askOptional(`  ORM`, 'e.g. TypeORM, Prisma, SQLAlchemy');
  const backendAuth      = await askOptional(`  Auth`, 'e.g. Passport.js, JWT-only, OAuth2');

  separator();

  // ── Confirm ───────────────────────────────────────────────────────────────────

  console.log(`\n${bold('Review your configuration:')}\n`);
  console.log(`  ${bold('Project')}          : ${green(projectName)}`);
  console.log(`  ${bold('Client framework')} : ${green(clientFramework || '(to be resolved by agent)')}`);
  if (clientLanguage)  console.log(`  ${bold('Client language')}  : ${green(clientLanguage)}`);
  if (clientUiLibrary) console.log(`  ${bold('UI library')}       : ${green(clientUiLibrary)}`);
  if (clientState)     console.log(`  ${bold('State')}            : ${green(clientState)}`);
  if (clientStyling)   console.log(`  ${bold('Styling')}          : ${green(clientStyling)}`);
  console.log(`  ${bold('Backend framework')}: ${green(backendFramework || '(to be resolved by agent)')}`);
  if (backendLanguage) console.log(`  ${bold('Backend language')} : ${green(backendLanguage)}`);
  if (backendOrm)      console.log(`  ${bold('ORM')}              : ${green(backendOrm)}`);
  if (backendAuth)     console.log(`  ${bold('Auth')}             : ${green(backendAuth)}`);

  console.log('');
  const confirm = await ask(`${bold('Confirm and write to config files?')} ${dim('(y/n)')}: `);

  if (confirm.toLowerCase() !== 'y') {
    console.log(yellow('\n  Aborted. No files were changed.\n'));
    rl.close();
    return;
  }

  // ── Write configs ─────────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold('Writing configuration...')}\n`);

  // Root CLAUDE.md
  writeConfig(path.join(process.cwd(), '..', 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
  });
  console.log(`  ${green('✓')} Root CLAUDE.md`);

  // client/CLAUDE.md
  writeConfig(path.join(process.cwd(), '..', 'client', 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
    FRAMEWORK:    clientFramework,
    LANGUAGE:     clientLanguage,
    UI_LIBRARY:   clientUiLibrary,
    STATE:        clientState,
    STYLING:      clientStyling,
  });
  console.log(`  ${green('✓')} client/CLAUDE.md`);

  // backend/CLAUDE.md
  writeConfig(path.join(process.cwd(), '..', 'backend', 'CLAUDE.md'), {
    PROJECT_NAME: projectName,
    FRAMEWORK:    backendFramework,
    LANGUAGE:     backendLanguage,
    ORM:          backendOrm,
    AUTH:         backendAuth,
  });
  console.log(`  ${green('✓')} backend/CLAUDE.md`);

  // ── Worktrees setup ───────────────────────────────────────────────────────────

  ensureGitignore('worktrees/');
  console.log(`  ${green('✓')} worktrees/ added to .gitignore`);

  // ── Done ──────────────────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold(green('  Project initialized successfully!'))}\n`);
  console.log(`  ${bold('Next steps:')}\n`);
  console.log(`  1. Create your first worktree:`);
  console.log(`     ${cyan('git worktree add worktrees/client-ui -b agent/client/ui')}\n`);
  console.log(`  2. Open Claude Code inside the worktree folder\n`);
  console.log(`  3. Run your first task:`);
  console.log(`     ${cyan('Use agents/UI.md. Task: scaffold the initial project structure.')}\n`);
  separator();
  console.log('');

  rl.close();
};

main().catch((err) => {
  console.error('\n  Error:', err.message);
  process.exit(1);
});