import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Ingredient = {
  ingredient: {
    name: string;
    ingredient_code: string;
    id: number;
  };
  amount: number;
};

type Recipe = {
  id: number;
  name: string;
  available: boolean;
  ingredients: Ingredient[];
};

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecipe() {
      const token = Cookies.get("access_token");
      const res = await fetch(
        `http://api.odensebartech.com/api/v1/recipes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setRecipe(data);
      setLoading(false);
    }

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    const token = Cookies.get("access_token");
    try {
      const res = await fetch(
        `http://api.odensebartech.com/api/v1/recipes/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Recipe deleted");
      navigate("/dashboard/page1");
    } catch (err: any) {
      toast.error("Delete failed", {
        description: err.message,
      });
    }
  };

  if (loading) return <div className="p-6">Loading recipe...</div>;
  if (!recipe) return <div className="p-6">Recipe not found.</div>;

  return (
    <div className="p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">{recipe.name}</h1>
        <Badge variant={recipe.available ? "default" : "destructive"}>
          {recipe.available ? "Available" : "Unavailable"}
        </Badge>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-2">Ingredients</h2>
        <ul className="space-y-1 text-sm">
          {recipe.ingredients.map((item, idx) => (
            <li key={idx}>
              <span className="font-medium">{item.ingredient.name}</span> –{" "}
              {item.amount} ml
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Recipe</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The recipe will be permanently
                deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
