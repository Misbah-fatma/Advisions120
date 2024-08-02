import React, { useState, useEffect} from 'react';
import {
  Box,
  Center,
  Container,
  Heading,
  Input,
  Button,
  ChakraProvider,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import bg from "./bg.jpg"

const ResetPassword = () => {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("user");
    if (userDataFromStorage) {
      try {
        const parsedData = JSON.parse(userDataFromStorage);
        setUserData(parsedData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const toast = useToast();

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    axiosInstance.post(`/auth/reset-password`, { password, email })
      .then((response) => {
        setLoading(false);
        setSuccess(true);
        toast({
          title: "Password reset successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      })
      .catch((error) => {
        setLoading(false);
        setError('Failed to reset password. Please try again.');
      });
  };

  return (
    <ChakraProvider>
      <Container maxW="full" bgImage={`url(${bg})`} bgSize="cover" bgPos="center" className="bg-opacity">
        <Center minH="100vh">
          <Box maxW="lg" mx="auto" bg="rgba(255, 255, 255, 0.8)" boxShadow="xl" borderRadius="xl" p="8" position="relative" top="-50px" backdropFilter="blur(30px)">
            <Box textAlign="center">
              <Heading as="h2" fontWeight="bold" mb="5">Reset Password</Heading>
            </Box>
            {error && (
              <Alert status="error" mb="4">
                <AlertIcon />
                <AlertTitle mr={2}></AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <CloseButton position="absolute" right="8px" top="8px" onClick={() => setError(null)} />
              </Alert>
            )}
            {success && (
              <Alert status="success" mb="4">
                <AlertIcon />
                <AlertTitle mr={2}>Success!</AlertTitle>
                <AlertDescription>Password has been reset.</AlertDescription>
                <CloseButton position="absolute" right="8px" top="8px" onClick={() => setSuccess(false)} />
              </Alert>
            )}
            <form onSubmit={handleResetPassword}>
            <Input variant="filled" mb="4" type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input variant="filled" mb="4" type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input variant="filled" mb="4" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

              <Button type='submit' colorScheme="blue" size="md" mb="4" w="full" isLoading={loading}>Reset Password</Button>
            </form>
          </Box>
        </Center>
      </Container>
    </ChakraProvider>
  );
}

export default ResetPassword;
