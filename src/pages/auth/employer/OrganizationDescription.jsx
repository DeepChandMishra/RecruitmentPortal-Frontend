import React, { useEffect, useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { organizationDescriptionSchema } from "../../../util/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../redux/action-types";
import { addEmployerDetail } from "../../../redux/actions/user";
import ReactQuill from "react-quill";
import logo from '../../../assets/images/logo.svg';
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const OrganizationDescription = () => {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(""); // Content of Quill editor
  const [charCount, setCharCount] = useState(0); // Track character count
  const charLimit = 500;

  //Redux State
  const { userDetails } = useSelector((state) => state.user);
  const { employerDetails } = useSelector((state) => state.user);

  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')
  console.log("🚀 ~ Login ~ landingContent:", landingContent)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Use Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(organizationDescriptionSchema),
    mode: "onChange",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    startTransition(() => {
      setValue(name, value, { shouldValidate: true });
    });
  };

  useEffect(() => {
    if (employerDetails) {
      setValue("textdetails", employerDetails?.description);
      setValues(employerDetails?.description || "");
    }
  }, []);

  const onSubmit = (data) => {
    startTransition(() => {
      // Handle the form submission
      let business_details = {
        ...employerDetails,
        description: data?.textdetails,
        detailAdded: true,
      };

      dispatch({
        type: ActionType.EMPLOYER_DETAILS,
        payload: business_details,
      });
      addDetail(business_details)
      navigate("/details-organization-plan");
    });
  };

  const addDetail = async (data) => {
    const _data = {
      id: userDetails?._id,
      employerDetails: data,
    };

    dispatch(
      addEmployerDetail(_data, (result) => {
      })
    );
  };

  // Function to handle Quill input and limit character count
  const handleQuillChange = (content, delta, source, editor) => {
    const plainText = editor.getText(); // Get the plain text from the editor
    if (plainText.trim().length <= charLimit) {
      setValues(content); // Update the Quill content if within limit
      setCharCount(plainText.trim().length); // Update the character count
    } else {
      // If character count exceeds the limit, truncate the editor's text
      const trimmedText = plainText.trim().slice(0, charLimit); // Trim to limit
      const truncatedContent = editor.getContents().slice(0, charLimit); // Get the content within the limit

      editor.setContents(truncatedContent); // Set the truncated content in the editor
      setValues(editor.root.innerHTML); // Update the state with the truncated HTML
      setCharCount(charLimit);
    }
  };

  useEffect(() => {
    setValue("textdetails", values);
  }, [values, setValue]);

  return (

    <div>
      <div class="logo-block text-center mb-5">
        <a class="homepage-navigation" href="/">
          <h5 class="back-to-homepage">{landingContent?.signup?.back_buttonn}</h5>
          <img src={logo} alt="logo" />
        </a></div>

      <div className="cardcontrols">
        <div className="cards">
          <div className="titlecards">{landingContent?.signup?.organization_title}</div>
          <div className="formdesign">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="formControls mb-5">
                <label className="customeLabel">
                  {landingContent?.signup?.organization_title}
                </label>

                <ReactQuill
                  theme="snow"
                  value={values}
                  onChange={handleQuillChange}
                  style={{
                    height: "300px",
                    maxHeight: "600px",
                  }}
                />

              </div>
              <div>

                {errors.textdetails && (
                  <div className="errorMsg">{errors.textdetails.message}</div>
                )}
              </div>

              <div className="d-flex justify-content-between">
                <div className="formControls mt-5">
                  <button
                    className="btn border-0 bg-transparent btn-back  w-100"
                    type="button"
                    onClick={() => navigate("/details-organization-email")}
                  >
                    {landingContent?.signup?.backButtonLabel}
                  </button>
                </div>
                <div className="formControls mt-5">
                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : `${landingContent?.signup?.next_button}`}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDescription;
