import React, { useEffect, useState, useMemo } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  Card,
  Searchbar,
  TextInput,
  Chip,
  SegmentedButtons,
} from "react-native-paper";
import ClassRoomService from "../services/classroom.service";
import { useNavigation } from "@react-navigation/native";

const ClassroomsScreen = () => {
  const navigation = useNavigation();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState<string[]>([]);

  // tri : valeur initiale name-asc
  const [sortOption, setSortOption] = useState<
    "name-asc" | "name-desc" | "cap-asc" | "cap-desc"
  >("name-asc");

  useEffect(() => {
    fetchAllClassrooms();
  }, []);

  const fetchAllClassrooms = async () => {
    try {
      const response = await ClassRoomService.fetchAll();
      setClassrooms(response);
    } catch (err) {
      console.error("Erreur fetch classrooms", err);
    }
  };

  // récupère tous les équipements disponibles
  const allEquipment = useMemo(() => {
    const s = new Set<string>();
    classrooms.forEach((c) => {
      Array.isArray(c.equipment) &&
        c.equipment.forEach((e: string) => s.add(e));
    });
    return Array.from(s);
  }, [classrooms]);

  const toggleEquipment = (eq: string) => {
    setEquipmentFilter((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  };

  // filtre texte / capacité / équipements
  const filteredClassrooms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const minCap = parseInt(minCapacity, 10) || 0;
    return classrooms.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (c.capacity < minCap) return false;
      if (
        equipmentFilter.length > 0 &&
        !equipmentFilter.every(
          (eq) => Array.isArray(c.equipment) && c.equipment.includes(eq)
        )
      )
        return false;
      return true;
    });
  }, [searchQuery, minCapacity, equipmentFilter, classrooms]);

  // tri final avec segmented buttons
  const sortedClassrooms = useMemo(() => {
    const arr = [...filteredClassrooms];
    switch (sortOption) {
      case "name-asc":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        arr.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "cap-asc":
        arr.sort((a, b) => a.capacity - b.capacity);
        break;
      case "cap-desc":
        arr.sort((a, b) => b.capacity - a.capacity);
        break;
    }
    return arr;
  }, [filteredClassrooms, sortOption]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Rechercher une salle…"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        clearIcon="close"
      />

      <TextInput
        label="Capacité min"
        mode="outlined"
        keyboardType="number-pad"
        value={minCapacity}
        onChangeText={setMinCapacity}
        style={styles.input}
      />

      <Text style={styles.label}>Équipements :</Text>
      <View style={styles.chipRow}>
        {allEquipment.map((eq) => (
          <Chip
            key={eq}
            selected={equipmentFilter.includes(eq)}
            onPress={() => toggleEquipment(eq)}
            style={styles.chip}
          >
            {eq}
          </Chip>
        ))}
      </View>

      {/* -- Nouveau contrôle de tri */}
      <Text style={styles.label}>Trier par :</Text>
      <SegmentedButtons
        value={sortOption}
        onValueChange={setSortOption}
        buttons={[
          { value: "name-asc", label: "Nom A→Z" },
          { value: "name-desc", label: "Nom Z→A" },
          { value: "cap-asc", label: "Cap ↑" },
          { value: "cap-desc", label: "Cap ↓" },
        ]}
        style={styles.segmented}
      />

      <ScrollView contentContainerStyle={styles.list}>
        {sortedClassrooms.length > 0 ? (
          sortedClassrooms.map((classroom) => (
            <Card
              key={classroom.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("ClassroomsDetails", { id: classroom.id })
              }
            >
              <Card.Title
                title={classroom.name}
                titleStyle={styles.cardTitle}
              />
              <Card.Content>
                <Text>Capacité : {classroom.capacity}</Text>
                {Array.isArray(classroom.equipment) && (
                  <Text>Équipements : {classroom.equipment.join(", ")}</Text>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>
            {searchQuery || minCapacity || equipmentFilter.length
              ? "Aucun résultat pour ces filtres."
              : "Aucune salle disponible."}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ClassroomsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchbar: { marginBottom: 10 },
  input: { marginBottom: 10 },
  label: { fontWeight: "600", marginBottom: 4 },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: { marginVertical: 4 },
  segmented: { marginBottom: 16 },
  list: { gap: 10 },
  card: { marginVertical: 4 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "blue" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    color: "#666",
  },
});
