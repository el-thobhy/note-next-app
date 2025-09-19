/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { authService } from "@/services/authServices";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";

export default function VerificationForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(false);
  const [hint, setHint] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(otp.length !== 6) {
      setError(true);
      setHint("OTP must be 6 digits long");
      return;
    }
    
    setLoading(true);

    
    try {
      const response = await authService.verificationEmail(otp);
      setMessage("Verification successful, you can login using your username and password "+ response.data.userName);
      setSuccess(true); 
      setTimeout(() => {  
        setLoading(false);
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      setSuccess(false);
      console.log("Verification error:", err);
      alert(err?.response?.data?.message || "Verification failed");
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    setTimer(30);
    setCanResend(false);
    try {
      await authService.sendOtp();
      alert("OTP has been resent to your email.");
    } catch (err: any) {
      console.log("Resend OTP error:", err);
      alert(err?.response?.data?.message || "Failed to resend OTP");
    }
  }

  const handleChangeOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length == 6) { // Only allow digits
      setOtp(value);
      setError(false);
      setHint("");
    } else {
      setError(true);
      setHint("OTP must be numeric and 6 digits long");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
     
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Otp Verification
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your the OTP from current email!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    OTP <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    placeholder="Otp" 
                    onChange={(e) => handleChangeOtp(e)} 
                    type="text"
                    hint={hint}
                    error={error}
                     />
                </div>
               
                <div>
                  <Button className="w-full" size="sm" disabled={loading} type="submit">
                    {loading ? "Verify..." : "Verify"}
                  </Button>
                   <Modal isOpen={success} onClose={() => setSuccess(false)} className="max-w-sm p-6 text-center" showCloseButton={false}> 
                        <h2 className="mb-4 text-lg font-semibold text-success-700 dark:text-white/90">Email Verified</h2>
                        <p className="mb-6 text-success-900 dark:text-gray-400">{message}</p>
                    </Modal>
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            className="mt-5 text-brand-500 disabled:text-gray-400"
                            onClick={handleResendOtp}
                            disabled={!canResend}
                        >
                            Resend OTP
                        </button>
                        {!canResend && (
                            <span className="text-sm mt-5 text-gray-500">
                            Resend in {timer}s
                            </span>
                        )}
                    </div>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
