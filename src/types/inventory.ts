export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  lastUpdated: Date;
}

export type CreateItemData = Omit<InventoryItem, 'id' | 'lastUpdated'>;