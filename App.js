import React from 'react';
import { View, Slider, Text } from 'react-native';
import AddEntry from './components/AddEntry';

export default class App extends React.Component {
  state = {
    value: 0,
  };
  render() {
    return (
      <View style={{ flex: 1, marginTop: 50 }}>
        <AddEntry />
      </View>
    );
  }
}
