import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    marginHorizontal: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
});

const specificStyles = StyleSheet.create({
  containerResumen: {
    width: "100%",
    marginBottom: 20,
  },
  productoTexto: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 2,
  },
  disabledCard: {
    backgroundColor: "gray",
  },
  botonRestablecer: {
    backgroundColor: "#FF5722",
  },
  botonHistorial: {
    backgroundColor: "#4285F4",
  },
  metodoPagoContainerSelected: {
    backgroundColor: "#d3f8d3",
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
});

export { commonStyles, specificStyles };
