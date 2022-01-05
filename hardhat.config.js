require('@nomiclabs/hardhat-waffle');

const projectId = 'c7b7e4315ecc48d5a921d620c38f27d0';
const fs = require('fs');
const keyData = fs.readFileSync('./p-key.txt', {
  encoding: 'utf8',
  flag: 'r',
});

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337, // config standart just test dude...!!
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [keyData],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: [keyData],
    },
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enable: true,
        runs: 200,
      },
    },
  },
};
