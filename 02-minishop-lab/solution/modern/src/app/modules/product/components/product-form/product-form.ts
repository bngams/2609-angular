import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  /** Émis avec le produit saisi quand le formulaire est validé. */
  readonly add = output<Product>();

  /** Formulaire typé : TypeScript connaît le type de chaque champ. */
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.add.emit(this.form.getRawValue());
    this.form.reset();
  }
}
