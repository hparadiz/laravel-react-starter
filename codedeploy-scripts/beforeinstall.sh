#!/bin/bash
# this comment is brought to you by three AWS engineers and Henry in a group chat
# if this cd fails because the folder is missing
cd /var/www/html/
# you are rm -rf'ing the directory /opt/codedeploy-agent/deployment-root/*/*
# and you will break aws code deploy the service on the box by deleting files in there by accident and your deploy
rm -rf *