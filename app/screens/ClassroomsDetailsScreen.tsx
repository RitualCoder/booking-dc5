import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  Button,
  Card,
  Paragraph,
  TextInput,
  Avatar,
  Divider,
  Chip,
} from "react-native-paper";
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
  const [submitting, setSubmitting] = useState(false);

  const [pickerState, setPickerState] = useState<{
    field: "startTime" | "endTime";
    mode: "date" | "time";
    visible: boolean;
  }>({ field: "startTime", mode: "date", visible: false });

  const openPicker = (field: "startTime" | "endTime", mode: "date" | "time") =>
    setPickerState({ field, mode, visible: true });

  const handleConfirm = (date: Date) => {
    const iso = date.toISOString();
    setReservationData((prev) => ({
      ...prev,
      [pickerState.field]: iso,
    }));
    if (pickerState.mode === "date") {
      setPickerState({ field: pickerState.field, mode: "time", visible: true });
    } else {
      setPickerState((s) => ({ ...s, visible: false }));
    }
  };

  useEffect(() => {
    if (id) fetchClassroom();
  }, [id]);

  const fetchClassroom = async () => {
    try {
      const responseClassroom = await ClassRoomService.fetchById(id);
      setClassroom(responseClassroom);
      const responseReservation = await ReservationService.fetchById(
        responseClassroom.id
      );
      setReservations(responseReservation);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDateTime = (isoString: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return (
      d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      }) +
      " " +
      d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  async function bookClassroom() {
    try {
      setSubmitting(true);
      await ReservationService.bookClassroom(reservationData);
      await fetchClassroom();
      setReservationData({ startTime: "", endTime: "", classroomId: id });
    } catch (error) {
      console.error("Erreur lors de la réservation", error);
    } finally {
      setSubmitting(false);
    }
  }

  if (!classroom) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Chargement…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header salle */}
      <View style={styles.header}>
        <Avatar.Icon
          icon="domain"
          size={50}
          style={{ backgroundColor: "#bae6fd" }}
        />
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.title}>{classroom.name}</Text>
          <Text style={styles.subtitle}>
            Capacité :{" "}
            <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
              {classroom.capacity}
            </Text>
          </Text>
        </View>
      </View>

      {/* Equipements */}
      {Array.isArray(classroom.equipment) && classroom.equipment.length > 0 && (
        <View style={styles.equipmentContainer}>
          <Text style={styles.sectionTitle}>Équipements disponibles</Text>
          <View style={styles.equipmentList}>
            {classroom.equipment.map((e: string, idx: number) => (
              <View key={idx} style={styles.equipmentItem}>
                <Avatar.Icon
                  icon="check-circle-outline"
                  size={30}
                  style={{ backgroundColor: "#fff", marginRight: 8 }}
                  color="#16a34a"
                />
                <Text style={styles.equipmentText}>{e}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Divider style={{ marginVertical: 16 }} />

      {/* Réservations existantes */}
      <Text style={styles.sectionTitle}>Réservations à venir</Text>
      {reservations.length > 0 ? (
        reservations.map((res) => (
          <View key={res.id} style={styles.cardWrapper}>
            <Card style={styles.card} elevation={2}>
              <Card.Content>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                      <Chip style={styles.chipFuture} icon="calendar-clock">
                        {formatDateTime(res.startTime)}
                      </Chip>
                      <Text style={styles.arrow}>→</Text>
                      <Chip style={styles.chipFuture} icon="clock-outline">
                        {formatDateTime(res.endTime)}
                      </Chip>
                    </View>
                    <View style={[styles.row, { marginTop: 6 }]}>
                      <Paragraph style={styles.roomLabel}>Salle :</Paragraph>
                      <Paragraph style={styles.roomName}>
                        <Text style={styles.roomIcon}>🏫</Text> {classroom.name}{" "}
                        <Text style={styles.roomCapacity}>
                          ({classroom.capacity} places)
                        </Text>
                      </Paragraph>
                    </View>
                    <View style={{ marginTop: 8 }}>
                      <Paragraph style={{ color: "#666", fontSize: 14 }}>
                        Par{" "}
                        <Text style={{ fontWeight: "bold", color: "#2563eb" }}>
                          {res.user.name}
                        </Text>
                        <Text style={{ color: "#64748b" }}>
                          {" "}
                          ({res.user.email})
                        </Text>
                      </Paragraph>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        ))
      ) : (
        <Text style={styles.noResText}>
          Aucune réservation pour cette salle.
        </Text>
      )}

      <Divider style={{ marginVertical: 22 }} />

      {/* Réservation bloc */}
      <View style={styles.bookContainer}>
        <Text style={styles.bookTitle}>Nouvelle réservation</Text>
        <TextInput
          label="Début"
          mode="outlined"
          style={styles.input}
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
          left={<TextInput.Icon icon="calendar" />}
          placeholder="Sélectionner la date et l'heure"
        />

        <TextInput
          label="Fin"
          mode="outlined"
          style={styles.input}
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
          left={<TextInput.Icon icon="calendar" />}
          placeholder="Sélectionner la date et l'heure"
        />

        <Button
          mode="contained"
          style={styles.reserveButton}
          labelStyle={{ fontWeight: "bold", fontSize: 14, letterSpacing: 0.5 }}
          disabled={
            !reservationData.startTime || !reservationData.endTime || submitting
          }
          loading={submitting}
          onPress={bookClassroom}
        >
          Réserver
        </Button>
      </View>

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
        locale="fr-FR"
        confirmTextIOS="Confirmer"
        cancelTextIOS="Annuler"
      />
    </ScrollView>
  );
};

const BLUE = "#2563eb";
const BLUE_PALE = "#e6eeff";
const BLUE_BORDER = "#2563eb";
const BLUE_CHIP = "#e6eeff";
const BLUE_TEXT = "#2563eb";
const BG = "#f7f9fb";
const BG_EQUIP = "#f1f5ff";
const BG_BOOK = "#f1f5ff";
const TEXT_MAIN = "#22223b";
const TEXT_MUTED = "#64748b";
const TEXT_FADED = "#94a3b8";

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: BG,
    paddingBottom: 36,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG,
  },
  loadingText: {
    fontSize: 18,
    color: TEXT_MUTED,
    fontStyle: "italic",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: TEXT_MAIN,
  },
  subtitle: {
    fontSize: 15.5,
    marginTop: 2,
    color: BLUE_TEXT,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    color: BLUE_TEXT,
    letterSpacing: 0.2,
  },
  equipmentContainer: {
    marginBottom: 6,
    padding: 12,
    borderRadius: 10,
    backgroundColor: BG_EQUIP,
  },
  equipmentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 3,
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
    marginBottom: 7,
  },
  equipmentText: {
    fontSize: 15,
    color: TEXT_MAIN,
  },
  cardWrapper: {
    marginBottom: 7,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderLeftWidth: 6,
    borderLeftColor: BLUE_BORDER,
    backgroundColor: BLUE_PALE,
    marginBottom: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  arrow: {
    fontSize: 22,
    marginHorizontal: 3,
    color: TEXT_MUTED,
    fontWeight: "600",
  },
  chipFuture: {
    backgroundColor: BLUE_CHIP,
    marginRight: 2,
    marginVertical: 1,
    height: 30,
    borderWidth: 1,
    borderColor: "#dde4fb",
  },
  roomLabel: {
    fontWeight: "500",
    color: TEXT_MAIN,
    marginRight: 2,
    fontSize: 15,
  },
  roomName: {
    fontWeight: "600",
    color: BLUE_TEXT,
    fontSize: 15.5,
  },
  roomIcon: {
    fontSize: 16,
    marginRight: 3,
  },
  roomCapacity: {
    fontWeight: "400",
    color: TEXT_MUTED,
    fontSize: 13,
  },
  noResText: {
    fontStyle: "italic",
    color: TEXT_FADED,
    marginVertical: 15,
    alignSelf: "center",
    fontSize: 15.5,
  },
  reservationText: {
    fontSize: 16.5,
    fontWeight: "bold",
    color: TEXT_MAIN,
  },
  userText: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  bookContainer: {
    backgroundColor: BG_BOOK,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 40,
    elevation: 1,
  },
  bookTitle: {
    fontSize: 17.5,
    fontWeight: "bold",
    marginBottom: 9,
    color: BLUE_TEXT,
    letterSpacing: 0.2,
  },
  input: {
    marginBottom: 13,
    backgroundColor: "#fff",
  },
  reserveButton: {
    marginTop: 5,
    backgroundColor: BLUE,
    color: "#fff",
  },
});

export default ClassroomsDetailsScreen;
