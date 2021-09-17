import { Ingredient } from '../../shared/ingredient.model';
import {
  addIngredient,
  addIngredients,
  deleteIngredient,
  startEdit,
  stopEdit,
  updateIngredient,
} from './shopping-list.action';
import { createReducer, on } from '@ngrx/store';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('apple', 5), new Ingredient('tomato', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

const _shoppingListReducer = createReducer(
  initialState,
  on(addIngredient, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, action.payload],
  })),
  on(addIngredients, (state, action) => ({
    ...state,
    ingredients: [...state.ingredients, ...action.payload],
  })),
  on(updateIngredient, (state, action) => ({
    ...state,
    ingredients: state.ingredients.map((ingredient, index) =>
      index === action.payload.index
        ? { ...action.payload.ingredient }
        : ingredient
    ),
  })),
  on(deleteIngredient, (state, action) => ({
    ...state,
    ingredients: state.ingredients.filter(
      (_, index) => index !== action.payload.index
    ),
  })),
  on(startEdit, (state, action) => ({
    ...state,
    editedIngredientIndex: action.index,
    editedIngredient: { ...state.ingredients[action.index] },
  })),
  on(stopEdit, (state) => ({
    ...state,
    editedIngredientIndex: -1,
    editedIngredient: null,
  }))
);

export function ShoppingReducer(state, action) {
  return _shoppingListReducer(state, action);
}
