
export interface PricingData {
  monthly: number;
  unit: string;
}

export const PRICING_ESTIMATES: Record<string, PricingData> = {
  'aws_instance': { monthly: 8.50, unit: 't2.micro instance' },
  'aws_s3_bucket': { monthly: 0.023, unit: 'per GB (est. avg)' },
  'azurerm_virtual_machine': { monthly: 15.00, unit: 'Basic B1s' },
  'google_compute_instance': { monthly: 7.00, unit: 'e2-micro' },
  'module': { monthly: 25.00, unit: 'Complex Module (est)' },
  'vsphere_virtual_machine': { monthly: 0, unit: 'On-premise' },
  'proxmox_vm_qemu': { monthly: 0, unit: 'On-premise' },
  'local_file': { monthly: 0, unit: 'Local' },
  'alicloud_instance': { monthly: 6.50, unit: 'ecs.t5-lc1m1.small' },
  'huaweicloud_compute_instance': { monthly: 7.20, unit: 's6.small.1' },
  'sangfor_vm': { monthly: 0, unit: 'On-premise HCI' },
};

export function calculateMonthlyCost(resources: any[]): number {
  return resources.reduce((total, res) => {
    const pricing = PRICING_ESTIMATES[res.type] || { monthly: 0 };
    return total + pricing.monthly;
  }, 0);
}
