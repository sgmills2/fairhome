import { useState, useMemo } from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Grid from '@mui/joy/Grid';
import Slider from '@mui/joy/Slider';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Accordion from '@mui/joy/Accordion';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionDetails from '@mui/joy/AccordionDetails';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { 
  CostBenefitInputs, 
  CostBenefitResults, 
  defaultInputs, 
  researchData, 
  calculateCostBenefit, 
  formatCurrency, 
  formatNumber,
  generateChartData,
  generateBenefitBreakdown
} from '../services/research';

function ResearchPage() {
  const [inputs, setInputs] = useState<CostBenefitInputs>(defaultInputs);

  const results = useMemo((): CostBenefitResults => {
    return calculateCostBenefit(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof CostBenefitInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const chartData = useMemo(() => generateChartData(inputs, results), [inputs, results]);
  const benefitBreakdown = useMemo(() => generateBenefitBreakdown(inputs), [inputs]);

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography level="h1" sx={{ mb: 2, color: 'primary.500' }}>
          AFairHome.org Cost-Benefit Research
        </Typography>
        <Typography level="body-lg" sx={{ color: 'text.secondary' }}>
          Comprehensive analysis of affordable housing portal investment for Chicago
        </Typography>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="soft" color="primary">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1 }} />
                <Typography level="title-sm">Total Benefits</Typography>
              </Box>
              <Typography level="h3">{formatCurrency(results.totalBenefits)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="soft" color="success">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography level="title-sm">Benefit-Cost Ratio</Typography>
              </Box>
              <Typography level="h3">{results.benefitCostRatio.toFixed(1)}:1</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="soft" color="warning">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography level="title-sm">Annual Users</Typography>
              </Box>
              <Typography level="h3">{formatNumber(inputs.numberOfUsers)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="soft" color="primary">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HomeIcon sx={{ mr: 1 }} />
                <Typography level="title-sm">ROI</Typography>
              </Box>
              <Typography level="h3">{results.roiPercentage.toFixed(0)}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Interactive Calculator */}
      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 3 }}>
                Interactive Cost-Benefit Calculator
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Number of Users: {formatNumber(inputs.numberOfUsers)}
                </Typography>
                <Slider
                  value={inputs.numberOfUsers}
                  onChange={(_, value) => handleInputChange('numberOfUsers', value as number)}
                  min={10000}
                  max={100000}
                  step={5000}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Time Savings per User: {formatCurrency(inputs.timeSavingsPerUser)}
                </Typography>
                <Slider
                  value={inputs.timeSavingsPerUser}
                  onChange={(_, value) => handleInputChange('timeSavingsPerUser', value as number)}
                  min={50}
                  max={300}
                  step={25}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Cost Savings per User: {formatCurrency(inputs.costSavingsPerUser)}
                </Typography>
                <Slider
                  value={inputs.costSavingsPerUser}
                  onChange={(_, value) => handleInputChange('costSavingsPerUser', value as number)}
                  min={50}
                  max={200}
                  step={25}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Housing Stability Benefit: {formatCurrency(inputs.housingStabilityBenefit)}
                </Typography>
                <Slider
                  value={inputs.housingStabilityBenefit}
                  onChange={(_, value) => handleInputChange('housingStabilityBenefit', value as number)}
                  min={200}
                  max={1000}
                  step={100}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Development Cost: {formatCurrency(inputs.developmentCost)}
                </Typography>
                <Input
                  type="number"
                  value={inputs.developmentCost}
                  onChange={(e) => handleInputChange('developmentCost', Number(e.target.value))}
                  startDecorator="$"
                  sx={{ width: '100%' }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography level="title-sm" sx={{ mb: 1 }}>
                  Annual Maintenance Cost: {formatCurrency(inputs.maintenanceCost)}
                </Typography>
                <Input
                  type="number"
                  value={inputs.maintenanceCost}
                  onChange={(e) => handleInputChange('maintenanceCost', Number(e.target.value))}
                  startDecorator="$"
                  sx={{ width: '100%' }}
                />
              </Box>

              <Button
                variant="soft"
                onClick={() => setInputs(defaultInputs)}
                sx={{ width: '100%' }}
              >
                Reset to Default Values
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 3 }}>
                Results Summary
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemDecorator>
                    <CheckCircleIcon color="success" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-sm">Total Benefits</Typography>
                    <Typography level="body-sm">{formatCurrency(results.totalBenefits)}</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <WarningIcon color="warning" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-sm">First-Year Costs</Typography>
                    <Typography level="body-sm">{formatCurrency(results.totalFirstYearCost)}</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <TrendingUpIcon color="primary" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-sm">Net Benefit</Typography>
                    <Typography level="body-sm">{formatCurrency(results.netBenefit)}</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <AttachMoneyIcon color="success" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-sm">Benefit-Cost Ratio</Typography>
                    <Typography level="body-sm">{results.benefitCostRatio.toFixed(1)}:1</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <TrendingUpIcon color="info" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-sm">ROI Percentage</Typography>
                    <Typography level="body-sm">{results.roiPercentage.toFixed(1)}%</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <InfoIcon color="primary" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-sm">Payback Period</Typography>
                    <Typography level="body-sm">{results.paybackPeriodMonths.toFixed(1)} months</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <AttachMoneyIcon color="success" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-sm">5-Year NPV</Typography>
                    <Typography level="body-sm">{formatCurrency(results.fiveYearNpv)}</Typography>
                  </ListItemContent>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                5-Year Benefits vs Costs
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(value as number)} />
                  <Line type="monotone" dataKey="benefits" stroke="#8884d8" name="Benefits" />
                  <Line type="monotone" dataKey="costs" stroke="#82ca9d" name="Costs" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Benefit Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={benefitBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {benefitBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Research Data */}
      <Box sx={{ mt: 4 }}>
        <Accordion>
          <AccordionSummary>
            <Typography level="title-lg">Chicago Housing Authority Data</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="title-sm">Site-Based Family Housing</Typography>
                    <Typography level="h4">{formatNumber(researchData.chaWaitlists.siteBasedFamily)}</Typography>
                    <Typography level="body-sm">households on waitlist</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="title-sm">Community Area Scattered Sites</Typography>
                    <Typography level="h4">{formatNumber(researchData.chaWaitlists.communityAreaScattered)}</Typography>
                    <Typography level="body-sm">households on waitlist</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="title-sm">Site-Based Senior</Typography>
                    <Typography level="h4">{formatNumber(researchData.chaWaitlists.siteBasedSenior)}</Typography>
                    <Typography level="body-sm">households on waitlist</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="title-sm">Project-Based Vouchers</Typography>
                    <Typography level="h4">{formatNumber(researchData.chaWaitlists.projectBasedVouchers)}</Typography>
                    <Typography level="body-sm">households on waitlist</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="title-sm">Community-Wide Vouchers</Typography>
                    <Typography level="h4">{formatNumber(researchData.chaWaitlists.communityWideVouchers)}</Typography>
                    <Typography level="body-sm">households on waitlist</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>
            <Typography level="title-lg">Key Findings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {researchData.keyFindings.map((finding, index) => (
                <ListItem key={index}>
                  <ListItemDecorator>
                    <CheckCircleIcon color="success" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="body-sm">{finding}</Typography>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>
            <Typography level="title-lg">Data Sources & Citations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {researchData.dataSources.map((source, index) => (
                <ListItem key={index}>
                  <ListItemDecorator>
                    <InfoIcon color="primary" />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="body-sm">{source}</Typography>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Methodology */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography level="h4" sx={{ mb: 2 }}>
            Research Methodology
          </Typography>
          <Typography level="body-md" sx={{ mb: 2 }}>
            This cost-benefit analysis is based on conservative assumptions and Chicago-specific data from the Chicago Housing Authority's FY2025 MTW Annual Plan. The analysis incorporates:
          </Typography>
          <List>
            <ListItem>
              <ListItemDecorator>•</ListItemDecorator>
              <ListItemContent>
                <Typography level="body-sm">
                  <strong>User Base:</strong> 25% of waitlist households (50,000 users) use the website annually
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemDecorator>•</ListItemDecorator>
              <ListItemContent>
                <Typography level="body-sm">
                  <strong>Time Savings:</strong> 10 hours saved per user at $15/hour = $150 value
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemDecorator>•</ListItemDecorator>
              <ListItemContent>
                <Typography level="body-sm">
                  <strong>Cost Savings:</strong> $100 per user (transportation + application fees)
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemDecorator>•</ListItemDecorator>
              <ListItemContent>
                <Typography level="body-sm">
                  <strong>Housing Stability:</strong> 20% achieve faster housing placement → $2,500 additional annual income
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemDecorator>•</ListItemDecorator>
              <ListItemContent>
                <Typography level="body-sm">
                  <strong>Development Cost:</strong> $625,000 (midpoint of $500K-$750K budget)
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemDecorator>•</ListItemDecorator>
              <ListItemContent>
                <Typography level="body-sm">
                  <strong>Maintenance:</strong> $100,000 annually
                </Typography>
              </ListItemContent>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResearchPage; 