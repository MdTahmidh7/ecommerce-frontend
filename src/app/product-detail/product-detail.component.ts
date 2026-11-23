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
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';


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
  currentImageIndex: number = 0;
  quantity: number = 1;
  activeTab: string = 'description';
  user: UserRegistrationRequest = null as any;

  registrationForm!: FormGroup;
  deliveryAddressForm!: FormGroup;
  checkoutForm: FormGroup;
  pendingOrderPayload: CreateOrderRequest | null = null;

  protected readonly Math = Math;
  protected readonly Number = Number;
  isSubmitting: boolean = false;

  otp: string = '';
  resendDisabled: boolean = true;
  countdown: number = environment.otpExpiryTimeInMin*60;
  maxCountdown: number = environment.otpExpiryTimeInMin*60;
  shippingCost: number = environment.shippingCost | 120;
  private countdownInterval: any;
  // Use ViewChildren to access the OTP input elements
  @ViewChildren('otp1, otp2, otp3, otp4, otp5, otp6') otpInputs!: ElementRef[];
  protected  environment = environment;
  errorMessage: string | null = null;
  safeDescription!: SafeHtml;
  contactNumber:string = '01716750237';

  constructor(
    private route: ActivatedRoute,
    public authService : AuthService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private productDetailsService: ProductDetailsService,
    private orderService: OrderService,
    private alertService : AlertService,
    private sanitizer: DomSanitizer
  ) {

    this.checkoutForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^(?:\\+88|88)?01[3-9]\\d{8}$'),
        Validators.maxLength(11)
      ]],
      districtName: ['', Validators.required],
      upazilaName: ['', Validators.required],
      address: ['', Validators.required]
    });

  }

  ngOnInit(): void {

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.productDetailsService.getProductById(this.productId).subscribe({
        next: (data: Product) => {
          this.product = data;

          this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.product.description || '');

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

  buyNow(modal: any): void {
    if (this.authService.isUserAuthenticated()) {
      const currentName = this.authService.getUserName();
      const currentPhone = this.authService.getUserPhoneNumber();
      if (currentName && currentName !== 'Guest') {
        this.checkoutForm.patchValue({ name: currentName });
      }
      if (currentPhone) {
        this.checkoutForm.patchValue({ phoneNumber: currentPhone });
      }
    }
    this.openModal(modal);
  }

  openModal(modal: any) {
    const modalRef = this.modalService.open(modal, {
      backdrop: 'static',
      centered: true,
      keyboard: false,
      scrollable: true,
      windowClass: 'checkout-modal-window'
    });

    modalRef.result.then(
      (result) => {
        console.log('Modal closed:', result);
      },
      (dismissed) => {
        console.log('Modal dismissed:', dismissed);
      }
    );
  }

  onSubmitCheckout(modal: any, verifyOtpModal: any): void {
    if (this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValues = this.checkoutForm.value;

    // If user is already authenticated, place order directly
    if (this.authService.isUserAuthenticated()) {
      this.alertService.confirm(
        "Confirm Order",
        "Are you sure you want to place the order?"
      ).then((result) => {
        if (result.isConfirmed) {
          this.isSubmitting = true;
          this.placeDirectOrder(modal);
        }
      });
      return;
    }

    // For unauthenticated user: stage pending order payload
    const productId = this.product?.id || 0;
    const quantity = this.quantity;
    const price = this.product?.price || 0;
    const totalPrice = price * quantity;

    this.pendingOrderPayload = {
      districtName: formValues.districtName,
      upazilaName: formValues.upazilaName,
      address: formValues.address,
      orderItems: [{
        productId: productId,
        quantity: quantity,
        price: totalPrice
      }]
    };

    this.user = {
      name: formValues.name,
      phoneNumber: formValues.phoneNumber,
      districtName: formValues.districtName,
      upazilaName: formValues.upazilaName,
      address: formValues.address,
      upazilaId: 0
    };

    this.isSubmitting = true;

    // Attempt registration first
    this.authService.register(this.user).subscribe({
      next: () => {
        this.isSubmitting = false;
        modal.close();
        this.openOtpModal(verifyOtpModal);
      },
      error: (error) => {
        const errorMsg = this.extractErrorMessage(error);
        // If user already exists, request OTP via login
        if (errorMsg.toLowerCase().includes('already') || errorMsg.toLowerCase().includes('in use') || error.status === 400) {
          this.authService.login(formValues.name, formValues.phoneNumber).subscribe({
            next: () => {
              this.isSubmitting = false;
              modal.close();
              this.openOtpModal(verifyOtpModal);
            },
            error: (loginErr) => {
              this.isSubmitting = false;
              const loginErrMsg = this.extractErrorMessage(loginErr);
              this.alertService.error('Verification Failed', loginErrMsg);
            }
          });
        } else {
          this.isSubmitting = false;
          this.alertService.error('Registration Failed', errorMsg);
        }
      }
    });
  }

  private openOtpModal(verifyOtpModal: any) {
    this.otp = '';
    this.countdown = environment.otpExpiryTimeInMin * 60;
    this.resendDisabled = true;
    this.errorMessage = null;
    this.modalService.open(verifyOtpModal, {
      backdrop: 'static',
      centered: true,
      keyboard: false,
      windowClass: 'otp-modal-window'
    });
    this.startCountdown();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.checkoutForm?.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getCurrentImage() {
    if (this.product && this.product.imageUrls && this.product.imageUrls.length > 0) {
      return this.product.imageUrls[this.currentImageIndex];
    } else {
      return 'assets/images/no-image.png'; // Fallback image
    }
  }

  private placeDirectOrder(modal: any) {
    const formVal = this.checkoutForm.value;
    const userId = this.authService.getUserId();
    const productId = this.product?.id || 0;
    const quantity = this.quantity;
    const price = this.product?.price || 0;
    const totalPrice = price * quantity;

    const orderRequest: CreateOrderRequest = {
      districtName: formVal.districtName,
      upazilaName: formVal.upazilaName,
      address: formVal.address,
      userId: userId,
      orderItems: [{
        productId: productId,
        quantity: quantity,
        price: totalPrice
      }]
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        modal.close();
        this.alertService.success(
          "Order Placed Successfully",
          "Your order has been placed successfully!"
        );
        this.checkoutForm.reset();
        this.router.navigate(['/my-orders']);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          modal.close();
          this.router.navigate(['/products']);
        } else {
          const errorMessage = this.extractErrorMessage(error);
          this.alertService.error('Order Failed', errorMessage);
        }
      }
    });
  }

  verifyOTP(modal: any) {
    if (this.otp && this.otp.length === 6) {
      const phoneNumber = this.checkoutForm.value.phoneNumber;
      this.isSubmitting = true;

      this.authService.verifyOtp(phoneNumber, this.otp.toString()).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          const userId = this.authService.getUserId();

          if (this.pendingOrderPayload) {
            this.pendingOrderPayload.userId = userId;
            this.orderService.createOrder(this.pendingOrderPayload).subscribe({
              next: () => {
                this.modalService.dismissAll();
                this.alertService.success(
                  "Order Placed Successfully",
                  "Your order has been placed successfully!"
                );
                this.checkoutForm.reset();
                this.pendingOrderPayload = null;
                this.router.navigate(['/my-orders']);
              },
              error: (err) => {
                this.modalService.dismissAll();
                const errMessage = this.extractErrorMessage(err);
                this.alertService.error('Order Failed', errMessage || 'Logged in successfully, but order placement failed.');
              }
            });
          } else {
            this.modalService.dismissAll();
            this.alertService.success('Login Successful', 'Welcome back.');
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message || 'OTP verification failed. Please try again.';
          console.error('OTP Verification error:', error);
        }
      });
    }
  }

  resendOTP() {
    if (this.resendDisabled) return;
    const phoneNumber = this.checkoutForm.value.phoneNumber;
    if (!phoneNumber) return;

    this.authService.reSendOtp(phoneNumber).subscribe({
      next: () => {
        this.countdown = environment.otpExpiryTimeInMin * 60;
        this.resendDisabled = true;
        this.startCountdown();
        this.alertService.success('OTP Resent', 'A new OTP has been sent to your phone.');
      },
      error: (err) => {
        const errMsg = this.extractErrorMessage(err);
        this.alertService.error('Failed', errMsg || 'Failed to resend OTP.');
      }
    });
  }

  private extractErrorMessage(error: any): string {
    if (!error) return 'An unexpected error occurred.';
    if (error.error) {
      if (typeof error.error === 'object' && error.error.message) {
        return error.error.message;
      } else if (typeof error.error === 'string') {
        try {
          const parsed = JSON.parse(error.error);
          if (parsed.message) return parsed.message;
        } catch (e) {
          return error.error;
        }
      }
    }
    return error.message || 'An unexpected error occurred.';
  }

  onOtpChange(event: KeyboardEvent, nextInput: HTMLInputElement | null, prevInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;

    // Move backward on backspace
    if (event.key === 'Backspace' && input.value === '') {
      if (prevInput) {
        prevInput.focus();
      }
    }
    // Move forward on digit entry
    else if (event.key >= '0' && event.key <= '9') {
      if (nextInput) {
        nextInput.focus();
      }
    }
    // Update the final OTP string after the input changes
    this.updateOtpString();
  }

  onOtpInput(event: Event, nextInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      // Keep only single numeric digit
      const numeric = input.value.replace(/\D/g, '');
      input.value = numeric ? numeric.slice(-1) : '';
      if (input.value && nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
    this.updateOtpString();
  }

  onOtpKeyDown(event: KeyboardEvent, prevInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && (!input.value || input.value === '')) {
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    const digits = clipboardData.replace(/\D/g, '').slice(0, 6);
    if (digits && this.otpInputs) {
      const inputsArray = Array.from(this.otpInputs);
      digits.split('').forEach((digit, index) => {
        if (inputsArray[index]) {
          inputsArray[index].nativeElement.value = digit;
        }
      });
      this.updateOtpString();
      const lastIndex = Math.min(digits.length, 5);
      if (inputsArray[lastIndex]) {
        inputsArray[lastIndex].nativeElement.focus();
      }
    }
  }

  // A helper method to combine all input values into a single string
  updateOtpString() {
    this.otp = this.otpInputs.map(input => input.nativeElement.value).join('');
    // You can now check this.otp.length here to disable/enable the button
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

  getYoutubeEmbedUrl() {
    //return safe video url
    const videoUrl = this.product?.youtubeLink || '';
    const videoId = videoUrl.split('v=')[1];
    //for share url if video url is like https://youtu.be/VIDEO_ID
    if (!videoId) {
      const urlParts = videoUrl.split('/');
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${urlParts[urlParts.length - 1]}`);
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

  }

  getTotalPayable() {
    if (this.product && this.product.price) {
      return (this.product.price * this.quantity) + this.shippingCost;
    } else {
      return "";
    }
  }
}
