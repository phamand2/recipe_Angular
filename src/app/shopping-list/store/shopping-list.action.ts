import { Ingredient } from '../../shared/ingredient.model';

import { createAction, props } from '@ngrx/store';

export const addIngredient = createAction(
  '[Shopping List] ADD_INGREDIENT',
  props<{ payload: Ingredient }>()
);

export const addIngredients = createAction(
  '[Shopping List] ADD_INGREDIENTS',
  props<{ payload: Ingredient[] }>()
);

export const updateIngredient = createAction(
  '[Shopping List] UPDATE_INGREDIENT',
  props<{
    payload: {
      index: number;
      ingredient: Ingredient;
    };
  }>()
);

export const deleteIngredient = createAction(
  '[Shopping List] DELETE_INGREDIENT',
  props<{
    payload: {
      index: number;
    };
  }>()
);

export const startEdit = createAction(
  '[Shopping List] Start Edit',
  props<{
    index: number;
  }>()
);

export const stopEdit = createAction('[Shopping List] Stop Edit');
