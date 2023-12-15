import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/form-validators/password.validator';
import { MenuController } from '@ionic/angular/standalone';
import { ShowHidePasswordComponent } from 'src/app/components/show-hide-password/show-hide-password.component';
import { RegisterWpUserPayload } from 'src/app/shared/wooApi';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { ModalService } from 'src/app/shared/utils/modal.service';
import { AuthHeaderComponent } from 'src/app/components/auth-header/auth-header.component';
import { IAuthHeader } from '../interfaces';
import { KeypadModule } from 'src/app/shared/native/keyboard/keypad.module';
import { scaleHeight } from 'src/app/shared/animations/animations';
import { AuthActions } from '../store/auth.actions';
import { Customer } from 'src/app/shared/wordpress/utils/types/wooCommerceTypes';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['../auth.styles.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    scaleHeight()
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ShowHidePasswordComponent,
    AuthHeaderComponent,
    KeypadModule
  ]
})
export class RegisterPage implements OnInit, OnDestroy {

  authHeader: IAuthHeader = {
    image: 'assets/shapes.svg',
    title: 'Register',
    subtitle: 'Join the club'
  }

  pageTitle = 'Register';

  signupForm: FormGroup;

  matching_passwords_group: FormGroup;

  addressForm: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'username': [
      { type: 'required', message: 'Email is required.' },
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password mismatch' }
    ]
  };

  address_validation_messages = {
    'first_name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'last_name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address_1': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address_2': [
      { type: 'required', message: 'Name is required.' }
    ],
    'city': [
      { type: 'required', message: 'Name is required.' }
    ],
    'postcode': [
      { type: 'required', message: 'Name is required.' }
    ],
    'country': [
      { type: 'required', message: 'Name is required.' }
    ],
    'phone': [
      { type: 'required', message: 'Name is required.' }
    ],
  };

  private store = inject(Store);

  private modalService = inject(ModalService);

  private menu = inject(MenuController);


  private readonly ngUnsubscribe = new Subject();

  constructor() {
    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('Rwbento123!', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'confirm_password': new FormControl('Rwbento123!', Validators.required)
    }, (formGroup: FormGroup | any) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.addressForm = new FormGroup({
      first_name: new FormControl('test', Validators.required),
      last_name: new FormControl('test', Validators.required),
      address_1: new FormControl('test', Validators.required),
      address_2: new FormControl('test', Validators.required),
      city: new FormControl('Edinburgh', Validators.required),
      postcode: new FormControl('ED88UJ', Validators.required),
      country: new FormControl('UK'),
      company: new FormControl('AMIGO'),
      phone: new FormControl('+7512345678', Validators.compose([
        Validators.required,
      ])),
    });

    this.signupForm = new FormGroup({
      'email': new FormControl('test01@email.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'username': new FormControl('test01', Validators.compose([
        Validators.required
      ])),
      'matching_passwords': this.matching_passwords_group,
      'address': this.addressForm
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  async doRegister(): Promise<void> {
    const payload: RegisterWpUserPayload = {
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.matching_passwords.confirm_password,
    }
    // console.log(this.signupForm.value);
    const payloadRegister: Customer = {
      "email": this.signupForm.value.email,
      "first_name": this.signupForm.value.address.first_name,
      "last_name": this.signupForm.value.address.last_name,
      "username": this.signupForm.value.username,
      "password": this.signupForm.value.matching_passwords.confirm_password,
      "billing": {
        "email": this.signupForm.value.email,
        "first_name": this.signupForm.value.address.first_name,
        "last_name": this.signupForm.value.address.last_name,
        "company": this.signupForm.value.address.company,
        "address_1": this.signupForm.value.address.address_1,
        "address_2": this.signupForm.value.address.address_2,
        "city": this.signupForm.value.address.city,
        "state": this.signupForm.value.address.state,
        "postcode": this.signupForm.value.address.postcode,
        "country": this.signupForm.value.address.country,
        "phone": this.signupForm.value.address.phone,
      },
      "shipping": {
        "email": this.signupForm.value.email,
        "first_name": this.signupForm.value.address.first_name,
        "last_name": this.signupForm.value.address.last_name,
        "company": this.signupForm.value.address.company,
        "address_1": this.signupForm.value.address.address_1,
        "address_2": this.signupForm.value.address.address_2,
        "city": this.signupForm.value.address.city,
        "state": this.signupForm.value.address.state,
        "postcode": this.signupForm.value.address.postcode,
        "country": this.signupForm.value.address.country,
        "phone": this.signupForm.value.address.phone,
      }
    }
    // const myMoc = {
    //   "email": "joao61@example.com",
    //   "first_name": "Jose",
    //   "last_name": "Jose",
    //   "username": "joao61",
    //   "password": "Rwbento123!",
    //   "billing": {
    //     "email": "joao61@example.com",
    //     "first_name": "Jose",
    //     "last_name": "Jose",
    //     "company": "",
    //     "address_1": "969 asd",
    //     "address_2": "",
    //     "city": "San Francisco",
    //     "state": "CA",
    //     "postcode": "94103",
    //     "country": "US",
    //     "phone": "(555) 555-5555"
    //   },
    //   "shipping": {
    //     "email": "joao61@example.com",
    //     "first_name": "Jose",
    //     "last_name": "Jose",
    //     "company": "",
    //     "address_1": "969 asd",
    //     "address_2": "",
    //     "city": "San Francisco",
    //     "state": "CA",
    //     "postcode": "94103",
    //     "country": "US",
    //     "phone": "(555) 555-5555"
    //   }
    // }
    // console.log(payloadRegister);
    await this.store.dispatch(new AuthActions.Register(payloadRegister));
  }

  async showTermsModal() {
    await this.modalService.showPrivacyModal();
  }

  async showPrivacyModal() {
    await this.modalService.showPrivacyModal();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
