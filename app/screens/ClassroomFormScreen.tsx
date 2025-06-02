import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { TextInput, Button, Text, Chip, IconButton } from "react-native-paper";
import ClassRoomService from "../services/classroom.service";

const BLUE = "#2563eb";
const BLUE_PALE = "#e6eeff";
const BG = "#f7f9fb";

const ClassroomFormScreen = ({ onSubmit, navigation }: any) => {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [equipment, setEquipment] = useState("");
  const [equipments, setEquipments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddEquipment = () => {
    if (equipment.trim() && !equipments.includes(equipment.trim())) {
      setEquipments((prev) => [...prev, equipment.trim()]);
      setEquipment("");
    }
  };

  const handleRemoveEquipment = (eq: any) => {
    setEquipments((prev) => prev.filter((e) => e !== eq));
  };

  const handleSubmit = async () => {
    if (!name || !capacity || isNaN(parseInt(capacity))) return;
    setSubmitting(true);
    const response = await ClassRoomService.createClassroom({
      name,
      capacity: Number(capacity),
      equipment: equipments,
    });
    if (onSubmit) {
      await onSubmit({
        name,
        capacity: Number(capacity),
        equipment: equipments,
      });
    }
    setSubmitting(false);
    navigation.goBack && navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nouvelle salle</Text>

      <TextInput
        label="Nom de la salle"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
        left={<TextInput.Icon icon="domain" />}
      />

      <TextInput
        label="Capacité"
        mode="outlined"
        value={capacity}
        onChangeText={(t) => setCapacity(t.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
        style={styles.input}
        left={<TextInput.Icon icon="account-group" />}
      />

      <View style={styles.equipBlock}>
        <TextInput
          label="Nouvel équipement"
          mode="outlined"
          value={equipment}
          onChangeText={setEquipment}
          style={[styles.input, { flex: 1, marginRight: 4 }]}
          left={<TextInput.Icon icon="tools" />}
          onSubmitEditing={handleAddEquipment}
        />
        <Button
          mode="contained"
          style={styles.addButton}
          onPress={handleAddEquipment}
          disabled={!equipment.trim()}
          buttonColor={BLUE}
        >
          Ajouter
        </Button>
      </View>

      <View style={styles.equipmentList}>
        {equipments.map((eq, idx) => (
          <Chip
            key={idx}
            style={styles.chip}
            onClose={() => handleRemoveEquipment(eq)}
            closeIcon="close"
          >
            {eq}
          </Chip>
        ))}
      </View>

      <Button
        mode="contained"
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={!name || !capacity || equipments.length === 0 || submitting}
        loading={submitting}
        buttonColor={BLUE}
      >
        Créer la salle
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BG,
    flexGrow: 1,
    padding: 20,
    paddingTop: 42,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: BLUE,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  equipBlock: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  addButton: {
    justifyContent: "center",
  },
  equipmentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 22,
    gap: 7,
  },
  chip: {
    backgroundColor: BLUE_PALE,
    marginRight: 6,
    marginBottom: 4,
  },
  submitButton: {
    marginTop: 18,
    elevation: 0,
    paddingVertical: 2,
  },
});

export default ClassroomFormScreen;
