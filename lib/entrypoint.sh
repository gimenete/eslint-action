#!/bin/sh

set -e

if [ -z "$PROJECT_DIRECTORY" ]
then
  PROJECT_DIRECTORY="."
fi

cd $PROJECT_DIRECTORY
npm install

NODE_PATH=node_modules node /action/lib/run.js
