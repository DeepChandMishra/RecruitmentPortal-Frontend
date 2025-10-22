import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { titleSchema } from "../../../util/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../redux/action-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import Logo from "../../../assets/images/logo.svg";
import { useTranslation } from "react-i18next";

const TitleDetails = () => {
  const [values, setValues] = useState(""); // Content of Quill editor
  const [charCount, setCharCount] = useState(0); // Track character count
  const charLimit = 500; // Character limit for the description field

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State
  const { employeeDetails } = useSelector((state) => state.user);

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')
  console.log("🚀 ~ Login ~ landingContent:", landingContent)

  // Use Form
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(titleSchema), // Uncomment if using yup for validation
  });

  useEffect(() => {
    if (employeeDetails) {
      setValue("title", employeeDetails?.title);
      setValue("description", employeeDetails?.description);
      setValues(employeeDetails?.description || "");
      setCharCount(employeeDetails?.description?.replace(/<\/?[^>]+(>|$)/g, "").length || 0); // Set initial character count
    }
  }, [employeeDetails]);

  // Handle form submission
  const onSubmit = (data) => {
    const employeeDetail = {
      title: data.title,
      description: values,
    };
    dispatch({
      type: ActionType.EMPLOYEE_DETAILS,
      payload: employeeDetail,
    });

    navigate("/details-skills"); // Replace with your next page route
  };

  useEffect(() => {
    setValue("description", values);
  }, [values, setValue]);

  // Function to handle Quill input and limit character count
  const handleQuillChange = (content, delta, source, editor) => {
    const plainText = editor.getText(); // Get plain text
    const plainTextLength = plainText.trim().length;

    if (plainTextLength <= charLimit) {
      setValues(content); // Update content if within limit
      setCharCount(plainTextLength); // Update character count
    } else {
      // Notify user they have exceeded the limit
      toast.warn("Character limit exceeded");
    }
  };

  const onError = (errors, e) => {
    toast.error(errors?.description?.message);
  };

  return (
    <div className="cardcontrols">
      <div className="logo-block text-center mb-5">
        <Link to='/' className='homepage-navigation'>
          <h5 className='back-to-homepage'>{landingContent?.signup?.backButton}</h5>
          <img src={Logo} alt="logo" />
        </Link>
      </div>
      <div className="cards">
        <div className="titlecards">{landingContent?.signup?.addDetailLabel}</div>
        <div className="formdesign">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="formControls">
              <label className="customeLabel">{landingContent?.signup?.titleLabel}</label>
              <input
                type="text"
                className={`authfields ${errors.title ? "is-invalid" : ""}`}
                placeholder={landingContent?.signup?.titleLabel}
                autoComplete="off"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title.message}</div>
              )}
            </div>

            <div className="formControls">
              <label className="customeLabel">
                {landingContent?.signup?.titleDescription}
              </label>
              <ReactQuill
                theme="snow"
                value={values}
                onChange={handleQuillChange}
                className="experience-description"
              />
              {errors.description && (
                <div className="invalid-feedback">
                  {errors.description.message}
                </div>
              )}
            </div>

            {/* Display dynamic character count */}
            <span className="input-span-col">
              {charLimit - charCount} {landingContent?.signup?.charcatersLeft}
            </span>

            <div className="d-flex justify-content-between">
              <div className="formControls mt-5">
                <button
                  className="btn border-0 bg-transparent btn-back w-100"
                  type="button"
                  onClick={() => navigate(-1)} // Go back to the previous page
                >
                  {landingContent?.signup?.backButtonLabel}
                </button>
              </div>
              <div className="formControls mt-5">
                <button className="btn btn-primary w-100" type="submit">
                  {landingContent?.signup?.nextButtonLabel}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TitleDetails;
