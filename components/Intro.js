import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight, } from "react-native";
import Button from "react-native-button";
import { Actions } from "react-native-router-flux";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
import DB from '../db'

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2980b9",
  },
  button: {
    backgroundColor: '#ecf0f1',
    paddingTop: width*0.025,
    paddingBottom: width*0.025,
    paddingLeft: width*0.05,
    paddingRight: width*0.05,
    borderRadius: 10,
    color: '#34495e'
  },
});

class Intro extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      score: 0
    }
  }

  async componentWillMount () {

    DB.load({
      key: 'score'
    }).then(res => {
      this.setState({
        score: res.score
      })
    }).catch(err => {

    })

  }

  render () {
    return (
      <View {...this.props}  style={styles.container}>
        <View style={[styles.button, { marginBottom: width*0.1, }]}>
          <Text>
            rekor: {this.state.score} kelime
          </Text>
        </View>
        <TouchableHighlight onPress={() => Actions.game()} underlayColor={'rgba(0,0,0,0)'}>
          <View style={styles.button}>
            <Text>
              oyna
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

module.exports = Intro;
