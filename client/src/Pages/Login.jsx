import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userInfo, userStatus } from "../redux/userSlice";
import { useMutation } from "react-query";
import { login } from "../api/api";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import axios from "axios";

const Login = () => {
  // const BASE_URL = "http://localhost:5000/api";
  const BASE_URL = "https://starwheal.onrender.com/api";

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  const [loginError, setLoginError] = useState("");
  const [userType, setUserType] = useState("");
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setUserType(event.target.value);
  };

  const saveState = (userData) => {
    dispatch(userStatus(true));
    dispatch(userInfo(userData));
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const mutation = useMutation({
    mutationFn: login,
    mutationKey: ["user-profile"],
    onSuccess: ({ user }) => {
      console.log(user);
      if (user) {
        saveState(user);
        navigate("/");
      }
    },
    onError: ({ response }) => {
      console.log(response.data.error);
      if (response.data.error === "ERR_EMAIL_OR_PASSWORD") {
        return setLoginError("Invalid email or password");
      }
      setLoginError("Invalid email or password");
    },
  });

  const handleSubmit = async (data) => {
    mutation.mutate(data);
  };

  const getLogo = async () => {
    try {
      dispatch(showLoading());
      const response = await api.get("/admin/get-logo");
      dispatch(hideLoading());
      if (response.data.success) {
        // setLogo(response.data.data);
        setLogo(response.data.data.clinicLogo);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getLogo();
  }, []);

  return (
    // <Formik
    //   initialValues={{
    //     email: "",
    //     password: "",
    //   }}
    //   validationSchema={Yup.object({
    //     email: Yup.string()
    //       .email("Invalid email adress")
    //       .required("Required")
    //       .trim(),
    //     password: Yup.string()
    //       .min(4, "Must be greater than 4 characters")
    //       .required("Required")
    //       .trim(),
    //   })}
    //   onSubmit={(values) => {
    //     handleSubmit({ ...values, userType });
    //   }}
    // >
    //   {(formik) => (
    //     <Box
    //       display="flex"
    //       justifyContent="center"
    //       alignItems="center"
    //       width="100%"
    //       height="100vh"
    //       sx={{
    //         backgroundColor: "#005555",
    //       }}
    //     >
    //       <Box
    //         component="form"
    //         sx={{
    //           mx: "auto",
    //           p: 2,
    //           width: {
    //             xs: "90%",
    //             md: 500,
    //           },
    //           display: "flex",
    //           flexDirection: "column",
    //           backgroundColor: "white",
    //           borderRadius: 1,
    //           boxShadow: 1,
    //         }}
    //         noValidate
    //         autoComplete="off"
    //         onSubmit={formik.handleSubmit}
    //       >
    //         <Typography
    //           textAlign="center"
    //           fontSize={25}
    //           mb={2}
    //           mt={2}
    //           variant="formTitle"
    //         >
    //           Welcome
    //         </Typography>
    //         <Typography fontSize={14} variant="body1" mb={2} mt={2} color="red">
    //           {loginError}
    //         </Typography>

    //         <FormControl fullWidth sx={{ marginBottom: 2 }}>
    //           <InputLabel id="demo-simple-select-label">
    //             Select user type
    //           </InputLabel>
    //           <Select
    //             labelId="demo-simple-select-label"
    //             id="demo-simple-select"
    //             value={userType}
    //             label="Select user type"
    //             onChange={handleChange}
    //           >
    //             <MenuItem value="patient">Patient</MenuItem>
    //             <MenuItem value="doctor">Doctor</MenuItem>
    //             <MenuItem value="admin">Admin</MenuItem>
    //           </Select>
    //         </FormControl>

    //         <TextField
    //           sx={{ mb: 2 }}
    //           type="text"
    //           required
    //           label="Email"
    //           variant="outlined"
    //           error={formik.touched.email && formik.errors.email && true}
    //           helperText={
    //             formik.touched.email && formik.errors.email
    //               ? formik.errors.email
    //               : null
    //           }
    //           {...formik.getFieldProps("email")}
    //         />

    //         <TextField
    //           type="password"
    //           required
    //           label="Password"
    //           variant="outlined"
    //           error={formik.touched.password && formik.errors.password && true}
    //           helperText={
    //             formik.touched.password && formik.errors.password
    //               ? formik.errors.password
    //               : null
    //           }
    //           {...formik.getFieldProps("password")}
    //           sx={{ mb: 2 }}
    //         />

    //         <Button
    //           type="submit"
    //           variant="contained"
    //           disabled={mutation.isLoading}
    //           size="large"
    //           sx={{ py: 1.5 }}
    //         >
    //           {mutation.isLoading ? (
    //             <CircularProgress sx={{ color: "#147edb" }} size="26px" />
    //           ) : (
    //             "Login"
    //           )}
    //         </Button>
    //         <Typography mt={2} variant="subtitle2" align="center">
    //           Don{"'"}t have an account? Register{" "}
    //           <Link to="/register">here.</Link>
    //         </Typography>
    //       </Box>
    //     </Box>
    //   )}
    // </Formik>
    <div className="vh-100" style={{ backgroundColor: "#005555" }}>
      <div className="d-flex h-100">
        <div className="m-auto container p-3 px-lg-5 py-lg-4">
          <div className="bg-white shadow rounded p-3 px-lg-5 py-lg-4">
            <div className="row">
              <div className="col-md-6 border-end border-1">
                <div className="h-100 d-flex align-items-center">
                  <div className="text-center p-3 w-100">
                    <img
                      className="img-fluid login-img mb-3 w-50"
                      src={
                        logo?.selectedFile ||
                        "https://affinitymedicalclinic.ca/wp-content/uploads/2017/03/Affinity_Medical.png"
                      }
                      alt="s"
                    />
                    <h1 className="fw-bold text-black">
                      STARWHEAL MEDICAL CLINIC
                    </h1>
                  </div>
                </div>
              </div>
              <div className="col-md-6 p-3 px-lg-5 py-lg-4">
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                  }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .email("Invalid email adress")
                      .required("Required")
                      .trim(),
                    password: Yup.string()
                      .min(4, "Must be greater than 4 characters")
                      .required("Required")
                      .trim(),
                  })}
                  onSubmit={(values) => {
                    handleSubmit({ ...values, userType });
                  }}
                >
                  {(formik) => (
                    <Box>
                      <Box
                        component="form"
                        sx={{
                          mx: "auto",
                          p: 2,
                          width: {
                            xs: "90%",
                            md: 500,
                          },
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "white",
                          borderRadius: 1,
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={formik.handleSubmit}
                      >
                        <Typography
                          textAlign="center"
                          fontSize={25}
                          variant="formTitle"
                        >
                          Welcome
                        </Typography>
                        <Typography
                          fontSize={14}
                          variant="body1"
                          mb={2}
                          mt={2}
                          color="red"
                        >
                          {loginError}
                        </Typography>

                        {/* <FormControl fullWidth sx={{ marginBottom: 2 }}>
                          <InputLabel id="demo-simple-select-label">
                            Select user type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={userType}
                            label="Select user type"
                            onChange={handleChange}
                          >
                            <MenuItem value="patient">Patient</MenuItem>
                            <MenuItem value="doctor">Doctor</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                        </FormControl> */}

                        <TextField
                          sx={{ mb: 2 }}
                          type="text"
                          required
                          label="Email"
                          variant="outlined"
                          error={
                            formik.touched.email && formik.errors.email && true
                          }
                          helperText={
                            formik.touched.email && formik.errors.email
                              ? formik.errors.email
                              : null
                          }
                          {...formik.getFieldProps("email")}
                        />

                        <TextField
                          type="password"
                          required
                          label="Password"
                          variant="outlined"
                          error={
                            formik.touched.password &&
                            formik.errors.password &&
                            true
                          }
                          helperText={
                            formik.touched.password && formik.errors.password
                              ? formik.errors.password
                              : null
                          }
                          {...formik.getFieldProps("password")}
                          sx={{ mb: 2 }}
                        />

                        <Button
                          type="submit"
                          variant="contained"
                          disabled={mutation.isLoading}
                          size="large"
                          sx={{ py: 1.5 }}
                        >
                          {mutation.isLoading ? (
                            <CircularProgress
                              sx={{ color: "#147edb" }}
                              size="26px"
                            />
                          ) : (
                            "Login"
                          )}
                        </Button>
                        <Typography mt={2} variant="subtitle2" align="center">
                          Don{"'"}t have an account? Register{" "}
                          <Link to="/register">here.</Link>
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
