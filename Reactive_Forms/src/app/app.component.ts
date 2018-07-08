import { Component , OnInit } from '@angular/core';
import { FormControl , FormBuilder , FormGroup, Validators , AbstractControl, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

/**
 * 
 * @param element 
 * Custom validator is a functon that takes in an Abstratc control. Form group , form control and form array comes
 * abstract control. It will return an object if there is an error and that will get defined as a key value on the
 * errors collection of that field
 */
function emailValidator(element : AbstractControl) : {[key : string] : boolean} | null{
  let email = element.get('emailAddress');
  let confirmEmail = element.get('confirmEmail');
    if( (email.value === confirmEmail.value) || (email.pristine || confirmEmail.pristine))
    {
      return null;
    }
    else{
        return {'Unmatch' : true};
    }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  /**
   * This is a property of type formgroup which will hold the reference to our form model
   */
  private userInfoForm : FormGroup;
  /**
   * Captures the validation error message if there is any for the first name input field
   */
  private firstNameHasErrors : string = "";
  /**
   * Object to specify the validation messages for the first name input field if there is any error
   */
  private firstNameErrors = {
    required : `First Name field is required `,
    minlength : 'First Name must be 3 characters long',
  }

  /**
   * Captures the validation error message for last name input field
   */
  private lastNameHasErrors : string = '';

  /**
   * Object to specify the validation messages for the last name input field if there is any error
   */
  private lastNameErrors = {
    required : `Last Name field is required `,
    minlength : 'Last Name must be 3 characters long',
  }

  /**
   * Captures the error message for email address input field
   */
  private emailAddressHasErrors : string = '';

  /**
   * Object to specify the validation messages for the email address input field
   */
  private emailAddressErrors = {
    required : `Email Address is a required `,
    minlength : 'Email Address must be 8 characters long',
    pattern : 'Please enter valid email address'
  }

  /**
   * Property to get the form array along with controls so that by mistake we do not write elements to our formgroup
   * that will persist
   */
  get phoneNumberArray() : FormArray {
    return <FormArray>this.userInfoForm.get('phoneNumberArray');
  }

  /**
   * 
   */
  private phoneHasErrors : string = '';

  private phoneErrors = {
    required : `Phone Number is required `,
    minlength : 'Phone Number must be 10 digits long',
  }
  
  /**
   * We can pass in an object to the formcontrol constructor , where first key is the value of the field and the 
   * second one defines the state
   */
  //private firstName : FormControl = new FormControl({value : 'Manish', disabled : false});
  /**
   * To the form control instance we can pass a string that would be the default value of the input element
   */
  //private lastName : FormControl = new FormControl('Chahal');
  /**
   * To the formcontrol constructor we can pass in an array where the first element of the array is the default value
   * and the second element contains the validators which can be an array or a single element
   */
  //private middleName : FormControl = new FormControl(['Kumar', [Validators.required , Validators.minLength(3)]]);

  /**
   * Injecting formbuilder into the component class by making use of constructor parameter properties
   */
  constructor( private formBuilder : FormBuilder){

  }


  //ngOnInit() : void{
  /**
   * Here we assign the root form group or the form model to the userinfoform property, to the constructor the 
   * forgroup we pass an object that contains the form controls , nested formm groups and form arrays . A form control is an
   * instance of formcontrol class , we define form control as key value pair where key is the logical name and value
   * is an instance of the form group
   */
 /*
    this.userInfoForm = new FormGroup({
      firstName : this.firstName,
      lastName : this.lastName,
      middleName : this.middleName
    });
  }
  */
/**
 * If we want to populate our fields with the test data than we can make use of set value method which takes in an object
 * where we have to specify the values for each of the form control instances , if we do not specify for the form control
 * instances than it will complaint , so if we want populate test data for a subset of form controls than we can make use of 
 * patch value
 */
/*
  populateDefaultData() : void {
    this.userInfoForm.setValue({
      firstName : 'Manish',
      lastName : 'Chahal'
    });
  }
  */
 /*
 populateDefaultData() : void {
  this.userInfoForm.patchValue({
    firstName : 'Manish'
  });
}
*/

/**
 * So far we have seen how to build form group and form control instances by using their respective classes , now lets take a
 * look at the formbuilder which is provided by angular as a service . It can be used to create the root form group ,
 * form control , nested form groups and form arrays. We can think of it as a factory. Its group method takes in an object  
 *  containing form group and from control instances. In order to use it we have to inject it into our component class. 
 * We can create group control and array using form builder
 */
/**
 * ngOninit is the best place for creating the form model because when this code is called at that time our component
 * and the template will get instantiated or initialized , so for assurance we do it here. As the constructor is the
 * first method called when the class gets instantiated so try to keep the constructor as clean as possible . Try to
 * make use of component life cycle hooks.
 */
ngOnInit() : void{

  /**
   * Using group method of the formbuilder service to create root form group and passing to it an object that contains
   * nested form control instances
   */
  this.userInfoForm = this.formBuilder.group({
    /**
     * We can make use of all the three variations we have used above for form control instance  i.e. passing a string ,
     * object or an array
     */
    firstName : ['' , [Validators.required , Validators.minLength(3) , Validators.maxLength(50)]],
    lastName : ['' , [Validators.required , Validators.minLength(3) , Validators.maxLength(50)]],
    /**
     * For cross field validations we have to group those fields together into a form group , after that we can write
     * our own custom valiator function which will get called. To the formgroup we can pass in an object which have
     * reference to the custom validator function and will get called if the two fields does not match. For eg: if email
     * and confirm email does not match. 
     */
    emailGroup : this.formBuilder.group({
    emailAddress : ['' , [Validators.required , Validators.minLength(8), Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
    confirmEmail : ['' , Validators.required]
    } , {validator : emailValidator}),
    /**
     * In order to duplicate or dynamically add elements to the html we have to build a form array that will
     * have the elements contained inside it and when an event is fired we dynamically add elements to that
     * form array and iterate over that array in the markup using repeater
     */
    phoneNumberArray : this.formBuilder.array([
        this.formBuilder.control(['', [Validators.required , Validators.minLength(10)]])
    ]),
    address : this.formBuilder.group({
      landMark : [''],
      street : [''],
      zipCode : [''],
      country : [''],
      city : [''],
      state : [''],
      houseNo : [''],
      society : ['']
    })
  })

  /**
   * Anguar provides us a valueChanges observable which will send us notification whenever the value of an input 
   * control is changed . We can subscribe to that observable and listen to the value changed event and perform 
   * validation. As we can see earlier whenever the user starts typing in the text box , validation error message 
   * shows up which is not good , we should give the user a chance to atleast type. In order to achieve that we make use of 
   * the debounceTime method of the observable , which lets us control when to call the function when there is  change in the
   * input element value. In our case we are specifying that whenever a value is changed wait for 1000 ms 
   * before calling the seterrorsOnfirstname method. So it gives the user a smooth experience.
   */
  this.userInfoForm.get('firstName').valueChanges.pipe(debounceTime(1000)).subscribe(
    value => this.setErrorsOnFirstName(this.userInfoForm.get('firstName'))
  );

  /**
   * Subscribing to observable for value changes of last name input field
   */
  this.userInfoForm.get('lastName').valueChanges.pipe(debounceTime(1000)).subscribe(
    value => this.setErrorsOnLastName(this.userInfoForm.get('lastName'))
  );

  /**
   * Subscribing to observable for value changes of email address input field
   */
  this.userInfoForm.get('emailGroup.emailAddress').valueChanges.pipe(debounceTime(1000)).subscribe(
    value => this.setErrorsOnEmailAddress(this.userInfoForm.get('emailGroup.emailAddress'))
  );
/*
  this.userInfoForm.get('phoneNumberArray').valueChanges.pipe(debounceTime(1000)).subscribe(
    value => this.setErrorsOnPhoneNumber(<FormArray>this.userInfoForm.get('phoneNumberArray'))
  )
  */
}

/**
 * 
 * @param element Function to set the value of the firstnamehaserrors property if there is any error
 */
setErrorsOnFirstName(element : AbstractControl){
  this.firstNameHasErrors = '';
  if(element.errors && (!element.pristine || element.touched))
  {
    this.firstNameHasErrors = Object.keys(element.errors).map(
      key => this.firstNameErrors[key]).join('');
  }
}

setErrorsOnLastName(element : AbstractControl){
  this.lastNameHasErrors = '';
  if(element.errors && (!element.pristine || element.touched))
  {
    this.lastNameHasErrors = Object.keys(element.errors).map(
      key => this.lastNameErrors[key]).join('');
  }
}

setErrorsOnEmailAddress(element : AbstractControl){
  this.emailAddressHasErrors = '';
  if(element.errors && (!element.pristine || element.touched))
  {
    Object.keys(element.errors).map(
      key => {
        if(this.emailAddressHasErrors === ''){
          this.emailAddressHasErrors = this.emailAddressErrors[key];
      }
  });
  }
}

/*
setErrorsOnPhoneNumber(element : FormArray) : void{
  for(let index = 0 ; index < element.controls.length ; index++)
  {
    if(element.controls[index].errors && (!element.controls[index].pristine || element.controls[index].touched))
  {
    Object.keys(element.controls[index].errors).map(
      key => {
        if(this.phoneHasErrors === ''){
          this.phoneHasErrors = this.phoneErrors[key];
      }
  });
  }
  }
}
*/
/**
 * method to be called when user wants to add a another phone number
 */
addAlternatePhoneNumber() : void {
  let control : FormControl = new FormControl('',[Validators.required , Validators.minLength(10)]);
  this.phoneNumberArray.push(control);
}

/**
 * method to be called when user wants to remove another phone number field if got added by mistake
 */
removeAlternatePhoneNumber() : void {
  if(this.phoneNumberArray.controls.length > 1)
  {
    this.phoneNumberArray.removeAt(this.phoneNumberArray.controls.length - 1);
  }
}

}

