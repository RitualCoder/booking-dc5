import AuthContext, { AuthContextProvider } from "./context/AuthContext";
import MainNavigation from "./navigation/MainNavigation";
import { AuthContextProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthContextProvider>
      <MainNavigation />
    </AuthContextProvider>
  );
}
