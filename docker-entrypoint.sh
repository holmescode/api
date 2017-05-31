#!/bin/bash
set -e

if [ "$1" = 'api' ]; then
    exec node /var/service/index.js "$@"
fi

exec "$@"
