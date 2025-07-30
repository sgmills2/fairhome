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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PersonIcon from '@mui/icons-material/Person';
import { 
  CostBenefitInputs, 
  CostBenefitResults, 
  defaultInputs, 
  researchData, 
  calculateCostBenefit, 
  formatCurrency, 
  formatNumber,
  generateChartData
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

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography level="h1" sx={{ mb: 2, color: 'primary.500' }}>
          AHAD Cost-Impact Research
        </Typography>
        <Typography level="body-lg" sx={{ color: 'text.secondary' }}>
          Comprehensive analysis of affordable housing portal investment for Chicago
        </Typography>
      </Box>

      {/* Total Economic Impact Card */}
      <Card variant="soft" color="success" sx={{ mb: 4 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography level="h2" sx={{ mb: 1, color: 'success.500' }}>
            Total Annual Economic Impact
          </Typography>
          <Typography level="h1" sx={{ fontSize: '3rem', fontWeight: 'bold' }}>
            {formatCurrency(results.totalBenefits)}
          </Typography>
          <Typography level="body-lg" sx={{ mt: 1 }}>
            Cost-Impact Ratio: <strong>{results.benefitCostRatio.toFixed(1)}:1</strong> • 
            ROI: <strong>{results.roiPercentage.toFixed(0)}%</strong>
          </Typography>
        </CardContent>
      </Card>

      {/* Segmented Benefits Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={4}>
          <Card variant="soft" color="primary">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography level="title-md">Housing Seekers</Typography>
              </Box>
              <Typography level="h3">{formatCurrency(results.segmentedBenefits.housingSeekersDirectBenefits.subtotal)}</Typography>
              <Typography level="body-sm" sx={{ mt: 1, opacity: 0.8 }}>
                Direct time & cost savings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card variant="soft" color="warning">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VolunteerActivismIcon sx={{ mr: 1 }} />
                <Typography level="title-md">Nonprofit Organizations</Typography>
              </Box>
              <Typography level="h3">{formatCurrency(results.segmentedBenefits.nonprofitOperationalBenefits.subtotal)}</Typography>
              <Typography level="body-sm" sx={{ mt: 1, opacity: 0.8 }}>
                Operational efficiency gains
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} md={4}>
          <Card variant="soft" color="primary">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ mr: 1 }} />
                <Typography level="title-md">City of Chicago</Typography>
              </Box>
              <Typography level="h3">{formatCurrency(results.segmentedBenefits.municipalBenefits.subtotal)}</Typography>
              <Typography level="body-sm" sx={{ mt: 1, opacity: 0.8 }}>
                Reduced costs & increased revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1, color: 'neutral.500' }} />
                <Typography level="title-sm">Annual Users</Typography>
              </Box>
              <Typography level="h4">{formatNumber(inputs.numberOfUsers)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: 'neutral.500' }} />
                <Typography level="title-sm">First-Year Costs</Typography>
              </Box>
              <Typography level="h4">{formatCurrency(results.totalFirstYearCost)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'neutral.500' }} />
                <Typography level="title-sm">Net Benefit</Typography>
              </Box>
              <Typography level="h4">{formatCurrency(results.netBenefit)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InfoIcon sx={{ mr: 1, color: 'neutral.500' }} />
                <Typography level="title-sm">Payback Period</Typography>
              </Box>
              <Typography level="h4">{results.paybackPeriodMonths.toFixed(1)} months</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Interactive Calculator */}
      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level="h4" sx={{ mb: 2 }}>
                Interactive Cost-Impact Calculator
              </Typography>
              
              <Box sx={{ mb: 2 }}>
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

              <Box sx={{ mb: 2 }}>
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

              <Box sx={{ mb: 2 }}>
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

              <Box sx={{ mb: 2 }}>
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

              <Box sx={{ mb: 2 }}>
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

              <Box sx={{ mb: 2 }}>
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
                sx={{ width: '100%', mt: 1 }}
              >
                Reset to Default Values
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ py: 3 }}>
              <Typography level="h4" sx={{ mb: 3 }}>
                Results Summary
              </Typography>
              
              <List size="md" sx={{ '--ListItem-paddingY': '1rem' }}>
                <ListItem>
                  <ListItemDecorator>
                    <CheckCircleIcon color="success" sx={{ fontSize: 'xl' }} />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-md">Total Benefits</Typography>
                    <Typography level="title-sm" sx={{ fontWeight: 'bold', color: 'success.500' }}>{formatCurrency(results.totalBenefits)}</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <WarningIcon color="warning" sx={{ fontSize: 'xl' }} />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-md">First-Year Costs</Typography>
                    <Typography level="title-sm" sx={{ fontWeight: 'bold', color: 'warning.500' }}>{formatCurrency(results.totalFirstYearCost)}</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <TrendingUpIcon color="primary" sx={{ fontSize: 'xl' }} />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-md">Net Benefit</Typography>
                    <Typography level="title-sm" sx={{ fontWeight: 'bold', color: 'primary.500' }}>{formatCurrency(results.netBenefit)}</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <AttachMoneyIcon color="success" sx={{ fontSize: 'xl' }} />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-md">Cost-Impact Ratio</Typography>
                    <Typography level="title-sm" sx={{ fontWeight: 'bold', color: 'success.500' }}>{results.benefitCostRatio.toFixed(1)}:1</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <TrendingUpIcon color="info" sx={{ fontSize: 'xl' }} />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-md">ROI Percentage</Typography>
                    <Typography level="title-sm" sx={{ fontWeight: 'bold', color: 'info.500' }}>{results.roiPercentage.toFixed(1)}%</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <InfoIcon color="primary" sx={{ fontSize: 'xl' }} />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-md">Payback Period</Typography>
                    <Typography level="title-sm" sx={{ fontWeight: 'bold', color: 'primary.500' }}>{results.paybackPeriodMonths.toFixed(1)} months</Typography>
                  </ListItemContent>
                </ListItem>
                <ListItem>
                  <ListItemDecorator>
                    <AttachMoneyIcon color="success" sx={{ fontSize: 'xl' }} />
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="title-md">5-Year NPV</Typography>
                    <Typography level="title-sm" sx={{ fontWeight: 'bold', color: 'success.500' }}>{formatCurrency(results.fiveYearNpv)}</Typography>
                  </ListItemContent>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                10-Year Economic Forecast (with Growth & Inflation)
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value as number)}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="municipalBenefits" 
                    stroke="#ffc658" 
                    name="Municipal Benefits"
                    strokeWidth={3}
                    dot={{ fill: '#ffc658', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="housingSeekersDirectBenefits" 
                    stroke="#8884d8" 
                    name="Housing Seekers"
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="nonprofitOperationalBenefits" 
                    stroke="#82ca9d" 
                    name="Nonprofit Efficiency"
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="costs" 
                    stroke="#ff7c7c" 
                    name="Annual Costs"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#ff7c7c', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2, fontSize: '0.8rem', color: 'text.secondary' }}>
                <Typography level="body-xs" sx={{ mb: 1 }}>
                  <strong>Forecast Assumptions:</strong> 3% inflation, 2.5% wage growth, diminishing returns after Year 3
                </Typography>
                <Typography level="body-xs">
                  Benefits include user growth (5% initially, slowing), cost inflation, and efficiency improvements over time
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Forecast Analysis */}
      <Box sx={{ mt: 4 }}>
        <Accordion>
          <AccordionSummary>
            <Typography level="title-lg">10-Year Economic Forecast Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={4}>
              <Grid xs={12} md={6}>
                <Typography level="title-md" sx={{ mb: 2, color: 'primary.500' }}>
                  Key Trends & Insights
                </Typography>
                <List>
                  <ListItem>
                    <ListItemDecorator>📈</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>Growth Phase (Years 1-3):</strong> Benefits grow due to user adoption, wage increases, and system improvements
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>📊</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>Maturity Phase (Years 4-7):</strong> Diminishing returns as market saturates, but benefits stabilize at higher levels
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>💰</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>Inflation Impact:</strong> Costs grow at 3% annually, but benefits grow faster due to wage increases and user growth
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>🏛️</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>Municipal Benefits:</strong> Remain largest segment due to ongoing encampment cost savings and increased tax revenue
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                </List>
              </Grid>
              
              <Grid xs={12} md={6}>
                <Typography level="title-md" sx={{ mb: 2, color: 'warning.500' }}>
                  Economic Assumptions
                </Typography>
                <List>
                  <ListItem>
                    <ListItemDecorator>💵</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>Inflation Rate:</strong> 3% annually (Federal Reserve target)
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>📊</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>Wage Growth:</strong> 2.5% annually (historical Chicago average)
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>👥</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>User Growth:</strong> 5% initially, slowing over time as market saturates
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>📉</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>Diminishing Returns:</strong> 15% efficiency reduction after Year 3 as easy gains are captured
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>🏠</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">
                        <strong>Housing Placement:</strong> Gradual improvement from 20% to 28% over 10 years
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.50', borderRadius: 'md', border: '1px solid', borderColor: 'warning.200' }}>
              <Typography level="title-sm" sx={{ mb: 1, color: 'warning.700' }}>
                📊 Forecast Methodology
              </Typography>
              <Typography level="body-sm" sx={{ color: 'warning.700' }}>
                This 10-year forecast incorporates realistic economic assumptions including inflation, wage growth, 
                user adoption curves, and diminishing returns. The model assumes benefits don't grow linearly forever—
                after Year 3, efficiency improvements slow as the "low-hanging fruit" is captured. Municipal benefits 
                remain strong due to ongoing encampment cost avoidance, while user-facing benefits grow with wage inflation 
                but plateau as the market matures.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>
            <Typography level="title-lg">Research Methodology & Assumptions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography level="body-md" sx={{ mb: 3 }}>
              This cost-impact analysis uses segmented benefits to show value distribution across stakeholders, 
              based on Chicago-specific data from the Chicago Housing Authority's FY2025 MTW Annual Plan.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid xs={12} md={4}>
                <Typography level="title-sm" sx={{ mb: 1, color: 'primary.500' }}>Housing Seekers</Typography>
                <List size="sm">
                  <ListItem>
                    <ListItemDecorator>•</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">Time savings: 10 hours at $15/hour per user</Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>•</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">Direct cost reductions in applications & travel</Typography>
                    </ListItemContent>
                  </ListItem>
                </List>
              </Grid>
              
              <Grid xs={12} md={4}>
                <Typography level="title-sm" sx={{ mb: 1, color: 'warning.500' }}>Nonprofit Organizations</Typography>
                <List size="sm">
                  <ListItem>
                    <ListItemDecorator>•</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">Staff efficiency: $30/hour for case workers</Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>•</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">25% of users receive nonprofit assistance</Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>•</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">8 hours average per housing search case</Typography>
                    </ListItemContent>
                  </ListItem>
                </List>
              </Grid>
              
              <Grid xs={12} md={4}>
                <Typography level="title-sm" sx={{ mb: 1, color: 'info.500' }}>City of Chicago</Typography>
                <List size="sm">
                  <ListItem>
                    <ListItemDecorator>•</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">$20M annual encampment cleanup costs</Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>•</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">15% tax rate on increased income</Typography>
                    </ListItemContent>
                  </ListItem>
                  <ListItem>
                    <ListItemDecorator>•</ListItemDecorator>
                    <ListItemContent>
                      <Typography level="body-sm">20% achieve faster housing placement</Typography>
                    </ListItemContent>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>
            <Typography level="title-lg">Detailed Benefit Analysis by Stakeholder</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* Housing Seekers */}
              <Grid xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.500' }} />
                      <Typography level="title-md">Housing Seekers</Typography>
                    </Box>
                    <List size="sm">
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Time Savings</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.housingSeekersDirectBenefits.timeSavings)}</Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Application Cost Savings</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.housingSeekersDirectBenefits.applicationCostSavings)}</Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Transportation Savings</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.housingSeekersDirectBenefits.transportationSavings)}</Typography>
                        </ListItemContent>
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography level="title-sm">
                        Subtotal: {formatCurrency(results.segmentedBenefits.housingSeekersDirectBenefits.subtotal)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Nonprofit Organizations */}
              <Grid xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <VolunteerActivismIcon sx={{ mr: 1, color: 'warning.500' }} />
                      <Typography level="title-md">Nonprofit Organizations</Typography>
                    </Box>
                    <List size="sm">
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Caseload Efficiency (@$30/hr)</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.nonprofitOperationalBenefits.caseloadEfficiency)}</Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Reduced Duplicate Efforts</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.nonprofitOperationalBenefits.reducedDuplicateEfforts)}</Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Improved Outcomes</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.nonprofitOperationalBenefits.improvedOutcomes)}</Typography>
                        </ListItemContent>
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography level="title-sm">
                        Subtotal: {formatCurrency(results.segmentedBenefits.nonprofitOperationalBenefits.subtotal)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* City of Chicago */}
              <Grid xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccountBalanceIcon sx={{ mr: 1, color: 'info.500' }} />
                      <Typography level="title-md">City of Chicago</Typography>
                    </Box>
                    <List size="sm">
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Reduced Encampment Costs</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.municipalBenefits.reducedEncampmentCosts)}</Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Increased Tax Revenue</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.municipalBenefits.increasedTaxRevenue)}</Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Emergency Services Savings</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.municipalBenefits.reducedEmergencyServiceCosts)}</Typography>
                        </ListItemContent>
                      </ListItem>
                      <ListItem>
                        <ListItemContent>
                          <Typography level="body-sm">Healthcare Cost Reductions</Typography>
                          <Typography level="title-sm">{formatCurrency(results.segmentedBenefits.municipalBenefits.reducedHealthcareCosts)}</Typography>
                        </ListItemContent>
                      </ListItem>
                    </List>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography level="title-sm">
                        Subtotal: {formatCurrency(results.segmentedBenefits.municipalBenefits.subtotal)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

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
    </Box>
  );
}

export default ResearchPage; 