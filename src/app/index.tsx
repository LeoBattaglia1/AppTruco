import { useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AnotadorTruco() {
  const [nosotros, setNosotros] = useState(0);
  const [ellos, setEllos] = useState(0);

  // Estados para los nombres personalizados
  const [nombreNosotros, setNombreNosotros] = useState("NOSOTROS");
  const [nombreEllos, setNombreEllos] = useState("ELLOS");

  // Estados para el modal de edición de nombres
  const [modalVisible, setModalVisible] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState<
    "nosotros" | "ellos" | null
  >(null);
  const [tempNombre, setTempNombre] = useState("");

  const modificarPuntos = (equipo: "nosotros" | "ellos", cantidad: number) => {
    // Si ya hay un ganador, no dejamos seguir sumando hasta reiniciar
    if (nosotros >= 30 || ellos >= 30) return;

    if (equipo === "nosotros") {
      setNosotros((prev) => Math.max(0, Math.min(prev + cantidad, 30)));
    } else {
      setEllos((prev) => Math.max(0, Math.min(prev + cantidad, 30)));
    }
  };

  const reiniciarPartida = () => {
    setNosotros(0);
    setEllos(0);
  };

  const abrirEditor = (equipo: "nosotros" | "ellos") => {
    setEquipoEditando(equipo);
    setTempNombre(equipo === "nosotros" ? nombreNosotros : nombreEllos);
    setModalVisible(true);
  };

  const guardarNombre = () => {
    if (tempNombre.trim() !== "") {
      if (equipoEditando === "nosotros") {
        setNombreNosotros(tempNombre.toUpperCase());
      } else if (equipoEditando === "ellos") {
        setNombreEllos(tempNombre.toUpperCase());
      }
    }
    setModalVisible(false);
  };

  // Renderizador visual de los atados de 5 fósforos
  const renderizarFosforosVisuales = (cantidadPuntos: number) => {
    const bloques = [];
    let rest = cantidadPuntos;

    while (rest > 0) {
      const enBloque = Math.min(rest, 5);
      bloques.push(enBloque);
      rest -= enBloque;
    }

    return (
      <View style={styles.contenedorAtados}>
        {bloques.map((nro, index) => (
          <View key={index} style={styles.atadoFosforosContainer}>
            {nro >= 1 && (
              <View style={styles.fosforoHorizontalArriba}>
                <View style={styles.cabezaRojaHorizontal} />
              </View>
            )}
            {nro >= 2 && (
              <View style={styles.fosforoVerticalIzquierda}>
                <View style={styles.cabezaRojaVertical} />
              </View>
            )}
            {nro >= 3 && (
              <View style={styles.fosforoVerticalDerecha}>
                <View style={styles.cabezaRojaVerticalAbajo} />
              </View>
            )}
            {nro >= 4 && (
              <View style={styles.fosforoHorizontalAbajo}>
                <View style={styles.cabezaRojaHorizontalAbajo} />
              </View>
            )}
            {nro === 5 && (
              <View style={styles.fosforoDiagonal}>
                <View style={styles.cabezaRojaDiagonal} />
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  // Calcular diferencia de puntos para el texto dinámico
  const diferencia = Math.abs(nosotros - ellos);
  let textoDiferencia = "Partida empatada";
  if (nosotros > ellos) {
    textoDiferencia = `${nombreNosotros} va${nosotros - ellos === 1 ? "" : "n"} ganando por ${diferencia} ${diferencia === 1 ? "punto" : "puntos"}`;
  } else if (ellos > nosotros) {
    textoDiferencia = `${nombreEllos} va${ellos - nosotros === 1 ? "" : "n"} ganando por ${diferencia} ${diferencia === 1 ? "punto" : "puntos"}`;
  }

  // Detectar ganador
  const hayGanador = nosotros >= 30 || ellos >= 30;
  const nombreGanador = nosotros >= 30 ? nombreNosotros : nombreEllos;

  const malasNosotros = Math.min(nosotros, 15);
  const buenasNosotros = nosotros > 15 ? nosotros - 15 : 0;
  const malasEllos = Math.min(ellos, 15);
  const buenasEllos = ellos > 15 ? ellos - 15 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
      >
        {/* TABLERO PRINCIPAL DE MADERA */}
        <View style={styles.cuerpoTablero}>
          {/* ================= NOSOTROS ================= */}
          <View style={styles.columnaEquipo}>
            <TouchableOpacity onPress={() => abrirEditor("nosotros")}>
              <Text style={styles.nombreEquipo}>{nombreNosotros} ✏️</Text>
            </TouchableOpacity>

            <View style={styles.seccionMitad}>
              {renderizarFosforosVisuales(malasNosotros)}
            </View>

            <View style={styles.lineaDivisoriaHorizontal} />

            <View style={styles.seccionMitad}>
              {renderizarFosforosVisuales(buenasNosotros)}
            </View>

            <View style={styles.botoneraColumna}>
              <TouchableOpacity
                style={styles.btnMenosColumna}
                onPress={() => modificarPuntos("nosotros", -1)}
              >
                <Text style={styles.textBtnColumna}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnMasColumna}
                onPress={() => modificarPuntos("nosotros", 1)}
              >
                <Text style={styles.textBtnColumna}>+1</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DIVISOR CENTRAL */}
          <View style={styles.divisorMaderaVertical} />

          {/* ================= ELLOS ================= */}
          <View style={styles.columnaEquipo}>
            <TouchableOpacity onPress={() => abrirEditor("ellos")}>
              <Text style={styles.nombreEquipo}>{nombreEllos} ✏️</Text>
            </TouchableOpacity>

            <View style={styles.seccionMitad}>
              {renderizarFosforosVisuales(malasEllos)}
            </View>

            <View style={styles.lineaDivisoriaHorizontal} />

            <View style={styles.seccionMitad}>
              {renderizarFosforosVisuales(buenasEllos)}
            </View>

            <View style={styles.botoneraColumna}>
              <TouchableOpacity
                style={styles.btnMenosColumna}
                onPress={() => modificarPuntos("ellos", -1)}
              >
                <Text style={styles.textBtnColumna}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnMasColumna}
                onPress={() => modificarPuntos("ellos", 1)}
              >
                <Text style={styles.textBtnColumna}>+1</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CARTEL DE GANADOR O TEXTO DE DIFERENCIA */}
        {hayGanador ? (
          <View style={styles.cartelGanador}>
            <Text style={styles.textoGanadorTitulo}>
              🏆 ¡PARTIDA FINALIZADA! 🏆
            </Text>
            <Text style={styles.textoGanadorSub}>
              Los ganadores son: {nombreGanador}
            </Text>
          </View>
        ) : (
          <View style={styles.cajaDiferencia}>
            <Text style={styles.textoDiferencia}>{textoDiferencia}</Text>
          </View>
        )}

        {/* BOTÓN NUEVA PARTIDA */}
        <TouchableOpacity
          style={styles.btnReiniciar}
          onPress={reiniciarPartida}
        >
          <Text style={styles.textReiniciar}>🔄 NUEVA PARTIDA</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL PARA EDITAR NOMBRES */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar Nombre de Equipo</Text>
            <TextInput
              style={styles.inputNombre}
              value={tempNombre}
              onChangeText={setTempNombre}
              placeholder="Escribe el nombre..."
              placeholderTextColor="#888"
              autoFocus={true}
            />
            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={styles.btnModalCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textModalBtn}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnModalGuardar}
                onPress={guardarNombre}
              >
                <Text style={styles.textModalBtn}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b0e02",
  },
  scrollContainer: {
    padding: 12,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  cuerpoTablero: {
    flexDirection: "row",
    backgroundColor: "#341a05",
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#542c09",
    padding: 10,
    minHeight: 480,
    marginBottom: 10,
  },
  columnaEquipo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  nombreEquipo: {
    color: "#f1c40f",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
    marginVertical: 5,
    textAlign: "center",
  },
  seccionMitad: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  lineaDivisoriaHorizontal: {
    width: "95%",
    height: 3,
    backgroundColor: "#1b0e02",
    marginVertical: 4,
  },
  divisorMaderaVertical: {
    width: 4,
    backgroundColor: "#1b0e02",
    marginHorizontal: 6,
  },
  contenedorAtados: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 4,
  },
  atadoFosforosContainer: {
    width: 46,
    height: 46,
    position: "relative",
    margin: 3,
  },
  fosforoHorizontalArriba: {
    position: "absolute",
    top: 2,
    left: 4,
    width: 38,
    height: 5,
    backgroundColor: "#e6ccb2",
    borderRadius: 2,
  },
  cabezaRojaHorizontal: {
    position: "absolute",
    right: -4,
    top: -1,
    width: 7,
    height: 7,
    backgroundColor: "#c0392b",
    borderRadius: 4,
  },
  fosforoVerticalIzquierda: {
    position: "absolute",
    top: 4,
    left: 2,
    width: 5,
    height: 38,
    backgroundColor: "#e6ccb2",
    borderRadius: 2,
  },
  cabezaRojaVertical: {
    position: "absolute",
    top: -4,
    left: -1,
    width: 7,
    height: 7,
    backgroundColor: "#c0392b",
    borderRadius: 4,
  },
  fosforoVerticalDerecha: {
    position: "absolute",
    top: 4,
    right: 2,
    width: 5,
    height: 38,
    backgroundColor: "#e6ccb2",
    borderRadius: 2,
  },
  cabezaRojaVerticalAbajo: {
    position: "absolute",
    bottom: -4,
    left: -1,
    width: 7,
    height: 7,
    backgroundColor: "#c0392b",
    borderRadius: 4,
  },
  fosforoHorizontalAbajo: {
    position: "absolute",
    bottom: 2,
    left: 4,
    width: 38,
    height: 5,
    backgroundColor: "#e6ccb2",
    borderRadius: 2,
  },
  cabezaRojaHorizontalAbajo: {
    position: "absolute",
    left: -4,
    top: -1,
    width: 7,
    height: 7,
    backgroundColor: "#c0392b",
    borderRadius: 4,
  },
  fosforoDiagonal: {
    position: "absolute",
    top: 20,
    left: 4,
    width: 38,
    height: 5,
    backgroundColor: "#e6ccb2",
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
  },
  cabezaRojaDiagonal: {
    position: "absolute",
    right: -4,
    top: -1,
    width: 7,
    height: 7,
    backgroundColor: "#c0392b",
    borderRadius: 4,
  },
  botoneraColumna: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  btnMasColumna: {
    flex: 2,
    backgroundColor: "#27ae60",
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
  },
  btnMenosColumna: {
    flex: 1,
    backgroundColor: "#c0392b",
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
  },
  textBtnColumna: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cajaDiferencia: {
    backgroundColor: "#2b1503",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#7f4f24",
    alignItems: "center",
    marginVertical: 6,
  },
  textoDiferencia: {
    color: "#f39c12",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  cartelGanador: {
    backgroundColor: "#1e8449",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#f1c40f",
    alignItems: "center",
    marginVertical: 6,
  },
  textoGanadorTitulo: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 2,
  },
  textoGanadorSub: {
    color: "#fef9e7",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  btnReiniciar: {
    backgroundColor: "#241002",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d35400",
    marginTop: 4,
  },
  textReiniciar: {
    color: "#f39c12",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 1,
  },
  /* Estilos del Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#341a05",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    borderWidth: 2,
    borderColor: "#d35400",
    alignItems: "center",
  },
  modalTitle: {
    color: "#f39c12",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputNombre: {
    width: "100%",
    backgroundColor: "#1b0e02",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#7f4f24",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalBotones: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  btnModalCancelar: {
    flex: 1,
    backgroundColor: "#c0392b",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  btnModalGuardar: {
    flex: 1,
    backgroundColor: "#27ae60",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  textModalBtn: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
