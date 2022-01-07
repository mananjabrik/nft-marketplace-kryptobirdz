import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { CardItem } from '../components';
import { NftsProps } from '../interface/NftsProps';
import { LoadNFTs, buyNFTs } from '../lib';

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<NftsProps[]>();
  const [loadingState, setLoadingState] = useState(false);
  useEffect(() => {
    setLoadingState(true);
    LoadNFTs().then((nfts) => {
      setNfts(nfts.items);
      setLoadingState(false);
    });
  }, []);
  return (
    <div className="flex justify-center">
      {loadingState === true ? (
        <div className="flex justify-center items-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-purple-900"
            role="status"
          >
            <div className="spinner-border animate-spin inline-block w-4 h-4 border-r-4 rounded-full border-purple-900"></div>
          </div>
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {nfts?.map((nft, index) => (
          <CardItem key={index} onBuy={() => buyNFTs(nft)} {...nft} />
        ))}
      </div>
    </div>
  );
};

export default Home;
