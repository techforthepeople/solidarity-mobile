import React from 'react';
import { StyleSheet, Text, View, Modal, Dimensions, TouchableOpacity, Image, Button} from 'react-native';
import MapView from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import PersonDetails from '../components/PersonDetails'
import axios from 'axios'

import {
  Header
} from "react-native-elements"

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        accessToken: null,
        isModalVisible: false,
        latitude: 0,
        longitude: 0,
        desLatitude: null,
        desLongitude: null, 
        selectedPerson: {},

        //Fake Data
        markers: []
    }
    this.handleOnPress = this.handleOnPress.bind(this)
    this.closeModal = this.closeModal.bind(this)
    
  }

  _onLogin = () => {
    auth0.webAuth
        .authorize({
            scope: 'openid profile email'
        })
        .then(credentials => {
            Alert.alert('AccessToken: ' + credentials.accessToken);
            this.setState({ accessToken: credentials.accessToken });
        })
        .catch(error => console.log(error));
};

_onLogout = () => {
    auth0.webAuth
        .clearSession({})
        .then(success => {
            Alert.alert('Logged out!');
            this.setState({ accessToken: null });
        })
        .catch(error => {
            console.log('Log out cancelled');
        });
};



  //Get A Users Location!
  async componentDidMount() {
    Geolocation.getCurrentPosition(
        position => {
          const location = position.coords;
          this.setState({latitude: location.latitude, longitude: location.longitude})
        },
        error => alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      const {data} = await axios.get('https://solidarity-backend-030.onrender.com/location/')

      this.setState({ markers: data })

      console.log('MARKER DATA', this.state.markers)
    }

  
  handleOnPress = (marker) => {
    this.setState({ isModalVisible: true, selectedPerson: marker})

  }

  closeModal () {
    this.setState({isModalVisible: false})
  }

  

  render() {
    let loggedIn = this.state.accessToken === null ? false : true;

      return (
        //Render MapVIew
        <View style={styles.container}>
        <MapView 
          style={styles.map}
          region = {{
            longitudeDelta: 0.1,
            latitudeDelta: 0.1,
            latitude: this.state.latitude,
            longitude: this.state.longitude
          }}
          showsUserLocation={true}
        >

        {this.state.markers.map(marker => {
            //process color
            let color = "red"
            // if(user.email === marker.userEmail) color ="blue"

           return (
             <MapView.Marker 
              key={marker.authId}
              coordinate={{
                latitude: Number(marker.location_histories[marker.location_histories.length-1].lat), 
                longitude: Number(marker.location_histories[marker.location_histories.length-1].long)
              }}
              title={marker.name}
              onPress={() => this.handleOnPress(marker)}
              pinColor={color}
             />
           )
         })}

        </MapView>

        <View style={styles.modal}>
          <PersonDetails isModalVisible={this.state.isModalVisible} 
            closeModal={() => this.closeModal()} 
            selectedPerson ={this.state.selectedPerson}
            />
         </View>


        </View>
    );
    }
  
    }

    export default Map;
   

    const styles = StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      modal: {
        width: 2,
        height: 2,
        marginTop: 10
    }, 
      button: {
        width: 20,
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 25,
        alignItems: 'center',
      },
      buttonContainer: {
        flexDirection: 'row',
        width: 50,
        height: 50,
        position: 'absolute',
        bottom:10,
        right:10,
        justifyContent: 'center'
      },
      buttonText: {
        fontSize: 50,
      }
    });

    