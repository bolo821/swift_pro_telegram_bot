#!/bin/bash
npm i -g pm2
FILE=/home/ubuntu/app/src/index.ts
if test -f "$FILE"; then
    echo "$FILE exists"
    cd /home/ubuntu
    pm2 stop --silent index
    pm2 delete index
    killall -9 node
else
    echo "$FILE does not exist."
fi
cd /home/ubuntu
sudo rm -rf app
sudo mkdir app


cd /home/ubuntu/app

cat > .env <<EOF
PORT = 3000
TELEGRAM_API_KEY = '5786568987:AAEexz4G7F3tfIG8pSaiVOzFgy9BStmCuPU'
WEBSITE_URL = "https://swiftbot.io"
DB_URI='mongodb+srv://SUTheUser:szc2t1D6jAWwHolu@swifttreadeprod.2e8jy.mongodb.net/?retryWrites=true&w=majority'
LOAD_TESTNET='no'
AFFILIATE_SALES_COMMISSION=15
BOT_MODE = 'webhook'
REGION='us-east-1'
ACCESS_KEY_ID=''
SECRET_ACCESS_KEY=''
INBOUND_QUEUE='https://sqs.us-east-1.amazonaws.com/323805758413/SwiftBotProd.fifo'
USE_FORK_LOCAL='yes'
ZIPKIN_ENDPOINT= 'http://localhost:9411/api/v1/spans'
MAX_CORES = 'yes'
EOF

# install mongodb on ubuntu 20.04

curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
apt-key list
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install mongodb-org

sudo systemctl restart mongod
sudo systemctl enable mongod