# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
to run this project locally, first run hardhat node, 
```shell
yarn install
npx hardhat test
npx hardhat node
```
and open new terminal for deploy your contract to localhost ethereum test
```shell
npx hardhat run scripts/deploy.js --network localhost
```
if succes build your contract, you can see on root folder config.js
hardhat deploy two address: the first nftaddress for nft items, and nftmarketaddress for minted nft, buy nft.
to run this project first edit your config.js nftaddress and nftmarketaddress to string value because i dont know how to create value to string,
help me to create base nft market thanks..!!

if you done edited config.js, go to terminal node you can import account metamask for testing enjoy..!!!
dont forget to change network localhost:8545 on metamask

and last 
```shell
yarn dev
```
