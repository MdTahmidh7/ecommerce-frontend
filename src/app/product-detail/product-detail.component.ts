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


declare var bootstrap: any;

interface BootstrapModal {
  show(): void;
  hide(): void;
  dispose(): void;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product = {
    id: '1',
    title: 'Premium Wireless Headphones',
    brand: 'AudioTech',
    rating: 4.5,
    reviewCount: 127,
    price: 199.99,
    oldPrice: 249.99,
    discount: 20,
    availability: 'In Stock',
    description: 'Experience crystal-clear sound with our premium wireless headphones. Featuring advanced noise cancellation technology, comfortable ear cushions, and a long-lasting battery life of up to 30 hours.',
    features: [
      'Active Noise Cancellation',
      'Bluetooth 5.0 connectivity',
      '30-hour battery life',
      'Quick charge (5 min charge = 2 hours playback)',
      'Built-in microphone for calls',
      'Voice assistant compatible'
    ],
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Impedance': '32 Ohm',
      'Battery Capacity': '600mAh',
      'Charging Time': '2 hours',
      'Weight': '250g'
    },
    variants: {
      colors: ['Black', 'White', 'Blue'],
      sizes: ['One Size']
    },
    images: [
      'https://placehold.co/600x400/E0F2FE/2563EB?text=Headphones+Main',
      'https://placehold.co/600x400/E0F2FE/2563EB?text=Headphones+Side',
      'https://placehold.co/600x400/E0F2FE/2563EB?text=Headphones+Back',
      'https://placehold.co/600x400/E0F2FE/2563EB?text=Headphones+Detail'
    ],
    reviews: [
      {
        id: 1,
        user: 'John D.',
        rating: 5,
        date: '2023-10-15',
        title: 'Best headphones I\'ve ever owned',
        comment: 'The sound quality is amazing and the noise cancellation works perfectly. Battery life is impressive too!'
      },
      {
        id: 2,
        user: 'Sarah M.',
        rating: 4,
        date: '2023-09-28',
        title: 'Great sound, slightly tight fit',
        comment: 'Sound quality is excellent and battery lasts forever. Only complaint is they\'re a bit tight on my head after a few hours.'
      },
      {
        id: 3,
        user: 'Michael P.',
        rating: 5,
        date: '2023-09-10',
        title: 'Worth every penny',
        comment: 'These headphones have transformed my commute. The noise cancellation is so good I can barely hear the train!'
      }
    ],
    relatedProducts: [
      {
        id: '2',
        title: 'Wireless Earbuds',
        price: 89.99,
        image: 'https://placehold.co/300x200/FEE2E2/DC2626?text=Earbuds'
      },
      {
        id: '3',
        title: 'Premium Speaker',
        price: 149.99,
        image: 'https://placehold.co/300x200/D1FAE5/059669?text=Speaker'
      },
      {
        id: '4',
        title: 'Audio Amplifier',
        price: 299.99,
        image: 'https://placehold.co/300x200/F3E8FF/7E22CE?text=Amplifier'
      },
      {
        id: '5',
        title: 'Headphone Stand',
        price: 39.99,
        image: 'https://placehold.co/300x200/FEF3C7/D97706?text=Stand'
      }
    ]
  };

  selectedColor: string = 'Black';
  selectedSize: string = 'One Size';
  currentImageIndex: number = 0;
  quantity: number = 1;
  activeTab: string = 'description';
  currentReviewPage: number = 1;
  reviewsPerPage: number = 3;
  reviewForm: FormGroup;


  contactForm: FormGroup;
  private modal: any;

  divisions:DivisionModel[] = [];
  districts:DistrictsModel[] = [];
  upazilas:UpazilaModel[] = [];

  constructor(private route: ActivatedRoute,
              private authService : AuthService,
              private router: Router,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private productDetailsService: ProductDetailsService,
              ) {

    this.reviewForm = new FormGroup({
      rating: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      comment: new FormControl(null, Validators.required)
    });

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      division: ['', Validators.required],
      district: ['', Validators.required],
      upazila: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    // In a real app, you would fetch the product data based on the ID
    // For now, we're using mock data
    //call api for getAllDivisions
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
    this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
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
    // In a real app, this would add the product to the cart
    console.log('Added to cart:', {
      product: this.product.title,
      color: this.selectedColor,
      size: this.selectedSize,
      quantity: this.quantity
    });
  }

  buyNow(modal: any): void {

    //First check if the user is logged in
    if (!this.authService.isUserAuthenticated()) {
      this.openModal(modal);
      return;
    }

    console.log('Buy now:', {
      product: this.product.title,
      color: this.selectedColor,
      size: this.selectedSize,
      quantity: this.quantity
    });
  }

  get displayedReviews() {
    const start = (this.currentReviewPage - 1) * this.reviewsPerPage;
    return this.product.reviews.slice(start, start + this.reviewsPerPage);
  }

  get totalReviewPages() {
    return Math.ceil(this.product.reviews.length / this.reviewsPerPage);
  }

  changePage(page: number): void {
    this.currentReviewPage = page;
  }

  openModal(modal : any) {
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

  closeModal() {
    this.modal.hide();
  }

  // isFieldInvalid(fieldName: string): boolean {
  //   const field = this.contactForm?.get(fieldName);
  //
  //   // If the field exists, check its validation status and user interaction.
  //   // Your original logic for (field.invalid && (field.dirty || field.touched)) is correct.
  //   if (field) {
  //     return field.invalid && (field.dirty || field.touched);
  //   }
  //   // If the field does not exist (e.g., typo in fieldName), return false
  //   // or log an error for debugging.
  //   console.warn(`Form control '${fieldName}' not found in contactForm.`);
  //   return false;
  // }

  onSubmit(modal: any): void {
    if (this.contactForm.valid) {
      modal.close(this.contactForm.value);
      console.log("Form values = ",this.contactForm.value)
      alert("Form submitted.")
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
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
}
