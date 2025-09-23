import {Component, ElementRef, OnInit, ViewChildren, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductDetailsService} from './service/product-details.service';
import {DivisionModel} from '../model/division.model';
import {DistrictsModel} from '../model/districts.model';
import {UpazilaModel} from '../model/upazila.model';
import {UserRegistrationRequest} from '../model/userRegistrationRequest.model';
import {Product} from '../model/product.model';
import {environment} from '../../environments/environment';
import {CreateOrderRequest} from '../model/CreateOrderRequest.moel';
import {OrderService} from '../order.service';
import {AlertService} from '../common-service/alert.service';
import {AppComponent} from '../app.component';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  private appComponent = inject(AppComponent);
  productId: string | null = null;
  product: Product | undefined;
  orderRequest: CreateOrderRequest = null as any;

  selectedColor: string = '';
  selectedSize: string = '';
  currentImageIndex: number = 0;
  quantity: number = 1;
  activeTab: string = 'description';
  user: UserRegistrationRequest = null as any;

  contactForm: FormGroup;
  deliveryAddressForm: FormGroup;

  protected readonly Math = Math;
  protected readonly Number = Number;
  isSubmitting: boolean = false;

  divisions:DivisionModel[] = [];
  districts:DistrictsModel[] = [];
  upazilas:UpazilaModel[] = [];

  otp: string = '';
  resendDisabled: boolean = false;
  countdown: number = 60;
  private countdownInterval: any;
  // Use ViewChildren to access the OTP input elements
  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6') otpInputs!: ElementRef[];
  protected  environment = environment;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute,
              private authService : AuthService,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private productDetailsService: ProductDetailsService,
              private orderService: OrderService,
              private alertService : AlertService
  ) {

    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
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
      console.log(this.currentImageIndex);
    }
  }

  prevImage(): void {
    if (this.product && this.product.imageUrls) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imageUrls.length) % this.product.imageUrls.length;
      console.log(this.currentImageIndex);
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

  }

  openModal(modal: any) {

    //this.contactForm.reset(); // Reset form when opening

    const modalRef = this.modalService.open(modal, {
      size: 'md',
      backdrop: 'static',
      centered: true,
      keyboard: false
    });

    modalRef.result.then(
      (result) => {
        console.log('Form submitted successfully:', result);
      },
      (dismissed) => {
        console.log('Modal dismissed:', dismissed);
      }
    );
  }

  onSubmit(modal: any, verifyOtpModal: any): void {

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
          const modalRef = this.modalService.open(verifyOtpModal, {
            size: 'md',
            backdrop: 'static',
            centered: true,
            keyboard: false
          });
        },
        error: (error) => {
          console.error('Error registering contact:', error);
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
      this.alertService.confirm(
        "Confirm Order",
        "Are you sure you want to place the order?"
      ).then((result) => {
        if (result.isConfirmed) {
          this.placeOrder();
        }
      });
    }
  }

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

  getCurrentImage() {
    if (this.product && this.product.imageUrls && this.product.imageUrls.length > 0) {
      return this.product.imageUrls[this.currentImageIndex];
    }else {
      return 'assets/images/no-image.png'; // Fallback image
    }
  }

  private placeOrder() {
    const userId = this.authService.getUserId();
    const upazilaId = this.deliveryAddressForm.get('upazilaId')?.value;
    const productId = this.product?.id;
    const quantity = this.quantity;
    const price = this.product?.price;
    const totalPrice = price ? price * quantity : 0;

    //prepare order request
    this.orderRequest = {
      upazilaId: upazilaId,
      userId: userId,
      orderItems: [{
        productId: productId || 0, // Fallback to 0 if productId is undefined
        quantity: quantity,
        price: totalPrice
      }]
    };

    //call api for order request
    this.orderService.createOrder(this.orderRequest).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        this.alertService.success(
          "Order Placed Successfully",
          "Your order has been placed successfully!"
        )
        this.deliveryAddressForm.reset();
      },
      error: (error) => {
        console.error('Error while creating order:', error);
      }
    });
  }

  verifyOTP(modal: any) {
    if (this.otp != null) {
      console.log("Form values for user registration = ", this.contactForm.value)
      console.log("Phone Number: ", this.contactForm.value.phoneNumber);
      console.log("OTP: ", this.otp);

      this.authService.verifyOtp(
        this.contactForm.value.phoneNumber,
        this.otp.toString()
      ).subscribe({
        next: (response) => {
          this.modalService.dismissAll();
          this.alertService.success('Login Successful','Welcome back.');
          // Handle successful OTP verification
          console.log('OTP verified successfully:', response);
        },
        error: (error) => {
          this.errorMessage = error.message || 'OTP verification failed. Please try again.';
          console.error('OTP Verification error:', error);
        },
        complete: () => {
          //this.loading = false;
        }
      });
    }
  }

  resendOTP() {
    //handle resend otp
  }

  onOtpChange(currentInput: HTMLInputElement, nextInput: HTMLInputElement | null) {
    this.otp = this.otpInputs.map(input => input.nativeElement.value).join('');

    if (currentInput.value && nextInput) {
      nextInput.focus();
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    clearInterval(this.countdownInterval);
  }

  redirectToLogin() {
    this.modalService.dismissAll();
    this.router.navigate(['/login']);
  }
}
