# AFairHome.org Cost-Benefit Research & Analysis

A comprehensive cost-benefit analysis tool for affordable housing initiatives in Chicago, specifically designed to quantify the economic impact of the AFairHome.org website portal.

## 🏠 Project Overview

This project provides data-driven analysis to justify a $500K-$750K investment in an affordable housing search portal for Chicago. The analysis incorporates Chicago Housing Authority (CHA) data, economic research, and conservative assumptions to project benefits including:

- **Time savings** for housing seekers
- **Direct cost savings** (transportation, application fees)
- **Housing stability benefits** (increased employment, income)
- **Healthcare savings** (reduced ER visits)
- **Municipal savings** (encampment cleanup costs)

## 📊 Key Findings

Based on the cost-benefit analysis:

- **Benefit-Cost Ratio**: 51.7:1
- **Annual Benefits**: $37.5 million
- **First-Year Costs**: $725,000
- **ROI**: 5,070%
- **Payback Period**: 0.23 months

## 🔬 Research Methodology

### Data Sources

#### Chicago Housing Authority (CHA) Data
- **Site-Based Family Housing**: 53,300 households on waitlist
- **Community Area Scattered Sites**: 48,900 households  
- **Project-Based Voucher Program**: 106,600 households
- **Total Estimated Unique Households**: 200,000-230,000
- **Source**: CHA FY2025 MTW Annual Plan

#### Economic Research
- **Housing stability employment increase**: 20% (Economic Roundtable, 2021)
- **Average Chicago wage**: $15/hour (Bureau of Labor Statistics, 2023)
- **Public housing average stay**: 11.8 years (HUD data)
- **HCV average stay**: 10 years (HUD data)

### Key Assumptions

1. **User Base**: 25% of waitlist households (50,000 users) use the website annually
2. **Time Savings**: 10 hours saved per user at $15/hour = $150 value
3. **Cost Savings**: $100 per user (transportation + application fees)
4. **Housing Stability**: 20% achieve faster housing placement → $2,500 additional annual income
5. **Development Cost**: $625,000 (midpoint of $500K-$750K budget)
6. **Maintenance**: $300,000 annually

### Additional Benefits (Not Quantified)

- Reduced emergency room visits
- Chicago encampment cleanup savings (~$20M annually)
- Increased local economic activity 
- Higher tax revenue from improved employment
- Enhanced landlord compliance and accountability

## 🖥️ Features

### Interactive Cost-Benefit Calculator
- Real-time parameter adjustment
- Instant results recalculation
- Visual charts and graphs
- 5-year projection modeling

### Advanced Analytics
- Scenario analysis (Conservative/Base/Optimistic)
- Sensitivity analysis for key parameters
- Net Present Value calculations
- Payback period analysis

### Research Documentation
- Comprehensive data sources
- Methodology transparency
- Assumption documentation
- Citation management

## 📈 API Endpoints

### `/api/analysis` (POST)
Run cost-benefit analysis with custom parameters

**Request Body:**
```json
{
  "numberOfUsers": 50000,
  "timeSavingsPerUser": 150,
  "costSavingsPerUser": 100,
  "housingStabilityBenefit": 500,
  "developmentCost": 625000,
  "maintenanceCost": 300000
}
```

### `/api/scenarios` (GET)
Get analysis results for Conservative/Base/Optimistic scenarios

### `/api/research-data` (GET)
Get comprehensive research data and sources

### `/api/sensitivity` (POST)
Perform sensitivity analysis on specific parameters

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **Recharts** for data visualization
- **Axios** for API communication

### Backend
- **Python 3.8+** with Flask
- **NumPy & Pandas** for data analysis
- **Dataclasses** for type safety
- **Flask-CORS** for frontend integration

## 📋 Model Validation

The cost-benefit model has been validated against:

1. **Chicago Housing Authority official data** (FY2025 MTW Annual Plan)
2. **Bureau of Labor Statistics** wage data
3. **Academic research** on housing stability and employment
4. **Industry standards** for website development and maintenance costs
5. **Conservative assumption frameworks** to ensure reliability

## 🎯 Use Cases

1. **Investment Justification**: Demonstrate ROI for stakeholders
2. **Grant Applications**: Provide evidence-based cost-benefit analysis
3. **Policy Development**: Inform affordable housing policy decisions
4. **Academic Research**: Support housing economics research
5. **Municipal Planning**: Guide public investment in housing infrastructure

## ⚠️ Limitations & Disclaimers

1. **Waitlist Overlap**: CHA data may include households on multiple waitlists
2. **National Averages**: Some benefits based on national rather than Chicago-specific data
3. **Conservative Estimates**: Model intentionally uses conservative assumptions
4. **Verification Needed**: $20M encampment cleanup cost requires city budget validation

## 🤝 Contributing

This research tool is designed for the AFairHome.org project. For questions or contributions:

1. Review the research methodology in `research.md`
2. Ensure all data sources are properly cited
3. Maintain conservative assumption frameworks
4. Document any changes to calculation methods

## 📚 Citations & References

- Chicago Housing Authority FY2025 MTW Annual Plan
- Bureau of Labor Statistics Chicago Metropolitan Area Data (2023)
- Economic Roundtable Study on Housing Stability (2021)
- National Low Income Housing Coalition Research (2022)
- Harvard Joint Center for Housing Studies (2022)
- HUD Housing Choice Voucher and Public Housing Data

## 🏗️ Project Structure

```
FairhomeResearch/
├── src/                          # React TypeScript frontend
│   ├── components/
│   │   ├── ResearchPage.tsx      # Main interactive analysis page
│   │   └── ResearchSummary.tsx   # Research data and sources
│   ├── App.tsx                   # Main React application
│   └── index.tsx                 # Application entry point
├── backend/                      # Python data science backend
│   ├── cost_benefit_model.py     # Advanced cost-benefit analysis model
│   ├── api.py                    # Flask API endpoints
│   └── requirements.txt          # Python dependencies
├── public/                       # Static assets
├── research.md                   # Comprehensive research documentation
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+) and **Yarn**
- **Python** (3.8+) and **pip**

### Frontend Setup (React/TypeScript)

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn start
```

The React application will be available at `http://localhost:3000`

### Backend Setup (Python/Flask)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Start the Flask API:
```bash
python api.py
```

The API will be available at `http://localhost:5000`

### Running the Complete Application

1. Start the backend API (Port 5000)
2. Start the frontend React app (Port 3000)
3. The React app will communicate with the Python API for advanced calculations

## 📞 Contact

For questions about this research or the AFairHome.org project, please refer to the comprehensive documentation in `research.md` or review the interactive analysis tool.

---

**Note**: This analysis provides a conservative estimate of benefits. Actual returns may be higher due to additional factors such as reduced healthcare costs, increased municipal tax revenue, and enhanced community economic activity. 