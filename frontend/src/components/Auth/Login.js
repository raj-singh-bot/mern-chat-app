import { Box, Button, FormControl, FormLabel, InputGroup, InputRightElement } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import Home from './../../pages/home page/Home.module.css'
import * as Yup from "yup";
import axios from 'axios';
import { REQUEST_AUTH } from '../../store/auth/authActionTypes';
import { useDispatch } from "react-redux";

const Login = () => {
  const [show, setShow] = useState()
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const dispatch = useDispatch();

  const handleClick = () => setShow(!show);

  const initialValues = {
    email: '',
    password: ''
  }

  const validationSchema = Yup.object().shape({
    email:  Yup.string().required("Please enter your email address").email('Invalid email address'),
    password: Yup.string().required("Please enter your password")
  })

  const handleSubmit = async (e) => {
    setLoading(!loading)
    console.log(e)
    const data = {
      email :e.email,
      password: e.password,
    }
    dispatch({ type: REQUEST_AUTH, payload: data});

    // await axios.post('http://localhost:4000/user/login',data)
    // .then((res) => {console.log(res.data)
    //   localStorage.setItem('token', JSON.stringify(res.data.token))
    //   setLoading(false)})
    // .catch((err) => {console.log(err)
    //   setLoading(false)})
    
  }

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
        <Button type='submit' colorScheme='blue' width='100%'>Log In</Button>
      </Form>
      )}
      </Formik>
    </Box>
  )
}

export default Login