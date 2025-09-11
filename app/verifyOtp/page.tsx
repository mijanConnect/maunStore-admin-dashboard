import { Suspense } from "react";
import VerifyOtpForm from "@/components/dashboard/VerifyOtp";

const page = () => {
  return (
    <div>
      <Suspense>
        <VerifyOtpForm />
      </Suspense>
    </div>
  );
};

export default page;
