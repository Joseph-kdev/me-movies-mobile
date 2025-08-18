import { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

const UserAuthContext = createContext(null);

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within UserAuthContextProvider");
  }
  return context;
};

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Auth state change error:", err);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,
  };
 
  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}
