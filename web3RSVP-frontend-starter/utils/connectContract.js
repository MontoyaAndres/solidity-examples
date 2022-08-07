import { ethers } from "ethers";

import abiJSON from "./Web3RSVP.json";

function connectContract() {
  const contractAddress = "0xc7D259Bb8Ee9281857897164AD7D444b007b7E5F";
  const contractABI = abiJSON;
  let rsvpContract;

  try {
    const { ethereum } = window;

    if (ethereum.chainId === "0x13881") {
      //checking for eth object in the window, see if they have wallet connected to Mumbai network
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log("contractABI", contractABI);
      rsvpContract = new ethers.Contract(contractAddress, contractABI, signer); // instantiating new connection to the contract
    } else {
      throw new Error("Please connect to the Polygon Mumbai network.");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return rsvpContract;
}

export default connectContract;
