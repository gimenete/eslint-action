# ESLint Action

This is a GitHub Action that runs ESLint for `.js`, `.jsx`, `.ts` and `.tsx` files using your `.eslintrc` rules. It's free to run and it'll annotate the diffs of your pull requests with lint errors and warnings.

![](screenshots/annotation.png)

Neat! Bet your CI doesn't do that.

## Usage

`.github/workflows/lint.yml`:
```yml
name: Lint

on: pull_request

jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: hallee/eslint-action@1.0.2
        # The permissions for the GITHUB_TOKEN in forked repositories is read-only
        # https://help.github.com/en/actions/reference/events-that-trigger-workflows#pull-request-event-pull_request
        if: ${{ github.event_name == 'push' || github.event.pull_request.head.repo.full_name == github.repository }} 
        with:
          repo-token: ${{secrets.GITHUB_TOKEN}}
          source-root: optional-sub-dir
```
