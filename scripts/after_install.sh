#!/bin/bash
cd /home/ubuntu/app
npm install
npm run build


rm /home/ubuntu/app/node_modules/web3-providers-http/lib/index.js
rm /home/ubuntu/app/node_modules/web3-providers-http/src/index.js

rm /home/ubuntu/app/node_modules/web3-core-helpers/lib/formatters.js
rm /home/ubuntu/app/node_modules/web3-core-helpers/src/formatters.js

cp /home/ubuntu/app/temp/index.js /home/ubuntu/app/node_modules/web3-providers-http/lib
cp /home/ubuntu/app/temp/index.js /home/ubuntu/app/node_modules/web3-providers-http/src

cp /home/ubuntu/app/temp/formatters.js /home/ubuntu/app/node_modules/web3-core-helpers/lib
cp /home/ubuntu/app/temp/formatters.js /home/ubuntu/app/node_modules/web3-core-helpers/src

sudo chmod 777 -R /tmp/

# sed -i 's/callback(errors.InvalidResponse(response));/console.log("###", h, payload, error, response);callback(null, {jsonrpc: "2.0",id: 0,result: {}});/g' /home/ubuntu/app/node_modules/web3-providers-http/lib/index.js
# sed -i 's/callback(errors.InvalidResponse(response));/console.log("###", h, payload, error, response);callback(null, {jsonrpc: "2.0",id: 0,result: {}});/g'/home/ubuntu/app/node_modules/web3-providers-http/src/index.js

# sed -i 's/tx.gas = utils.hexToNumber(tx.gas);/if (tx.gas) tx.gas = outputBigNumberFormatter(tx.gas);/g' /home/ubuntu/app/node_modules/web3-core-helpers/lib/formatters.js
# sed -i 's/tx.gas = utils.hexToNumber(tx.gas);/if (tx.gas) tx.gas = outputBigNumberFormatter(tx.gas);/g' /home/ubuntu/app/node_modules/web3-core-helpers/src/formatters.js