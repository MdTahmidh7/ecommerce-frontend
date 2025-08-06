import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductAdminService } from '../product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(private fb: FormBuilder, private productAdminService: ProductAdminService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stockQuantity: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onFileSelect(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(this.productForm.value)], { type: 'application/json' }));
      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      this.productAdminService.createProduct(formData).subscribe({
        next: (response) => {
          console.log('Product created successfully', response);
          this.productForm.reset();
        },
        error: (error) => {
          console.error('Error creating product', error);
        }
      });
    }
  }
}