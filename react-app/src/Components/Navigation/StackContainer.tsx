import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../Pages/Home';
import AccountScreen from '../Pages/Account';

const Stack = createNativeStackNavigator();

const StackNavigator = ({ sessionData }) => {
    const preTitle = 'Starter Application';

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={ 'Home' } screenOptions={{ headerShown: false, headerTitleAlign: 'center' }}>
                <Stack.Screen name="Home" component={ HomeScreen } options={{ title: preTitle + 'Home' }} initialParams={{ title: 'Home', session: sessionData }} />
                <Stack.Screen name="Account" component={ AccountScreen }  options={{ title: preTitle + 'Account Settings' }} initialParams={{ title: 'Account Settings', session: sessionData }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default StackNavigator;