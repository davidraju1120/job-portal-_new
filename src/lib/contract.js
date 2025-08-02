// Example minimal ABI for logging job post events
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with deployed contract address
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "recruiter", "type": "address" },
      { "internalType": "string", "name": "jobTitle", "type": "string" }
    ],
    "name": "logJobPost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
