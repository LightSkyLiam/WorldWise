import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

// Fake Auth Example
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
function AuthProvider({ children }) {
  const initialState = {
    user: null,
    isAuthenticated: false,
    error: "",
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "login":
        return {
          ...state,
          user: action.payLoad,
          isAuthenticated: true,
          error: "",
        };
      case "logout":
        return { ...state, user: null, isAuthenticated: false };
      case "error":
        return { ...state, error: action.payLoad };
      default:
        throw new Error(`Unknown Action`);
    }
  };
  const [{ user, isAuthenticated, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const login = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: `login`, payLoad: FAKE_USER });
    else
      dispatch({ type: "error", payLoad: "Email Or Password Are Not Correct" });
  };
  const logout = () => {
    dispatch({ type: `logout` });
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error(`Auth Context Was Used Outside AuthProvider`);
  return context;
};
export { AuthProvider, useAuth };
