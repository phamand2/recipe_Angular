import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import {ShoppingListService} from "./shopping-list.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients = []
  private igChangeSub: Subscription

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients()

    this.igChangeSub = this.shoppingListService.ingredientChanged
      .subscribe((ingredient) => {
      this.ingredients = ingredient
    })

  }

  ngOnDestroy() {
    this.igChangeSub.unsubscribe()
  }

  onEditItem(index: number){
    this.shoppingListService.startedEditing.next(index);
  }

}
