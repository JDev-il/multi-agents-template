#!/usr/bin/env node

/**
 * Multi-Agent Monorepo Template - Task Launcher
 * Run with: node .workflow/launch.js
 *
 * Creates a Git Worktree, generates coordination files,
 * and opens your IDE automatically at the correct path.
 */

const readline     = require('readline');
const fs           = require('fs');
const path         = require('path');
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
const red    = (s) => `${c.red}${s}${c.reset}`;

// ── Paths ─────────────────────────────────────────────────────────────────────

const ROOT        = path.join(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, '.scaffold', '.config.json');
const LOCK_PATH   = path.join(ROOT, '.scaffold', '.initialized');

// ── Guards ────────────────────────────────────────────────────────────────────

if (!fs.existsSync(LOCK_PATH)) {
  console.log(`\n${red('  Project not initialized.')}`);
  console.log(dim('  Run node .scaffold/init.js first.\n'));
  process.exit(1);
}

if (!fs.existsSync(CONFIG_PATH)) {
  console.log(`\n${red('  Missing .scaffold/.config.json.')}`);
  console.log(dim('  Run node .scaffold/init.js to regenerate.\n'));
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// ── Location guard ────────────────────────────────────────────────────────────

const normalizedCwd  = path.resolve(process.cwd());
const normalizedRoot = path.resolve(ROOT);

if (normalizedCwd !== normalizedRoot) {
  console.log(`\n${red('  Wrong location detected.')}`);
  console.log(dim(`  You are here : ${normalizedCwd}`));
  console.log(dim(`  Should be    : ${normalizedRoot}\n`));
  console.log(bold('  Run this to fix it and launch:'));
  console.log(cyan(`\n  cd "${normalizedRoot}" && node .workflow/launch.js\n`));
  process.exit(1);
}

// ── OS & IDE detection ────────────────────────────────────────────────────────

const platform = process.platform;

const detectIDE = () => {
  const ides = [
    { cmd: 'code',     label: 'VS Code'  },
    { cmd: 'cursor',   label: 'Cursor'   },
    { cmd: 'webstorm', label: 'WebStorm' },
  ];

  const which = platform === 'win32' ? 'where' : 'which';

  for (const ide of ides) {
    try {
      execSync(`${which} ${ide.cmd}`, { stdio: 'pipe' });
      return ide;
    } catch {
      continue;
    }
  }
  return null;
};

const openIDE = (worktreePath) => {
  const ide = detectIDE();

  try {
    if (platform === 'darwin') {
      if (ide) {
        execSync(`"${ide.cmd}" --new-window "${worktreePath}"`, { stdio: 'pipe' });
      } else {
        execSync(`open -a "Visual Studio Code" "${worktreePath}"`, { stdio: 'pipe' });
      }
    } else if (platform === 'win32') {
      const cmd = ide ? ide.cmd : 'code';
      execSync(`start "" "${cmd}" "${worktreePath}"`, { stdio: 'pipe' });
    } else {
      const cmd = ide ? ide.cmd : 'code';
      execSync(`${cmd} --new-window "${worktreePath}"`, { stdio: 'pipe' });
    }
    return ide ? ide.label : 'VS Code';
  } catch {
    return null;
  }
};

// ── Agent map ─────────────────────────────────────────────────────────────────

const AGENTS = {
  client:  ['UI', 'LOGIC', 'FORMS', 'ROUTING', 'TESTING', 'ACCESSIBILITY'],
  backend: ['API', 'LOGIC', 'AUTH', 'DB', 'TESTING', 'EVENTS', 'JOBS'],
  shared:  ['SECURITY'],
};

const DOD_ITEMS = {
  UI:            ['All planned components exist and render correctly', 'No business logic inside components', 'All values derive from design tokens', 'Shared types consumed from CONTRACTS.md'],
  LOGIC:         ['All planned logic units exist and function correctly', 'No API calls outside the service layer', 'All response types from CONTRACTS.md', 'State and data fetching concerns separated'],
  FORMS:         ['All fields exist with correct validation rules', 'Error messages are clear and user-facing', 'Submission payload matches CONTRACTS.md', 'Double submission is prevented'],
  ROUTING:       ['All routes resolve to correct components', 'Every protected route declares its guard', 'All routes are lazy loaded unless justified', 'Route paths are centralized'],
  TESTING:       ['All planned test cases exist and pass', 'Happy path, edge cases, and failure states covered', 'Test data shapes from CONTRACTS.md', 'No implementation changes made'],
  ACCESSIBILITY: ['All audit findings resolved', 'Every interactive element keyboard reachable', 'Focus managed after dynamic content changes', 'Color contrast meets WCAG 2.1 AA'],
  API:           ['All endpoints exist with correct HTTP methods', 'DTOs own all input validation', 'All types in CONTRACTS.md', 'Every endpoint declares access control'],
  AUTH:          ['All strategies and guards function correctly', 'No secrets in code', 'All tokens have expiry set', 'Auth failures return consistent responses'],
  DB:            ['All entities and relationships defined', 'Migration generated and surfaced', 'Repository methods own all queries', 'No ORM auto-sync used'],
  EVENTS:        ['All emitters and handlers exist', 'Receivers acknowledge immediately', 'All handlers are idempotent', 'Failure handling defined'],
  JOBS:          ['All jobs exist with correct triggers', 'Schedule expressions from config', 'All jobs are idempotent', 'Failure strategy defined for every job'],
  SECURITY:      ['All findings documented with severity', 'Every finding has a remediation proposal', 'OWASP Top 10 coverage confirmed', 'No fixes implemented directly'],
};

// ── Readline ──────────────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, (a) => resolve(a.trim())));

const showList = (items) => {
  items.forEach((item, i) => {
    console.log(`  ${dim(`${i + 1}.`)} ${item}`);
  });
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

const separator = () => console.log(`\n${dim('─'.repeat(60))}`);

// ── File generators ───────────────────────────────────────────────────────────

const generateClaudeScope = ({ project, agent, branchName, worktreePath }) => {
  return `# .claude-scope
# Auto-generated by .workflow/launch.js
# This file identifies the scope of this worktree.
# Read this file at session start and verify scope before proceeding.

project      : ${project}
agent        : ${agent}
branch       : ${branchName}
worktree     : ${worktreePath}

## Scope Verification Rule
Before doing anything else, verify:
1. The loaded CLAUDE.md matches the project scope above
2. If opened at repo root instead of this worktree - hard stop:

   WRONG CONTEXT - CANNOT PROCEED
   This worktree is scoped to: ${project}/${agent}
   Close and reopen at: ${worktreePath}

3. Read TASK.md for the current task prompt
4. Reference the correct agent file: agents/${agent}.md
`;
};

const generateTaskMd = ({ project, agent, task, branchName }) => {
  const dod    = (DOD_ITEMS[agent] || []).map(item => `- [ ] ${item}`).join('\n');
  const prompt = project === 'shared'
    ? `Use shared/agents/${agent}.md. Task: ${task}`
    : `Use agents/${agent}.md. Task: ${task}`;

  return `# TASK - ${config.projectName}

## Scope
Project : ${project}
Agent   : ${agent}
Branch  : ${branchName}

## Claude Code Prompt
Copy and paste this into the Claude Code chat panel:

\`\`\`
${prompt}
\`\`\`

> Open Claude Code in a NEW chat window.
> Do NOT reuse a previous chat session for this task.

---

## Definition of Done
${dod || '- [ ] Task completed as described above'}

---

## Status
- [ ] NOT STARTED
- [ ] IN PROGRESS
- [ ] COMPLETED

## Notes
<!-- Agent writes completion notes, decisions, and open questions here -->
`;
};

// ── Main ──────────────────────────────────────────────────────────────────────

const main = async () => {
  console.log('\n');
  console.log(bold(cyan('  Multi-Agent Monorepo Template')));
  console.log(dim(`  Task Launcher - ${config.projectName}\n`));
  separator();

  // ── Select scope ─────────────────────────────────────────────────────────────

  const scopeOptions = Object.keys(AGENTS);
  const project      = await selectRequired('* Project scope:', scopeOptions);

  // ── Select agent ─────────────────────────────────────────────────────────────

  const agentOptions = AGENTS[project];
  const agent        = await selectRequired(`* Agent (${project}):`, agentOptions);

  // ── Task description ──────────────────────────────────────────────────────────

  let task = '';
  while (!task) {
    task = await ask(`\n${bold('* Task description')}: `);
    if (!task) console.log(yellow('  Task description is required.'));
  }

  separator();

  // ── Confirm ───────────────────────────────────────────────────────────────────

  const worktreeName = `${project}-${agent.toLowerCase()}`;
  const branchName   = `agent/${project}/${agent.toLowerCase()}`;
  const worktreePath = path.join(ROOT, 'worktrees', worktreeName);

  console.log(`\n${bold('Review:')}\n`);
  console.log(`  ${dim('Project')}  : ${green(project)}`);
  console.log(`  ${dim('Agent')}    : ${green(agent)}`);
  console.log(`  ${dim('Branch')}   : ${green(branchName)}`);
  console.log(`  ${dim('Worktree')} : ${green(`worktrees/${worktreeName}`)}`);
  console.log(`  ${dim('Task')}     : ${green(task)}`);
  console.log('');

  const confirm = await ask(`${bold('Confirm?')} ${dim('(y/n)')}: `);
  if (confirm.toLowerCase() !== 'y') {
    console.log(yellow('\n  Aborted.\n'));
    rl.close();
    return;
  }

  separator();
  console.log(`\n${bold('Setting up workspace...')}\n`);

  // ── Create worktree ───────────────────────────────────────────────────────────

  try {
    execSync(`git worktree add "${worktreePath}" -b ${branchName}`, {
      cwd: ROOT,
      stdio: 'pipe',
    });
    console.log(`  ${green('✓')} Worktree created: worktrees/${worktreeName}`);
  } catch (err) {
    console.log(`  ${yellow('!')} Worktree may already exist - continuing.`);
  }

  // ── Write .claude-scope ───────────────────────────────────────────────────────

  fs.writeFileSync(
    path.join(worktreePath, '.claude-scope'),
    generateClaudeScope({ project, agent, branchName, worktreePath }),
    'utf8'
  );
  console.log(`  ${green('✓')} .claude-scope written`);

  // ── Write TASK.md ─────────────────────────────────────────────────────────────

  fs.writeFileSync(
    path.join(worktreePath, 'TASK.md'),
    generateTaskMd({ project, agent, task, branchName }),
    'utf8'
  );
  console.log(`  ${green('✓')} TASK.md written`);

  // ── Open IDE ──────────────────────────────────────────────────────────────────

  const openedIDE = openIDE(worktreePath);
  if (openedIDE) {
    console.log(`  ${green('✓')} ${openedIDE} opened at worktrees/${worktreeName}`);
  } else {
    console.log(`  ${yellow('!')} Could not open IDE automatically.`);
    console.log(dim(`     Open manually at: ${worktreePath}`));
  }

  // ── Next steps ────────────────────────────────────────────────────────────────

  separator();
  console.log(`\n${bold(green('  Workspace ready!'))}\n`);
  console.log(`  ${bold('What to do next:')}\n`);
  console.log(`  ${bold('1.')} Your IDE should be open at: ${cyan(`worktrees/${worktreeName}`)}`);
  console.log(dim('     If not, open it manually at the path above.\n'));
  console.log(`  ${bold('2.')} Open a ${bold('NEW')} Claude Code chat window.`);
  console.log(dim('     Do NOT reuse a previous session.\n'));
  console.log(`  ${bold('3.')} Copy the prompt from ${cyan('TASK.md')} and paste it into the chat.\n`);
  console.log(`  ${bold('4.')} When the agent completes the task:`);
  console.log(dim('     Check off the Definition of Done items in TASK.md.'));
  console.log(dim('     Mark status as COMPLETED before starting the next task.\n'));
  separator();
  console.log('');

  rl.close();
};

main().catch((err) => {
  console.error('\n  Error:', err.message);
  process.exit(1);
});