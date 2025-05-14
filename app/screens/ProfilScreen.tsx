import { Text, View } from "react-native";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAuth from "../hooks/useAuth";
import { Button } from "react-native-paper";

const ProfilScreen = () => {
  const { user } = useContext(AuthContext);
  const { signout } = useAuth();

  return (
    <View>
      <Text>Profil</Text>
      <Text>{user?.email}</Text>
      <Button onPress={() => signout()}>
        <Text>Signout</Text>
      </Button>
    </View>
  );
};

export default ProfilScreen;
