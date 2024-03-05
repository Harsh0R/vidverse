require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: ["39b695e5ddb531dcb4c983fd552d67f323a3c370f9fc77632ce0cd45900ad3c7"], // Replace privateKey with your wallet's private key for deployment
    },
  },
};
