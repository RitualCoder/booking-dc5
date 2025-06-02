import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card, Paragraph, Chip, Button } from "react-native-paper";
import ReservationService from "../services/reservation.service";
import { useFocusEffect } from "@react-navigation/native";

const ReservationsScreen = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAllReservations = async () => {
    try {
      setLoading(true);
      const response = await ReservationService.fetchAll();
      setReservations(response);
    } catch (err) {
      console.error("Erreur fetch reservations", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllReservations();
    }, [])
  );

  const deleteReservation = async (id: string) => {
    try {
      setDeletingId(id);
      await ReservationService.deleteOne(id);
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== id)
      );
    } catch (err) {
      console.error("Erreur delete reservation", err);
    } finally {
      setDeletingId(null);
    }
  };

  const now = new Date();

  const futureReservations = reservations
    .filter((r) => new Date(r.endTime) >= now)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const pastReservations = reservations
    .filter((r) => new Date(r.endTime) < now)
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

  const formatDateTime = (isoString: string) => {
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3182ce" />
        <Text style={{ marginTop: 8 }}>Chargement des réservations…</Text>
      </View>
    );
  }

  const renderReservation = (r: any, past: boolean = false) => (
    <View key={r.id} style={styles.cardWrapper}>
      <Card
        style={[styles.card, past ? styles.cardPast : styles.cardFuture]}
        elevation={2}
      >
        <Card.Content>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Chip
                  style={past ? styles.chipPast : styles.chipFuture}
                  icon="calendar-clock"
                >
                  {formatDateTime(r.startTime)}
                </Chip>
                <Text style={styles.arrow}>→</Text>
                <Chip
                  style={past ? styles.chipPast : styles.chipFuture}
                  icon="clock-outline"
                >
                  {formatDateTime(r.endTime)}
                </Chip>
              </View>
              <View style={styles.row}>
                <Paragraph style={styles.roomLabel}>Salle :</Paragraph>
                <Paragraph style={styles.roomName}>
                  <Text style={styles.roomIcon}>🏫</Text> {r.classroom.name}{" "}
                  <Text style={styles.roomCapacity}>
                    ({r.classroom.capacity} places)
                  </Text>
                </Paragraph>
              </View>
            </View>
          </View>
        </Card.Content>
        {!past && (
          <Button
            mode="text"
            textColor="#dc2626"
            loading={deletingId === r.id}
            disabled={deletingId === r.id}
            onPress={() => deleteReservation(r.id)}
          >
            {deletingId === r.id ? "Annulation…" : "Annuler"}
          </Button>
        )}
      </Card>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Réservations à venir</Text>
      {futureReservations.length > 0 ? (
        futureReservations.map((r) => renderReservation(r, false))
      ) : (
        <Text style={styles.emptyText}>Aucune réservation à venir.</Text>
      )}

      <Text style={styles.sectionTitle}>Réservations passées</Text>
      {pastReservations.length > 0 ? (
        pastReservations.map((r) => renderReservation(r, true))
      ) : (
        <Text style={styles.emptyText}>Aucune réservation passée.</Text>
      )}
    </ScrollView>
  );
};

const BLUE = "#2563eb";
const BLUE_PALE = "#e6eeff";
const GRAY_BG = "#f3f6fa";
const GRAY_BORDER = "#d1d5db";
const TEXT_DARK = "#22223b";
const TEXT_MUTED = "#64748b";
const TEXT_FADED = "#94a3b8";
const BG = "#f7f9fb";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 52,
    gap: 18,
    backgroundColor: BG,
    minHeight: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BG,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 6,
    color: BLUE,
    letterSpacing: 0.2,
  },
  cardWrapper: {
    marginBottom: 7,
  },
  card: {
    borderRadius: 14,
  },
  cardFuture: {
    borderLeftWidth: 6,
    borderLeftColor: BLUE,
    backgroundColor: BLUE_PALE,
  },
  cardPast: {
    borderLeftWidth: 6,
    borderLeftColor: GRAY_BORDER,
    backgroundColor: GRAY_BG,
    paddingBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: BLUE_PALE,
    marginRight: 2,
    marginVertical: 1,
    height: 30,
    borderWidth: 1,
    borderColor: "#dde4fb",
  },
  chipPast: {
    backgroundColor: "#f7f9fb",
    marginRight: 2,
    marginVertical: 1,
    height: 30,
    borderWidth: 1,
    borderColor: GRAY_BORDER,
  },
  roomLabel: {
    fontWeight: "500",
    color: TEXT_DARK,
    marginRight: 2,
    fontSize: 15,
  },
  roomName: {
    fontWeight: "600",
    color: BLUE,
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
  emptyText: {
    fontStyle: "italic",
    color: TEXT_FADED,
    marginVertical: 15,
    alignSelf: "center",
    fontSize: 15.5,
  },
});

export default ReservationsScreen;
