import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { CardItem, Loading } from '../components';
import { NftsProps } from '../interface/NftsProps';
import { LoadNFTs, buyNFTs, showContract } from '../lib';

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<NftsProps[]>(); //hooks for listing the item
  const [loadingState, setLoadingState] = useState(false);
  const { marketContract, tokenContract } = showContract();
  useEffect(() => {
    setLoadingState(true);
    LoadNFTs(tokenContract, marketContract, 'marketItems').then((nft) => {
      setNfts(nft?.items);
      setLoadingState(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        {loadingState === true ? <Loading /> : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts?.map((nft, index) => (
            <CardItem key={index} onBuy={() => buyNFTs(nft)} {...nft} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
