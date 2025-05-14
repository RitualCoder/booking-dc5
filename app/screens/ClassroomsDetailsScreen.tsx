import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button, Card, Paragraph, TextInput } from "react-native-paper";
import ClassRoomService from "../services/classroom.service";
import ReservationService from "../services/reservation.service";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ClassroomsDetailsScreen = ({ route }: any) => {
  const { id } = route.params;
  const [classroom, setClassroom] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationData, setReservationData] = useState({
    startTime: "",
    endTime: "",
    classroomId: id,
  });

  const [pickerState, setPickerState] = useState<{
    field: "startTime" | "endTime";
    mode: "date" | "time";
    visible: boolean;
  }>({ field: "startTime", mode: "date", visible: false });

  const openPicker = (
    field: "startTime" | "endTime",
    mode: "date" | "time"
  ) => {
    setPickerState({ field, mode, visible: true });
  };

  const handleConfirm = (date: Date) => {
    const iso = date.toISOString();
    setReservationData((prev) => ({
      ...prev,
      [pickerState.field]: iso,
    }));
    // if you want both date+time in sequence:
    if (pickerState.mode === "date") {
      // next open time picker for same field
      setPickerState({ field: pickerState.field, mode: "time", visible: true });
    } else {
      // done
      setPickerState((s) => ({ ...s, visible: false }));
    }
  };

  useEffect(() => {
    if (id) fetchClassroom();
  }, [id]);

  const fetchClassroom = async () => {
    try {
      // 1️⃣ Récupère la classe
      const responseClassroom = await ClassRoomService.fetchById(id);
      setClassroom(responseClassroom);

      // 2️⃣ Puis ses réservations (en supposant que fetchById prend un classroomId)
      const responseReservation = await ReservationService.fetchById(
        responseClassroom.id
      );
      setReservations(responseReservation);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    // Format FR : 25/04/2025 12:00
    return (
      d.toLocaleDateString("fr-FR") +
      " " +
      d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (!classroom) {
    return (
      <View style={styles.center}>
        <Text>Chargement…</Text>
      </View>
    );
  }

  async function bookClassroom() {
    try {
      await ReservationService.bookClassroom(reservationData);
      await fetchClassroom();
      setReservationData({ startTime: "", endTime: "", classroomId: id });
    } catch (error) {
      console.error("Erreur lors de la réservation", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{classroom.name}</Text>
      <Text style={styles.subtitle}>Capacité : {classroom.capacity}</Text>

      {Array.isArray(classroom.equipment) && classroom.equipment.length > 0 && (
        <View style={styles.equipmentContainer}>
          <Text style={styles.sectionTitle}>Équipements :</Text>
          {classroom.equipment.map((e: string, idx: number) => (
            <Text key={idx} style={styles.equipmentItem}>
              • {e}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Réservations :</Text>
      {reservations.length > 0 ? (
        reservations.map((res) => (
          <Card key={res.id} style={styles.card}>
            <Card.Content>
              <Paragraph style={styles.reservationText}>
                {formatDateTime(res.startTime)} → {formatDateTime(res.endTime)}
              </Paragraph>
              <Paragraph style={styles.userText}>
                Par : {res.user.name} ({res.user.email})
              </Paragraph>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={styles.noResText}>
          Aucune réservation pour cette classe.
        </Text>
      )}

      <Text>Nouvelle réservation :</Text>

      <TextInput
        label="Début"
        mode="outlined"
        value={
          reservationData.startTime
            ? new Date(reservationData.startTime).toLocaleString("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : ""
        }
        editable={false}
        onPressIn={() => openPicker("startTime", "date")}
      />

      <TextInput
        label="Fin"
        mode="outlined"
        value={
          reservationData.endTime
            ? new Date(reservationData.endTime).toLocaleString("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : ""
        }
        editable={false}
        onPressIn={() => openPicker("endTime", "date")}
      />

      <Button
        mode="contained"
        disabled={!reservationData.startTime || !reservationData.endTime}
        onPress={() => {
          bookClassroom();
        }}
      >
        Réserver
      </Button>

      <DateTimePickerModal
        isVisible={pickerState.visible}
        mode={pickerState.mode}
        date={
          reservationData[pickerState.field]
            ? new Date(reservationData[pickerState.field])
            : new Date()
        }
        onConfirm={handleConfirm}
        onCancel={() => setPickerState((s) => ({ ...s, visible: false }))}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: "600",
  },
  equipmentContainer: {
    marginBottom: 8,
  },
  equipmentItem: {
    fontSize: 14,
    marginLeft: 8,
  },
  card: {
    marginVertical: 4,
  },
  reservationText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userText: {
    fontSize: 14,
    color: "#555",
  },
  noResText: {
    fontStyle: "italic",
    color: "#666",
  },
});

export default ClassroomsDetailsScreen;
