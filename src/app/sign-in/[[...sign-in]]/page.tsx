import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="border-brutal border-3 border-brutal-black bg-cream p-8" style={{ boxShadow: "8px 8px 0 #0A0A0A" }}>
        <SignIn />
      </div>
    </div>
  );
}