import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductAdminService } from '../product.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {AlertService} from '../../common-service/alert.service';
import {CategoryResponse} from '../../model/categoryResponse.model';

interface ImageFile {
  file: File;
  name: string;
  url: SafeUrl;
}

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup;
  selectedFiles: ImageFile[] = [];
  categories: CategoryResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private productAdminService: ProductAdminService,
    private sanitizer: DomSanitizer,
    private alertService: AlertService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stockQuantity: ['', Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.selectedFiles = [];
    this.productForm.reset();
    this.getAllCategories();
  }

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (this.selectedFiles.length + files.length > 5) {
      //sweet alert for max 5 images
      this.alertService.error(
        'You can upload a maximum of 5 images.',
        'Please remove some images before adding more.'
      ).then(r =>{
        return r;
      }) ;

      return;
    }

    files.forEach(file => {
      const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      //check if file size is more than 7MB
      if (file.size > 7 * 1024 * 1024) {
        this.alertService.error(
          'File size exceeds the limit of 7MB.',
          `The file ${file.name} is too large. Please select a smaller file.`
        ).then(r =>{
          return r;
        }) ;
        return;
      }
      this.selectedFiles.push({ file, name: file.name, url });
    });
  }

  removeImage(fileName: string): void {
    this.selectedFiles = this.selectedFiles.filter(item => item.name !== fileName);
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFiles.length > 0 && this.selectedFiles.length <= 5) {
      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(this.productForm.value)], { type: 'application/json' }));
      this.selectedFiles.forEach(item => {
        formData.append('images', item.file, item.name);
      });

      this.productAdminService.createProduct(formData as any).subscribe({
        next: (response) => {
          console.log('Product created successfully', response);
          this.productForm.reset();
          this.selectedFiles = []; // Clear selected images after successful submission
        },
        error: (error) => {
          console.error('Error creating product', error);
        }
      });
    }
  }

  getAllCategories(){
    return this.productAdminService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.content;
        console.log('Categories fetched successfully', this.categories);
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      }
    });
  }
}
