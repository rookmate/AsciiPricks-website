import { useContractReads } from "wagmi";
import { BigNumber } from 'ethers';

export function useMint({ contractAddress, contractABI, address }) {
  const { data, isError, isLoading, error } = useContractReads({
    contracts: [
      {
        address: `0x${contractAddress.substring(2)}`,
        abi: contractABI,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        address: `0x${contractAddress.substring(2)}`,
        abi: contractABI,
        functionName: 'MAX_PER_WALLET',
      },
    ]
  });

  if (isLoading) {
    return <p>Loading sale status...</p>;
  }

  if (isError) {
    return <p>Error loading sale status: {error ? error.message : ''}</p>;
  }

  if (data === undefined) {
    return 0;
  }

  const balance = data[0] ? parseInt(BigNumber.from(data[0]).toString()) : 0;
  const walletMaxQuantity = data[1] - balance;
  
  return walletMaxQuantity;
}