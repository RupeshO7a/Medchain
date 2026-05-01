# MedChain Frontend

## Blockchain Healthcare Records System - Frontend Application

This is the React frontend for the MedChain blockchain healthcare records system, as specified in your project plan.

## ✨ Features

### 🏥 For Hospitals
- **Dashboard**: View statistics and recent records
- **Search Patient**: Find complete medical history using Aadhaar number
- **Add Record**: Create new patient records on blockchain
- **Real-time Updates**: See records from all hospitals in the network

### ⚙️ For Government Admin
- **Hospital Management**: Approve or reject hospital applications
- **Authorization Control**: Grant blockchain access to hospitals
- **Network Monitoring**: View system-wide statistics

### 🔐 Security Features
- JWT-based authentication
- Encrypted Aadhaar numbers
- Blockchain-verified records
- Cross-hospital data sharing with access control

## 🎨 Design Features

- **Modern Blockchain-Inspired UI**: Dark theme with cyberpunk aesthetics
- **Custom Fonts**: Playfair Display + JetBrains Mono
- **Smooth Animations**: Micro-interactions and transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Gradient Accents**: Cyan-to-purple blockchain theme

## 📁 Project Structure
```
medchain-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Login.js & Login.css
│   │   ├── Register.js & Register.css
│   │   ├── Dashboard.js & Dashboard.css
│   │   ├── SearchPatient.js & SearchPatient.css
│   │   ├── AddRecord.js & AddRecord.css
│   │   └── Admin.js & Admin.css
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+ installed
- Backend server running on http://localhost:5000
- MongoDB running
- Hardhat blockchain node running

### Step 1: Install Dependencies
```bash
cd medchain-frontend
npm install
```

This will install:
- React 18.2.0
- React Router DOM 6.20.0
- Axios 1.6.2
- All necessary dependencies

### Step 2: Configure Backend URL

The frontend is pre-configured to connect to `http://localhost:5000`

If your backend runs on a different URL, edit `src/context/AuthContext.js`:
```javascript
// Change this line:
axios.defaults.baseURL = 'http://localhost:5000';

// To your backend URL:
axios.defaults.baseURL = 'http://your-backend-url:port';
```

### Step 3: Start Development Server
```bash
npm start
```

The application will open at **http://localhost:3000**

## 🔧 Configuration

### Backend Connection

Edit `src/context/AuthContext.js` to change the API endpoint:
```javascript
axios.defaults.baseURL = 'YOUR_BACKEND_URL';
```

### For Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Build the production version:
```bash
npm run build
```

2. Update the backend URL to your deployed backend:
```javascript
axios.defaults.baseURL = 'https://your-backend.railway.app';
```

## 📱 Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Login page | Public |
| `/register` | Hospital registration | Public |
| `/dashboard` | Hospital dashboard | Authenticated |
| `/search` | Search patient records | Hospital only |
| `/add-record` | Add new medical record | Hospital only |
| `/admin` | Government admin panel | Admin only |

## 🎯 How to Use

### For Hospitals

1. **Register**: Go to `/register` and fill the hospital application form
2. **Wait for Approval**: Government admin must authorize your hospital
3. **Login**: Use your email and password at `/`
4. **Add Records**: Click "Add Record" to create patient records
5. **Search Patients**: Enter Aadhaar number to view complete history

### For Government Admin

1. **Login**: Use admin credentials (admin@healthgov.in / Admin@123456)
2. **Review Applications**: Check pending hospital applications
3. **Authorize**: Click "Authorize" to grant blockchain access
4. **Monitor**: View network statistics and manage hospitals

## 🧪 Testing the Complete System

### Prerequisites
You need **3 terminal windows** running simultaneously:

**Terminal 1**: Blockchain node
```bash
cd smart-contracts
npx hardhat node
```

**Terminal 2**: Backend server
```bash
cd backend
npm run dev
```

**Terminal 3**: Frontend (this)
```bash
cd frontend
npm start
```

### Test Flow

1. **Register Hospital**: Go to http://localhost:3000/register
2. **Admin Approval**: Login as admin and authorize the hospital
3. **Hospital Login**: Login with hospital credentials
4. **Add Record**: Create a test record with Aadhaar: 123456789012
5. **Search Record**: Search the same Aadhaar to view the record
6. **Register 2nd Hospital**: Test cross-hospital data sharing
7. **Search from Hospital 2**: Verify Hospital 2 can see Hospital 1's records

## 🎨 Design System

### Colors
- Primary: `#00d9ff` (Cyan)
- Secondary: `#6366f1` (Purple)
- Accent: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)
- Dark Background: `#0a0e27`

### Typography
- Display Font: Playfair Display (serif, elegant headers)
- Body Font: JetBrains Mono (monospace, technical feel)

### Components
- Cards with glassmorphism effects
- Gradient borders on hover
- Animated backgrounds with grid patterns
- Floating shape effects
- Timeline view for medical records

## 🔐 Security Notes

- All API calls include JWT authentication
- Aadhaar numbers are hashed before blockchain storage
- Patient data is encrypted end-to-end
- Admin routes are protected with role-based access

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## 🚀 Production Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable:
   - `REACT_APP_API_URL` = Your backend URL
5. Deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `build` folder
4. Configure redirects for React Router:

Create `public/_redirects`:
```
/* /index.html 200
```

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure backend server is running on port 5000
- Check `axios.defaults.baseURL` in AuthContext.js
- Verify CORS is enabled on backend

### "White screen after npm start"
- Check browser console for errors
- Ensure all dependencies are installed: `npm install`
- Clear cache: `npm start -- --reset-cache`

### "Cannot search/add records"
- Ensure blockchain node is running
- Check backend is connected to blockchain
- Verify hospital is authorized by admin

## 📄 License

This project is part of the Government of India NDHM initiative.

## 🤝 Support

For issues or questions:
1. Check your backend logs
2. Verify all 3 services are running (blockchain, backend, frontend)
3. Check browser console for frontend errors
4. Ensure MongoDB is running

---

**Built with ❤️ for the National Digital Health Mission**