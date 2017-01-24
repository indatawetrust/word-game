import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight, } from "react-native";
import Button from "react-native-button";
import { Actions } from "react-native-router-flux";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from 'react-native-vector-icons/FontAwesome';
import DB from '../db'
import I18n from 'react-native-i18n'

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
  lang: {
    backgroundColor: '#ecf0f1',
    paddingTop: width*0.025,
    paddingBottom: width*0.025,
    paddingLeft: width*0.05,
    paddingRight: width*0.05,
    borderRadius: 10,
  },
});

class Intro extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      score: 0,
      lang: '',
      langs: ['TR', 'EN', 'FR'],
    }

    this.langs = this.langs.bind(this)
    this.langChange = this.langChange.bind(this)
  }

  componentWillMount () {

    DB.load({
      key: 'score'
    }).then(res => {
      this.setState({
        score: res.score
      })
    }).catch(err => {

    })

    DB.load({
      key: 'lang'
    }).then(res => {
      this.setState({
        lang: res.lang
      })
    }).catch(err => {
      DB.save({
        key: 'lang',
        rawData: {
          lang: I18n.currentLocale(),
        }
      })
    })

  }

  langChange (lang) {
    new Promise(res => {
      DB.remove({
        key: 'lang',
      })
      res()
    }).then(() => {
      DB.save({
        key: 'lang',
        rawData: {
          lang: lang,
        }
      })

      this.setState({
        lang: lang,
      })
    })
  }

  langs () {
    let touch = []

    for (let lang of this.state.langs) {
      touch.push(<TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={lang.toLowerCase() !== this.state.lang ? this.langChange.bind(null, lang.toLowerCase()) : null}>
        <View style={[styles.lang, { opacity: lang.toLowerCase() === this.state.lang ? 1 : 0.5 }]}>
          <Text>
            {lang}
          </Text>
        </View>
      </TouchableHighlight>)
    }

    return touch
  }

  render () {
    return (
      <View {...this.props}  style={styles.container}>
        <View style={[styles.button, { marginBottom: width*0.1, }]}>
          <Text>
            <Icon name="pencil" style={{ color: '#2980b9',fontSize: width*0.05, }}/> {this.state.lang == 'en' ? 'Find Word' : (this.state.lang == 'fr' ? 'Mot Trouver' : 'Kelime Bul')}
          </Text>
        </View>
        <View style={[styles.button, { marginBottom: width*0.1, }]}>
          <Text>
          {this.state.lang == 'en' ? 'Highest Score' : (this.state.lang == 'fr' ? 'Meilleur Score' : 'En Yüksek Skor')}
          </Text>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <Icon name="star" style={{ color: '#2980b9',fontSize: width*0.05, }}/> {this.state.score} {this.state.lang == 'en' ? 'word' : (this.state.lang == 'fr' ? 'mot' : 'kelime')}
          </Text>
        </View>
        <TouchableHighlight onPress={() => Actions.game({ lang: this.state.lang })} underlayColor={'rgba(0,0,0,0)'}>
          <View style={[styles.button, { marginBottom: width*0.1, }]}>
            <Text>
              <Icon name="play" style={{ color: '#2980b9',fontSize: width*0.05, }}/>
            </Text>
          </View>
        </TouchableHighlight>
        <View style={{ marginBottom: width*0.1, flexDirection: 'row' }}>
          {this.langs()}
        </View>
      </View>
    );
  }
}

module.exports = Intro;
