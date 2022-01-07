/* pages/creator-dashboard.js */
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import { nftmarketaddress, nftaddress } from '../config';

import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

interface NftsProps {
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
  name: string;
  description: string;
  kategory: string;
}
export default function CreatorDashboard() {
  const [nfts, setNfts] = useState<NftsProps[]>();
  const [sold, setSold] = useState<NftsProps[]>();
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      KBMarket.abi,
      signer
    );
    try {
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
      const data = await marketContract.fetchItemsCreated();
      const items = await Promise.all(
        data.map(async (i: NftsProps) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          let item = {
            price,
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            sold: i.price,
            image: meta.data.image,
            kategory: meta.data.kategory,
          };
          return item;
        })
      );
      /* create a filtered array of items that have been sold */
      const soldItems = items.filter((i: NftsProps) => {
        const ownerdetect = '0x0000000000000000000000000000000000000000';
        if (i.owner !== ownerdetect) {
          return true;
        }
      });
      setSold(soldItems);
      setNfts(items);
      setLoadingState('loaded');
    } catch (error) {
      console.log(error);
      setLoadingState('not-loaded');
    }
  }
  if (loadingState === 'not-loaded' && !nfts?.length && !sold?.length)
    return <h1 className="py-10 px-20 text-3xl">No assets created</h1>;
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Created</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts?.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} className="object-cover h-72 w-96" />
              <div className="p-4">
                <p className="text-3xl font-semibold truncate capitalize">
                  {nft.name ?? ''}
                </p>
                <div>
                  {/* <p className="text-gray-400 truncate">{nft.description}</p> */}
                  {/* <p className="text-gray-400 truncate">owner : {nft.owner}</p> */}
                  <p className="text-gray-400 truncate">
                    seller : {nft.seller}
                  </p>
                  <p className="text-gray-400 truncate">
                    id : {nft.tokenId.toString()}
                  </p>
                  <p className="text-gray-400 truncate">
                    kategori : {nft.kategory}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} Eth
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4">
        {sold?.length ? (
          <div>
            <h2 className="text-2xl py-2">Items soldout</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {sold?.map((nft, i) => (
                <div
                  key={i}
                  className="border shadow rounded-xl overflow-hidden"
                >
                  <img src={nft.image} className="object-cover h-72 w-96" />
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">
                      Price - {nft.price} Eth
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h1 className="py-10 px-20 text-3xl">No assets created</h1>
        )}
      </div>
    </div>
  );
}
