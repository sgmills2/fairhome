export interface CostBenefitInputs {
  numberOfUsers: number;
  timeSavingsPerUser: number;
  costSavingsPerUser: number;
  housingStabilityBenefit: number;
  developmentCost: number;
  maintenanceCost: number;
}

export interface CostBenefitResults {
  totalBenefits: number;
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
    'Benefit-Cost Ratio: 51.7:1',
    'Annual Benefits: $37.5 million',
    'First-Year Costs: $725,000',
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

export function calculateCostBenefit(inputs: CostBenefitInputs): CostBenefitResults {
  const totalBenefits = inputs.numberOfUsers * (inputs.timeSavingsPerUser + inputs.costSavingsPerUser + inputs.housingStabilityBenefit);
  const totalFirstYearCost = inputs.developmentCost + inputs.maintenanceCost;
  const netBenefit = totalBenefits - totalFirstYearCost;
  const benefitCostRatio = totalBenefits / totalFirstYearCost;
  const roiPercentage = (netBenefit / totalFirstYearCost) * 100;
  const paybackPeriodMonths = (totalFirstYearCost / totalBenefits) * 12;
  const fiveYearNpv = netBenefit * 5 - inputs.maintenanceCost * 4; // Simplified NPV calculation

  return {
    totalBenefits,
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

export function generateChartData(inputs: CostBenefitInputs, results: CostBenefitResults) {
  return [
    { year: 'Year 1', benefits: results.totalBenefits, costs: results.totalFirstYearCost },
    { year: 'Year 2', benefits: results.totalBenefits, costs: inputs.maintenanceCost },
    { year: 'Year 3', benefits: results.totalBenefits, costs: inputs.maintenanceCost },
    { year: 'Year 4', benefits: results.totalBenefits, costs: inputs.maintenanceCost },
    { year: 'Year 5', benefits: results.totalBenefits, costs: inputs.maintenanceCost },
  ];
}

export function generateBenefitBreakdown(inputs: CostBenefitInputs) {
  return [
    { name: 'Time Savings', value: inputs.numberOfUsers * inputs.timeSavingsPerUser, color: '#8884d8' },
    { name: 'Cost Savings', value: inputs.numberOfUsers * inputs.costSavingsPerUser, color: '#82ca9d' },
    { name: 'Housing Stability', value: inputs.numberOfUsers * inputs.housingStabilityBenefit, color: '#ffc658' },
  ];
} 