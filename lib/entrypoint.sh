#!/bin/sh

set -e

npm install --no-package-lock

NODE_PATH=node_modules node /action/lib/run.js
