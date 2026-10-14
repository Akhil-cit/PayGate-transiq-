import { useState, useEffect } from 'react';
import { useRecipientStore } from '../store/useRecipientStore';
import { Search, Plus, Star, Trash2, Pencil, Building, User, Phone, Mail, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateName, validateAccountNumber, validateIfsc, validatePhone, validateEmail } from '../../../utils/validation';

const ACCOUNT_TYPES = [
  { value: 'savings', label: 'Savings' },
  { value: 'current', label: 'Current' },
  { value: 'nri', label: 'NRI' },
];

const emptyForm = {
  name: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  accountType: 'savings',
  phone: '',
  email: '',
};

const RecipientList = () => {
  const {
    recipients,
    loading,
    error,
    successMessage,
    fetchAll,
    create,
    update,
    remove,
    clearError,
    clearSuccess,
  } = useRecipientStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (filterType) params.accountType = filterType;
    fetchAll(params);
  }, [fetchAll, filterType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (filterType) params.accountType = filterType;
    fetchAll(params);
  };

  const validate = () => {
    const errs = {};
    const nameErr = validateName(formData.name, 'Recipient Name');
    if (nameErr) errs.name = nameErr;

    const bankErr = validateName(formData.bankName, 'Bank Name');
    if (bankErr) errs.bankName = bankErr;

    const accErr = validateAccountNumber(formData.accountNumber);
    if (accErr) errs.accountNumber = accErr;

    const ifscErr = validateIfsc(formData.ifscCode);
    if (ifscErr) errs.ifscCode = ifscErr;

    if (formData.phone && formData.phone.trim()) {
      const phoneErr = validatePhone(formData.phone);
      if (phoneErr) errs.phone = phoneErr;
    }

    if (formData.email && formData.email.trim()) {
      const emailErr = validateEmail(formData.email);
      if (emailErr) errs.email = emailErr;
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingRecipient) {
      const res = await update(editingRecipient._id, formData);
      if (res?.success) {
        setEditingRecipient(null);
        setFormData(emptyForm);
        fetchAll();
      }
    } else {
      const res = await create(formData);
      if (res?.success) {
        setShowAddModal(false);
        setFormData(emptyForm);
        fetchAll();
      }
    }
  };

  const handleOpenEdit = (rec) => {
    setEditingRecipient(rec);
    setFormData({
      name: rec.name || '',
      bankName: rec.bankName || '',
      accountNumber: rec.accountNumber || '',
      ifscCode: rec.ifscCode || '',
      accountType: rec.accountType || 'savings',
      phone: rec.phone || '',
      email: rec.email || '',
    });
    setFormErrors({});
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your recipients?`)) {
      await remove(id);
      fetchAll();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 pr-36">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Beneficiary Management</span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">Recipients & Contacts</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {recipients.length} saved contact{recipients.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setEditingRecipient(null);
                setFormData(emptyForm);
                setFormErrors({});
                setShowAddModal(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} /> Add Recipient
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} /> {successMessage}
            </span>
            <button onClick={clearSuccess} className="text-emerald-600 hover:text-emerald-800">✕</button>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-xl text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </span>
            <button onClick={clearError} className="text-rose-600 hover:text-rose-800">✕</button>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-md">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by recipient name, bank, or account..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="">All Account Types</option>
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
              {recipients.length} Found
            </span>
          </div>
        </div>

        {recipients.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            <User size={32} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No recipients found</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Add your first recipient or adjust your search filter.</p>
            <button
              onClick={() => {
                setEditingRecipient(null);
                setFormData(emptyForm);
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
            >
              Add Recipient
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipients.map((rec) => (
              <div
                key={rec._id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {rec.name?.charAt(0)?.toUpperCase() || 'R'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{rec.name}</h3>
                      <p className="text-xs text-slate-500">{rec.bankName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account:</span>
                    <span className="font-mono font-medium text-slate-800">{rec.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IFSC:</span>
                    <span className="font-mono text-slate-800">{rec.ifscCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="capitalize font-medium text-slate-700">{rec.accountType || 'Savings'}</span>
                  </div>
                  {rec.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-slate-700">{rec.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    {rec.referenceCode || `REC-${rec._id?.slice(-4)}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(rec)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition inline-flex items-center gap-1"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rec._id, rec.name)}
                      className="px-2.5 py-1 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition inline-flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(showAddModal || editingRecipient) && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {editingRecipient ? `Edit: ${editingRecipient.name}` : 'Add New Beneficiary'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRecipient(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Recipient Name *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    {formErrors.name && <span className="text-[11px] text-rose-600">{formErrors.name}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bank Name *</label>
                    <input
                      required
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    {formErrors.bankName && <span className="text-[11px] text-rose-600">{formErrors.bankName}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Number *</label>
                    <input
                      required
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="e.g. 50100412345678"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    {formErrors.accountNumber && <span className="text-[11px] text-rose-600">{formErrors.accountNumber}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">IFSC Code *</label>
                    <input
                      required
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                      placeholder="e.g. HDFC0001234"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 uppercase"
                    />
                    {formErrors.ifscCode && <span className="text-[11px] text-rose-600">{formErrors.ifscCode}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Account Type</label>
                    <select
                      value={formData.accountType}
                      onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    >
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                      <option value="nri">NRI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone (Optional)</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@example.com"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingRecipient(null);
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                  >
                    {loading ? 'Saving...' : editingRecipient ? 'Save Changes' : 'Add Recipient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientList;
