#!/bin/sh

set -e

cd "${2:-.}" || echo "source root not found"

[ -f yarn.lock ] && yarn install
[ -f package-lock.json ] && npm install

NODE_PATH=node_modules GITHUB_TOKEN="${GITHUB_TOKEN:-${1:-.}}" SOURCE_ROOT=${2:-.} node /action/lib/run.js
