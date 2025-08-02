// MetaMask wallet connection and payment utility for Sepolia testnet

export async function connectWallet() {
  if (!window.ethereum) throw new Error('MetaMask is not installed');
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts[0];
}

export async function getNetwork() {
  if (!window.ethereum) return null;
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return chainId;
}

export async function switchToSepolia() {
  const sepolia = {
    chainId: '0xaa36a7', // Sepolia chainId
    chainName: 'Sepolia',
    nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  };
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: sepolia.chainId }],
    });
  } catch (switchError) {
    // If not added, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [sepolia],
      });
    } else {
      throw switchError;
    }
  }
}

export async function sendPayment({ to, valueEth }) {
  if (!window.ethereum) throw new Error('MetaMask is not installed');
  // valueEth: string, e.g. '0.01'
  await switchToSepolia();
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const tx = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [{
      from: accounts[0],
      to,
      value: '0x' + (BigInt(Math.floor(Number(valueEth) * 1e18))).toString(16),
    }],
  });
  return tx;
}
