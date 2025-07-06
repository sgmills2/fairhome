# AFairHome Research - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you run the cost-benefit analysis tool locally.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Yarn** package manager - [Install guide](https://yarnpkg.com/getting-started/install)
- **Python** (3.8 or higher) - [Download here](https://www.python.org/downloads/)

---

## 🏗️ Setup Instructions

### 1. Install Frontend Dependencies

```bash
# Install React/TypeScript dependencies
yarn install
```

### 2. Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Return to root directory
cd ..
```

### 3. Start the Applications

**Option A: Run Both Services**
```bash
# Terminal 1: Start the Python API (Port 5000)
cd backend
python api.py

# Terminal 2: Start the React App (Port 3000)
yarn start
```

**Option B: Frontend Only (Static Analysis)**
```bash
# Run just the React app with static calculations
yarn start
```

---

## 🖥️ Access the Applications

- **React Frontend**: http://localhost:3000
- **Python API** (if running): http://localhost:5000/api/health
- **API Documentation**: See `backend/api.py` for endpoint details

---

## 📊 Running Analysis

### Quick Python Analysis
```bash
# Run the analysis script directly
python run_analysis.py

# Or run the model directly
cd backend
python cost_benefit_model.py
```

### Interactive Web Interface
1. Open http://localhost:3000
2. Adjust parameters in the left panel
3. View real-time results in the right panel
4. Explore charts and projections below

---

## 📁 Project Structure

```
FairhomeResearch/
├── 📱 Frontend (React/TypeScript)
│   ├── src/components/ResearchPage.tsx    # Main analysis interface
│   ├── src/App.tsx                        # React application
│   └── package.json                       # Node dependencies
│
├── 🐍 Backend (Python/Flask)
│   ├── cost_benefit_model.py              # Core analysis model
│   ├── api.py                             # Flask API endpoints
│   └── requirements.txt                   # Python dependencies
│
├── 📚 Documentation
│   ├── research.md                        # Comprehensive research
│   ├── README.md                          # Full documentation
│   ├── DEMO_RESULTS.md                    # Sample analysis results
│   └── QUICK_START.md                     # This guide
│
└── 🔧 Utilities
    ├── run_analysis.py                    # Quick analysis runner
    └── verify_encampment_costs.py         # Cost verification tool
```

---

## 🎯 Key Features

### Interactive Cost-Benefit Calculator
- **Real-time parameter adjustment**
- **Instant recalculation** of all metrics
- **Visual charts and graphs**
- **5-year financial projections**

### Advanced Analytics
- **Scenario analysis** (Conservative/Base/Optimistic)
- **Sensitivity analysis** for key parameters
- **Net Present Value** calculations
- **Benefit-cost ratio** analysis

### Research Documentation
- **Chicago Housing Authority data** integration
- **Comprehensive source citations**
- **Methodology transparency**
- **Assumption documentation**

---

## 📈 Sample Results

Based on Chicago Housing Authority data and conservative assumptions:

| Metric | Value |
|--------|-------|
| **Annual Benefits** | $37.5 million |
| **First-Year Costs** | $725,000 |
| **Benefit-Cost Ratio** | 51.7:1 |
| **ROI** | 5,070% |
| **Payback Period** | 0.23 months |

---

## 🔧 Troubleshooting

### Common Issues

**"Python was not found"**
- Install Python from python.org
- Add Python to your system PATH
- Restart your terminal

**"yarn not found"**
- Install Node.js first
- Install Yarn: `npm install -g yarn`

**Dependencies not installing**
- For Python: Try `pip3` instead of `pip`
- For Node: Delete `node_modules` and `yarn.lock`, then run `yarn install`

**Port conflicts**
- React (3000): Change in package.json scripts
- Python (5000): Change port in `backend/api.py`

### Getting Help

1. **Check the documentation**: Review `README.md` and `research.md`
2. **Review sample results**: See `DEMO_RESULTS.md`
3. **Verify setup**: Run health checks on both frontend and backend

---

## 🎮 Quick Demo

If you just want to see the analysis results without setting up the full environment:

1. **View Demo Results**: Open `DEMO_RESULTS.md`
2. **Review Research**: Open `research.md` 
3. **Run Static Analysis**: Use `run_analysis.py` (requires Python)

---

## 📝 Next Steps

1. **Explore the interactive interface** at http://localhost:3000
2. **Adjust parameters** to see how assumptions affect results
3. **Review the comprehensive research** in `research.md`
4. **Verify the $20M encampment cost** using `verify_encampment_costs.py`
5. **Export results** for presentations and proposals

---

## 🎯 Usage for AFairHome.org

This research tool provides:

- **Investment justification** for your $500K-750K budget
- **Evidence-based analysis** using Chicago-specific data
- **Conservative estimates** that ensure credible projections
- **Professional presentation** materials for stakeholders
- **Ongoing monitoring** framework for impact measurement

The analysis strongly supports proceeding with the AFairHome.org project, showing exceptional return on investment and significant social benefits for Chicago's affordable housing ecosystem.

---

**Need help?** Review the full documentation in `README.md` or check the research methodology in `research.md`. 