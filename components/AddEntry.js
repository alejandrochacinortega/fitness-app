import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
} from '../utils/helpers';
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';

import CustomSlider from './CustomSlider';
import Steppers from './Steppers';
import DateHeader from './DateHeader';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';

import { connect } from 'react-redux';
import { addEntry } from '../actions';

function SubmitButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>Submit</Text>
    </TouchableOpacity>
  );
}

class App extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  };

  increment = metric => {
    const { max, step } = getMetricMetaInfo(metric);
    this.setState(state => {
      const count = state[metric] + step;

      return {
        ...state,
        [metric]: count > max ? max : count,
      };
    });
  };

  decrement = metric => {
    this.setState(state => {
      const count = state[metric] - getMetricMetaInfo(metric).step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      };
    });
  };

  slide = (metric, value) => {
    this.setState(state => {
      return {
        [metric]: value,
      };
    });
  };

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    // Update Redux
    this.props.addEntry({
      [key]: entry,
    });

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }));

    // Navigate to home

    submitEntry({ key, entry });

    // Save to DB

    // Clear local notification
  };

  reset = () => {
    const key = timeToString();

    // Update Redux
    this.props.addEntry({
      [key]: getDailyReminderValue(),
    });
    // Route to home

    removeEntry(key);
  };

  render() {
    const metaInfo = getMetricMetaInfo();
    console.log('this.state ', this.state);

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name="ios-happy-outline" size={100} />
          <Text>You already logged your information for today</Text>
          <TextButton onPress={this.reset}>
            <Text>Reset</Text>
          </TextButton>
        </View>
      );
    }

    return (
      <View>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider' ? (
                <CustomSlider
                  value={value}
                  onChange={value => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <Steppers
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </View>
          );
        })}
        <SubmitButton onPress={this.submit} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined',
  };
}

export default connect(mapStateToProps, { addEntry })(App);
