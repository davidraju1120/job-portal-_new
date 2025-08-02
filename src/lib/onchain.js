// Utility for logging job posts on-chain (optional, best effort)
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract';

export async function logJobPostOnChain({ recruiter, jobTitle }) {
  if (!window.ethereum) throw new Error('MetaMask is not installed');
  const provider = new window.ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new window.ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const tx = await contract.logJobPost(recruiter, jobTitle);
  return tx.hash;
}
