/* eslint-disable global-require */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const request = require('./request');

const {
  GITHUB_EVENT_PATH, GITHUB_TOKEN, GITHUB_WORKSPACE, SOURCE_ROOT
} = process.env;
const event = require(GITHUB_EVENT_PATH);
const { after: sha } = event;
const { repository } = event;
const {
  owner: { login: owner }
} = repository;
const { name: repo } = repository;

const checkName = 'ESLint check';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github.antiope-preview+json',
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'User-Agent': 'eslint-action'
};

async function createCheck() {
  const body = {
    name: checkName,
    head_sha: sha,
    status: 'in_progress',
    started_at: new Date()
  };

  const { data } = await request(`https://api.github.com/repos/${owner}/${repo}/check-runs`, {
    method: 'POST',
    headers,
    body
  });
  const { id } = data;
  return id;
}

function lint() {
  const eslint = require('eslint');

  const cli = new eslint.CLIEngine({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    ignorePath: SOURCE_ROOT ? null : '.gitignore'
  });
  const report = cli.executeOnFiles(['.']);
  // fixableErrorCount, fixableWarningCount are available too
  const { results, errorCount, warningCount } = report;

  const levels = ['', 'warning', 'failure'];

  const annotations = [];
  results.forEach(result => {
    const { filePath, messages } = result;
    const path = filePath.substring(GITHUB_WORKSPACE.length + 1);
    messages.forEach(msg => {
      const {
        line, severity, ruleId, message
      } = msg;
      const annotationLevel = levels[severity];
      annotations.push({
        path,
        start_line: line,
        end_line: line,
        annotation_level: annotationLevel,
        message: `[${ruleId}] ${message}`
      });
    });
  });

  return {
    conclusion: errorCount > 0 ? 'failure' : 'success',
    output: {
      title: checkName,
      summary: `${errorCount} error(s), ${warningCount} warning(s) found`,
      annotations
    }
  };
}

async function updateCheck(id, conclusion, output) {
  let annotations = output.annotations;
  do {
    output.annotations = annotations.splice(0, 50); // eslint-disable-line no-param-reassign
    const completed = output.annotations.length < 50;
    const body = {
      name: checkName,
      head_sha: sha,
      status: completed ? 'completed' : 'in_progress',
      completed_at: completed ? new Date() : undefined,
      conclusion: completed ? conclusion : undefined,
      output
    };

    await request(`https://api.github.com/repos/${owner}/${repo}/check-runs/${id}`, {
      method: 'PATCH',
      headers,
      body
    });
  } while (annotations.length);
}

function exitWithError(err) {
  console.error('Error', err.stack);
  if (err.data) {
    console.error(err.data);
  }
  process.exit(1);
}

async function run() {
  const id = await createCheck();
  try {
    const { conclusion, output } = lint();
    console.log(output.summary);
    await updateCheck(id, conclusion, output);
    if (conclusion === 'failure') {
      process.exit(78);
    }
  } catch (err) {
    await updateCheck(id, 'failure');
    exitWithError(err);
  }
}

run().catch(exitWithError);
