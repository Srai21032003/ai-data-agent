// This service provides sample data for the mock implementation
export const generateSampleData = (type: string): any[] => {
  switch (type) {
    case 'topProducts':
      return [
        { product: 'Smart TVs', revenue: 2500000 },
        { product: 'Wireless Headphones', revenue: 1800000 },
        { product: 'Laptop Computers', revenue: 1650000 },
        { product: 'Smartphones', revenue: 1450000 },
        { product: 'Fitness Trackers', revenue: 980000 }
      ];
      
    case 'retentionByRegion':
      return [
        { region: 'Northeast', retention_rate: 78 },
        { region: 'West', retention_rate: 72 },
        { region: 'Midwest', retention_rate: 65 },
        { region: 'South', retention_rate: 59 }
      ];
      
    case 'revenueGrowth':
      return [
        { department: 'Technology', revenue_2023: 8200000, revenue_2022: 6450000, growth_percentage: 27.1 },
        { department: 'Beauty', revenue_2023: 4100000, revenue_2022: 3560000, growth_percentage: 15.2 },
        { department: 'Home Goods', revenue_2023: 5650000, revenue_2022: 5040000, growth_percentage: 12.1 },
        { department: 'Apparel', revenue_2023: 7200000, revenue_2022: 6650000, growth_percentage: 8.3 },
        { department: 'Outdoors', revenue_2023: 3180000, revenue_2022: 3080000, growth_percentage: 3.2 },
        { department: 'Food & Beverage', revenue_2023: 2850000, revenue_2022: 2910000, growth_percentage: -2.1 }
      ];
      
    case 'marketingROI':
      return [
        { channel: 'Social Media', spend_amount: 450000, roi_percent: 320, performance_category: 'High Performer' },
        { channel: 'Email Marketing', spend_amount: 120000, roi_percent: 275, performance_category: 'High Performer' },
        { channel: 'Search Engine', spend_amount: 380000, roi_percent: 210, performance_category: 'High Performer' },
        { channel: 'Content Marketing', spend_amount: 250000, roi_percent: 175, performance_category: 'Average' },
        { channel: 'Influencer', spend_amount: 310000, roi_percent: 160, performance_category: 'Average' },
        { channel: 'Television', spend_amount: 820000, roi_percent: 95, performance_category: 'Underperformer' },
        { channel: 'Radio', spend_amount: 280000, roi_percent: 85, performance_category: 'Underperformer' },
        { channel: 'Print', spend_amount: 190000, roi_percent: 65, performance_category: 'Underperformer' }
      ];
      
    case 'salesForecast':
      return [
        { month: 'July', previous_sales: 3850000, forecasted_sales: 4620000 },
        { month: 'August', previous_sales: 3920000, forecasted_sales: 4700000 },
        { month: 'September', previous_sales: 3780000, forecasted_sales: 4350000 },
        { month: 'October', previous_sales: 3650000, forecasted_sales: 4100000 },
        { month: 'November', previous_sales: 4250000, forecasted_sales: 4850000 },
        { month: 'December', previous_sales: 5120000, forecasted_sales: 6240000 }
      ];
      
    case 'customerSegments':
      return [
        { segment_name: 'Premium Subscribers', customer_count: 12500, percentage: 15.2, avg_ltv: 4200, avg_cac: 320, churn_rate: 5.3 },
        { segment_name: 'Frequent Shoppers', customer_count: 23400, percentage: 28.5, avg_ltv: 2800, avg_cac: 180, churn_rate: 12.1 },
        { segment_name: 'Digital Natives', customer_count: 8700, percentage: 10.6, avg_ltv: 1650, avg_cac: 85, churn_rate: 18.4 },
        { segment_name: 'Occasional Buyers', customer_count: 34600, percentage: 42.1, avg_ltv: 950, avg_cac: 130, churn_rate: 25.7 },
        { segment_name: 'Legacy Customers', customer_count: 2900, percentage: 3.5, avg_ltv: 1850, avg_cac: 210, churn_rate: 8.9 }
      ];
      
    case 'inventoryTurnover':
      return [
        { category: 'Electronics', inventory_turnover: 12.4, avg_days_in_inventory: 29, current_inventory_value: 1850000 },
        { category: 'Fashion Apparel', inventory_turnover: 8.7, avg_days_in_inventory: 42, current_inventory_value: 2730000 },
        { category: 'Seasonal Items', inventory_turnover: 6.8, avg_days_in_inventory: 54, current_inventory_value: 1230000 },
        { category: 'Kitchen & Dining', inventory_turnover: 5.4, avg_days_in_inventory: 68, current_inventory_value: 980000 },
        { category: 'Home Goods', inventory_turnover: 4.2, avg_days_in_inventory: 87, current_inventory_value: 1640000 },
        { category: 'Luxury Products', inventory_turnover: 3.5, avg_days_in_inventory: 104, current_inventory_value: 1580000 }
      ];
      
    default:
      return [];
  }
};