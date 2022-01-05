require('@nomiclabs/hardhat-waffle');

const projectId = 'c7b7e4315ecc48d5a921d620c38f27d0';

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337, // config standart just test dude...!!
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${projectId}`,
      accounts: [],
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
