import AuthContext, { AuthContextProvider } from "./context/AuthContext";
import MainNavigation from "./navigation/MainNavigation";

export default function App() {
  return (
    <AuthContextProvider>
      <MainNavigation />
    </AuthContextProvider>
  );
}
