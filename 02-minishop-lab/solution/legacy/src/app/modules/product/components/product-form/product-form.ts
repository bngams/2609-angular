import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  @Output() add = new EventEmitter<Product>();

  /** Formulaire typé : TypeScript connaît le type de chaque champ. */
  form = new FormGroup({
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
