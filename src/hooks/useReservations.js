import { useState } from 'react';
import { loadReservations, saveReservations } from '../lib/reservations';

function useReservations() {
  const [reservations, setReservations] = useState(loadReservations);

  function addReservation(reservation) {
    const next = [...reservations, reservation];
    setReservations(next);
    saveReservations(next);
  }

  function cancelReservation(id) {
    const next = reservations.filter((r) => r.id !== id);
    setReservations(next);
    saveReservations(next);
  }

  return { reservations, addReservation, cancelReservation };
}

export default useReservations;
