/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, View, Text, Button, Alert} from 'react-native';

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_name: 'Mohit Saxena',
      user_contact: '8468975121',
      user_address: 'Mapsco casabela',
      input_user_id: 4,
    };

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',
              [],
            );
          }
        },
      );
    });
  }
  InsertDBAction = () => {
    console.log('insertDB Called');
    if (this.state.user_name) {
      if (this.state.user_contact) {
        if (this.state.user_address) {
          db.transaction((tx) => {
            // Loop would be here in case of many values

            tx.executeSql(
              'INSERT INTO table_user (user_id, user_name, user_contact, user_address) VALUES (?,?,?,?)',
              [
                this.state.input_user_id,
                this.state.user_name,
                this.state.user_contact,
                this.state.user_address,
              ],
              (tx, results) => {
                console.log('Insert Results', results.rowsAffected);
                if (results.rowsAffected > 0) {
                  this.callAlertDialog('Success', 'User updated successfully');
                } else {
                  this.callAlertDialog('Failed', 'Updation Failed');
                }
              },
            );
          });
        } else {
          this.callAlertDialog('Failed', 'Please fill Address');
        }
      } else {
        this.callAlertDialog('Failed', 'Please fill Contact Number');
      }
    } else {
      this.callAlertDialog('Failed', 'Please fill Name');
    }
  };
  DeleteRowDBAction = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM  table_user where user_id=4',
        [],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            this.callAlertDialog('Success', 'User deleted successfully');
          } else {
            this.callAlertDialog('Failed', 'Please insert a valid User Id');
          }
        },
      );
    });
  };
  callAlertDialog = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Ok',
        },
      ],
      {cancelable: false},
    );
  };
  render() {
    console.log('render');
    return (
      <SafeAreaView>
        <View>
          <Text>Demo For SQLITE</Text>
          <Button
            title="Insert into Database"
            onPress={() => this.InsertDBAction()}
          />
          <Button
            title="Delete DB Action"
            onPress={() => this.DeleteRowDBAction()}
          />
        </View>
      </SafeAreaView>
    );
  }
}
