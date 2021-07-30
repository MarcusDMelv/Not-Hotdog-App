import React, { Component } from 'react';
import { Text,View, StyleSheet,Image,Button,SafeAreaView} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Tflite from 'tflite-react-native';
let tflite = new Tflite();
var modelFile = 'models/model_unquant.tflite';
var labelsFile = 'models/labels.txt';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      recognitions:null,
      source:null
    };
    tflite.loadModel({model:modelFile, labels:labelsFile}, (err,response) => {
      if(err)console.log(err);
      else console.log(response);
    });
  }
  selectGallerImage(){
    const options = {};
    ImagePicker.launchImageLibrary(options,(response) => {
      if(response.didCancel) {
        console.log('User Cancelled Image')
      } else if(response.error) {
        console.log('Error')
      } else if(response.customButton) {
        console.log('User pressed custom button')
      }else{
        this.setState({
          source: {uri: response.uri},
        });
        tflite.runModelOnImage({
          path:response.path,
          imageMean:128,
          imageStd:128,
          numResults:2,
          threshold:0.05,
        },(err,res)=>{
          if(err) console.log(err);
          else{
            console.log(res[res.length -1]);
            this.setState({recognitions:res[res.length-1]})
          }
        },
        );
      }
    });
  }
  takeImage(){
    const options = {};
    ImagePicker.launchCamera(options,(response) => {
      if(response.didCancel) {
        console.log('User Cancelled Image')
      } else if(response.error) {
        console.log('Error')
      } else if(response.customButton) {
        console.log('User pressed custom button')
      }else{
        this.setState({
          source: {uri: response.uri},
        });
        tflite.runModelOnImage({
          path:response.path,
          imageMean:128,
          imageStd:128,
          numResults:2,
          threshold:0.05,
        },(err,res)=>{
          if(err) console.log(err);
          else{
            console.log(res[res.length -1]);
            this.setState({recognitions:res[res.length-1]})
          }
        },
        );
      }
    });
  }
  render(){
    const {recognitions,source} = this.state;
    return(
      <SafeAreaView style ={styles.areaView}>
        <View style ={styles.titleContainer}>
          <Text style ={styles.title}>
            Not Hotdog
          </Text>
          <Text style ={styles.subtitle}>
            Using Machine Learning
          </Text>
        </View >
        <View style ={styles.outputContainer}>
          {
            recognitions ? (
              <View>
              <Image source={source} style = {styles.hotdogImage}></Image>
              <Text style ={{
                color:'white',
                textAlign:'center',
                paddingTop:10,
                fontSize:25
              }}>{recognitions['label']+'-'+(recognitions['confidence']*100).toFixed(0)+'%'}</Text>
              </View>
            ) : (
                <Image 
                source ={require('./asstes/hotdog.png')}
                style = {styles.hotdogImage}>
                </Image>
              )
              
          }
        </View>
        <View style ={styles.button}> 
          <Button 
          onPress = {this.selectGallerImage.bind(this)}
          title = "Camera Roll" 
          itleStyle={{fontSize:20}} 
          containerStyle={{margin:5}}>
          </Button>
          <Text></Text>
          <Button 
          onPress = {this.takeImage.bind(this)}
          title = "Take a Photo" 
          itleStyle={{fontSize:20}} 
          containerStyle={{margin:10}}>
          </Button>
        </View>

      </SafeAreaView>
    )

  }
}

const styles = StyleSheet.create({
  areaView:{
    flex:1,
    backgroundColor:'orange'
  },
  titleContainer:{
    marginTop: 70,
    marginLeft:40,
  },
  title:{
    fontSize:40,
    fontWeight:'bold'
  },
  subtitle:{
    fontSize:16,
  },
  outputContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  buttonContainer:{
    paddingBottom:20,
    marginBottom:5,
  },
  button:{
    paddingBottom:50,
    width:400,
    alignItems:'center',
    justifyContent:'center',
    
  },
  hotdogImage:{
    height:250,
    width:250,
  }

})