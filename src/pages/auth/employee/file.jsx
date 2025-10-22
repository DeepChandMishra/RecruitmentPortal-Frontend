import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import uploadIcon from "../../../assets/images/upload.svg";
import uploadedIcon from "../../../assets/images/uploaded.svg";
import { fileDetailsSchema } from "../../../util/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../redux/action-types";
import { addEmployeeDetail } from "../../../redux/actions/user";
import Logo from "../../../assets/images/logo.svg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const FileDetails = () => {
  const [fileName, setFileName] = useState("");

  //Redux State  
  const { employeeDetails } = useSelector((state) => state.user);
  const { userDetails } = useSelector((state) => state.user);
  console.log("userDetails", userDetails);
  console.log("employeeDetails", employeeDetails);


  const { t, i18n } = useTranslation();
  const landingContent = t('landingPage')
  console.log("🚀 ~ Login ~ landingContent:", landingContent)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Use Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(fileDetailsSchema),
    mode: "onChange",
  });

  const onDrop = (acceptedFiles) => {
    console;
    if (acceptedFiles.length > 0) {
      setValue("resume", acceptedFiles);
      setFileName(acceptedFiles[0].name);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
    maxSize: 1048576, // 1MB
  });

  const onSubmit = (data) => {
    const resumeDetails = {
      ...employeeDetails,
      detailAdded: true,
      resume: data.resume[0],
    };

    const _data = {
      userId: userDetails?._id,
      employeeDetails: resumeDetails,
    };

    dispatch(
      addEmployeeDetail(_data, (result) => {
      })
    );
    toast.success("All details collected successfully");
    navigate("/employee-dashboard");
  };

  return (
    <div className="cardcontrols">
      <div className="logo-block text-center mb-5">
        <Link to='/' className='homepage-navigation'>
          <h5 className='back-to-homepage'>{landingContent?.signup?.back_buttonn}</h5>
          <img src={Logo} alt="logo" />
        </Link>
      </div>
      <div className="cards">
        <div className="titlecards">{landingContent?.signup?.addDetailLabel}</div>
        <div className="formdesign">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="pb-2"> Upload Your Resume</label>
            <div className="file-upload-wrapper mb-5" {...getRootProps()}>
              <div
                className={`file-upload-content ${isDragActive ? "drag-active" : ""
                  }`}
              >
                <img
                  src={fileName ? uploadedIcon : uploadIcon}
                  alt="Upload"
                  className="upload-image pb-4"
                />
                <h3 className="upload-title">
                  {fileName
                    ? `File uploaded: ${fileName}`
                    : "Drag or click here to upload file"}
                </h3>
                <p className="upload-description">
                  {landingContent?.signup?.file_upload_description}
                </p>
                <input {...register("resume")} {...getInputProps()} />
                {errors.resume && (
                  <div className="errorMsg">{errors.resume.message}</div>
                )}
              </div>
            </div>

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

export default FileDetails;
