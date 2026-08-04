#!/usr/bin/env bash
# exit on error
set -o errexit

npm ci --legacy-peer-deps
npm run build

pipenv sync

pipenv run upgrade
pipenv run insert-test-data
pipenv run flask insert-test-users 1
