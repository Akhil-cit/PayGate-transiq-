import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/participant.css';

const getInitialProfile = () => {
  try {
    const raw = localStorage.getItem('paygate_user');
    if (raw) {
      const u = JSON.parse(raw);
      return {
        fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Account Holder',
        email: u.email || 'user@paygate.com',
        phone: u.phone || '+91 9876543210',
        accountNumber: 'MW-' + (u.id || u._id || 'PRIMARY').slice(-6).toUpperCase(),
        bankName: 'Transiq Primary Wallet',
        accountType: 'Digital Wallet',
      };
    }
  } catch {}
  return {
    fullName: 'Account Holder',
    email: 'user@paygate.com',
    phone: '+91 9876543210',
    accountNumber: 'MW-PRIMARY',
    bankName: 'Transiq Primary Wallet',
    accountType: 'Digital Wallet',
  };
};

import customerService from '../../../api/customerService';

const RemitterProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(getInitialProfile());

  useEffect(() => {
    setFormData(getInitialProfile());
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const parts = formData.fullName.trim().split(' ');
      const firstName = parts[0] || 'Customer';
      const lastName = parts.slice(1).join(' ') || 'User';
      await customerService.updateMe({ firstName, lastName, phone: formData.phone });
      const raw = localStorage.getItem('paygate_user');
      const u = raw ? JSON.parse(raw) : {};
      localStorage.setItem('paygate_user', JSON.stringify({ ...u, firstName, lastName, phone: formData.phone }));
    } catch {}
    setIsEditing(false);
  };

  return (
    <div className="module-page participants-page">
      <div className="module-header">
        <div>
          <p className="page-eyebrow">Profile</p>
          <h1>Remitter profile</h1>
        </div>
        <div className="header-actions">
          <Link to="/" className="secondary-button">Back to dashboard</Link>
          <button type="button" className="primary-button" onClick={() => setIsEditing((current) => !current)}>
            {isEditing ? 'Cancel' : 'Edit profile'}
          </button>
        </div>
      </div>

      <div className="card profile-card">
        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-summary">
              <div className="avatar">N</div>
              <div>
                <h2>{formData.fullName}</h2>
                <p>{formData.email}</p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="label">Phone</span>
                <strong>{formData.phone}</strong>
              </div>
              <div className="info-item">
                <span className="label">Bank</span>
                <strong>{formData.bankName}</strong>
              </div>
              <div className="info-item">
                <span className="label">Account type</span>
                <strong>{formData.accountType}</strong>
              </div>
              <div className="info-item full-width">
                <span className="label">Account number</span>
                <strong>{formData.accountNumber}</strong>
              </div>
            </div>

            <div className="inline-actions">
              <Link to="/recipients" className="secondary-button">View recipients</Link>
              <Link to="/send-money" className="primary-button">Initiate payment</Link>
            </div>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-grid">
              <label>
                <span>Full name</span>
                <input name="fullName" value={formData.fullName} onChange={handleChange} />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" value={formData.email} onChange={handleChange} />
              </label>
              <label>
                <span>Phone</span>
                <input name="phone" value={formData.phone} onChange={handleChange} />
              </label>
              <label>
                <span>Bank name</span>
                <input name="bankName" value={formData.bankName} onChange={handleChange} />
              </label>
              <label>
                <span>Account type</span>
                <select name="accountType" value={formData.accountType} onChange={handleChange}>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Salary">Salary</option>
                </select>
              </label>
              <label>
                <span>Account number</span>
                <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
              </label>
            </div>

            <div className="inline-actions">
              <button type="button" className="secondary-button" onClick={() => setIsEditing(false)}>
                Discard
              </button>
              <button type="submit" className="primary-button">Save changes</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RemitterProfile;
