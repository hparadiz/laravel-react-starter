#!/bin/bash
LOCK=/tmp/deployment.lock
if [ -f $LOCK ]; then
    rm $LOCK
fi