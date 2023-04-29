import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Head from "next/head";
import { ethers } from "ethers";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";

import styles from "./index.module.css";
import contractABI from "abi/contract-abi.json";
import { success } from "helpers/effects";
import { useIsMounted } from "./hooks/useIsMounted";
import { useSaleStatus } from "./hooks/useSaleStatus";
import { useMint } from "./hooks/useMint";
import { relative } from "path";

const PRICE = 0;
const contractAddress: string = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

function Home () {
  const [isConnected, setIsConnected] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const { address } = useAccount();

  const { config, error: contractError } = usePrepareContractWrite({
    address: `0x${contractAddress.substring(2)}`,
    abi: contractABI,
    functionName: "mint",
    args: [quantity],
    overrides: {
      from: address,
      value: ethers.utils.parseEther((quantity * PRICE).toString()),
    },
  });

  const {
    isLoading,
    isSuccess: isStarted,
    error: mintError,
    data: mintData,
    write,
  } = useContractWrite(config);

  const { isSuccess: isMinted } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const handleChange = (event: Event, newValue: number | number[]) => {
    setQuantity(newValue as number);
  };

  useEffect(() => {
    setIsConnected(!!address);
  }, [address]);

  useEffect(() => {
    if (isMinted) {
      success();
    }
  }, [isMinted]);

  return (
    <>
      <MetaTags />
      <div className={styles.container}>
        <div className={styles.main}>
          <Logo />
          <MainContent />
          {/*<ConnectButton showBalance={false} />
           {isConnected && (
            <>
              {isMinted ? (
                <>
                  <div className={styles.status}>Success!</div>
                  <div className={styles.action}>
                    <a
                      href={`https://opensea.io/${address}?tab=collected`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View on OpenSea
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.price}>
                    You are about to mint <strong>{quantity}</strong> ASCII PRICKS NFT{quantity > 1 && "s"}. Move the slider below to adjust the quantity.
                  </div>
                  <Slider
                    style={{ color: '#e33e81' }}
                    value={quantity}
                    onChange={handleChange}
                    aria-label="Quantity"
                    valueLabelDisplay="auto"
                    step={1}
                    min={1}
                    max={10}
                    disabled={isLoading || isStarted}
                  />
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#e33e81' }}
                    size="large"
                    onClick={() => {
                      write?.();
                    }}
                    disabled={!!contractError || isLoading || isStarted}
                  >
                    Mint
                  </Button>
                  {isLoading && (
                    <div className={styles.status}>Waiting for approval...</div>
                  )}
                  {isStarted && <div className={styles.status}>Minting...</div>}
                  {mintData && (
                    <div className={styles.action}>
                      <a
                        href={`https://etherscan.io/tx/${mintData.hash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View transaction
                      </a>
                    </div>
                  )}
                  {contractError && (
                    <div className={styles.error}>
                      An error occurred while preparing the transaction. Make
                      sure that you have enough funds and that you haven’t
                      reached your limit of 10 tokens.
                    </div>
                  )}
                  {mintError && (
                    <div className={styles.error}>
                      An error occurred while accessing your wallet or
                      processing the transaction.
                    </div>
                  )}
                </>
              )}
            </>
          )} */}
        </div>
      </div>
    </>
  );
};

export default Home;

function MetaTags() {
  return (
    <Head>
      <title>ASCII PRICKS</title>
      <meta
        name="description"
        content="You ever wanted to know if you got the biggest dickus on the internet?  Now is your chance show the world what you got!  Your wallet deserves an untouchable dick to fend off the Ethereum blockchain.  No real utility other than boasting you have the longest, most rare or colorful dick in Ethereum. Is it the smallest? Weird flex but ok.  No roadmap."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://localhost:3000" />
      <meta property="og:title" content="ASCII PRICKS" />
      <meta
        property="og:description"
        content="You ever wanted to know if you got the biggest dickus on the internet?  Now is your chance show the world what you got!  Your wallet deserves an untouchable dick to fend off the Ethereum blockchain.  No real utility other than boasting you have the longest, most rare or colorful dick in Ethereum. Is it the smallest? Weird flex but ok.  No roadmap."
      />
      <meta
        property="og:image"
        content="https://localhost:3000/img/sample.png"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <Image src="/img/logo.png" alt="ASCII PRICKS logo" layout="fill" />
    </div>
  );
}


function MainContent() {
  const mounted = useIsMounted();
  const { isConnected, address } = useAccount() ?? { isConnected: false, address: undefined };
  const isSaleActive = useSaleStatus({ contractAddress, contractABI });
  const canMint = useMint({ contractAddress, contractABI, address });

  return (
    <>
      <ConnectButton showBalance={false} />
      <div>{
      mounted ? 
        isConnected ? 
          canMint ?
            isSaleActive ?
              <div className={styles.action}>
                <Mint canMint={canMint} address={address} />
              </div>
            :
              <div className={styles.action}>
                Public Sale is not active yet
              </div>
          :
            <div className={styles.action}>
              This wallet already max minted.<br />View your minted NFTs on{' '}
              <a
                href={`https://opensea.io/${address}?tab=collected`}
                target="_blank"
                rel="noreferrer"
              >
              OpenSea
              </a>
            </div>
        : 
          null
      :
        null
      }</div>
    </>
  );
}

interface MintProps {
  canMint: number | JSX.Element;
  address?: string;
}

function Mint({ canMint, address }: MintProps) {
  const [quantity, setQuantity] = useState<number>(1);

  const { config } = usePrepareContractWrite({
    address: `0x${contractAddress.substring(2)}`,
    abi: contractABI,
    functionName: "mint",
    args: [quantity],
    overrides: {
      from: `0x${address?.substring(2)}`,
      value: ethers.utils.parseEther((0).toString()),
    },
  });

  const {
    isLoading,
    isSuccess: isStarted,
    error: mintError,
    data: mintData,
    write,
  } = useContractWrite(config);

  const { isSuccess: isMinted } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const handleChange = (event: Event, newValue: number | number[]) => {
    setQuantity(newValue as number);
  };

  useEffect(() => {
    if (isMinted) {
      success();
    }
  }, [isMinted]);

  return (
    <>
      <div className={styles.price}>
        You are about to mint <strong>{quantity}</strong> ASCII PRICKS NFT{quantity > 1 && "s"}. Move the slider below to adjust the quantity.
      </div>
      <Slider
        style={{ color: '#e33e81' }}
        value={quantity}
        onChange={handleChange}
        aria-label="Quantity"
        valueLabelDisplay="auto"
        step={1}
        min={1}
        max={typeof canMint === 'number' ? canMint : undefined}
        disabled={(isLoading || isStarted) && !isMinted}
      />
      <Button
        variant="contained"
        style={{ 
          backgroundColor: '#e33e81',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        size="large"
        onClick={() => {
          write?.();
        }}
        disabled={(isLoading || isStarted) && !isMinted}
      >
        Mint
      </Button>
      {isLoading && (
        <div className={styles.status}><br />Waiting for approval...</div>
      )}
      {(isStarted && !isMinted) && (
        <div className={styles.status}><br />Minting...</div>
      )}
      {mintData && (
        <div className={styles.action} style={{ textAlign: 'center' }}>
          <a
            href={`https://etherscan.io/tx/${mintData.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            <br />View transaction
          </a>
        </div>
      )}
      {mintError && (
        <div className={styles.error}>
          <br />An error occurred while accessing your wallet or
          processing the transaction.
        </div>
      )}
      {isMinted && (
        <>
          <div className={styles.action} style={{ textAlign: 'center' }}>
            View your minted NFTs on{' '}
            <a
              href={`https://opensea.io/${address}?tab=collected`}
              target="_blank"
              rel="noreferrer"
            >
            OpenSea
            </a>
          </div>
        </>
      )}
    </>
  );
}