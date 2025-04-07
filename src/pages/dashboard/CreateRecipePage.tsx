import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Cookies from "js-cookie";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IngredientOption = {
  id: number;
  name: string;
  ingredient_code: string;
};

type IngredientForm = {
  ingredient_code: string;
  amount: number;
};

type FormData = {
  name: string;
  available: boolean;
  ingredients: IngredientForm[];
};

export default function CreateRecipePage() {
  const [ingredientOptions, setIngredientOptions] = useState<
    IngredientOption[]
  >([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      available: true,
      ingredients: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  useEffect(() => {
    async function fetchIngredients() {
      const token = Cookies.get("access_token");
      const res = await fetch(
        "http://api.odensebartech.com/api/v1/ingredients",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setIngredientOptions(data);
    }

    fetchIngredients();
  }, []);

  const onSubmit = async (data: FormData) => {
    const token = Cookies.get("access_token");

    try {
      const res = await fetch("http://api.odensebartech.com/api/v1/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create recipe");

      toast.success("Recipe created", {
        description: `Recipe '${data.name}' has been added.`,
      });

      navigate("/dashboard/page1");
    } catch (err: any) {
      toast.error("Error", {
        description: err.message,
      });
    }
  };

  return (
    <div className="p-6 mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Create New Recipe</h1>
        <Button variant="ghost" onClick={() => navigate("/dashboard/page1")}>
          Cancel
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Recipe Name</Label>
          <Input
            id="name"
            placeholder="e.g. Peachy Beach"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">Name is required</p>
          )}
        </div>

        {/* Available */}
        <Controller
          control={control}
          name="available"
          render={({ field: { value, onChange } }) => (
            <div className="flex items-center gap-4">
              <Label htmlFor="available">Available</Label>
              <Switch
                id="available"
                checked={value}
                onCheckedChange={onChange}
              />
              <span className="text-sm text-muted-foreground">
                Toggle to mark this recipe as available
              </span>
            </div>
          )}
        />

        {/* Ingredients */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg">Ingredients</Label>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ ingredient_code: "", amount: 0 })}
            >
              + Add Ingredient
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No ingredients added yet.
            </p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
            >
              <Controller
                control={control}
                name={`ingredients.${index}.ingredient_code`}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredientOptions.map((option) => (
                        <SelectItem
                          key={option.ingredient_code}
                          value={option.ingredient_code}
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Input
                type="number"
                placeholder="Amount (ml)"
                {...register(`ingredients.${index}.amount`, {
                  required: true,
                  min: 1,
                })}
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit">Create Recipe</Button>
        </div>
      </form>
    </div>
  );
}
