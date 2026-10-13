const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/paygate_db').then(async () => {
  await mongoose.connection.collection('users').updateOne(
    { email: 'admin@transiq.internal' },
    { $set: { email: 'admin@paygate.internal' } }
  );
  console.log('Updated admin email to admin@paygate.internal');
  process.exit(0);
});
