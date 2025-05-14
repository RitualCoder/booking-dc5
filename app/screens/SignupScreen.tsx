import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../hook/useAuth";
import React from "react";
import AuthService from "../services/auth.service";

const SignupScreen = () => {
  const { user, setUser, signIn, signUp } = useAuth();
  const [credentials, setCredentials] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text>SignUp Screen</Text>

      <TextInput
        placeholder="Name"
        onChangeText={(text) => {
          setCredentials({ ...credentials, name: text });
        }}
      />

      <TextInput
        placeholder="Email"
        onChangeText={(text) => {
          setCredentials({ ...credentials, email: text });
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) =>
          setCredentials({ ...credentials, password: text })
        }
      />

      {/* submit button */}
      <Button
        mode="contained"
        onPress={() => {
          signUp(credentials.name, credentials.email, credentials.password);
        }}
      >
        S'inscrire
      </Button>
    </View>
  );
};

export default SignupScreen;
