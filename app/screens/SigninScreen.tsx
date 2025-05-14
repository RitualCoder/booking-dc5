import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "../hook/useAuth";
import React from "react";
import { Link } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const SigninScreen = () => {
  const { user, setUser, signIn } = useAuth();
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      <Text>Sign Screen</Text>

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
        onPress={() => signIn(credentials.email, credentials.password)}
      >
        Se connecter
      </Button>

      <Button onPress={() => 
        navigation.navigate('Signup')
      }>S'inscrire</Button>
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
