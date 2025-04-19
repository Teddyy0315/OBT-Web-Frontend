import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { IndeterminateCheckbox } from "@/components/ui/indeterminate-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type Ingredient = {
  id: number;
  name: string;
  ingredient_code: string;
};

export default function Page2() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const isAllSelected = selectedIds.length === ingredients.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < ingredients.length;

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  async function fetchIngredients() {
    const token = Cookies.get("access_token");
    if (!token) {
      console.error("No access token found");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://api.odensebartech.com/api/v1/ingredients",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch ingredients");

      const data = await res.json();
      setIngredients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    if (isAllSelected || isIndeterminate) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ingredients.map((i) => i.id));
    }
  }

  async function handleDeleteSelected() {
    const token = Cookies.get("access_token");

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`http://api.odensebartech.com/api/v1/ingredients/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      toast.success("Ingredients deleted");
      await fetchIngredients();
      setSelectedIds([]);
      setConfirmDelete(false);
    } catch (err) {
      toast.error("Failed to delete selected ingredients");
    }
  }

  async function handleCreateIngredient() {
    const token = Cookies.get("access_token");

    try {
      const res = await fetch(
        "http://api.odensebartech.com/api/v1/ingredients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newName, ingredient_code: newCode }),
        }
      );

      if (!res.ok) throw new Error("Failed to create ingredient");

      toast.success("Ingredient created");
      setNewName("");
      setNewCode("");
      setCreating(false);
      await fetchIngredients();
    } catch (err: any) {
      toast.error("Error creating ingredient", {
        description: err.message,
      });
    }
  }

  if (loading) return <div className="p-4">Loading ingredients...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Ingredients</h1>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedIds.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p>
                  This will permanently delete {selectedIds.length}{" "}
                  ingredient(s).
                </p>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteSelected}>
                    Confirm Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4" />
                Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Ingredient</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Ingredient name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  placeholder="Ingredient code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateIngredient}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-auto border rounded-lg shadow-sm">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="w-10 text-center px-2 py-2">
                <IndeterminateCheckbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="text-left px-4 py-2 font-medium">ID</th>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">Code</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => {
              const selected = selectedIds.includes(ingredient.id);
              return (
                <tr
                  key={ingredient.id}
                  className={selected ? "bg-accent/40" : ""}
                  onClick={() => toggleSelect(ingredient.id)}
                >
                  <td className="text-center px-2 py-2">
                    <Checkbox checked={selected} />
                  </td>
                  <td className="px-4 py-2">{ingredient.id}</td>
                  <td className="px-4 py-2">{ingredient.name}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                    {ingredient.ingredient_code}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
