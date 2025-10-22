// validationSchemas.js
import * as Yup from "yup";

let errorMessage = "This field is required.";

//Login Schema
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required.")
    .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Email is not valid."),
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password should be at least 6 characters."),
});

//Forgot Password Schema
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required.")
    .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Email is not valid."),
});

//Reset Password Schema
export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

//Signup Schema
export const signupSchema = Yup.object().shape({
  firstName: Yup.string().required(errorMessage),
  lastName: Yup.string().required(errorMessage),
  email: Yup.string()
    .required(errorMessage)
    .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Email is not valid."),
  password: Yup.string()
    .required(errorMessage)
    .min(6, "Password should be at least 6 characters."),
  acceptance: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions."
  ),
});

export const employerDetailsSchema = Yup.object().shape({
  businessName: Yup.string().required("Name of business is required"),

  businessAddress: Yup.string().required("Business address is required"),

  city: Yup.string().required("City is required"),

  postalCode: Yup.string()
    .matches(
      /^[A-Za-z0-9 ]+$/,
      "Postal code can only contain letters, numbers, and spaces"
    )
    .required("Postal code is required"),

  country: Yup.string().required("Country is required"),
  state: Yup.string().required("Country is required"),
});

export const organizationDescriptionSchema = Yup.object().shape({
  textdetails: Yup.string()
    .required("Description of your organisation is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
});

export const organizationDetailsSchema = Yup.object().shape({
  registrationNumber: Yup.string()
    .required("Registration number is required")
    // .matches(/^[\d]+$/, 'Registration number must be a number')
    .typeError("Registration number must be a string"),

  vatNumber: Yup.string()
    .required("VAT number is required")
    // .matches(/^[\d]+$/, 'VAT number must be a number')
    .typeError("VAT number must be a string"),

  sizeOfBusiness: Yup.string().required("Size of business is required"),
});

export const organizationEmailSchema = Yup.object().shape({});

export const professionalPlanSchema = Yup.object().shape({
  // professionalPlan: Yup.string().required("Please select a professional plan"),
});

export const socialDetailsSchema = Yup.object().shape({
  // facebook: Yup.string()
  //   .url('Invalid URL format')
  //   .required('Facebook URL is required'),
  // linkedIn: Yup.string()
  //   .url('Invalid URL format')
  //   .required('LinkedIn URL is required'),
  // instagram: Yup.string()
  //   .url('Invalid URL format')
  //   .required('Instagram URL is required'),
  // website: Yup.string()
  //   .url('Invalid URL format')
  //   .required('Website URL is required'),
});

export const fileDetailsSchema = Yup.object().shape({});

export const selectPlanSchema = Yup.object().shape({
  plan: Yup.string().required("Selecting a plan is required"),
});

export const skillSchema = Yup.object().shape({
  skills: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string(),
      })
    )
    .min(1, 'At least one skill must be selected')
    .required('At least one skill must be selected'),

  languages: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string(),
      })
    )
    .min(1, 'At least one language must be selected')
    .required('At least one language must be selected'),

  opportunities: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one opportunity type must be selected')
    .required('At least one opportunity type must be selected'),
});

export const titleSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot be more than 100 characters long"),
  description: Yup.string()
    .required("Description is required")
    .test(
      "plain-text-length",
      "Description must be at least 10 characters long",
      (value) => {
        const plainText = value ? value.replace(/<\/?[^>]+(>|$)/g, "") : "";
        return plainText.length >= 10;
      }
    )
    .test(
      "plain-text-max-length",
      "Description cannot be more than 500 characters long",
      (value) => {
        const plainText = value ? value.replace(/<\/?[^>]+(>|$)/g, "") : "";
        return plainText.length <= 500;
      }
    ),
});

export const jobTitleSchema = Yup.object().shape({
  role: Yup.object().required("Role is required"),
});

export const jobInfoSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
});
