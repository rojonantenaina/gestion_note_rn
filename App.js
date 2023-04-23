import React, { useEffect, useState } from "react";
import {
  NativeBaseProvider,
  Box,
  Center,
  Heading,
  Modal,
  Button,
  VStack,
  Text,
  Input,
  FormControl,
  FlatList,
  HStack,
  Avatar,
  Spacer,
  StatusBar,
} from "native-base";
import axios from "axios";

export default function App() {
  useEffect(() => {
    recupererEtudiant();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [numeroEtudiant, setNumeroEtudiant] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [moyenne, setMoyenne] = React.useState(0);
  const [etudiants, setEtudiants] = React.useState([]);
  const [title, setTitle] = React.useState("Ajouter");
  const [type, setType] = React.useState("ajout");
  const [id, setId] = React.useState(0);
  const [moyenneClasse, setMoyenneClasse] = React.useState(0);
  const [moyenneMin, setMoyenneMin] = React.useState(0);
  const [moyenneMax, setMoyenneMax] = React.useState(0);
  const [nombreAdmis, setNombreAdmis] = React.useState(0);
  const [nombreRedoublant, setnombreRedoublant] = React.useState(0);

  const handleSizeClick = () => {
    setModalVisible(!modalVisible);
    setTitle("Ajouter");
    setNumeroEtudiant("");
    setNom("");
    setMoyenne(0);
    setType("ajout");
  };

  const enregistrerEtudiant = () => {
    const formData = new FormData();
    formData.append("numeroEtudiant", numeroEtudiant);
    formData.append("nom", nom);
    formData.append("moyenne", moyenne);
    if (type === "ajout") {
      axios
        .post("http://127.0.0.1:8000/api/etudiants", formData)
        .then((response) => {
          console.log(response.data);
          recupererEtudiant();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === "modif") {
      axios
        .put(`http://127.0.0.1:8000/api/etudiants/${id}`, {
          formData,
        })
        .then((response) => {
          console.log(formData);
          console.log(response.data);
          recupererEtudiant();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const recupererEtudiant = () => {
    axios
      .get("http://127.0.0.1:8000/api/etudiants")
      .then((response) => {
        console.log(response.data);
        setEtudiants(response.data);
        calculerMoyenne(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const supprimerEtudiant = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/etudiants/${id}`)
      .then((response) => {
        console.log(response.data);
        setEtudiants(response.data);
        recupererEtudiant();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modifierEtudiant = (idE, numeroE, nomE, moyenneE) => {
    setModalVisible(true);
    setNumeroEtudiant(numeroE);
    setNom(nomE);
    setMoyenne(moyenneE);
    setTitle("Modifier");
    setType("modif");
    setId(idE);
  };

  const calculerMoyenne = (re) => {
    var sommeMoyenne = 0;
    var nombreEtudiant = re.length;
    for (var i = 0; i < nombreEtudiant; i++) {
      sommeMoyenne += re[i].moyenne;
    }
    setMoyenneClasse(sommeMoyenne / nombreEtudiant);
    const agg = re.sort((a, b) => a.moyenne - b.moyenne);
    const min = agg[0];
    const max = agg[agg.length - 1];
    setMoyenneMin(min.moyenne);
    setMoyenneMax(max.moyenne);
    setNombreAdmis(re.filter((row) => row.moyenne >= 10).length);
    setnombreRedoublant(re.filter((row) => row.moyenne < 10).length);
  };

  return (
    <NativeBaseProvider>
      <StatusBar />
      <Box flex={1}>
        <Box
          p="2"
          width="full"
          bg="primary.500"
          _text={{
            fontSize: "md",
            fontWeight: "medium",
            color: "warmGray.50",
            letterSpacing: "lg",
          }}
          shadow={2}
        >
          GESTION DE NOTE
        </Box>
        <Modal isOpen={modalVisible} onClose={setModalVisible}>
          <Modal.Content maxH="500">
            <Modal.CloseButton />
            <Modal.Header>
              <p>{title} un étudiant</p>
            </Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Matricule de l'étudiant</FormControl.Label>
                <Input
                  onChange={(e) => setNumeroEtudiant(e.target.value)}
                  value={numeroEtudiant}
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Nom de l'étudiant</FormControl.Label>
                <Input onChange={(e) => setNom(e.target.value)} value={nom} />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Moyenne de l'étudiant</FormControl.Label>
                <Input
                  type="number"
                  value={moyenne}
                  onChange={(e) => setMoyenne(e.target.value)}
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onPress={() => {
                    setModalVisible(false);
                    enregistrerEtudiant();
                  }}
                >
                  Enregistrer
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Box p={2} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button rounded={20} onPress={() => handleSizeClick()}>
            Nouveau
          </Button>
        </Box>
        <FlatList
          data={etudiants}
          renderItem={({ item }) => (
            <Box borderBottomWidth="1" borderColor="muted.800" py="2" px={2}>
              <HStack space={[2, 3]} justifyContent="space-between">
                <VStack>
                  <Text color="coolGray.800" bold>
                    IM : {item.numeroEtudiant}
                  </Text>
                  <Text color="coolGray.600">Nom : {item.nom}</Text>
                  <Text fontSize="xs" color="coolGray.800">
                    Moyenne : {item.moyenne}
                  </Text>
                </VStack>
                <Spacer />
                <Button
                  colorScheme="success"
                  size="sm"
                  onPress={() =>
                    modifierEtudiant(
                      item.id,
                      item.numeroEtudiant,
                      item.nom,
                      item.moyenne
                    )
                  }
                >
                  Modifier
                </Button>
                <Button
                  colorScheme="danger"
                  size="sm"
                  onPress={() => supprimerEtudiant(item.id)}
                >
                  Supprimer
                </Button>
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
        <Text>Moyenne de classe : {moyenneClasse}</Text>
        <Text>Moyenne minimale : {moyenneMin}</Text>
        <Text>Moyenne maximale : {moyenneMax}</Text>
        <Text>Nombre admis : {nombreAdmis}</Text>
        <Text>Nombre rédoublant : {nombreRedoublant}</Text>
      </Box>
    </NativeBaseProvider>
  );
}

