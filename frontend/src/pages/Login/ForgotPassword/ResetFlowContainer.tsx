// src/pages/Login/ForgotPassword/ResetFlowContainer.tsx
import { useState } from "react";
import EmailInput from "./EmailInput";
import VerifyCode from "./VerifyCode";
import ResetPassword from "./ResetPassword";

export default function ResetFlowContainer() {
  const [step, setStep] = useState<"email" | "code" | "reset">("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const goToCode = (emailFromInput: string) => {
    setEmail(emailFromInput);
    setStep("code");
  };

  const goToReset = (receivedToken: string) => {
    setToken(receivedToken);
    setStep("reset");
  };

  return (
    <>
      {step === "email" && <EmailInput onSuccess={goToCode} />}
      {step === "code" && <VerifyCode email={email} onVerified={goToReset} />}
      {step === "reset" && <ResetPassword email={email} token={token} />}
    </>
  );
}
