import { StyleSheet } from 'react-native';
import { tokens } from '@tamagui/themes';
import { Dimensions } from 'react-native';

const bgDefaultColor = '#2a495f';

const styles = StyleSheet.create({
    app: {
      marginHorizontal: "auto",
      maxWidth: 500
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bgDefaultColor,
    },
    splashContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bgDefaultColor, // Background color for the splash screen
    },
    splashText: {
      fontSize: 24,
      fontWeight: "bold",
    },
    // Add styles for your splash screen image if needed
    splashImage: {
      width: 144,
      height: 144,
     },

    // TEMP FOR BACKGROUND COLOR
    bgDefaultColor: {
      backgroundColor: bgDefaultColor,
    },

    // Page header styles
    pageHeader: {
      ...StyleSheet.absoluteFillObject,
      maxHeight: 60,
      height: 60,
      backgroundColor: tokens.color.blue1Light.val,
      marginBottom: 20,
      flex: 1,
      flexWrap: 'nowrap',
      flexDirection: 'row',      
    },
    appTitle: {
      textAlign: 'center',
      fontSize: 15,
      fontWeight: 'bold',
      letterSpacing: 5,
      color: tokens.color.blue6Light.val,
    },
    pageTitle: {
      textAlign: 'center',
      position: 'absolute', 
      width: '100%',
      bottom: 5,
      fontSize: 20,
      fontWeight: 'bold',
      color: tokens.color.blue6Dark.val,
    },
    userName: {
      textAlign: 'right',
      position: 'absolute',
      bottom: 5,
      width: '100%',
      paddingRight: 10,
      fontSize: 15,
      color: tokens.color.blue6Dark.val,
    },

    // Menu container button style
    menuContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: tokens.color.blue6Light.val,
      height: Dimensions.get('window').height,
      padding: 5,
      maxWidth: 300,
      minWidth: 300,
      borderRightColor: tokens.color.blue1Light.val,
      borderRightWidth: 2,
      shadowColor: tokens.color.blue10Dark.val,
      shadowOffset: { width: 2, height: 0 },
      shadowRadius: 10,
      zIndex: 999,
    },
    mainMenu: {
      backgroundColor: tokens.color.blue6Light.val, 
      width: '100%',
      padding: 10,
    },
    menuHeader: {
      flex: 1,
      flexDirection: 'row', 
      flexWrap: 'nowrap', 
      maxHeight: 60,
      width: '100%',
      marginBottom: 30,
    },
    menuHeaderLogoContainer: {
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuHaderLogoImage: {
      width: 50, 
      height: 50,
    },
    menuHeaderTitle: {
      flexGrow: 2,
      justifyContent: 'center',
      textAlign: 'left',
      fontSize: 30,
    },
    menuButton: {
      backgroundColor: 'transparent',
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 15,
      borderWidth: 0,
      height: '100%',
      color: bgDefaultColor
    },
    menuItems: {
      width: '100%',
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
      gap: 5,
    },
    menuItemButton: {
      margin: 2,
      justifyContent: 'flex-start',
      fontSize: 20,
    },
    menuItemButtonHover: {
      backgroundColor: tokens.color.blue4Light.val,
      shadowColor: tokens.color.blue5Dark.val,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: .5,
      shadowRadius: 5,
    },
  });

export default styles;