import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { jobInfoSchema } from "../../util/validationSchema";
import { ActionType } from "../../redux/action-types";
import { useCommonContext } from "../../context/commonContext";
import { containsHttps } from "../../util/UtilFunction";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function JobPostInformation() {
  const [file, setFile] = useState(null);
  const [charCount, setCharCount] = useState(0); // Track character count
  const maxCharLimit = 8000; // Max character limit
  const { fileData, saveFile } = useCommonContext();
  const { jobDetails } = useSelector((state) => state.jobposting);
  const [description, setDescription] = useState(jobDetails?.description || "");
 console.log('description',description);
 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(jobInfoSchema),
    mode: "onChange",
  });

  // Setting initial job details if available and syncing form state
  useEffect(() => {
    if (jobDetails) {
      setCharCount(jobDetails?.description?.length || 0);
      setDescription(jobDetails?.description || ""); // Initialize description state
      setValue("description", jobDetails?.description );
      if (containsHttps(jobDetails?.file)) {
        saveFile({ name: jobDetails?.file });
      }
    }
  }, []);

  const onSubmit = (data) => {
    let jobPostingDetails = {
      ...jobDetails,
      description: data.description,
    };

    if (fileData?.name) {
      jobPostingDetails.file = fileData?.name
    }

    dispatch({
      type: ActionType.JOB_DETAILS,
      payload: jobPostingDetails,
    });
    navigate("/job-details", { state: file });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    saveFile(selectedFile);
  };

  const handleDescriptionChange = (value) => {
    // Sanitize and strip out HTML tags, keeping only visible text
    const textContent = value.replace(/<\/?[^>]+(>|$)/g, "").trim(); // This removes HTML tags and trims spaces
  
    if (textContent.length <= maxCharLimit) {
      setDescription(value); 
      setCharCount(textContent.length); 
      setValue("description", value); 
    } else {
      const truncatedValue = value.slice(0, maxCharLimit);
      const truncatedTextContent = truncatedValue.replace(/<\/?[^>]+(>|$)/g, "").trim(); // Again sanitize the truncated value
      setDescription(truncatedValue); 
      setCharCount(truncatedTextContent.length); 
      setValue("description", truncatedValue); 
    }
  };
  
  return (
    <div>
      <div className="container job-post pt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="job-wrapper">
            <div className="d-flex job-range justify-content-between">
              <div className="text-col ">
                <h6 className="heading-stepper">
                  <span>6/6</span>Post an Opportunity
                </h6>
                <h2 className="job-head-col">Feel free to share any further details</h2>
                <ul className="job-list-col m-0 px-0">
                  Adding a pay range can be very helpful for candidates and
                  boost your posting.
                  <li className="ps-1">
                    Clear expectations about your task or deliverables.
                  </li>
                  <li className="ps-1">The skills required for your work.</li>
                  <li className="ps-1">Good communication</li>
                  <li className="ps-1">
                    Details about how you or your team like to work.
                  </li>
                </ul>
              </div>

              <div className="input-col">
                <div className="info-inner-row">
                  <div className="formControls mb-1">
                    <label className="customeLabel d-block">
                      Description of the opportunity
                    </label>
                    {/* Uncomment if you want a plain textarea instead of ReactQuill */}
                    {/* <textarea
                      id="textdetails"
                      className="text-details"
                      name="description"
                      rows="12"
                      cols="49"
                      {...register("description")}
                      placeholder="Description of the opportunity"
                      onChange={handleDescriptionChange} // Handle text change
                    ></textarea> */}
                    
                    {/* ReactQuill component for rich text editing */}
                    <ReactQuill
                      theme="snow"
                      value={description}
                      className="quill_text"
                      onChange={handleDescriptionChange}
                      placeholder="Description of the opportunity"
                      style={{ height: "auto", maxWidth:"550px", width:"100%" }}
                    />
                    {errors.description && (
                      <div className="errorMsg">
                        {errors.description.message}
                      </div>
                    )}
                  </div>
                  {/* Dynamic character count */}
                  <span className="input-span-col">
                    {/* Display character limit */}
                    {maxCharLimit - charCount } characters max
                    {console.log(charCount , "and", maxCharLimit)} 
                  </span>
                </div>

                <div>
                  {/* Uncomment if you need help or additional information */}
                  {/* <span className="info-span">Need help?</span>
                  <p className="text-label">
                    See examples of effective descriptions.
                  </p> */}
                  <div className="file-upload-wrapper-info">
                    <label htmlFor="file-upload" className="file-upload-label">
                      <i className="fa fa-paperclip"></i>
                      {fileData ? fileData.name : "Attach File"}
                    </label>
                    <input
                      type="file"
                      id="file-upload"
                      className="file-upload-input"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <span className="info-span">Max file size: 100 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between end-btn-row py-5">
            <div>
              <button
                className="btn back border-0 bg-transparent"
                type="button"
                onClick={() => navigate("/job-range")}
              >
                Back
              </button> 
            </div>
            <div>
              <button className="btn btn-primary" type="submit">
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
