import { Box, Button, FormControl, FormLabel, InputGroup, InputRightElement  } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik';
import ImageFormField from '../ImageFormField/ImageFormField';
import Home from './../../pages/home page/Home.module.css'
import * as Yup from "yup";
import axios from 'axios'
import { REQUEST_AUTH } from '../../store/auth/authActionTypes';


const Signup = () => {
  const [show, setShow] = useState()
  const [showConfirm, setShowConfirm] = useState()
  const [loading, setLoading] = useState(false);
  // const [finalPic, setFinalPic] = useState();

  const initialValues =  {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    pic: ''
  }

  const validationSchema= Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email:  Yup.string().required("Please enter your email address").email('Invalid email address'),
    password: Yup.string().required("Please enter your password").matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
    confirmPassword: Yup.string().required("Re-enter your password").oneOf([Yup.ref("password"), null], "Passwords must match"),
  })

// useEffect(() => {
//   console.log(finalPic)
// },[finalPic])
  // console.log(finalPic)

  let aaa = null
  const handleSubmit = async(e) => {
    setLoading(!loading)
    console.log(e)
    const sendData = async() => {
      const data = {
      name :e.name,
      email :e.email,
      password: e.password,
      pic: aaa,
      }
      console.log(data, "8888888")
      await axios.post('http://localhost:4000/user',data)
      .then((res) => {console.log(res)
        localStorage.setItem('userInfo', JSON.stringify(res.data.token))
        setLoading(false)
      })
      .catch((err) => {console.log(err)
        setLoading(false)})
      }
    if(e.pic){
      const formdata = new FormData();
      formdata.append("file", e.pic)
      formdata.append("upload_preset", "chat-app");
      formdata.append("cloud_name", "dien8bnav")
      await axios.post('https://api.cloudinary.com/v1_1/dien8bnav/image/upload', formdata)
      .then((res) => {

        aaa = res.data.url.toString()
        console.log(res.data.url.toString())
        setLoading(!loading)
        sendData();
      })
      
    }
  }

  const handleClick = () => setShow(!show);
  const handleClickConfirm = () => setShowConfirm(!showConfirm);
  return (
    <Box spacing='5px'>
      <Formik
       initialValues={initialValues}
       validationSchema={validationSchema}
       onSubmit={handleSubmit}
      >
      {({ setFieldValue, values, errors, touched }) => (
      <Form>
        <FormControl isRequired className={Home.space}>
          <FormLabel>Name:</FormLabel>
          <Field name="name"  type="text" placeholder="Enter Your Name" style={{width: '100%', padding: '8px', border: '1px solid #ccc' }} />
          {errors.name && touched.name ? (
            <div style={{ color: "red" }}>{errors.name}</div>
          ) : null}
        </FormControl>
        <FormControl isRequired className={Home.space}>
          <FormLabel>Email Address:</FormLabel>
          <Field name="email"  type="text" placeholder="Enter Your Email" style={{width: '100%', padding: '8px', border: '1px solid #ccc' }} />
          {errors.email && touched.email ? (
            <div style={{ color: "red" }}>{errors.email}</div>
          ) : null}
        </FormControl>
        <FormControl isRequired className={Home.space}>
          <FormLabel>Password:</FormLabel>
          <InputGroup size="md">
            <Field name="password"  type={show ? "text" : "password"} placeholder="Enter Your Password" style={{width: '100%', padding: '8px', border: '1px solid #ccc' }} />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.password && touched.password ? (
            <div style={{ color: "red" }}>{errors.password}</div>
          ) : null}
        </FormControl>
        <FormControl isRequired className={Home.space}>
          <FormLabel>Confirm Password:</FormLabel>
          <InputGroup size="md">
            <Field name="confirmPassword"  type={showConfirm ? "text" : "password"} placeholder="Confirm Your Password" style={{width: '100%', padding: '8px', border: '1px solid #ccc' }} />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClickConfirm}>
                {showConfirm ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.confirmPassword && touched.confirmPassword ? (
            <div style={{ color: "red" }}>{errors.confirmPassword}</div>
          ) : null}
        </FormControl>
        <FormControl  className={Home.space}>
          <FormLabel>Upload Image</FormLabel>
          <ImageFormField
            disabled={false}
            pic={"pic"}
            onSuccess={({ file: file }) => {
              if (file) setFieldValue("pic", file);
            }}
          />
        </FormControl>
        <Button type='submit' colorScheme='blue' width='100%' isLoading={loading}>Sign up</Button>
      </Form>
      )}
      </Formik>
    </Box>
  )
}

export default Signup