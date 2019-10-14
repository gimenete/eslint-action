#!/bin/sh

set -e
env
ls

npm install

NODE_PATH=node_modules node /action/lib/run.js
