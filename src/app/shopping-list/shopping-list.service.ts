import {Ingredient} from "../shared/ingredient.model";
import {Subject} from "rxjs";

export class ShoppingListService {
  ingredientChanged = new Subject<Ingredient[]>()
  startedEditing = new Subject<number>()

  private ingredients: Ingredient[] = [
    new Ingredient("apple", 5),
    new Ingredient("tomato", 10),
  ];

  onIngredientAdded(ingredient: Ingredient){
    this.ingredients.push(ingredient)
    this.ingredientChanged.next([...this.ingredients])
  }

  getIngredients(){
    return [...this.ingredients]
  }


  getIngredient(index: number){
    return this.ingredients[index]
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients)
    this.ingredientChanged.next([...this.ingredients])
  }

  updateIngredient(index: number, newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientChanged.next([...this.ingredients])
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index, 1)
    this.ingredientChanged.next([...this.ingredients])
  }
}
