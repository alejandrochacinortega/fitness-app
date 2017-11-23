import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { getMetricMetaInfo } from '../utils/helpers';
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

class App extends Component {
  render() {
    return (
      <View>
        <Text>{getMetricMetaInfo('bike').getIcon()}</Text>
        <Text>{getMetricMetaInfo('bike').type}</Text>
        <MaterialIcons name="directions-run" color={'black'} size={35} />
      </View>
    );
  }
}

export default App;
