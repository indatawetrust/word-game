import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight, } from "react-native";
import Button from "react-native-button";
import { Actions } from "react-native-router-flux";
import { Col, Row, Grid } from "react-native-easy-grid";
import DB from '../db'
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get("window")
let Words = null

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2980b9",
  },
  top: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topText: {
    fontSize: 15,
    color: '#34495e',
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    width: width,
  },
  gameGrid: {
    padding: width*0.1,
  },
  col: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: '#ecf0f1',
    width: width/10,
    borderRadius: 5,
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
    color: '#34495e'
  },
  button: {
    backgroundColor: '#ecf0f1',
    paddingTop: width*0.025,
    paddingBottom: width*0.025,
    paddingLeft: width*0.05,
    paddingRight: width*0.05,
    borderRadius: 5,
  },
  remove: {
    color: '#34495e',
    fontSize: 13,
  },
  send: {
    color: '#34495e',
    fontSize: 13,
  },
  topTextView: {
    backgroundColor: '#ecf0f1',
    paddingTop: width*0.02,
    paddingBottom: width*0.02,
    paddingLeft: width*0.05,
    paddingRight: width*0.05,
    borderRadius: 5,
  }
});

class Game extends React.Component {
  constructor (props) {
    super(props)

    this.row = this.row.bind(this)
    this.col = this.col.bind(this)
    this.generate = this.generate.bind(this)
    this.selectChar = this.selectChar.bind(this)
    this.removeChar = this.removeChar.bind(this)
    this.trashChar = this.trashChar.bind(this)
    this.sendWord = this.sendWord.bind(this)
    this.exit = this.exit.bind(this)

    switch (this.props.lang) {
      case 'tr':
          Words = require('../words.tr.json')
          this.chars = ["a","b","c","ç","d","e","f","g","h","ı","i","j","k","l","m","n","o","ö","p","r","s","ş","t","u","ü","v","y","z"]
        break
      case 'en':
          Words = require('../words.en.json')
          this.chars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","w","x","y","z"]
        break
      case 'fr':
          Words = require('../words.fr.json')
          this.chars = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","w","x","y","z"]
        break
    }

    this.words = []

    let words = []

    for (let i=0;i<5;i++) {
      let cols = []

      for (let j=0;j<5;j++) {
        cols.push('')
      }

      words.push(cols)
    }

    let char = this.chars[Math.floor(Math.random()*this.chars.length)]

    let newWord = Words[char][Math.floor(Math.random()*Words[char].length)].toLowerCase().trim().split('')

    this.state = {
      word: '',
      words: words,
      lang: this.props.lang,
      newWord: this.shuffle(newWord),
      time: '03:00',
      score: 0,
    }

    this.time = 180

    setInterval(() => {

      this.time = --this.time

      if (this.time === 0) {

        this.scoreSave(this.state.score)

      }

      let minute = Math.floor(this.time/60),
          second = this.time - minute*60

      this.setState({
        time: `0${minute}:${second <= 9 ? 0 : ''}${second}`
      })

    }, 1000)

    this.generate()
  }

  row () {
    return <Row></Row>
  }

  col () {
    return <Col></Col>
  }

  tile (size) {

    try {

      let rows = []

      for (let i=0;i<size;i++) {
        let cols = []

        for (let j=0;j<size;j++) {
          let char = this.state.words[i][j] == '' ? this.words[i][j] : this.state.words[i][j]

          cols.push(<Col size={10/size} style={styles.col} onPress={this.selectChar.bind(null, char, i, j)} underlayColor={'rgba(0,0,0,0)'}>
              <Text style={styles.text}>{char}</Text>
          </Col>)
        }

        rows.push(<Row size={10/size} style={styles.row}>{cols}</Row>)
      }

      return rows

    } catch (e) {

      Actions.intro()

    }

  }

  selectChar (char, i, j) {
    try {

      if (this.state.word.length <= 10) {
        let words = this.state.words

        let shift = this.state.newWord.shift()

        if (shift) {

          words[i][j] = shift

        } else {

          let randChar = this.chars[Math.floor(Math.random()*this.chars.length)]
              newWord = Words[randChar][Math.floor(Math.random()*Words[randChar].length)].toLowerCase().trim().split('')

          this.setState({
            newWord,
          })

          words[i][j] = newWord.shift()

        }

        this.setState({
          word: this.state.word + char,
          words: words,
        })
      }

    } catch (e) {

    }
  }

  removeChar () {
    this.setState({
      word: this.state.word.substr(0, this.state.word.length-1)
    })
  }

  trashChar () {
    this.setState({
      word: '',
    })
  }

  sendWord () {
    try {

      if (this.state.word != '') {
        if (Words[this.state.word[0]].indexOf(this.state.word) != -1) {

          this.setState({
            word: '',
            isCorrect: true,
            score: ++this.state.score,
          })

        } else {

          this.setState({
            isCorrect: false,
          })

        }

        setTimeout(() => {

          this.setState({
            isCorrect: undefined,
          })

        }, 250)
      }

    } catch (e) {

    }
  }

  shuffle (arr) {
    try {

      for (let i = arr.length; i; i--) {
          let j = Math.floor(Math.random() * i);
          [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
      }

      return arr

    } catch (e) {

    }
  }

  generate () {
    try {
      let char = this.chars[Math.floor(Math.random()*this.chars.length)]

      while(this.words.length < 25) {
        this.words = this.words.concat(Words[char][Math.floor(Math.random()*Words[char].length)].toLowerCase().trim().split(''))

        char = this.chars[Math.floor(Math.random()*this.chars.length)]
      }

      this.words = this.words.slice(0, 25)

      this.words = this.shuffle(this.words)

      let matrix = []

      for (let i=0;i<5;i++) {
        let list = []

        for (let j=0;j<5;j++) {
          list.push(this.words.pop())
        }

        matrix.push(list)
      }

      char = this.chars[Math.floor(Math.random()*this.chars.length)]

      this.words = matrix

    } catch (e) {

      Actions.intro()

    }
  }

  exit () {
    this.scoreSave(this.state.score)
  }

  scoreSave (score) {
    DB.load({
      key: 'score',
    }).then(res => {

      if (res.score < score) {

        DB.save({
          key: 'score',
          rawData: {
            score: this.state.score,
          }
        })

      }

      Actions.intro()

    })
  }

  render(){
    return (
      <View {...this.props}  style={styles.container}>
        <Grid>
          <Row size={1.5} style={styles.top}>
          </Row>
          <Row size={1.5} style={styles.top}>
            <View style={[styles.topTextView, { marginRight: width*0.1, }]}>
              <Text style={styles.topText}>
                <Icon name="clock-o" style={{ color: '#2980b9',fontSize: width*0.05, }}/> {this.state.time}
              </Text>
            </View>
            <View style={[styles.topTextView, { marginRight: width*0.05, }]}>
              <Text style={styles.topText}>
                <Icon name="star" style={{ color: '#2980b9',fontSize: width*0.05, }}/> {this.state.score}
              </Text>
            </View>
            <View style={{ position: 'absolute', right: width*0.1, padding: width*0.02, borderRadius: 5, backgroundColor: '#fff' }}>
              <TouchableHighlight onPress={this.exit} underlayColor={'rgba(0,0,0,0)'}>
                <Text style={styles.topText}>
                  <Icon name="sign-out" style={{ color: '#2980b9',fontSize: width*0.04, }}/>
                </Text>
              </TouchableHighlight>
            </View>
          </Row>
          <Row size={0.5} style={styles.top}>
            <View style={[styles.topTextView, { borderWidth: this.state.isCorrect == undefined ? 0 : 4, borderColor: this.state.isCorrect == true ? '#2ecc71' : '#e74c3c' }]}>
              <Text style={styles.topText}>
                {this.state.word == '' ? '_' : this.state.word}
              </Text>
            </View>
          </Row>
          <Row size={5.5} style={styles.bottom}>
            <Grid style={styles.gameGrid}>
              {this.tile(5)}
            </Grid>
          </Row>
          <Row size={2} style={styles.bottom}>
            <Grid>
              <Col size={3.33} style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TouchableHighlight onPress={this.removeChar} underlayColor={'rgba(0,0,0,0)'} style={{ opacity: this.state.word === '' ? 0.2 : 1 }}>
                  <View style={[styles.button, { opacity: this.state.word === '' ? 0.8 : 1 }]}>
                    <Text style={styles.send}>
                      {this.state.lang == 'en' ? 'delete' : (this.state.lang == 'fr' ? 'effacer' : 'sil')}
                    </Text>
                  </View>
                </TouchableHighlight>
              </Col>
              <Col size={3.33} style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TouchableHighlight onPress={this.trashChar} underlayColor={'rgba(0,0,0,0)'} style={{ opacity: this.state.word === '' ? 0.2 : 1 }}>
                  <View style={[styles.button, { opacity: this.state.word === '' ? 0.8 : 1 }]}>
                    <Text style={styles.send}>
                      {this.state.lang == 'en' ? 'clean' : (this.state.lang == 'fr' ? 'propre' : 'temizle')}
                    </Text>
                  </View>
                </TouchableHighlight>
              </Col>
              <Col size={3.33} style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TouchableHighlight onPress={this.sendWord} underlayColor={'rgba(0,0,0,0)'} style={{ opacity: this.state.word === '' ? 0.2 : 1 }}>
                  <View style={[styles.button, { opacity: this.state.word === '' ? 0.8 : 1 }]}>
                    <Text style={styles.send}>
                      {this.state.lang == 'en' ? 'send' : (this.state.lang == 'fr' ? 'envoyer' : 'gönder')}
                    </Text>
                  </View>
                </TouchableHighlight>
              </Col>
            </Grid>
          </Row>
        </Grid>
      </View>
    );
  }
}

module.exports = Game;
