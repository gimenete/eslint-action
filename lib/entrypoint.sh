#!/bin/sh

set -e
env
cd admin-frontend

ls
env

npm install

NODE_PATH=node_modules node /action/lib/run.js
