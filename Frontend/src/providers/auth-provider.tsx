import { createContext, useState, useEffect, useContext } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
// import api from "@/services/api";
// import { RegisterFormValues } from "@/pages/register-page";
// import { LoginFormValues as LoginCredentials } from "@/pages/login-page";
import { userService } from "@/services/user.service";
import { LoginUserDataI, RegisterUserDataI, UserI } from "@/types/user.types";
import api from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

// interface LoggedInUser {
//   _id: string;
//   username: string;
//   imageUrl: string | null;
// }

// type RegisterCredentials = Omit<RegisterFormValues, "confirmPassword">;

interface AuthContextType {
  loggedInUser: UserI | null | undefined;
  login: (user: LoginUserDataI) => Promise<void>;
  register: (user: RegisterUserDataI) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<UserI | null | undefined>(
    undefined
  );
  const [token, setToken] = useLocalStorage<string | null>("jwt-stocks", null);
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      setLoggedInUser(null);
      return;
    }

    async function fetchUser() {
      try {
        const user = await userService.getUser();
        setLoggedInUser(user);
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.error("Invalid token, logging out");
          logout();
        } else if (error.response?.status === 404) {
          console.error("User not found, logging out");
          logout();
        } else {
          console.error("Error fetching user data:", error);
        }
      }
    }

    fetchUser();
  }, [token]);

  function logout() {
    setToken(null);
    setLoggedInUser(null);
  }

  async function login(cred: LoginUserDataI) {
    try {
      const { data: token } = await api.post<string>("/auth/login", cred);
      setToken(token);
      toast({
        title: "Logged In!",
        description: "You have successfully logged in.",
        variant: "primary",
      });
    } catch (error) {
      throw error;
    }
  }

  async function register(cred: RegisterUserDataI) {
    try {
      await api.post("/auth/register", cred);
      toast({
        title: "Registered Successfully!",
        variant: "primary",
      });
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ loggedInUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
}
