import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Calculator } from "lucide-react";
import { itemService, Item, ApiItem } from "@/services/item.service";
import toast from "react-hot-toast";

const ExpenseCalculator = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "", quantity: 1, price: 0, total: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    const newId = Math.max(...items.map((item) => item.id || 0)) + 1;
    setItems([
      ...items,
      { id: newId, name: "", quantity: 1, price: 0, total: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const isSaveDisabled = items.some(
    (item) => !item.name.trim() || item.price <= 0
  );

  const updateItem = (id: number, field: keyof Item, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          if (field === "quantity" || field === "price") {
            updatedItem.total = updatedItem.quantity * updatedItem.price;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const handlePriceChange = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const parsedValue = Number(e.target.value);
    updateItem(id, "price", isNaN(parsedValue) ? 0 : parsedValue);
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleSave = async () => {
    try {
      setLoading(true);
      const savedItems: ApiItem[] = await itemService.createItems(items);
      toast.success("Items saved successfully!");
      setItems([{ id: 1, name: "", quantity: 1, price: 0, total: 0 }]);
      console.log("Saved items from backend:", savedItems);
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Calculator className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Expense Calculator
          </h1>
        </div>
        <p className="text-muted-foreground">
          "सत्यम् शिवम् सुन्दरम्" - May your expenses be blessed with truth and prosperity
        </p>
      </div>

      {/* Add Item */}
      <div className="mb-6 flex justify-center items-center gap-4">
        <Button
          onClick={addItem}
          className="gradient-primary shadow-warm"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
        </Button>
        <div className="text-xl text-muted-foreground">
          Total Items:{" "}
          <span className="font-bold text-primary">{items.length}</span>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-6 shadow-soft hover:shadow-warm transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              {/* Item Name */}
              <div className="md:col-span-2">
                <Label htmlFor={`name-${item.id}`} className="text-sm font-medium">
                  Item Name
                </Label>
                <Input
                  id={`name-${item.id}`}
                  placeholder="Enter item name"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  className="border-primary/20 focus:ring-primary"
                />
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor={`quantity-${item.id}`} className="text-sm font-medium">
                  Quantity
                </Label>
                <Input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                  }
                  className="border-primary/20 focus:ring-primary"
                />
              </div>

              {/* Price */}
              <div>
                <Label htmlFor={`price-${item.id}`} className="text-sm font-medium">
                  Price (₹)
                </Label>
                <Input
                  id={`price-${item.id}`}
                  type="number"
                  min="0"
                  step="1"
                  value={item.price || ""}
                  onChange={(e) => handlePriceChange(item.id, e)}
                  className="border-primary/20 focus:ring-primary"
                />
              </div>

              {/* Total */}
              <div>
                <Label className="text-sm font-medium">Total (₹)</Label>
                <div className="h-10 flex items-center justify-center bg-muted rounded-lg border font-semibold text-primary">
                  ₹{item.total.toFixed(2)}
                </div>
              </div>

              {/* Remove */}
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="border-destructive/20 hover:bg-destructive/10 hover:border-destructive"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Grand Total */}
      <Card className="p-8 gradient-subtle border-primary/20 shadow-glow">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Grand Total
            </h2>
            <div className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
              ₹{grandTotal.toFixed(2)}
            </div>
            <p className="text-muted-foreground mt-2">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Button
            size="lg"
            className="gradient"
            disabled={isSaveDisabled || loading}
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExpenseCalculator;
