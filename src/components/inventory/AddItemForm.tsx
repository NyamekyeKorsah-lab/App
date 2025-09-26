import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateItemData } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";

interface AddItemFormProps {
  onAddItem: (item: CreateItemData) => void;
}

const commonUnits = ["pieces", "kg", "g", "liters", "ml", "cups", "tbsp", "tsp", "cans", "bottles"];

export function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    lowStockThreshold: "5",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.quantity || !formData.unit) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseFloat(formData.quantity);
    const threshold = parseFloat(formData.lowStockThreshold);

    if (quantity < 0 || threshold < 0) {
      toast({
        title: "Invalid Values",
        description: "Quantity and threshold must be positive numbers.",
        variant: "destructive",
      });
      return;
    }

    onAddItem({
      name: formData.name.trim(),
      quantity,
      unit: formData.unit,
      lowStockThreshold: threshold,
    });

    setFormData({ name: "", quantity: "", unit: "", lowStockThreshold: "5" });
    
    toast({
      title: "Item Added",
      description: `${formData.name} has been added to inventory.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Tomatoes"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Initial Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {commonUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Low Stock Threshold</Label>
              <Input
                id="threshold"
                type="number"
                step="0.1"
                min="0"
                placeholder="5"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Item to Inventory
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}