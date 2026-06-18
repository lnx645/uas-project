import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Input } from "@/components/base/input/input";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Link,
  useFetcher,
  type ActionFunction,
  redirect,
  useNavigate,
} from "react-router";
import api from "@/utils/axios";

type Body = {
  email?: string;
  password?: string;
  idToken?: string; // Menampung access_token Google
};

async function loginAction(data: Body) {
  const response = await api.post("/api/auth/login", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

async function googleLoginAction(accessToken: string) {
  const response = await api.post(
    "/api/auth/google",
    { idToken: accessToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}
function setAuthToken(token: string) {
  localStorage.setItem("__auth", token);
}
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();

    const data = Object.fromEntries(formData) as Body;

    console.log("Mengirim data login reguler:", data);
    const result = await loginAction(data);

    if (result.token) {
      setAuthToken(result.token);
      return redirect("/explore");
    }
  } catch (error: any) {
    console.error("Gagal Login:", error?.response?.data || error.message);
    return {
      error: error?.response?.data?.error || "Kombinasi Email/Password salah!",
    };
  }
  return null;
};

export const Component = () => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const result = await googleLoginAction(tokenResponse.access_token);
        if (result.token) {
          setAuthToken(result.token);
          navigate("/explore");
        }
      } catch (error) {
        console.error("Gagal Autentikasi Google ke Backend:", error);
      }
    },
    onError: (error) => console.log("Google Login Failed:", error),
  });

  return (
    <div className="max-w-sm mx-auto p-6">
      {fetcher.data?.error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded border border-red-200">
          {fetcher.data.error}
        </div>
      )}

      <fetcher.Form method="POST" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="text-sm text-tertiary">Login to your account</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input name="email" size="sm" label="Email / Username" />
          <Input size="sm" name="password" label="Password" type="password" />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border-secondary" />
          <span className="text-xs text-tertiary">or</span>
          <div className="h-px flex-1 bg-border-secondary" />
        </div>

        {/* Type diubah ke button agar tidak memicu form submit bawaan HTML */}
        <SocialButton
          type="button"
          onClick={() => loginWithGoogle()}
          social="google"
          size="md"
        >
          Login With Google
        </SocialButton>

        <p className="text-center text-sm text-tertiary">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-brand-secondary hover:underline"
          >
            Register
          </Link>
        </p>
      </fetcher.Form>
    </div>
  );
};
