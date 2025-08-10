import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductDetailsService} from './service/product-details.service';
import {DivisionModel} from '../model/division.model';
import {DistrictsModel} from '../model/districts.model';
import {UpazilaModel} from '../model/upazila.model';
import {UserRegistrationRequest} from '../model/userRegistrationRequest.model';
import {Product} from '../model/product.model';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: Product | undefined; // Product can be undefined initially

  selectedColor: string = ''; // Initialize with empty string or default color
  selectedSize: string = ''; // Initialize with empty string or default size
  currentImageIndex: number = 0;
  quantity: number = 1;
  activeTab: string = 'description';
  // Removed review-related properties as they are not in the backend product response
  user: UserRegistrationRequest = null as any;


  contactForm: FormGroup;
  deliveryAddressForm: FormGroup;
  private modal: any;

  divisions:DivisionModel[] = [];
  districts:DistrictsModel[] = [];
  upazilas:UpazilaModel[] = [];

  constructor(private route: ActivatedRoute,
              private authService : AuthService,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private productDetailsService: ProductDetailsService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      divisionId: ['', Validators.required],
      districtId: ['', Validators.required],
      upazilaId: ['', Validators.required],
    });

    this.deliveryAddressForm = this.fb.group({
      address: ['',],
      divisionId: ['', Validators.required],
      districtId: ['', Validators.required],
      upazilaId: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productDetailsService.getProductById(this.productId).subscribe({
        next: (data: Product) => {
          this.product = data;
          // Initialize selected color/size if variants exist
          if (this.product.imageUrls && this.product.imageUrls.length > 0) {
            this.selectedColor = this.product.imageUrls[0]; // Assuming first image URL implies a color
          }
          // If there are sizes, you might want to set a default or first one
          // if (this.product.variants && this.product.variants.sizes.length > 0) {
          //   this.selectedSize = this.product.variants.sizes[0];
          // }
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
          // Handle error, e.g., navigate to a 404 page or show a message
          this.router.navigate(['/products']); // Example: navigate back to products list
        }
      });
    } else {
      this.router.navigate(['/products']); // No product ID, navigate away
    }
    this.getAllDivisions();
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    if (this.product && this.product.imageUrls) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imageUrls.length;
    }
  }

  prevImage(): void {
    if (this.product && this.product.imageUrls) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imageUrls.length) % this.product.imageUrls.length;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  addToCart(): void {
    if (!this.product) return;
    // In a real app, this would add the product to the cart
    console.log('Added to cart:', {
      product: this.product.name,
      color: this.selectedColor,
      size: this.selectedSize,
      quantity: this.quantity
    });
  }

  buyNow(modal: any, deliveryAddressModal: any): void {
    // //First check if the user is logged in
    if (!this.authService.isUserAuthenticated()) {
      this.openModal(modal);
      return;
    }
    else{
      this.openModal(deliveryAddressModal);
    }

    const userId = this.authService.getUserId();
    const upazilaId = this.deliveryAddressForm.get('upazilaId')?.value;
    const productId = this.product?.id;
    const quantity = this.quantity;
    const price = this.product?.price;
    const totalPrice = price ? price * quantity : 0;


    if (!this.product) return;
    console.log('Buy now:', {
      id: this.product.id,
      product: this.product.name,
      color: this.selectedColor,
      size: this.selectedSize,
      quantity: this.quantity,
      userId: userId
    });
    //log user id

  }

  // Removed displayedReviews and totalReviewPages getters as reviews are not part of product

  changePage(page: number): void {
    // This method is for reviews pagination, which is removed.
    // If reviews are added back, this method will need to be re-implemented.
  }

  openModal(modal: any) {
    this.contactForm.reset(); // Reset form when opening

    const modalRef = this.modalService.open(modal, {
      size: 'md',
      backdrop: 'static',
      centered: true,
      keyboard: false
    });

    modalRef.result.then(
      (result) => {
        // Handle successful form submission
        console.log('Form submitted successfully:', result);
        //this.lastSubmittedData = result;
        // Here you can call your API to save the data
        // this.contactService.saveContact(result).subscribe(...);
      },
      (dismissed) => {
        // Handle modal dismissal
        console.log('Modal dismissed:', dismissed);
      }
    );
  }

  onSubmit(modal: any): void {

    if (this.contactForm.valid) {

      modal.close(this.contactForm.value);
      console.log("Form values for user registration = ", this.contactForm.value)

      this.user = {
        firstName: this.contactForm.value.firstName,
        lastName: this.contactForm.value.lastName,
        password: this.contactForm.value.password,
        phoneNumber: this.contactForm.value.phoneNumber,
        address: this.contactForm.value.address,
        upazilaId: this.contactForm.value.upazilaId
      };

      //call register API
      this.authService.register(this.user).subscribe({

        next: (response) => {
          console.log('Contact registered successfully:', response);
          // Optionally, reset the form or show a success message
          this.contactForm.reset();
          //call order API

        },
        error: (error) => {
          console.error('Error registering contact:', error);
          // Optionally, show an error message to the user
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  onSubmitDeliveryAddress(modal: any): void {


    if (this.deliveryAddressForm.valid) {

      modal.close(this.deliveryAddressForm.value);
      console.log("Form values for Delivery Address = ", this.deliveryAddressForm.value);
      const deliveryAddress = {
        address: this.deliveryAddressForm.value.address,
        divisionId: this.deliveryAddressForm.value.divisionId,
        districtId: this.deliveryAddressForm.value.districtId,
        upazilaId: this.deliveryAddressForm.value.upazilaId
      };
      console.log("Delivery Address = ", deliveryAddress);
    }
  }

  protected readonly Math = Math;
  protected readonly Number = Number;
  isSubmitting: boolean = false;

  private getAllDivisions() {
    this.productDetailsService.getAllDivisions().subscribe({
      next: (data: any) => {
        this.divisions = data.content || [];
        console.log('Divisions fetched successfully:', this.divisions);
      },
      error: (error: any) => {
        console.error('Error fetching divisions:', error);
      }
    });
  }

  onDivisionChange(event: Event) {

    const divisionId = (event.target as HTMLSelectElement).value;

    if (!divisionId) {
      this.districts = [];
      this.upazilas = [];
      this.contactForm.patchValue({ district: '', upazila: '' });
      return;
    }
    this.productDetailsService.getAllDistrictByDivisionId(divisionId).subscribe({
      next: (data: any) => {
        this.districts = data.content || [];
        this.upazilas = [];
        this.contactForm.patchValue({ district: '', upazila: '' });
      },
      error: (error: any) => {
        console.error('Error fetching districts:', error);
      }
    });
  }

  onDistrictChange(event: Event) {

    const districtId = (event.target as HTMLSelectElement).value;
    console.log('Selected District ID:', districtId);

    if (!districtId) {
      this.upazilas = [];
      this.contactForm.patchValue({ upazila: '' });
      return;
    }
    this.productDetailsService.getAllUpazilaByDistrictId(districtId).subscribe({
      next: (data: any) => {
        this.upazilas = data.content || [];
        this.contactForm.patchValue({ upazila: '' });
      },
      error: (error: any) => {
        console.error('Error fetching upazilas:', error);
      }
    });
  }

// Update your form validity checks as needed:
  isFieldInvalid(field: string) {
    const control = this.contactForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  protected readonly HTMLSelectElement = HTMLSelectElement;
  protected  environment = environment;
}
