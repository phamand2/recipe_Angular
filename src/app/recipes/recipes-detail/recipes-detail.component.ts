import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppState } from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { deleteRecipe } from '../store/recipe.action';
import { addIngredients } from '../../shopping-list/store/shopping-list.action';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css'],
})
export class RecipesDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      // React to the change when clicking diff recipe
      (params: Params) => {
        this.id = +params['id']; // cast the id to a number
        // this.recipe = this.recipeService.getRecipe(this.id);
        this.store
          .select('recipe')
          .pipe(
            map((recipesState) => {
              return recipesState.recipes.find((recipe, index) => {
                return index === this.id;
              });
            })
          )
          .subscribe((recipe) => {
            this.recipe = recipe;
          });
      }
    );
  }

  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(addIngredients({ payload: this.recipe.ingredients }));
  }

  onEditRecipe() {
    // this.router.navigate(['edit'], {relativeTo: this.route})
    this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(
      deleteRecipe({
        payload: {
          index: this.id,
        },
      })
    );
    this.router.navigate(['/recipes']);
  }
}
