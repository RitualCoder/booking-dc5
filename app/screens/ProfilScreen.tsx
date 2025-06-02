import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import AuthContext from "../context/AuthContext";
import { useAuth } from "../hook/useAuth";
import { useUser } from "../hook/useUser";

const ProfilScreen = () => {
  const { user } = useContext(AuthContext);
  const { updateUser } = useUser();
  const { signOut } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Synchroniser la state locale dès que l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setCredentials({
        name: user.name,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  function handleUpdateUser() {
    if (user) {
      const data = {
        name: credentials.name,
        email: credentials.email,
      };
      updateUser(user.id, data);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 64, gap: 16 }}>
      <Button onPress={() => setEditMode(!editMode)}>
        {editMode ? "Annuler" : "Modifier"}
      </Button>

      <TextInput
        label="Nom"
        mode="outlined"
        value={credentials.name}
        onChangeText={(text) =>
          setCredentials((prev) => ({ ...prev, name: text }))
        }
        disabled={!editMode}
      />

      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        value={credentials.email}
        onChangeText={(text) =>
          setCredentials((prev) => ({ ...prev, email: text }))
        }
        disabled={!editMode}
      />

      {editMode && (
        <>
          <Button
            mode="contained"
            onPress={() => {
              handleUpdateUser();
              setEditMode(false);
            }}
          >
            Enregistrer
          </Button>
        </>
      )}

      <Button mode="outlined" onPress={signOut}>
        Se déconnecter
      </Button>
    </View>
  );
};

export default ProfilScreen;
