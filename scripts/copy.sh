#!/bin/bash

# Copy basic files
for pattern in CHANGELOG.md \
  package.json \
  README.md
do
  cp -r "$pattern" "./dist"
done
