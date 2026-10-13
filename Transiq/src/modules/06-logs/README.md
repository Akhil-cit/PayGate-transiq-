# Module 6: Transaction Logs & Monitoring

Complete React UI implementation for transaction logging, payment history, error tracking, and admin monitoring.

## 📁 File Structure

```
src/modules/06-logs/
├── pages/
│   ├── TransactionHistory.jsx    - Payment history and logs page
│   └── AdminMonitoring.jsx       - Admin dashboard with KPIs
├── components/
│   ├── PaymentHistory.jsx        - Payment history table
│   ├── LogViewer.jsx             - Transaction log detail viewer
│   ├── ErrorLogViewer.jsx        - Error log viewer with filters
│   ├── PendingTransactionMonitor.jsx - Monitor pending transactions
│   └── MonitoringDashboard.jsx   - Quick stats dashboard
└── store/
    └── logsStore.js             - Zustand state management
```

## 🎯 Features

### Pages

**TransactionHistory Page**
- Full payment history table
- Transaction log viewer with details
- Date/time filtering
- Status indicators (Success/Failed/Pending)

**AdminMonitoring Page**
- 5 KPI cards (Total, Success, Failed, Pending, Unresolved Errors)
- Pending transaction monitor with progress bars
- System status indicator
- Error logs with severity badges
- Full payment history

### Components

**PaymentHistory**
- Sortable table with transaction details
- Status color coding
- Payment method display
- Responsive design

**LogViewer**
- Transaction log list with sidebar details
- Click to view full transaction info
- Real-time selection

**ErrorLogViewer**
- Filter by status (All/Unresolved/Resolved)
- Severity level badges
- Error code categorization
- Resolution status tracking

**PendingTransactionMonitor**
- Progress bar for pending duration
- Initiation time display
- Amount and transaction ID
- Yellow warning styling

**MonitoringDashboard**
- Quick stats overview
- Recent activity feed
- System health indicators

## 🎨 Styling

- Tailwind CSS with responsive grid layouts
- Color-coded status badges (Green=Success, Red=Failed, Yellow=Pending, Orange=Critical)
- Clean cards with shadows
- Sticky sidebars for details view

## 📊 Dummy Data Structure

**Transaction Log**
```javascript
{
  id, transactionId, remitter, recipient, amount,
  status, timestamp, method
}
```

**Error Log**
```javascript
{
  id, errorId, transactionId, errorCode, message,
  severity, timestamp, resolved
}
```

**Pending Transaction**
```javascript
{
  id, transactionId, amount, initiated, durationMinutes
}
```

## 🚀 Usage

Import and use components in your main app:

```jsx
import AdminMonitoring from '@/modules/06-logs/pages/AdminMonitoring';
import TransactionHistory from '@/modules/06-logs/pages/TransactionHistory';

// In your router/App.jsx
<Route path="/admin/monitoring" component={AdminMonitoring} />
<Route path="/history" component={TransactionHistory} />
```

## 🔄 State Management

Uses Zustand store with dummy data. To connect to real backend:

```javascript
// In logsStore.js, replace dummy data with API calls
setTransactionLogs: async (userId) => {
  const logs = await fetch(`/api/logs/${userId}`).then(r => r.json());
  set({ transactionLogs: logs });
}
```
