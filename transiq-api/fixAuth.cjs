const fs = require('fs');
let code = fs.readFileSync('D:\\Clg\\python lab\\MERN PROJECT\\transiq-api\\routes\\auth.js', 'utf8');

// 1. Force customer role
code = code.replace(
  /const { firstName, lastName, email, password, phone, role } = req.body;\s*const exists = await User.findOne\({ \$or: \[{ email }, { phone }\] }\);\s*if \(exists\) {\s*return res.status\(409\).json\({ success: false, message: 'Email or phone already registered' }\);\s*}\s*const user = await User.create\({ firstName, lastName, email, password, phone, role: role \|\| 'customer' }\);/,
  `const { firstName, lastName, email, password, phone } = req.body;
      const exists = await User.findOne({ $or: [{ email }, { phone }] });
      if (exists) {
        return res.status(409).json({ success: false, message: 'Email or phone already registered' });
      }
      const user = await User.create({ firstName, lastName, email, password, phone, role: 'customer' });`
);

// 2. Add escape function and use it
if (!code.includes('escapeRegex')) {
  code = code.replace(
    'router.post(\'/verify-user\', async (req, res) => {',
    `const escapeRegex = (str) => str.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g, '\\\\$&');

router.post('/verify-user', async (req, res) => {`
  );
  
  code = code.replace(
    /\{ firstName: new RegExp\(`\^\$\{q\}\$`, 'i'\) \},\s*\{ lastName: new RegExp\(`\^\$\{q\}\$`, 'i'\) \},/,
    `{ firstName: new RegExp(\`^\${escapeRegex(q)}$\`, 'i') },
        { lastName: new RegExp(\`^\${escapeRegex(q)}$\`, 'i') },`
  );
}

// 3. Minimise verify-user return data
code = code.replace(
  /data: \{ id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, role: user.role \},/,
  `data: { firstName: user.firstName, lastName: user.lastName },`
);

fs.writeFileSync('D:\\Clg\\python lab\\MERN PROJECT\\transiq-api\\routes\\auth.js', code);
console.log('Fixed auth.js routes');
