import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategories } from '../../shared/interfaces/categories/icategories';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  private readonly categoriesService = inject(CategoriesService)

  categories: ICategories[] = []

  ngOnInit(): void {
    this.allCategories()
  }

  allCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => this.categories = res.data,
    })
  }
}
