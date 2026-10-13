import { Lock, LockOpen, WalletCards } from 'lucide-react';

export default function PocketCard({ pocket, currency = 'INR' }) {
  const amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(pocket.currentAmount || 0);
  const target = new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(pocket.targetAmount || 0);
  return <div className="pocket-card"><div className="pocket-top"><div className="pocket-icon"><WalletCards size={19}/></div><span className="pocket-lock">{pocket.isLocked ? <Lock size={13}/> : <LockOpen size={13}/>} {pocket.isLocked ? 'LOCKED' : 'OPEN'}</span></div><h3>{pocket.name}</h3><p>{amount} of {target}</p></div>;
}
