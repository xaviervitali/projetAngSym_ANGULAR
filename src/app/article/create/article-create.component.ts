import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncSubject, Subject } from 'rxjs';
import { CategoryService } from 'src/app/category/category.service';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css'],
})
export class ArticleCreateComponent implements OnInit {
  private editorSubject: Subject<any> = new AsyncSubject();
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
  });
  submitted = false;
  categories = [];
  titre = 'Nouveau titre';
  constructor(
    private articleService: ArticleService,
    private router: Router,
    private categoryService: CategoryService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.categoryService.findAll().subscribe((cat) => (this.categories = cat));
  }

  handleSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.articleService.create(this.form.value).subscribe(
      () => {
        this.router.navigateByUrl('/articles');
      },
      (e: HttpErrorResponse) => {
        if (e.status === 400 && e.error.violations) {
          for (const violation of e.error.violations) {
            const nomDuChamp = violation.propertyPath;
            const msg = violation.message;
            this.form.controls[nomDuChamp].setErrors({ invalid: msg });
          }
        }
      }
    );
  }
}
