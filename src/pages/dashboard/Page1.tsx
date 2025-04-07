import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";

type Ingredient = {
  ingredient: {
    id: number;
    name: string;
    ingredient_code: string;
  };
  amount: number;
};

type Recipe = {
  id: number;
  name: string;
  available: boolean;
  ingredients: Ingredient[];
};

export default function Page1() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecipes() {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://api.odensebartech.com/api/v1/recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch recipes");

        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading recipes...
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Recipes</h1>
        <Button onClick={() => navigate("/dashboard/create-recipe")}>
          + Create New Recipe
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id} // ✅ this was missing
            name={recipe.name}
            available={recipe.available}
            ingredients={recipe.ingredients}
          />
        ))}
      </div>
    </div>
  );
}
