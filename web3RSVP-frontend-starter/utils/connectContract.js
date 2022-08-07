import { ethers } from "ethers";

import abiJSON from "./Web3RSVP.json";

function connectContract() {
  const contractAddress = "0xc7D259Bb8Ee9281857897164AD7D444b007b7E5F";
  const contractABI = abiJSON.abi;
  let rsvpContract;

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      rsvpContract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }

  return rsvpContract;
}

export default connectContract;
