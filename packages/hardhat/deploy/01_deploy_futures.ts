import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// import { contracts } from "../typechain-types/factories/@chainlink";
// import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const StableCoin = await deploy("FakeUSD", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const PriceProvider = await deploy("FakePriceProvider", {
    from: deployer,
    args: [100],
    log: true,
    autoMine: true,
  });

  const Exchange = await deploy("FakeExchange", {
    from: deployer,
    args: [PriceProvider.address, StableCoin.address],
    log: true,
    autoMine: true,
  });

  await deploy("ethSeoulToken", {
    from: deployer,
    args: ["ethSeoulToken", "EST"],
    log: true,
    autoMine: true,
  });

  await deploy("FuturesPutOptions", {
    from: deployer,
    // Contract constructor arguments
    args: [StableCoin.address, PriceProvider.address, Exchange.address],
    log: true,
    autoMine: true,
  });

  // chainlink price feed
  const _sepolia_ETHUSD = "0x694AA1769357215DE4FAC081bf1f309aDC325306";
  await deploy("FuturesCallOptions", {
    from: deployer,
    // Contract constructor arguments
    args: [_sepolia_ETHUSD],
    // args: [PriceProvider.address],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  // const FuturesCallOption = await hre.ethers.getContract<Contract>("FuturesCallOptions", deployer);
  // console.log("availableBalance:", await FuturesCallOption.availableBalance());

  // const ethSeoulToken = await hre.ethers.getContract<Contract>("ethSeoulToken", deployer);
  // console.log("ethSeoulToken totalSupply:", await ethSeoulToken.totalSupply());
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["FuturesCallOption"];
