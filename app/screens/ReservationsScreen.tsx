import { Text, View } from "react-native";
import ReservationService from "../services/reservation.service";
import { useState } from "react";

const ReservationsScreen = () => {
  const [reservations, setReservations] = useState([]);
  const fetchAllReservations = async () => {
    const response = await ReservationService.fetchAll();
    // console.log(response);
    setReservations(response);
  };

  return (
    <View>
      <Text>Reservations</Text>
    </View>
  );
};

export default ReservationsScreen;
