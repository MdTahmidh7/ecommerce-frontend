import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductAdminService } from '../product.service'; // Assuming this service has getProductById and updateProduct
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AlertService } from '../../common-service/alert.service';
import { CategoryResponse } from '../../model/categoryResponse.model';
import { ActivatedRoute } from '@angular/router'; // To get product ID from route
import { NgxEditorModule, Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';
import { environment } from '../../../environments/environment';

// Interface for the file structure (kept consistent)
interface ImageFile {
  file: File | null; // Can be null for existing images fetched as URLs
  name: string;
  url: SafeUrl;
  isNew: boolean; // Flag to know if this file needs to be uploaded
}

// Mock model for the product data you fetch from the backend (adjust to your actual model)
interface ProductResponse {
  id: number;
  name: string;
  description: string; // This will be HTML string from backend
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrls: string[]; // List of existing image URLs
  youtubeLink?: string;
}

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxEditorModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  selectedFiles: ImageFile[] = [];
  categories: CategoryResponse[] = [];
  productId!: number;
  isLoading: boolean = true;

  // NGX-EDITOR PROPERTIES
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'], ['underline', 'strike'], ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'], [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'], ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'history'],
  ] as any;

  constructor(
    private fb: FormBuilder,
    private productAdminService: ProductAdminService,
    private sanitizer: DomSanitizer,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) {
    // Initialize the editor
    this.editor = new Editor();
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialize form structure early
    this.productForm = this.fb.group({
      id: [this.productId], // Include ID for the update API call
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stockQuantity: ['', Validators.required],
      youtubeLink: ['']
      //categoryId: [null, Validators.required]
    });

    this.getAllCategories();
    this.loadProductDetails(this.productId);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // --- Data Loading ---
  private IMAGE_BASE_URL: string = environment.imageBaseUrl;

  loadProductDetails(id: number): void {
    this.productAdminService.getProductById(id).subscribe({
      next: (product: ProductResponse) => {

        // 1. Convert HTML description back to Ngx-Editor document format
        const descriptionDoc = toDoc(product.description);

        // 2. Patch the form values
        this.productForm.patchValue({
          name: product.name,
          description: descriptionDoc, // Use the doc format for the editor
          price: product.price,
          stockQuantity: product.stockQuantity,
          categoryId: product.categoryId,
          youtubeLink: product.youtubeLink || ''
        });

        // 3. Populate selectedFiles with existing images
        this.selectedFiles = product.imageUrls.map(relativeUrl => {
          // Concatenate to form the full, valid image URL
          const fullUrl = this.IMAGE_BASE_URL+ '/' + relativeUrl;

          return {
            file: null,
            name: relativeUrl,
            // CRITICAL: The sanitizer is applied here.
            url: this.sanitizer.bypassSecurityTrustUrl(fullUrl),
            isNew: false
          };
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product details', error);
        this.alertService.error('Error', 'Could not load product details.');
        this.isLoading = false;
      }
    });
  }

  getAllCategories(): void {
    // ... (Your existing logic for fetching categories) ...
    this.productAdminService.getAllCategories().subscribe({
      next: (categories: any) => {
        this.categories = categories.content;
        console.log('Fetched categories:', this.categories);
      },
      error: (error) => {
        console.error('Error fetching categories', error);
        this.alertService.error('Error', 'Could not load categories.');
      }
    });
  }

  // --- Image Handling (Modified for Update) ---

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files) as File[];
    if (this.selectedFiles.length + files.length > 5) {
      this.alertService.error('You can upload a maximum of 5 images.', 'Please remove some images before adding more.');
      return;
    }

    files.forEach(file => {
      if (file.size > 7 * 1024 * 1024) {
        this.alertService.error('File size exceeds the limit of 7MB.', `The file ${file.name} is too large.`);
        return;
      }

      const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      this.selectedFiles.push({ file, name: file.name, url, isNew: true }); // Mark as new file
    });
  }

  removeImage(fileName: string): void {
    // If the file is an existing image (file: null, isNew: false), you might need an extra step
    // to tell the backend to delete it. For simplicity here, we just remove it from the array.
    this.selectedFiles = this.selectedFiles.filter(item => item.name !== fileName);
  }

  // --- Submission ---

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFiles.length > 0 && this.selectedFiles.length <= 5) {
      const productData = this.productForm.value;

      try {
        // Convert only if it's JSON, not already HTML or text
        if (typeof productData.description === 'object') {
          productData.description = toHTML(productData.description);
        }
      } catch (error) {
        console.warn('Skipping toHTML conversion, invalid JSON:', error);
      }

      const newImageFiles = this.selectedFiles.filter(item => item.isNew && item.file) as ImageFile[];

      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

      newImageFiles.forEach(item => {
        formData.append('images', item.file!, item.name);
      });

      this.productAdminService.updateProduct(this.productId, formData as any).subscribe({
        next: () => {
          this.alertService.success("Product updated successfully!", "The product details have been saved.");
        },
        error: (error) => {
          console.error('Error updating product', error);
          this.alertService.error('Update Failed', error.message || 'Check console for details.');
        }
      });
    }
  }

  newImageCount(): number {
    return this.selectedFiles.filter(f => f.isNew).length;
  }

  protected readonly environment = environment;
}
