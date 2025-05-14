import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Card, IconButton, Paragraph } from "react-native-paper";
import ReservationService from "../services/reservation.service";

const ReservationsScreen = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReservations();
  }, []);

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

  const deleteReservation = async (id: string) => {
    try {
      await ReservationService.deleteOne(id);
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== id)
      );
    } catch (err) {
      console.error("Erreur delete reservation", err);
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
      d.toLocaleDateString("fr-FR") +
      " " +
      d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement des réservations…</Text>
      </View>
    );
  }

  const renderReservation = (r: any, past: boolean = false) => (
    <Card key={r.id} style={styles.card}>
      <Card.Content>
        <View style={styles.cardRow}>
          <View style={{ flex: 1 }}>
            <Paragraph style={styles.reservationText}>
              {formatDateTime(r.startTime)} → {formatDateTime(r.endTime)}
            </Paragraph>
            <Paragraph style={styles.roomText}>
              Salle : {r.classroom.name} ({r.classroom.capacity} places)
            </Paragraph>
          </View>
          {!past && (
            <IconButton
              icon="trash-can-outline"
              size={24}
              onPress={() => deleteReservation(r.id)}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 52,
    gap: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  card: {
    marginVertical: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reservationText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  roomText: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    fontStyle: "italic",
    color: "#666",
  },
});

export default ReservationsScreen;
