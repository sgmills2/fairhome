export interface CostBenefitInputs {
  numberOfUsers: number;
  timeSavingsPerUser: number;
  costSavingsPerUser: number;
  housingStabilityBenefit: number;
  developmentCost: number;
  maintenanceCost: number;
}

export interface SegmentedBenefits {
  housingSeekersDirectBenefits: {
    timeSavings: number;
    applicationCostSavings: number;
    transportationSavings: number;
    subtotal: number;
  };
  nonprofitOperationalBenefits: {
    caseloadEfficiency: number;
    reducedDuplicateEfforts: number;
    improvedOutcomes: number;
    subtotal: number;
  };
  municipalBenefits: {
    reducedEncampmentCosts: number;
    increasedTaxRevenue: number;
    reducedEmergencyServiceCosts: number;
    reducedHealthcareCosts: number;
    subtotal: number;
  };
  totalBenefits: number;
}

export interface CostBenefitResults {
  totalBenefits: number;
  segmentedBenefits: SegmentedBenefits;
  totalFirstYearCost: number;
  netBenefit: number;
  benefitCostRatio: number;
  roiPercentage: number;
  paybackPeriodMonths: number;
  fiveYearNpv: number;
}

export interface ResearchData {
  chaWaitlists: {
    siteBasedFamily: number;
    communityAreaScattered: number;
    siteBasedSenior: number;
    projectBasedVouchers: number;
    communityWideVouchers: number;
  };
  keyFindings: string[];
  dataSources: string[];
}

export const defaultInputs: CostBenefitInputs = {
  numberOfUsers: 50000,
  timeSavingsPerUser: 150,
  costSavingsPerUser: 100,
  housingStabilityBenefit: 500,
  developmentCost: 625000,
  maintenanceCost: 100000,
};

export const researchData: ResearchData = {
  chaWaitlists: {
    siteBasedFamily: 53300,
    communityAreaScattered: 48900,
    siteBasedSenior: 5300,
    projectBasedVouchers: 106600,
    communityWideVouchers: 15000,
  },
  keyFindings: [
    'Cost-Impact Ratio: 51.7:1',
    'Annual Benefits: $37.5 million',
    'First-Year Costs: $625,000',
    'ROI: 5,070%',
    'Payback Period: 0.23 months',
  ],
  dataSources: [
    'Chicago Housing Authority FY2025 MTW Annual Plan',
    'Bureau of Labor Statistics Chicago Metropolitan Area Data (2023)',
    'Economic Roundtable Study on Housing Stability (2021)',
    'National Low Income Housing Coalition Research (2022)',
    'Harvard Joint Center for Housing Studies (2022)',
    'HUD Housing Choice Voucher and Public Housing Data',
  ],
};

export function calculateSegmentedBenefits(inputs: CostBenefitInputs): SegmentedBenefits {
  // Housing Seekers Direct Benefits
  const timeSavings = inputs.numberOfUsers * inputs.timeSavingsPerUser;
  const applicationCostSavings = inputs.numberOfUsers * (inputs.costSavingsPerUser * 0.6); // 60% of cost savings
  const transportationSavings = inputs.numberOfUsers * (inputs.costSavingsPerUser * 0.4); // 40% of cost savings
  const housingSeekersSubtotal = timeSavings + applicationCostSavings + transportationSavings;

  // Nonprofit Operational Benefits (using $30/hour for staff time)
  const nonprofitHourlyRate = 30;
  const hoursPerCase = 8; // Estimated hours nonprofits spend per housing search case
  const caseloadEfficiency = inputs.numberOfUsers * 0.25 * hoursPerCase * nonprofitHourlyRate; // 25% of users get nonprofit help
  const reducedDuplicateEfforts = inputs.numberOfUsers * 0.15 * 4 * nonprofitHourlyRate; // 15% reduction in duplicate efforts
  const improvedOutcomes = inputs.numberOfUsers * 0.2 * (inputs.housingStabilityBenefit * 0.3); // 20% of housing stability benefit
  const nonprofitSubtotal = caseloadEfficiency + reducedDuplicateEfforts + improvedOutcomes;

  // Municipal Benefits
  const encampmentCostSavings = 20000000; // $20M annual encampment cleanup costs
  const housingPlacementRate = 0.2; // 20% achieve faster housing placement
  const avgIncomeIncrease = 2500; // $2,500 additional annual income
  const taxRate = 0.15; // Conservative tax rate on additional income
  const increasedTaxRevenue = inputs.numberOfUsers * housingPlacementRate * avgIncomeIncrease * taxRate;
  
  // Emergency services savings (conservative estimate)
  const emergencyServiceSavings = inputs.numberOfUsers * housingPlacementRate * 800; // $800 per person annually
  
  // Healthcare cost reductions (ER visits, etc.)
  const healthcareSavings = inputs.numberOfUsers * housingPlacementRate * 1200; // $1,200 per person annually
  
  const municipalSubtotal = encampmentCostSavings + increasedTaxRevenue + emergencyServiceSavings + healthcareSavings;

  const totalBenefits = housingSeekersSubtotal + nonprofitSubtotal + municipalSubtotal;

  return {
    housingSeekersDirectBenefits: {
      timeSavings,
      applicationCostSavings,
      transportationSavings,
      subtotal: housingSeekersSubtotal,
    },
    nonprofitOperationalBenefits: {
      caseloadEfficiency,
      reducedDuplicateEfforts,
      improvedOutcomes,
      subtotal: nonprofitSubtotal,
    },
    municipalBenefits: {
      reducedEncampmentCosts: encampmentCostSavings,
      increasedTaxRevenue,
      reducedEmergencyServiceCosts: emergencyServiceSavings,
      reducedHealthcareCosts: healthcareSavings,
      subtotal: municipalSubtotal,
    },
    totalBenefits,
  };
}

export function calculateCostBenefit(inputs: CostBenefitInputs): CostBenefitResults {
  const segmentedBenefits = calculateSegmentedBenefits(inputs);
  const totalBenefits = segmentedBenefits.totalBenefits;
  const totalFirstYearCost = inputs.developmentCost + inputs.maintenanceCost;
  const netBenefit = totalBenefits - totalFirstYearCost;
  const benefitCostRatio = totalBenefits / totalFirstYearCost;
  const roiPercentage = (netBenefit / totalFirstYearCost) * 100;
  const paybackPeriodMonths = (totalFirstYearCost / totalBenefits) * 12;
  const fiveYearNpv = netBenefit * 5 - inputs.maintenanceCost * 4; // Simplified NPV calculation

  return {
    totalBenefits,
    segmentedBenefits,
    totalFirstYearCost,
    netBenefit,
    benefitCostRatio,
    roiPercentage,
    paybackPeriodMonths,
    fiveYearNpv,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export interface ForecastAssumptions {
  inflationRate: number; // Annual inflation rate
  wageGrowthRate: number; // Annual wage growth rate
  userGrowthRate: number; // Annual user base growth rate
  encampmentCostGrowthRate: number; // Municipal cost inflation
  diminishingReturnsYear: number; // Year when benefits start to plateau
  diminishingReturnsFactor: number; // Reduction factor after plateau year
}

export const defaultForecastAssumptions: ForecastAssumptions = {
  inflationRate: 0.03, // 3% annual inflation
  wageGrowthRate: 0.025, // 2.5% annual wage growth
  userGrowthRate: 0.05, // 5% annual user growth (slowing over time)
  encampmentCostGrowthRate: 0.04, // 4% municipal cost inflation
  diminishingReturnsYear: 3, // Benefits start plateauing in year 3
  diminishingReturnsFactor: 0.85, // 15% reduction factor after plateau
};

export function calculateForecastedBenefits(
  baseInputs: CostBenefitInputs, 
  year: number, 
  assumptions: ForecastAssumptions = defaultForecastAssumptions
): SegmentedBenefits {
  // Calculate growth factors
  const inflationFactor = Math.pow(1 + assumptions.inflationRate, year - 1);
  const wageFactor = Math.pow(1 + assumptions.wageGrowthRate, year - 1);
  const userGrowthFactor = Math.pow(1 + assumptions.userGrowthRate * Math.pow(0.9, year - 1), year - 1); // Diminishing user growth
  const encampmentCostFactor = Math.pow(1 + assumptions.encampmentCostGrowthRate, year - 1);
  
  // Apply diminishing returns after specified year
  const diminishingFactor = year > assumptions.diminishingReturnsYear 
    ? Math.pow(assumptions.diminishingReturnsFactor, year - assumptions.diminishingReturnsYear)
    : 1;

  // Adjusted inputs for the year
  const adjustedInputs = {
    ...baseInputs,
    numberOfUsers: Math.round(baseInputs.numberOfUsers * userGrowthFactor),
    timeSavingsPerUser: baseInputs.timeSavingsPerUser * wageFactor * diminishingFactor,
    costSavingsPerUser: baseInputs.costSavingsPerUser * inflationFactor * diminishingFactor,
    housingStabilityBenefit: baseInputs.housingStabilityBenefit * wageFactor * diminishingFactor,
  };

  // Housing Seekers Direct Benefits (adjusted for growth)
  const timeSavings = adjustedInputs.numberOfUsers * adjustedInputs.timeSavingsPerUser;
  const applicationCostSavings = adjustedInputs.numberOfUsers * (adjustedInputs.costSavingsPerUser * 0.6);
  const transportationSavings = adjustedInputs.numberOfUsers * (adjustedInputs.costSavingsPerUser * 0.4);
  const housingSeekersSubtotal = timeSavings + applicationCostSavings + transportationSavings;

  // Nonprofit Operational Benefits (with wage inflation and diminishing returns)
  const nonprofitHourlyRate = 30 * wageFactor;
  const hoursPerCase = 8 * diminishingFactor; // Efficiency improvements reduce hours needed
  const caseloadEfficiency = adjustedInputs.numberOfUsers * 0.25 * hoursPerCase * nonprofitHourlyRate;
  const reducedDuplicateEfforts = adjustedInputs.numberOfUsers * 0.15 * 4 * nonprofitHourlyRate * diminishingFactor;
  const improvedOutcomes = adjustedInputs.numberOfUsers * 0.2 * (adjustedInputs.housingStabilityBenefit * 0.3);
  const nonprofitSubtotal = caseloadEfficiency + reducedDuplicateEfforts + improvedOutcomes;

  // Municipal Benefits (with different growth patterns)
  const baseEncampmentCost = 20000000;
  // Encampment costs grow but website effectiveness reduces them over time
  const encampmentCostSavings = baseEncampmentCost * encampmentCostFactor * diminishingFactor;
  
  const housingPlacementRate = Math.min(0.2 * (1 + (year - 1) * 0.02), 0.28); // Gradual improvement, capped at 28%
  const avgIncomeIncrease = 2500 * wageFactor;
  const taxRate = 0.15;
  const increasedTaxRevenue = adjustedInputs.numberOfUsers * housingPlacementRate * avgIncomeIncrease * taxRate;
  
  // Emergency and healthcare savings scale with both user growth and cost inflation
  const emergencyServiceSavings = adjustedInputs.numberOfUsers * housingPlacementRate * 800 * inflationFactor;
  const healthcareSavings = adjustedInputs.numberOfUsers * housingPlacementRate * 1200 * inflationFactor;
  
  const municipalSubtotal = encampmentCostSavings + increasedTaxRevenue + emergencyServiceSavings + healthcareSavings;

  const totalBenefits = housingSeekersSubtotal + nonprofitSubtotal + municipalSubtotal;

  return {
    housingSeekersDirectBenefits: {
      timeSavings,
      applicationCostSavings,
      transportationSavings,
      subtotal: housingSeekersSubtotal,
    },
    nonprofitOperationalBenefits: {
      caseloadEfficiency,
      reducedDuplicateEfforts,
      improvedOutcomes,
      subtotal: nonprofitSubtotal,
    },
    municipalBenefits: {
      reducedEncampmentCosts: encampmentCostSavings,
      increasedTaxRevenue,
      reducedEmergencyServiceCosts: emergencyServiceSavings,
      reducedHealthcareCosts: healthcareSavings,
      subtotal: municipalSubtotal,
    },
    totalBenefits,
  };
}

export function generateChartData(inputs: CostBenefitInputs, results: CostBenefitResults, includeForecast: boolean = true) {
  const chartData = [];
  
  for (let year = 1; year <= 10; year++) {
    let segmentedBenefits;
    let totalBenefits;
    
    if (includeForecast && year > 1) {
      // Use forecasted benefits for years 2+
      segmentedBenefits = calculateForecastedBenefits(inputs, year);
      totalBenefits = segmentedBenefits.totalBenefits;
    } else {
      // Use current year calculations for year 1
      segmentedBenefits = results.segmentedBenefits;
      totalBenefits = results.totalBenefits;
    }
    
    // Calculate costs with inflation
    const inflationFactor = Math.pow(1.03, year - 1); // 3% annual inflation
    const maintenanceCost = inputs.maintenanceCost * inflationFactor;
    const costs = year === 1 ? results.totalFirstYearCost : maintenanceCost;
    
    chartData.push({
      year: `Year ${year}`,
      totalBenefits,
      housingSeekersDirectBenefits: segmentedBenefits.housingSeekersDirectBenefits.subtotal,
      nonprofitOperationalBenefits: segmentedBenefits.nonprofitOperationalBenefits.subtotal,
      municipalBenefits: segmentedBenefits.municipalBenefits.subtotal,
      costs,
      // Add trend indicators
      userCount: year === 1 ? inputs.numberOfUsers : Math.round(inputs.numberOfUsers * Math.pow(1.05 * Math.pow(0.9, year - 1), year - 1)),
    });
  }
  
  return chartData;
}

export function generateBenefitBreakdown(results: CostBenefitResults) {
  const { segmentedBenefits } = results;
  return [
    { 
      name: 'Housing Seekers', 
      value: segmentedBenefits.housingSeekersDirectBenefits.subtotal, 
      color: '#8884d8' 
    },
    { 
      name: 'Nonprofit Efficiency', 
      value: segmentedBenefits.nonprofitOperationalBenefits.subtotal, 
      color: '#82ca9d' 
    },
    { 
      name: 'Municipal Benefits', 
      value: segmentedBenefits.municipalBenefits.subtotal, 
      color: '#ffc658' 
    },
  ];
} 