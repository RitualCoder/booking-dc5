import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const SigninScreen = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { signin } = useAuth();
  const navigation = useNavigation();

  //  handlesubmit
  return (
    <View style={styles.container}>
      <Text>Sign Screen</Text>

      {/* input email */}
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setCredentials({ ...credentials, email: text })}
      />
      {/* input password */}
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
        onPress={() => signin(credentials.email, credentials.password)}
      >
        Signin
      </Button>
      <Button onPress={() => navigation.navigate("Signup")}>
        <Text>Signup</Text>
      </Button>
    </View>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 20,
  },
});
