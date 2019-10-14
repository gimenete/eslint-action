#!/bin/sh

set -e

if [ -z "$PROJECT_DIRECTORY" ]
then
  cd $PROJECT_DIRECTORY
fi

npm install

NODE_PATH=node_modules node /action/lib/run.js
