import { useContractRead } from "wagmi";

export function useSaleStatus({ contractAddress, contractABI }) {
  const { data: saleStatus, isError, isLoading, error } = useContractRead({
      address: `0x${contractAddress.substring(2)}`,
      abi: contractABI,
      functionName: 'saleIsActive',
  });

  if (isLoading) {
      return <p>Loading sale status...</p>;
  }

  if (isError) {
      return <p>Error loading sale status: {error ? error.message : ""}</p>;
  }

  return saleStatus;
}