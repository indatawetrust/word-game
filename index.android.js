/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  Scene,
  Reducer,
  Router,
  Switch,
  Modal,
  Actions,
  ActionConst,
} from 'react-native-router-flux';
import { AdMobBanner, AdMobInterstitial, PublisherBanner} from 'react-native-admob'

import Intro from './components/Intro'
import Game from './components/Game'

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    console.log('ACTION:', action);
    return defaultReducer(state, action);
  };
};

export default class wordgame extends Component {
  render() {
    return (
      <View style={{ flex: 1, }}>
      <Router createReducer={reducerCreate}>
        <Scene key="root">
          <Scene component={Intro} initial key="intro" hideNavBar duration={0}/>
          <Scene component={Game} key="game" hideNavBar duration={0}/>
        </Scene>
      </Router>
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID="ca-app-pub-*/*"
        testDeviceID="EMULATOR"/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('wordgame', () => wordgame);
