export interface PricingBreakdown {
  hourly: number;
  daily: number;
  monthly: number;
}

export interface PricingCurrency {
  usd: PricingBreakdown;
  idr: PricingBreakdown;
}

const USD_TO_IDR = 16250; // Current approx conversion rate

function createBreakdown(monthlyUsd: number): PricingCurrency {
  const dailyUsd = monthlyUsd / 30;
  const hourlyUsd = dailyUsd / 24;

  return {
    usd: {
      hourly: hourlyUsd,
      daily: dailyUsd,
      monthly: monthlyUsd
    },
    idr: {
      hourly: hourlyUsd * USD_TO_IDR,
      daily: dailyUsd * USD_TO_IDR,
      monthly: monthlyUsd * USD_TO_IDR
    }
  };
}

export const PRICING_ESTIMATES: Record<string, PricingCurrency> = {
  'aws_instance': createBreakdown(8.50),
  'aws_s3_bucket': createBreakdown(2.50), // base est for small storage
  'azurerm_virtual_machine': createBreakdown(15.00),
  'google_compute_instance': createBreakdown(7.20),
  'module': createBreakdown(25.00),
  'vsphere_virtual_machine': createBreakdown(0),
  'proxmox_vm_qemu': createBreakdown(0),
  'local_file': createBreakdown(0),
  'alicloud_instance': createBreakdown(6.50),
  'huaweicloud_compute_instance': createBreakdown(7.10),
  'sangfor_vm': createBreakdown(0),
  'kubernetes_deployment': createBreakdown(12.00), // average cluster overhead per deployment
  'kubernetes_service': createBreakdown(5.00),
};

export function calculateTotalCost(resources: any[]): PricingCurrency {
  const totalMonthlyUsd = resources.reduce((total, res) => {
    const pricing = PRICING_ESTIMATES[res.type] || createBreakdown(0);
    return total + pricing.usd.monthly;
  }, 0);

  return createBreakdown(totalMonthlyUsd);
}
