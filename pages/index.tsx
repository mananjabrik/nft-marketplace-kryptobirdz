import type { NextPage } from 'next';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { nftaddress, nftmarketaddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json';

interface NftsProps {
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
  name: string;
  description: string;
}
const Home: NextPage = () => {
  const [nfts, setNfts] = useState<NftsProps[]>();
  const [loadingState, setLoadingState] = useState('');
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
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
    setNfts(items);
    setLoadingState('loaded');
  }

  async function buyNFTs(nft: any) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      nftmarketaddress,
      KBMarket.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString, 'ether');
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      { value: price }
    );
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === 'loaded' && !nfts?.length) {
    return <h1 className="px-20 py-7 text-4xl">No NFTs in MarketPlace</h1>;
  }
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '160px' }}>
        Next load the Data
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {nfts?.map((nft, index) => (
          <div key={index} className="border shadow rounded-xl overflow-hidden">
            <img src={nft.image ?? ''} alt={nft.name ?? ''} />
            <div className="p-4">
              <p className="text-3xl font-semibold">{nft.name ?? ''}</p>
              <div>
                <p className="text-gray-400">{nft.description}</p>
              </div>
            </div>
            <div className="p-4 bg-black">
              <p className="text-3xl mb-4 font-bold text-white">
                {nft.price} ETH
              </p>
              <button
                className="w-full bg-purple-500 text-white font-bold py-3 px-12 rounded"
                onClick={() => buyNFTs(nft)}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
