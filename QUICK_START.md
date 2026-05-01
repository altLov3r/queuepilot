# QueuePilot - Quick Start Guide

## Installation (One Command)

```bash
npm run install:all
```

This installs dependencies for root, client, and server.

## Running the Application

### Option 1: Run Everything (Recommended)
```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173) simultaneously.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

## Access the Application

Open your browser:
```
http://localhost:5173
```

## Quick Demo (30 seconds)

1. Click "Try Demo"
2. Click "Load Demo Tickets"
3. Click "Analyze Tickets"
4. View results and export

## Troubleshooting

### Port Already in Use
If port 3001 or 5173 is in use:
- Kill the process using that port
- Or change the port in `server/src/server.js` or `client/vite.config.js`

### Dependencies Not Installing
```bash
# Install manually
cd client && npm install
cd ../server && npm install
cd ..
```

### Module Not Found Errors
Make sure you're in the project root directory and all dependencies are installed.

## Project Structure

```
queuepilot/
├── client/          # React frontend (port 5173)
├── server/          # Express backend (port 3001)
├── README.md        # Full documentation
└── package.json     # Root scripts
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md) for technical details
- Review [SUBMISSION_TEXT.md](SUBMISSION_TEXT.md) for hackathon info

---

**Need help?** Check the README.md or examine the code comments.