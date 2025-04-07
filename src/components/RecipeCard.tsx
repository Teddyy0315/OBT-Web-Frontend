import { useNavigate } from "react-router-dom";

type Ingredient = {
  ingredient: {
    id: number;
    name: string;
    ingredient_code: string;
  };
  amount: number;
};

type RecipeCardProps = {
  id: number;
  name: string;
  available: boolean;
  ingredients: Ingredient[];
};

export function RecipeCard({
  id,
  name,
  available,
  ingredients,
}: RecipeCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onDoubleClick={() => navigate(`/dashboard/recipe/${id}`)}
      className="cursor-pointer w-full max-w-sm shadow-md p-4 h-64 flex flex-col justify-between rounded-lg border bg-white hover:shadow-lg transition"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${
            available
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
      </div>
      <ul className="text-sm overflow-auto flex-1 space-y-1">
        {ingredients.map((item, idx) => (
          <li key={idx}>
            <span className="font-medium">{item.ingredient.name}</span> –{" "}
            {item.amount} ml
          </li>
        ))}
      </ul>
    </div>
  );
}
