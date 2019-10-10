# ESLint Action

This custom Github Action lints our javasciprt repos with every push and
annotate the diff with the errors and warnings reported by ESLint.

## Usage

Add github workflow to automatically check linting with every push using
`edlio/eslint-action`

```yml
# Save to .github/workflows/eslint.yml in your repo
name: ESLint

on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - name: ESLint checks
      uses: edlio/eslint-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Also refer to our shareable ESLint configuraiton
[edlio/eslint-config-edlio](https://github.com/edlio/eslint-config-edlio)
