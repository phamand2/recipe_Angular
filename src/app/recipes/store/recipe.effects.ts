import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as recipeAction from './recipe.action';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { setRecipes, storeRecipe } from './recipe.action';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  // @ts-ignore
  fetchRecipes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(recipeAction.fetchRecipes),
      switchMap((actionData) => {
        return this.http.get<Recipe[]>(
          'https://recipe-angular-dd963-default-rtdb.firebaseio.com/recipes.json?'
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        return setRecipes({ payload: recipes });
      })
    );
  });

  storeRecipes$ = createEffect(
    // @ts-ignore
    () =>
      this.actions$.pipe(
        ofType(storeRecipe),
        // @ts-ignore
        withLatestFrom(this.store.select('recipe')),
        // @ts-ignore
        switchMap(([actionData, recipesState]) => {
          return this.http.put(
            'https://recipe-angular-dd963-default-rtdb.firebaseio.com/recipes.json',
            recipesState.recipes
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
