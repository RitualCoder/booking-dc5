import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  Card,
  Searchbar,
  TextInput,
  Chip,
  SegmentedButtons,
  Button,
} from "react-native-paper";
import ClassRoomService from "../services/classroom.service";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const BLUE = "#2563eb";
const BLUE_PALE = "#e6eeff";
const BG = "#f7f9fb";
const TEXT = "#22223b";
const MUTED = "#64748b";

const ClassroomsScreen = () => {
  const navigation = useNavigation();
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState<string[]>([]);

  const [sortOption, setSortOption] = useState<
    "name-asc" | "name-desc" | "cap-asc" | "cap-desc"
  >("name-asc");

  useFocusEffect(
    useCallback(() => {
      fetchAllClassrooms();
    }, [])
  );

  const fetchAllClassrooms = async () => {
    try {
      const response = await ClassRoomService.fetchAll();
      setClassrooms(response);
    } catch (err) {
      console.error("Erreur fetch classrooms", err);
    }
  };

  const createRoom = () => {
    navigation.navigate("ClassroomForm");
  };

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
      <Button
        mode="contained"
        style={styles.createButton}
        labelStyle={{ fontWeight: "600", color: "#fff" }}
        onPress={createRoom}
        buttonColor={BLUE}
      >
        + Créer une salle
      </Button>

      <Searchbar
        placeholder="Rechercher une salle…"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={{ color: TEXT }}
        iconColor={MUTED}
        theme={{ colors: { primary: BLUE } }}
      />

      <TextInput
        label="Capacité min"
        mode="outlined"
        keyboardType="number-pad"
        value={minCapacity}
        onChangeText={(t) => setMinCapacity(t.replace(/[^0-9]/g, ""))}
        style={styles.input}
        left={<TextInput.Icon icon="account-group" />}
        theme={{
          colors: {
            primary: BLUE,
            background: "#fff",
            onSurfaceVariant: MUTED,
          },
        }}
      />

      <Text style={styles.label}>Équipements :</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {allEquipment.length > 0 ? (
          allEquipment.map((eq) => {
            const selected = equipmentFilter.includes(eq);
            return (
              <Chip
                key={eq}
                selected={selected}
                onPress={() => toggleEquipment(eq)}
                style={[
                  styles.chip,
                  selected
                    ? {
                        backgroundColor: BLUE,
                        borderColor: BLUE,
                      }
                    : {
                        backgroundColor: BLUE_PALE,
                        borderColor: BLUE,
                      },
                ]}
                textStyle={{
                  color: selected ? "#fff" : BLUE,
                  fontWeight: selected ? "600" : "500",
                }}
                contentStyle={styles.chipContent}
                showSelectedOverlay={false}
              >
                {eq}
              </Chip>
            );
          })
        ) : (
          <Text style={styles.noEqText}>Aucun équipement disponible</Text>
        )}
      </ScrollView>

      <Text style={styles.label}>Trier par :</Text>
      <SegmentedButtons
        value={sortOption}
        onValueChange={setSortOption}
        buttons={[
          {
            value: "name-asc",
            label: "Nom A→Z",
            uncheckedColor: MUTED,
          },
          {
            value: "name-desc",
            label: "Nom Z→A",
            uncheckedColor: MUTED,
          },
          {
            value: "cap-asc",
            label: "Cap ↑",
            uncheckedColor: MUTED,
          },
          {
            value: "cap-desc",
            label: "Cap ↓",
            uncheckedColor: MUTED,
          },
        ]}
        style={styles.segmented}
        density={Platform.OS === "ios" ? "medium" : "regular"}
        theme={{
          colors: {
            primary: "#2563eb",
          },
        }}
      />

      <ScrollView contentContainerStyle={styles.listContainer}>
        {sortedClassrooms.length > 0 ? (
          sortedClassrooms.map((classroom) => (
            <TouchableOpacity
              key={classroom.id}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("ClassroomsDetails", {
                  id: classroom.id,
                })
              }
              style={styles.touchableCard}
            >
              <Card style={styles.card} elevation={2}>
                <View style={styles.cardContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{classroom.name}</Text>
                    <Text style={styles.cardText}>
                      Capacité :{" "}
                      <Text style={styles.cardValue}>{classroom.capacity}</Text>
                    </Text>
                    {Array.isArray(classroom.equipment) &&
                      classroom.equipment.length > 0 && (
                        <Text style={styles.cardText}>
                          Équipements :{" "}
                          <Text style={styles.cardValue}>
                            {classroom.equipment.join(", ")}
                          </Text>
                        </Text>
                      )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  createButton: {
    marginBottom: 12,
    elevation: 1,
  },
  searchbar: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 1,
  },
  input: {
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 6,
  },
  chipRow: {
    paddingVertical: 4,
    height: 80,
  },
  chip: {
    marginRight: 8,
    borderWidth: 1,
    height: 32,
  },
  chipContent: {
    justifyContent: "center",
  },
  noEqText: {
    color: MUTED,
    fontStyle: "italic",
    paddingVertical: 4,
  },
  segmented: {
    marginBottom: 18,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 1,
  },
  listContainer: {
    paddingBottom: 20,
    gap: 10,
  },
  touchableCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  card: {
    backgroundColor: BLUE_PALE,
    borderLeftWidth: 5,
    borderLeftColor: BLUE,
    marginVertical: 4,
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 2,
  },
  cardValue: {
    color: BLUE,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontStyle: "italic",
    color: MUTED,
    fontSize: 15,
  },
});
