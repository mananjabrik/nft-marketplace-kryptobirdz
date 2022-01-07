import { ethers } from 'ethers';
import axios from 'axios';
import { NftsProps } from '../interface/NftsProps';
import { showContract } from '.';

export const LoadNFTs = async () => {
  const { tokenContract, marketContract } = showContract();
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
};
