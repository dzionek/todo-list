#!/bin/bash

echo
echo "*** --- Linters --- ***"
echo

echo "1) Mypy"
mypy .
echo

echo "2) Flake8"
flake8
echo

echo "3) ES-Lint"
cd frontend || exit
npm run eslint
echo

read -p "Do you want to run unit tests [y/n]? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo
  echo "*** --- Tests --- ***"
  echo

  echo "4) Jest"
  npm run test
  echo

  echo "5) Pytest"
  echo
  cd ..
  pytest --ignore=frontend --cov-config=.coveragerc --cov=. -n auto
fi
