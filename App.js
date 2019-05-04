import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage
} from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";

import AppNavigator from "./navigation/AppNavigator";
import MainTabNavigator from "./navigation/MainTabNavigator";
import { db } from "./constants/ApiKeys";

import ApiKeys from "./constants/ApiKeys";
import * as firebase from "firebase";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false
    };

    // Initialize firebase...
    if (!firebase.apps.length) {
      firebase.initializeApp(ApiKeys.FirebaseConfig);
    }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = user => {
    this.setState({ isAuthenticationReady: true });
    this.setState({ isAuthenticated: !!user });
    this.setUser();
  };

  setUser = async () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var user = firebase.auth().currentUser;
        let name, email, photoUrl, uid, emailVerified;

        // const usersRef = db.collection("users").doc(user.uid);

        if (user != null) {
          displayName = user.displayName;
          email = user.email;
          phoneNumber = user.phoneNumber;
          photoUrl = user.photoURL;
          emailVerified = user.emailVerified;
          uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
          // this value to authenticate with your backend server, if
          // you have one. Use User.getToken() instead.
        }
        // User is signed in.
        // console.log(user.uid, "From user");

        var userRef = db.collection("users/").doc(uid);

        var getDoc = userRef
          .get()
          .then(doc => {
            if (!doc.exists) {
              console.log("No such document!");

              var data = {
                displayName: "Shawn",
                phoneNumber: "914-323-3456",
                email,
                photoUrl:
                  "https://media.licdn.com/dms/image/C5603AQF7ZNPlmP0waQ/profile-displayphoto-shrink_200_200/0?e=1562198400&v=beta&t=xtZ1wFVvHZ64h9QrsfLjAbWZejRu0uGOXTwNldEbHZI",
                uid
              };
              var setDoc = db
                .collection("users")
                .doc(uid)
                .set(data);

              var setWithOptions = setDoc.set(
                {
                  capital: true
                },
                { merge: true }
              );
              console.log(uid, "Document added");
            } else {
              console.log("Document data:", doc.data());
            }
          })
          .catch(err => {
            console.log("Error getting document", err);
          });

        // var data = {
        //   displayName: name,
        //   phoneNumber,
        //   email,
        //   photoUrl,
        //   uid
        // };
      } else {
        // No user is signed in.
        return;
      }
    });
  };

  render() {
    if (
      (!this.state.isLoadingComplete || !this.state.isAuthenticationReady) &&
      !this.props.skipLoadingScreen
    ) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          {this.state.isAuthenticated ? <MainTabNavigator /> : <AppNavigator />}
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
