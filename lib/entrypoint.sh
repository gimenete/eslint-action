#!/bin/sh

set -e
env
ls
cd admin-frontend
ls
npm install

NODE_PATH=node_modules node /action/lib/run.js
