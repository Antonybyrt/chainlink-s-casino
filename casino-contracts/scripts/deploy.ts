import { ethers, upgrades, network } from "hardhat";

// Chainlink configuration.
// Defaults target Ethereum Sepolia; override via env vars for other networks.
// VRF docs:  https://docs.chain.link/vrf/v2-5/supported-networks
// Feed docs: https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum
const VRF_COORDINATOR =
  process.env.VRF_COORDINATOR || "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B";
const VRF_KEY_HASH =
  process.env.VRF_KEY_HASH ||
  "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae";
const VRF_SUBSCRIPTION_ID =
  process.env.VRF_SUBSCRIPTION_ID ||
  "39112278833581689294166306650944393924609043833854182712739207415929256164503";
// Sepolia ETH/USD price feed (8 decimals)
const ETH_USD_PRICE_FEED =
  process.env.ETH_USD_PRICE_FEED || "0x694AA1769357215DE4FAC081bf1f309aDC325306";

async function main() {
  console.log(`Réseau: ${network.name}`);
  console.log("VRF Coordinator:", VRF_COORDINATOR);
  console.log("VRF Key Hash:", VRF_KEY_HASH);
  console.log("VRF Subscription Id:", VRF_SUBSCRIPTION_ID);
  console.log("ETH/USD Price Feed:", ETH_USD_PRICE_FEED);

  // 1. Deploy the CHIP token
  console.log("\nDéploiement du token CasinoChip (CHIP)...");
  const CasinoChip = await ethers.getContractFactory("CasinoChip");
  const chip = await CasinoChip.deploy();
  await chip.waitForDeployment();
  const chipAddress = await chip.getAddress();
  console.log("CasinoChip déployé à l'adresse:", chipAddress);

  // 2. Deploy the game library
  console.log("Déploiement de la bibliothèque BlackjackLibrary...");
  const BlackjackLibrary = await ethers.getContractFactory("BlackjackLibrary");
  const blackjackLibrary = await BlackjackLibrary.deploy();
  await blackjackLibrary.waitForDeployment();
  const libraryAddress = await blackjackLibrary.getAddress();
  console.log("Bibliothèque déployée à l'adresse:", libraryAddress);

  // 3. Deploy the upgradeable Blackjack proxy
  console.log("Déploiement du contrat Blackjack (proxy UUPS)...");
  const BlackjackV1 = await ethers.getContractFactory("BlackjackV1", {
    libraries: { BlackjackLibrary: libraryAddress },
  });
  const blackjack = await upgrades.deployProxy(
    BlackjackV1,
    [VRF_COORDINATOR, VRF_KEY_HASH, VRF_SUBSCRIPTION_ID, chipAddress, ETH_USD_PRICE_FEED],
    { initializer: "initialize", kind: "uups", unsafeAllowLinkedLibraries: true }
  );
  await blackjack.waitForDeployment();
  const blackjackAddress = await blackjack.getAddress();
  console.log("Contrat Blackjack déployé à l'adresse:", blackjackAddress);

  // 4. Wire the game as the CHIP minter/burner (one-time)
  console.log("Liaison du token au contrat de jeu (setGame)...");
  await (await chip.setGame(blackjackAddress)).wait();
  console.log("Token lié au jeu.");

  console.log("\n⚠️  Étapes suivantes obligatoires:");
  console.log(
    `1. Ajoute ${blackjackAddress} comme consumer de la souscription VRF ${VRF_SUBSCRIPTION_ID} (https://vrf.chain.link) et finance-la en LINK.`
  );
  console.log(
    `2. Approvisionne la réserve de la maison: blackjack.fundHouse({ value: <ETH> }) pour pouvoir payer les gains.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
