#!/bin/sh

while [ $# -gt 0 ]
do
  package="$1"
  version=$(npm show ${package} version)
  mkdir -p "src/app/shared/template/node_modules/${package}"
  echo "Installing ${package}-${version}"
  curl --silent "https://registry.npmjs.org/${package}/-/${package}-${version}.tgz" | tar xz --strip-components 1 -C "src/app/shared/template/node_modules/${package}"
  shift
done