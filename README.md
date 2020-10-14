## -  E T H E R L A N D  -
### ERC721 - NON FUNGIBLE TOKEN
#

### LOCAL TEST FLOW
after having installed dependencies :
1. retrieve the public address that will be set as the contract `owner` address
2. in file `Ownable.sol` change the owner address that is currently set in the constructor method
3. run the `test` script 

### DEPLOYMENT FLOW
1. If its not done yet, install truffle globally on your system, run `npm install -g truffle` in a terminal
2. Create a .env file in project's root folder and set variables as defined in .env_sample.txt file at root :
    - `DEPLOY_ETHERLAND_ERC721` to the boolean `true` if you allow deployment or `false` otherwise
    - `MNEMONIC` (seed words separated with a space)  
    - `INFURA_KEY` (goto https://infura.io to get an access key)
3. Open a terminal at root and run : 
    - for Rinkeby : truffle deploy --network rinkeby
    - for Mainnet : truffle deploy --network live
    ##### *if you have the `up to date` message when deploying, maybe you've already deployed the contract before. In that case, if your contract doesnt deploy, simply add the `--reset` tag as follow : `truffle deploy --network rinkeby --reset`*


### /!\ IMPORTANT /!\
##### DO NOT FORGET NOT TO SHARE YOUR .env MNEMONIC and INFURA_KEY PUBLICLY 
#
### PACKAGES VERSION  
##### If any error occurs due to node or npm version, try to update version to : 
- npm version to install to run this project : 5.6.0
run ```npm install -g npm@5.6.0```
- node version to install to run this project : 8.11.2
run ```nvm use 8.11.2```
# 
*Something went wrong ? support@proapps.fr* 
