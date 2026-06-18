import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Input } from "@/components/base/input/input";
import { Link } from "react-router";

export const Component = () => {
  return (
    <div className="max-w-sm mx-auto p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-semibold">Create an account</h1>
          <p className="text-sm text-tertiary">Sign up to get started</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Full Name" />
          <Input label="Email" type="email" />
          <Input label="Password" type="password" />
          <Input label="Confirm Password" type="password" />
        </div>

        <Button className="w-full">Register</Button>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border-secondary" />
          <span className="text-xs text-tertiary">or</span>
          <div className="h-px flex-1 bg-border-secondary" />
        </div>

        <SocialButton social="google" size="md">
          Sign Up With Google
        </SocialButton>

        <p className="text-center text-sm text-tertiary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-secondary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};