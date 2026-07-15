import { ethers, upgrades, run } from "hardhat";

async function main() {
  console.log("Déploiement de la bibliothèque BlackjackLibrary...");
  const BlackjackLibrary = await ethers.getContractFactory("BlackjackLibrary");
  const blackjackLibrary = await BlackjackLibrary.deploy();
  await blackjackLibrary.waitForDeployment();
  const libraryAddress = await blackjackLibrary.getAddress();
  console.log("Bibliothèque déployée à l'adresse:", libraryAddress);

  console.log("Déploiement du contrat Blackjack...");
  const BlackjackV1 = await ethers.getContractFactory("BlackjackV1", {
    libraries: {
      BlackjackLibrary: libraryAddress
    }
  });
  
  const blackjack = await upgrades.deployProxy(BlackjackV1, [], {
    initializer: "initialize",
    kind: "uups",
    unsafeAllowLinkedLibraries: true
  });

  await blackjack.waitForDeployment();
  
  const blackjackAddress = await blackjack.getAddress();
  console.log("Contrat Blackjack déployé à l'adresse:", blackjackAddress);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 