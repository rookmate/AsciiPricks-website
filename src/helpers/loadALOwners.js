const { Alchemy, Network } = require("alchemy-sdk");
const fs = require("fs");

const config = {
  apiKey: (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
          ? process.env.NEXT_PUBLIC_ALCHEMY_GOERLI_API_KEY ?? ""
          : process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? ""),
  network: (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
          ? [Network.ETH_GOERLI]
          : [Network.ETH_MAINNET]),
};

const alchemy = new Alchemy(config);

const loadALOwners = async () => {
  // Contract addresses
  const oSnipe = "0x67c66a5c36766ad11a16359e262c65a692da4923";
  const q00tants = "0x862c9b564fbdd34983ed3655aa9f68e0ed86c620";
  const q00nicorns = "0xb1b853a1aac513f2ab91133ca8ae5d78c24cb828";

  // Get owners 
  const { owners: owners1 } = await alchemy.nft.getOwnersForContract(oSnipe);
  const { owners: owners2 } = await alchemy.nft.getOwnersForContract(q00tants);
  const { owners: owners3 } = await alchemy.nft.getOwnersForContract(q00nicorns);

  // Combine and remove duplicates
  const owners = Array.from(new Set([...owners1, ...owners2, ...owners3]));

  // Convert owners array to JSON string
  const ownersJSON = JSON.stringify(owners);

  // Write to file
  fs.writeFileSync("./src/abi/allowlist.json", ownersJSON);

  return owners;
};

module.exports = { loadALOwners };

loadALOwners();