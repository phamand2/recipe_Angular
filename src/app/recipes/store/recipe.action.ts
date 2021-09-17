import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const setRecipes = createAction(
  '[Recipe] Set Recipes',
  props<{ payload: Recipe[] }>()
);

export const fetchRecipes = createAction('[Recipe] Fetch Recipes');

export const addRecipe = createAction(
  '[Recipe] Add Recipe',
  props<{ payload: Recipe }>()
);

export const updateRecipe = createAction(
  '[Recipe] Update Recipe',
  props<{
    payload: {
      index: number;
      newRecipe: Recipe;
    };
  }>()
);

export const deleteRecipe = createAction(
  '[Recipe] Delete Recipe',
  props<{
    payload: {
      index: number;
    };
  }>()
);

export const storeRecipe = createAction('[Recipe] Store Recipe');
