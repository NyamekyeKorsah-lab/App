import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/types/inventory";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash2, Package } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDeleteItem: (id: string) => void;
}

export function InventoryTable({ items, onUpdateQuantity, onDeleteItem }: InventoryTableProps) {
  const [restockAmounts, setRestockAmounts] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) return { status: "out", label: "Out of Stock", variant: "destructive" as const };
    if (item.quantity <= item.lowStockThreshold) return { status: "low", label: "Low Stock", variant: "default" as const };
    return { status: "good", label: "In Stock", variant: "secondary" as const };
  };

  const handleUse = (item: InventoryItem) => {
    if (item.quantity <= 0) {
      toast({
        title: "Cannot Use Item",
        description: "This item is out of stock.",
        variant: "destructive",
      });
      return;
    }
    onUpdateQuantity(item.id, Math.max(0, item.quantity - 1));
    toast({
      description: `Used 1 ${item.unit} of ${item.name}`,
    });
  };

  const handleRestock = (item: InventoryItem) => {
    const amount = parseFloat(restockAmounts[item.id] || "1");
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Restock amount must be greater than 0.",
        variant: "destructive",
      });
      return;
    }
    onUpdateQuantity(item.id, item.quantity + amount);
    setRestockAmounts({ ...restockAmounts, [item.id]: "" });
    toast({
      description: `Restocked ${amount} ${item.unit} of ${item.name}`,
    });
  };

  const handleDelete = (item: InventoryItem) => {
    onDeleteItem(item.id);
    toast({
      description: `${item.name} removed from inventory`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No items in inventory</h3>
          <p className="text-muted-foreground">Add your first item to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Kitchen Inventory ({items.length} items)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const stockInfo = getStockStatus(item);
                return (
                  <TableRow 
                    key={item.id} 
                    className={stockInfo.status === "out" ? "bg-destructive/5" : stockInfo.status === "low" ? "bg-warning/5" : ""}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <span className={stockInfo.status === "out" ? "text-destructive font-semibold" : ""}>
                        {item.quantity} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockInfo.variant} className={
                        stockInfo.status === "out" ? "bg-destructive text-destructive-foreground" :
                        stockInfo.status === "low" ? "bg-warning text-warning-foreground" : ""
                      }>
                        {stockInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(item.lastUpdated)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUse(item)}
                          disabled={item.quantity <= 0}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Restock {item.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Amount to add</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  placeholder="1"
                                  value={restockAmounts[item.id] || ""}
                                  onChange={(e) => setRestockAmounts({ ...restockAmounts, [item.id]: e.target.value })}
                                />
                              </div>
                              <Button onClick={() => handleRestock(item)} className="w-full">
                                Add to Stock
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}