#!/bin/bash
cd /home/ubuntu/app
NODE_ENV=production pm2 start build/index.js -f