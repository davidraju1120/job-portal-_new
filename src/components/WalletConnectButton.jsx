import React, { useState } from 'react';
import { connectWallet, getNetwork, switchToSepolia } from '@/lib/wallet';

import { useUser } from '@clerk/clerk-react';
const WalletConnectButton = ({ onConnected }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [network, setNetwork] = useState('');
  const [saved, setSaved] = useState(false);
  const { user } = useUser();

  const handleConnect = async () => {
    setError('');
    try {
      await switchToSepolia();
      const acc = await connectWallet();
      setAccount(acc);
      setNetwork(await getNetwork());
      if (user) {
        try {
          await user.update({ unsafeMetadata: { ...user.unsafeMetadata, wallet: acc } });
          setSaved(true);
        } catch (e) {
          setError('Wallet connected but failed to save to profile.');
        }
      }
      if (onConnected) onConnected(acc);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="my-4">
      {account ? (
        <div className="p-2 bg-green-900 text-green-200 rounded">Connected: {account}</div>
      ) : (
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          onClick={handleConnect}
        >
          Connect MetaMask (Sepolia)
        </button>
      )}
      {saved && <div className="text-green-400 mt-1">Wallet address saved to your profile!</div>}
      {network && (
        <div className="text-xs mt-1">Chain: {network}</div>
      )}
      {error && <div className="text-red-400 mt-1">{error}</div>}
    </div>
  );
};

export default WalletConnectButton;
