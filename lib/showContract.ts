import { ethers } from 'ethers';
import { nftaddress, nftmarketaddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json';

export const showContract = () => {
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(
    nftmarketaddress,
    KBMarket.abi,
    provider
  );
  return { tokenContract, marketContract };
};
