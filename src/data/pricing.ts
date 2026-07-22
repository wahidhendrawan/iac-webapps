export interface PricingBreakdown {
  hourly: number;
  daily: number;
  monthly: number;
}

export interface PricingCurrency {
  usd: PricingBreakdown;
  idr: PricingBreakdown;
}

export function createBreakdown(monthlyUsd: number, exchangeRate: number = 16250): PricingCurrency {
  const dailyUsd = monthlyUsd / 30;
  const hourlyUsd = dailyUsd / 24;

  return {
    usd: {
      hourly: hourlyUsd,
      daily: dailyUsd,
      monthly: monthlyUsd
    },
    idr: {
      hourly: hourlyUsd * exchangeRate,
      daily: dailyUsd * exchangeRate,
      monthly: monthlyUsd * exchangeRate
    }
  };
}

export const getPricingEstimates = (exchangeRate: number = 16250): Record<string, PricingCurrency> => ({
  'aws_instance': createBreakdown(8.50, exchangeRate),
  'aws_s3_bucket': createBreakdown(2.50, exchangeRate),
  'azurerm_virtual_machine': createBreakdown(15.00, exchangeRate),
  'google_compute_instance': createBreakdown(7.20, exchangeRate),
  'module': createBreakdown(25.00, exchangeRate),
  'vsphere_virtual_machine': createBreakdown(0, exchangeRate),
  'proxmox_vm_qemu': createBreakdown(0, exchangeRate),
  'local_file': createBreakdown(0, exchangeRate),
  'alicloud_instance': createBreakdown(6.50, exchangeRate),
  'huaweicloud_compute_instance': createBreakdown(7.10, exchangeRate),
  'sangfor_vm': createBreakdown(0, exchangeRate),
  'kubernetes_deployment': createBreakdown(12.00, exchangeRate),
  'kubernetes_service': createBreakdown(5.00, exchangeRate),
});

export function calculateTotalCost(resources: Array<{ type: string }>, exchangeRate: number = 16250): PricingCurrency {
  const estimates = getPricingEstimates(exchangeRate);
  const totalMonthlyUsd = resources.reduce((total, res) => {
    const pricing = estimates[res.type] || createBreakdown(0, exchangeRate);
    return total + pricing.usd.monthly;
  }, 0);

  return createBreakdown(totalMonthlyUsd, exchangeRate);
}
