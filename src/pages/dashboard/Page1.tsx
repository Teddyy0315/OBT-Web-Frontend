import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import Cookies from "js-cookie";

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

  if (loading) return <div className="p-4">Loading recipes...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          name={recipe.name}
          available={recipe.available}
          ingredients={recipe.ingredients}
        />
      ))}
    </div>
  );
}
