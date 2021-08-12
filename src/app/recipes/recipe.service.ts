import {Recipe} from "./recipe.model";
import {EventEmitter, Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>()

  private recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is a test', 'https://learnenglishteens.britishcouncil.org/sites/teens/files/a_recipe_1.jpg',[
      new Ingredient('meat', 1)
    ]),
    new Recipe('Pizza', 'This is a test', 'https://learnenglishteens.britishcouncil.org/sites/teens/files/a_recipe_1.jpg',[
      new Ingredient('bread',2)
    ])
  ];

  constructor(private slService: ShoppingListService) {
  }

  getRecipes(){
    // A copy
    return this.recipes.slice()
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients)
  }

  getRecipe(id: number){ // It's actually based on index because it's an array with objects
    return this.recipes[id]
  }



}
