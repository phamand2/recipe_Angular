import {Ingredient} from "../shared/ingredient.model";
import {Subject} from "rxjs";

export class ShoppingListService {
  ingredientChanged = new Subject<Ingredient[]>()

  private ingredients: Ingredient[] = [
    new Ingredient("apple", 5),
    new Ingredient("tomato", 10),
  ];

  onIngredientAdded(ingredient: Ingredient){
    this.ingredients.push(ingredient)
    this.ingredientChanged.next([...this.ingredients])
  }

  getIngredient(){
    return [...this.ingredients]
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients)
    this.ingredientChanged.next([...this.ingredients])
  }
}
