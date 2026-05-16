import { Suspense } from "react";
import LoginView from "@/src/features/company/auth/LoginView";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}
