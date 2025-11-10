# Phoenix Reignite - Setup & Deployment Guide

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.8+ ([Download](https://www.python.org/downloads/))
- Node.js 14+ (optional, for npm packages) ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))

### 1. Clone Repository
```bash
git clone https://github.com/Phoenix-Labs-59/phoenix-reignite.git
cd phoenix-reignite
```

### 2. Backend Setup (Flask)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
cp ../.env.example .env

# Run Flask server
python app.py
```

✅ Backend will run at: **http://localhost:5000**

### 3. Frontend Setup (HTML/CSS/JS)

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Option A: Use Python HTTP server
python -m http.server 8000

# Option B: Use Node http-server
npx http-server -p 8000
```

✅ Frontend will run at: **http://localhost:8000**

### 4. Test the App
- Open browser: `http://localhost:8000`
- Try creating a quiz
- Join a session
- Test anti-distraction mode

---

## 🌐 Deployment (Free Hosting)

### Backend Deployment (Replit)

1. **Upload to Replit:**
   - Go to [Replit.com](https://replit.com)
   - Click "Create Repl"
   - Choose "Python" template
   - Upload `backend/` files
   - Install requirements: `pip install -r requirements.txt`
   - Click "Run"

2. **Get your Replit URL:** `https://[username]-[projectname].replit.dev`

### Frontend Deployment (Vercel)

1. **Deploy to Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Click "New Project"
   - Connect your GitHub repo
   - Set root directory to `frontend/`
   - Deploy

2. **Get your Vercel URL:** `https://[projectname].vercel.app`

3. **Update API URL in frontend:**
   - Edit `frontend/script.js`
   - Change `const API_BASE = 'http://localhost:5000/api'`
   - To: `const API_BASE = 'https://[replit-url]/api'`

### Alternative: Deploy with GitHub Pages (Frontend Only)

```bash
cd frontend
# Add to gh-pages branch
git subtree push --prefix frontend origin gh-pages
```

---

## 🔧 Environment Variables

Create `.env` file in backend folder with:

```
FLASK_ENV=production
FLASK_DEBUG=False
SERVER_HOST=0.0.0.0
SERVER_PORT=5000
API_BASE_URL=https://your-replit-url
FRONTEND_URL=https://your-vercel-url
```

---

## 📦 Project Structure

```
phoenix-reignite/
├── backend/
│   ├── app.py                 # Flask API
│   ├── requirements.txt        # Python dependencies
│   └── venv/                  # Virtual environment (local only)
├── frontend/
│   ├── index.html             # Main UI
│   ├── style.css              # Styling
│   ├── script.js              # JavaScript
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── LICENSE                    # MIT License
├── README.md                  # Project info
└── SETUP.md                   # This file
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Make sure virtual env is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check if port 5000 is in use
# On macOS/Linux: lsof -i :5000
# On Windows: netstat -ano | findstr :5000
```

### CORS errors
- Make sure backend CORS is enabled (check `app.py`)
- Check if API_BASE URL is correct in `script.js`

### Frontend not loading
- Make sure you're serving from correct directory
- Check browser console for errors (F12)
- Verify API endpoint is accessible

---

## 📝 Next Steps

1. Customize `.env` with your settings
2. Add database integration (MongoDB/PostgreSQL)
3. Implement user authentication
4. Add AI quiz generation (OpenAI API)
5. Deploy to production
6. Set up CI/CD pipeline

---

## 💡 Tips

- Use `git pull` before starting to get latest updates
- Commit changes frequently: `git add .` → `git commit -m "message"` → `git push`
- Keep `.env` file secret (never commit it!)
- Test locally before deploying
- Monitor logs for errors

---

**Made with ❤️ by Phoenix Labs**
