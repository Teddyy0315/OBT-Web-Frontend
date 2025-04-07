import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Ingredient = {
  id: number;
  name: string;
  ingredient_code: string;
};

export default function Page2() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

    fetchIngredients();
  }, []);

  if (loading) return <div className="p-4">Loading ingredients...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Ingredients</h1>
      <div className="overflow-auto border rounded-lg shadow-sm">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-2 font-medium">ID</th>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">Code</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient.id} className="border-t">
                <td className="px-4 py-2">{ingredient.id}</td>
                <td className="px-4 py-2">{ingredient.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  {ingredient.ingredient_code}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
