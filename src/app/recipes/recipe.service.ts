import {Recipe} from "./recipe.model";
import { Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {

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
