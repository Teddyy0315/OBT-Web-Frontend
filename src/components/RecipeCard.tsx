import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Ingredient = {
  ingredient: {
    id: number;
    name: string;
    ingredient_code: string;
  };
  amount: number;
};

type RecipeCardProps = {
  name: string;
  available: boolean;
  ingredients: Ingredient[];
};

export function RecipeCard({ name, available, ingredients }: RecipeCardProps) {
  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{name}</CardTitle>
          <Badge variant={available ? "default" : "destructive"}>
            {available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {ingredients.map((item, idx) => (
            <li key={idx}>
              <span className="font-medium">{item.ingredient.name}</span> –{" "}
              {item.amount} ml
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
