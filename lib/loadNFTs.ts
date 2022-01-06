import { ethers } from 'hardhat';
import { nftaddress, nftmarketaddress } from '../config';
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import { NftsProps } from '../interface/NftsProps';
import axios from 'axios';
import { useEffect } from 'react';

useEffect(() => {
  loadNFTs();
}, []);
export async function loadNFTs(): Promise<{ items: any }> {
  const provider = new ethers.providers.JsonRpcProvider();
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(
    nftmarketaddress,
    KBMarket.abi,
    provider
  );
  const data = await marketContract.fetchMarketItems();

  const items = await Promise.all(
    data.map(async (i: NftsProps) => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
        price,
        tokenId: i.tokenId,
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      };
      return item;
    })
  );

  return { items };
}
