import { createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import {
  addRecipe,
  deleteRecipe,
  fetchRecipes,
  setRecipes,
  updateRecipe,
} from './recipe.action';

export interface State {
  recipes: Recipe[];
}

const initialState = {
  recipes: [],
};

const _recipeReducer = createReducer(
  initialState,
  on(setRecipes, (state, action) => ({
    ...state,
    recipes: [...action.payload],
  })),
  on(fetchRecipes, (state) => ({
    ...state,
  })),
  on(addRecipe, (state, action) => ({
    ...state,
    recipes: [...state.recipes, action.payload],
  })),
  on(updateRecipe, (state, action) => {
    const updateRecipe = {
      ...state.recipes[action.payload.index],
      ...action.payload.newRecipe,
    };

    const updatedRecipes = [...state.recipes];
    updatedRecipes[action.payload.index] = updateRecipe;

    return {
      ...state,
      recipes: updatedRecipes,
    };
  }),
  on(deleteRecipe, (state, action) => ({
    ...state,
    recipes: state.recipes.filter(
      (recipe, index) => index !== action.payload.index
    ),
  }))
);

export const RecipeReducer = (state, action) => {
  return _recipeReducer(state, action);
};
