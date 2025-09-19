/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { authService } from "@/services/authServices";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showAlertPassword, setShowAlertPassword] = useState("");
  const [setPasswordMatch, setShowPasswordMatch] = useState("");
  const [error, setError] = useState({
    username: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setError(prev => ({...prev, password: false}));
    setPassword(password);
    // Contoh validasi sederhana: minimal 8 karakter, harus ada angka dan huruf
    const isValid =
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password);

    if (!isValid) {
      setError(prev => ({...prev, password: true}));
      setShowAlertPassword(
        "Password must be at least 8 characters long and include both letters and numbers."
      );
    } else {
      setShowAlertPassword("");
    }
  };

  const handlePasswordMatch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    setError(prev => ({...prev, confirmPassword: false}));

    if (confirmPassword !== password) {
      setError(prev => ({...prev, confirmPassword: true}));
      setShowPasswordMatch("Passwords do not match.");
    } else {
      setShowPasswordMatch("");
    }
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const handleClickSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kumpulkan error di variabel lokal
    const newError = {
      username: username.length === 0,
      firstName: firstName.length === 0,
      lastName: lastName.length === 0,
      email: email.length === 0,
      password: password.length === 0 || showAlertPassword.length > 0,
      confirmPassword:
        confirmPassword.length === 0 ||
        confirmPassword !== password,
    };

    // Set pesan error password/confirm password
    if (newError.password && password.length === 0) {
      setShowAlertPassword("The field is required.");
    }
    if (
      password.length > 0 &&
      (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))
    ) {
      setShowAlertPassword(
        "Password must be at least 8 characters long and include both letters and numbers."
      );
    }
    if (newError.confirmPassword && confirmPassword.length === 0) {
      setShowPasswordMatch("The field is required.");
    } else if (confirmPassword !== password) {
      setShowPasswordMatch("Passwords do not match.");
    } else {
      setShowPasswordMatch("");
    }

    setError(newError);

    // Cek error dari variabel lokal, bukan dari state error
    if (
      newError.username ||
      newError.firstName ||
      newError.lastName ||
      newError.email ||
      newError.password ||
      newError.confirmPassword
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        userName: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
      });
      setMessage("Please check your email: "+
        response.data.email +
         " to verify your account.");
      setSuccess(true);
      setTimeout(() => {  
        setLoading(false);
        router.push("/verification");
      }, 3000);
      console.log("Registration successful:", 
        // response
      );
      // Redirect or show success message
    } catch (err: any) {
      setSuccess(false);
      setLoading(false);
      console.log("Registration error:", err);
      alert(err?.response?.data?.message || "Registration failed");
    }
  }
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to sign in
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={handleClickSignUp}>
              <div className="space-y-5">
                 {/* <!-- Username --> */}
                <div>
                  <Label>
                    Username<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if(e.target.value.length === 0){
                        setError(prev => ({...prev, username: true}));
                      }
                    }}
                    placeholder="Username"
                    hint={username.length === 0  && error.username? "This field is required" : undefined}
                    error={username.length === 0 && error.username}
                  />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if(e.target.value.length === 0){
                          setError(prev => ({...prev, firstName: true}));
                        }
                      }}
                      placeholder="Enter your first name"
                      hint={firstName.length === 0  && error.firstName? "This field is required" : undefined}
                      error={firstName.length === 0 && error.firstName}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if(e.target.value.length === 0){
                          setError(prev => ({...prev, lastName: true}));
                        }
                      }}
                      placeholder="Enter your last name"
                      hint={lastName.length == 0 && error.lastName ? "This field is required" : undefined}
                      error={lastName.length == 0 && error.lastName}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if(e.target.value.length === 0){
                        setError(prev => ({...prev, email: true}));
                      }
                    }}
                    placeholder="Enter your email"
                    hint={email.length == 0 && error.email ? "This field is required" : undefined}
                    error={email.length == 0 && error.email}
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      hint={showAlertPassword ? showAlertPassword : undefined}
                      error={(password.length === 0 && error.password) || showAlertPassword.length > 0}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Password confirmation --> */}
                <div>
                  <Label>
                    Confirm Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={confirmPassword}
                      onChange={handlePasswordMatch}
                      placeholder="Confirm your password"
                      type={showPasswordConfirm ? "text" : "password"}
                      hint={setPasswordMatch}
                      error={(confirmPassword.length === 0 && error.confirmPassword) || setPasswordMatch.length > 0}
                    />
                    <span
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPasswordConfirm ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button disabled={loading} type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    {loading ? "Sign Up..." : "Sign Up"}
                  </Button>
                  <Modal isOpen={success} onClose={() => setSuccess(false)} className="max-w-sm p-6 text-center" showCloseButton={false}> 
                    <h2 className="mb-4 text-lg font-semibold text-success-700 dark:text-white/90">Registration Successful</h2>
                    <p className="mb-6 text-success-900 dark:text-gray-400">{message}</p>
                  </Modal>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
        <span className="space-y-2 pb-10"></span>
      </div>
    </div>
  );
}
