import { useState, useEffect } from "react";
import { InventoryItem, CreateItemData } from "@/types/inventory";
import { AddItemForm } from "./AddItemForm";
import { InventoryTable } from "./InventoryTable";

// Mock data for demonstration - this would be replaced with Supabase
const mockItems: InventoryItem[] = [
  {
    id: "1",
    name: "Tomatoes",
    quantity: 12,
    unit: "pieces",
    lowStockThreshold: 5,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2", 
    name: "Olive Oil",
    quantity: 2.5,
    unit: "liters",
    lowStockThreshold: 1,
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "3",
    name: "Salt",
    quantity: 0,
    unit: "kg",
    lowStockThreshold: 0.5,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "4",
    name: "Pasta",
    quantity: 3,
    unit: "kg",
    lowStockThreshold: 2,
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
];

export function InventoryManager() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    // Load mock data - this would be replaced with Supabase query
    setItems(mockItems);
  }, []);

  const handleAddItem = (itemData: CreateItemData) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: Date.now().toString(), // Simple ID generation - Supabase would handle this
      lastUpdated: new Date(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity, lastUpdated: new Date() }
        : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">Kitchen Inventory Manager</h1>
        <p className="text-muted-foreground">Keep track of your kitchen supplies and never run out of essentials</p>
      </div>

      <AddItemForm onAddItem={handleAddItem} />
      
      <InventoryTable 
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
}