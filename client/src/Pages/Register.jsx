import Box from "@mui/material/Box";
import { DatePicker, Space } from "antd";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  InputLabel,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "react-query";
import { register } from "../api/api";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Register = () => {
  const [profileImage, setProfileImage] = useState();
  const [open, setOpen] = useState(false);
  const [fileError, setFileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [profileImageLink, setProfileImageLink] = useState();
  const navigate = useNavigate();

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleCheckboxChange = (event) => {
    setAgreeToTerms(event.target.checked);
  };

  // const handleFileChange = (e) => {
  //   const profilePic = e.target.files[0];
  //   setProfileImage(profilePic);
  //   setProfileImageLink(URL.createObjectURL(profilePic));
  //   setFileError("");
  // };

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => navigate("/login"),
    onError: ({ response }) => {
      if (response.data.error === "ERR_DUPLICATE_EMAIL") {
        setEmailError("Email is already registered.");
      }
    },
  });

  const handleSubmit = async (data) => {
    const {
      firstname,
      lastname,
      email,
      password,
      gender,
      birthday,
      mobileNumber,
      address,
      agreeToTerms,
    } = data;
    // if (!profileImage) {
    //   setFileError("Profile picture required");
    //   return;
    // }
    const formData = new FormData();
    formData.append("image", profileImage);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("gender", gender);
    formData.append("birthday", birthday);
    formData.append("mobileNumber", mobileNumber);
    formData.append("address", address);
    formData.append("agreeToTerms", agreeToTerms);
    // formData.append('profileImage', profileImage);

    mutation.mutate(formData);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%", // Set the initial width as a percentage
    height: "auto", // Let the height adjust based on content
    maxWidth: "600px", // Set a maximum width for larger screens
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    maxHeight: "80vh",
    overflow: "auto",
    p: 4,
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Adjust the width for small screens
  if (isSmallScreen) {
    style.width = "95%";
    style.maxWidth = "none";
  }

  const handleOpen = (event) => {
    event?.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  // const { handleChange, values } = useFormikContext();

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            Terms and Conditions
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            Starwheal Medical Clinic is a medical service consultation that
            provides you with better health conditions and recommendations like
            check-ups, piercing, circumcision etc.
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h3">
            1. PRIVACY POLICY
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h4">
            1.1 Information We Collect
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            We may collect various of information to our patients, including
            Personal Information: Information can be used to identify patient
            such as name, age, address, email address, and contact information.
            We may also collect you health information such as medical history,
            symptoms and treatments when you provide it to us.
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h3">
            Patient users:
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h5">
            For appointments:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            Patients can only book one appointment and one doctor per session,
            the patient cannot book two or multiple doctors and appointments at
            the same time or if there is a pending appointment
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h5">
            For appointment approval:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            The patient must wait for the doctor to approve their requested
            appointment so that they can print appointment details to show as a
            proof before coming to the clinic.
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h5">
            For appointment cancellations:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            You can only cancel your appointment 24 hours before the actual
            appointment time.
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h5">
            For late arrivals:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            If you, the patient, failed to arrive five to ten minutes before the
            requested appointment time you will be considered as a walk-in
            patient.
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h5">
            For SMS notification:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            Patient receives an SMS reminder the day of the appointment to
            remind that she has an appointment.
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h5">
            For Reschedule:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            After cancelling an appointment, the patient is welcome to
            reschedule and book a new appointment at their convenience.
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h5">
            For Appointment time
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            The appointment that the patient booked will not be always punctual,
            sometimes other patients appointments will exceed their allotted
            time and that will affect other appointments if this happens please
            wait until the other appointment is done and please exercise
            patience and understanding.
          </Typography>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={() => handleClose()}
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
            >
              Accept
            </Button>
          </div>
        </Box>
      </Modal>
      <Formik
        initialValues={{
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          birthday: "",
          gender: "",
          address: "",
          mobileNumber: "",
          agreeToTerms: false,
        }}
        validationSchema={Yup.object({
          firstname: Yup.string()
            .max(30, "Must be 30 characters or less")
            .min(3, "Must be 3 characters or more")
            .required("Required")
            .trim(),
          lastname: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("Required")
            .min(3, "Must be 3 characters or more")
            .trim(),
          email: Yup.string()
            .email("Invalid email adress")
            .required("Required")
            .trim(),
          password: Yup.string()
            .min(4, "Must be greater than 4 characters")
            .required("Required")
            .trim(),
          address: Yup.string()
            .min(3, "Must be greater than 3 characters")
            .required("Required")
            .trim(),
          mobileNumber: Yup.string()
            .min(3, "Must be 11 characters")
            // .max(11, 'Must be 11 characters')
            .required("Required")
            .trim(),
          birthday: Yup.string().required("Required").trim(),
          gender: Yup.string().required("Required").trim(),
          agreeToTerms: Yup.boolean()
            .oneOf([true], "You must agree to the terms and conditions")
            .required("You must agree to the terms and conditions"),
        })}
        onSubmit={(values) => {
          console.log(values);
          handleSubmit(values);
        }}
      >
        {(formik) => (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100vh"
            sx={{
              backgroundColor: "#005555",
            }}
          >
            <Box
              component="form"
              sx={{
                mx: "auto",
                p: 2,
                my: 3,
                width: {
                  xs: "90%",
                  md: 500,
                },
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: 1,
                boxShadow: 1,
              }}
              noValidate
              autoComplete="off"
              onSubmit={formik.handleSubmit}
            >
              <Typography
                textAlign="center"
                py={{ xs: 2, sm: 4 }}
                variant="formTitle"
                mb={2}
                fontSize={{ xs: 20, sm: 25 }}
              >
                Create an account
              </Typography>

              <TextField
                type="text"
                id="firstname"
                required
                label="Firstname"
                sx={{ mb: 2 }}
                variant="outlined"
                size="small"
                error={
                  formik.touched.firstname && formik.errors.firstname && true
                }
                helperText={
                  formik.touched.firstname && formik.errors.firstname
                    ? formik.errors.firstname
                    : null
                }
                {...formik.getFieldProps("firstname")}
              />
              <TextField
                type="text"
                required
                label="Lastname"
                variant="outlined"
                size="small"
                error={
                  formik.touched.lastname && formik.errors.lastname && true
                }
                helperText={
                  formik.touched.lastname && formik.errors.lastname
                    ? formik.errors.lastname
                    : null
                }
                {...formik.getFieldProps("lastname")}
                sx={{ mb: 2 }}
              />
              <TextField
                sx={{ mb: 2 }}
                type="text"
                required
                label="Email"
                variant="outlined"
                size="small"
                error={
                  emailError !== "" ||
                  (formik.touched.email && formik.errors.email && true)
                }
                helperText={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : emailError
                    ? emailError
                    : null
                }
                {...formik.getFieldProps("email")}
              />
              <TextField
                type="password"
                required
                label="Password"
                variant="outlined"
                size="small"
                error={
                  formik.touched.password && formik.errors.password && true
                }
                helperText={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : null
                }
                {...formik.getFieldProps("password")}
                sx={{ mb: 2 }}
              />
              <TextField
                type="text"
                required
                label="Address"
                variant="outlined"
                size="small"
                error={formik.touched.address && formik.errors.address && true}
                helperText={
                  formik.touched.address && formik.errors.address
                    ? formik.errors.address
                    : null
                }
                {...formik.getFieldProps("address")}
                sx={{ mb: 2 }}
              />
              <TextField
                type="number"
                required
                label="Mobile number"
                variant="outlined"
                size="small"
                error={
                  formik.touched.mobileNumber &&
                  formik.errors.mobileNumber &&
                  true
                }
                helperText={
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                    ? formik.errors.mobileNumber
                    : null
                }
                {...formik.getFieldProps("mobileNumber")}
                sx={{ mb: 2 }}
              />
              <Box display="flex" sx={{ justifyContent: "space-between" }}>
                <FormControl sx={{ marginBottom: 2, width: "30%" }}>
                  <InputLabel size="small" id="demo-simple-select-label">
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Gender"
                    size="small"
                    {...formik.getFieldProps("gender")}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
                <Stack direction="row">
                  <InputLabel sx={{ marginTop: 1, marginRight: 1 }}>
                    Birthday:
                  </InputLabel>
                  <TextField
                    type="date"
                    required
                    // label="Birthday"
                    variant="outlined"
                    size="small"
                    error={
                      formik.touched.birthday && formik.errors.birthday && true
                    }
                    helperText={
                      formik.touched.birthday && formik.errors.birthday
                        ? formik.errors.birthday
                        : null
                    }
                    {...formik.getFieldProps("birthday")}
                    sx={{ mb: 2 }}
                  />
                </Stack>
              </Box>
              {/* {profileImageLink && (
                <Avatar
                  size="large"
                  alt="profile-image"
                  src={profileImageLink}
                  sx={{ width: 56, height: 56 }}
                />
              )}
              <InputLabel sx={{ marginTop: "10px" }}>
                Profile picture
              </InputLabel>
              <input
                accept=".png,.jpg,.jpeg"
                type="file"
                style={{
                  marginBottom: "20px",
                  fontSize: "16px",
                  paddingTop: "10px",
                }}
                onChange={handleFileChange}
                name="image"
              />
              {fileError ? (
                <Typography mt={-2} mb={2} variant="caption" color="red">
                  {fileError}
                </Typography>
              ) : null} */}

              <FormControlLabel
                control={
                  <Field type="checkbox" name="agreeToTerms" as={Checkbox} />
                }
                label={
                  <>
                    <span>By submitting this form, you agree to our </span>
                    <span
                      style={{
                        color: "green",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpen()}
                    >
                      Terms and Conditions.
                    </span>
                  </>
                }
              />

              <Button
                variant="contained"
                disabled={false}
                size="large"
                sx={{ py: 1.5 }}
                type="submit"
              >
                {" "}
                {mutation.isLoading ? (
                  <CircularProgress sx={{ color: "#147edb" }} size="26px" />
                ) : (
                  <>
                    <CreateOutlinedIcon
                      sx={{ marginRight: "10px" }}
                      fontSize="small"
                    />{" "}
                    Register
                  </>
                )}
              </Button>

              <Typography mt={2} variant="subtitle2" align="center">
                Already have an account? Login <Link to="/login">here.</Link>
              </Typography>
            </Box>
          </Box>
        )}
      </Formik>
    </>
  );
};

export default Register;
