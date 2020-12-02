## -  E T H E R L A N D  -
### ERC721 - NON FUNGIBLE TOKEN
#

### LOCAL TEST FLOW
after having installed dependencies :
1. install yarn running commant `yarn install`
2. run command `yarn test` 

### DEPLOYMENT FLOW
1. If its not done yet, install truffle globally on your system, run `npm install -g truffle` in a terminal
2. Create or update the `.env` file at the root of the project with the following environnement variables :
    - `OWNER` : the public adress of the contract owner
    - `DEPLOY_ETHERLAND_ERC721` : a boolean to allow the deployment flow, set to `true` if you allow deployment or `false` otherwise
    - `MNEMONIC` : seed words separated with a space  
    - `INFURA_KEY` : goto https://infura.io to get an access key
3. Open a terminal at root and run : 
    - for Rinkeby : truffle deploy --network rinkeby
    - for Mainnet : truffle deploy --network live
    ##### *if you have the `up to date` message when deploying, maybe you've already deployed the contract before. In that case, if your contract doesnt deploy, simply add the `--reset` tag as follow : `truffle deploy --network rinkeby --reset`*


### /!\ IMPORTANT /!\
##### DO NOT FORGET NOT TO SHARE YOUR .env MNEMONIC and INFURA_KEY PUBLICLY 
#
### PACKAGES VERSION  
##### If any error occurs due to node or npm version, try to update version to : 
- npm : 5.6.0
run ```npm install -g npm@5.6.0```
- node : 8.11.2
run ```nvm use 8.11.2```
# 
*Something went wrong ? support@proapps.fr* 
