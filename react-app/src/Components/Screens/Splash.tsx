import { useState, useEffect } from 'react';
import { Image,Text, Animated } from "react-native";
import styles from "../../Styles/Sheet";

export function SplashScreen(props) {
    const [fadeAnim] = useState(new Animated.Value(1)); // Initial value for opacity: 1

    useEffect(() => {
        const timer = setTimeout(() => {
            // Fade out animation
            Animated.timing(
            fadeAnim,
            {
                toValue: 0,
                duration: 1000, // 1 second
                useNativeDriver: true,
            }
            ).start(()=> {
                props.onFadeComplete();
            });
        }, 0); // Wait for 1 seconds before starting the animation

        return () => clearTimeout(timer);
    }, [fadeAnim]);
    var localStyle = Object.assign({}, props.style, styles.splashContainer);
    return (
        <Animated.View style={[localStyle, { opacity: fadeAnim }]}>
            <Text style={styles.splashText}>
                <Image source={require('../../../resources/logo.png')} style={styles.splashImage} />
            </Text>
        </Animated.View>
    )
  }