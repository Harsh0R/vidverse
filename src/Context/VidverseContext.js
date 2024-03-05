import { useEffect, useState, React, createContext } from "react";
import {
  connectWallet,
  checkIfWalletConnected,
  disconnectFromMetaMask,
  connectingWithContract,
  tokenContract
} from "../Utils/apiFeatures";
import {
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { smartContractAddress, apiKey } from "./constants";
const ethers = require("ethers");

export const VidverseContext = createContext();

export const VidverseProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [livepeerCli, setlivepeerCli] = useState();

  const fetchData = async () => {
    try {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      // get account
      const connectAccount = await connectWallet();
      const contract = await connectingWithContract();

      setAccount(connectAccount);


      const livepeerClient = createReactClient({
        provider: studioProvider({ apiKey: apiKey }),
      });
      setlivepeerCli(livepeerClient);

    } catch (error) {
      console.log("Error in fetching account in vidverseContext...", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const allVideo = async () => {
    try {
      const contract = await connectingWithContract();
      const vid = await contract.getAllVideos();
      const processedVideos = vid.map((video) => {
        const processedVideo = { ...video };
        processedVideo.id = ethers.BigNumber.from(video.id._hex).toNumber();
        processedVideo.tipAmount = ethers.BigNumber.from(
          video.tipAmount._hex
        ).toNumber();
        return processedVideo;
      });

      return processedVideos;
    } catch (error) {
      console.error("Currently you have no videos.....😑", error);
    }
  };

  const uploadVideos = async (name, desc, cid) => {
    try {
      const contract = await connectingWithContract();
      const ms = await contract.uploadVideo(name, desc, cid);
      console.log("messagfe = ", ms);
    } catch (error) {
      console.error("Error accor while uploading videos.....😑");
    }
  };

  const tipVideoOwner = async (vidID, tipAmount) => {
    try {
      const contract = await connectingWithContract();
      await contract.tipVideoOwner(vidID, tipAmount);
    } catch (error) {
      console.error("Error accor while tip to videos.....😑", error);
    }
  };

  const hasValideAllowance = async (owner, amount) => {
    try {
      const contractObj = await connectingWithContract();
      const address = await contractObj.myToken();

      const tokenContractObj = await tokenContract(address);
      const data = await tokenContractObj.allowance(
        owner,
        smartContractAddress
      );
      const result = ethers.BigNumber.from(data._hex.toString());
      console.log("allowance === ", result);
      return result;
    } catch (e) {
      return console.log(e);
    }
  }

  const increaseAllowance = async (amount) => {
    try {
      const contractObj = await connectingWithContract();
      const address = await contractObj.myToken();

      const tokenContractObj = await tokenContract(address);
      const data = await tokenContractObj.approve(
        smartContractAddress,
        toWei(amount)
      );
      const result = await data.wait();
      return result;
    } catch (e) {
      return console.log("Error at Increase allowence = ", e);
    }
  }

  const getBalance = async (address) => {
    try {
      const contract = await connectingWithContract();
      const balance = await contract.getBalance(address);
      const balanceNumber = ethers.BigNumber.from(balance._hex).toString();
      console.log("Token Balance at context = ", balanceNumber);
      return balanceNumber;
    } catch (error) {
      console.error("Error accor while uploading videos.....😑");
    }
  }

  const toWei = async (amount) => {
    const toWie = ethers.utils.parseUnits(amount.toString());
    return toWie.toString();
  }



  return (
    <VidverseContext.Provider
      value={{
        account,
        livepeerCli,
        connectWallet,
        checkIfWalletConnected,
        disconnectFromMetaMask,
        allVideo,
        uploadVideos,
        tipVideoOwner,
        hasValideAllowance,
        increaseAllowance,
        getBalance
      }}
    >
      {children}
    </VidverseContext.Provider>
  );
};
