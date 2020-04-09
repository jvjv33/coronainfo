import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import { Button, ButtonGroup, Select, Layout, Text } from '@ui-kitten/components';
import axios from 'axios';
import { getEstados, getPaises, getTotal } from './service';
import { useNavigation, useRoute } from '@react-navigation/native';

export function Header() {
    const navigation = useNavigation();
    return(
        <ButtonGroup style={styles.buttonGroup} status='basic'>
            <Button onPress={() => navigation.navigate('Mundo')}>MUNDO</Button>
            <Button onPress={() => navigation.navigate('Pais')}>PAÍS</Button>
            <Button onPress={() => navigation.navigate('Estado')}>ESTADO</Button>
        </ButtonGroup>
    );
}

export function MundoScreen() {
    return (
      <>
        <ScrollView>
          <Layout style={styles.container}>
            <Text>Mundo Works!</Text>
          </Layout>
        </ScrollView>
      </>
    );
}

export function PaisScreen() {
    return (
      <>
        <ScrollView>
          <Layout style={styles.container}>
            <Text>País Works!</Text>
          </Layout>
        </ScrollView>
      </>
    );
  }

function getCasosPorEstado(source, state, cases) {
    source.map((item) => {if(item.state == state) { state = item.state; cases = item.cases;}});
}

function Geral({count}) {
  return (
    <Text style={{textAlign: 'center'}}>
      Casos: {count}, Mortes: 0
    </Text>
  );
}

async function Selecionar() {
  const x = 0;
  var options = [{text: 'Escolha um estado:'}];
  //const data = getEstados();
  const [data, setData] = useState([]);
  useEffect(async () => {
    const result = await axios(
        'https://api.coronaanalytic.com/journal',
        );
        //setData(result.data.values);
    //console.log(data);
    //const [count, setCount] = useState('0');
    //const data = getEstados();
    //data.map((item) => options.push({text: item.state}));
  }, []);
  const [selectedOption, setSelectedOption] = React.useState([options[0]]);
  //navigation.setParams({test: count});
  return (
    <>
    <Select
      style={styles.select}
      data={options}
      size='small'
      status='basic'
      placeholder='Escolha um Estado:'
      selectedOption={selectedOption}
      onSelect={setSelectedOption}
    />
  <Geral count={x}/>
  </>
  );
}
async function loadoptions() {
  var options = [];
  const response = await axios.get('https://api.coronaanalytic.com/journal');
  (response.data.values).map((item) => options.push({text: item.state}));
  return options;
}
export function EstadoScreen() {
  const [repositories, setRepositories] = useState(['Loading...']);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(['CE']);
  const [estado, setEstado] = useState([]);
  const [casos, setCasos] = useState(null);
  const [estados, setEstados] = useState([]);
  useEffect(() => {
    async function loadRepositories() {
      const response = await axios.get('https://api.coronaanalytic.com/journal');
      setRepositories(response.data);
      console.log(response.data.values[0].cases);
      setEstado(response.data.values[0].state);
      setCasos(response.data.values[0].cases);
      setEstados(response.data.values);
      var options2 = [];
      (response.data.values).map((item) => options2.push({text: item.state}));
      setOptions(options2);
    }

    loadRepositories();
  }, []);
  useEffect(() => {
    setEstado(selectedOption);
  }, [selectedOption]);
  return (
    <>
      <ScrollView>
        <Layout style={styles.container}>
          <Select
            style={styles.select}
            data={options}
            size='small'
            status='basic'
            placeholder='Escolha um Estado:'
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
          />
        <Text style={{textAlign: 'center'}}>
          Estado: {(Object.values(selectedOption)).values().next().value.toString()}, Casos: {casos}
        </Text>
        <Text>{JSON.stringify(estado)}</Text>
        </Layout>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    padding: 8,
  },
    select: {
        margin: 8,
    },
    buttonGroup: {
      margin: 8,
    },
});
