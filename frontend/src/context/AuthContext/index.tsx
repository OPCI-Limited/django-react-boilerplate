import { AxiosError } from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { User } from "../../interfaces";
import { api } from "../../services/api";
import { setAuthorizationHeader } from "../../services/interceptors";
import {
  createTokenCookies,
  getToken,
  removeTokenCookies,
} from "../../utils/tokenCookies";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  name: string;
  surname: string;
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void | AxiosError>;
  signUp: (credentials: SignUpCredentials) => Promise<void | AxiosError>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
  loadingUserData: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>();
  const [loadingUserData, setLoadingUserData] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = getToken();
  const isAuthenticated = Boolean(token);
  const userData = user as User;

  async function setUserData() {
    setLoadingUserData(true);

    try {
      const response = await api.get("/user/");

      if (response?.data) {
        const {
          email,
          permissions,
          groups,
          first_name: name,
          last_name: surname,
          id,
        } = response.data;
        console.log(response.data);
        setUser({ id, email, permissions, groups, name, surname });
      }
    } catch (error) {
      signOut();
    }

    setLoadingUserData(false);
  }

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/login/", { email, password });
      const { access, refresh } = response.data;
      console.log(response.data);

      createTokenCookies(access, refresh);
      setAuthorizationHeader(api.defaults, access);
      // get user data after successful login to set user state
      await setUserData();
    } catch (error) {
      const err = error as AxiosError;
      return err;
    }
  }

  async function signUp({ name, surname, email, password }: SignUpCredentials) {
    try {
      const response = await api.post("/register/", {
        first_name: name,
        last_name: surname,
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      const err = error as AxiosError;
      return err;
    }
  }

  function signOut(pathname = "/login") {
    removeTokenCookies();
    setUser(null);
    setLoadingUserData(false);
    navigate(pathname);
  }

  useEffect(() => {
    if (!token) signOut(pathname);
  }, [pathname, token]);

  useEffect(() => {
    const token = getToken();

    async function getUserData() {
      setLoadingUserData(true);

      try {
        const response = await api.get("/user/");

        if (response?.data) {
          const {
            id,
            email,
            permissions,
            groups,
            first_name: name,
            last_name: surname,
          } = response.data;
          console.log(response.data);
          setUser({ id, email, permissions, groups, name, surname });
        }
      } catch (error) {
        signOut();
      }

      setLoadingUserData(false);
    }

    if (token) {
      setAuthorizationHeader(api.defaults, token);
      getUserData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: userData,
        loadingUserData,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
