import { View, Text, Button, XStack, YStack, Card } from 'tamagui';
import styles from '../../Styles/Sheet';
import PageHeader from './Header';
import pageList from '../Navigation/pageList';

const HomeScreen = ({ route, navigation }) => {
    const pageData = {
        pageName: 'Home',
        pageTitle: route.params.title,
        UserID: route.params.UserID,
    };

    return (
        <View paddingTop={100} justifyContent={'flex-start'} alignItems={'center'} height={'100vh'} backgroundColor={'#2a495f'}>
            
            <PageHeader navigation={navigation} pageData={pageData} />

            <XStack flex={1} flexDirection={'column'} gap={2}>

                <YStack flex={1} maxHeight={100}>
                    <Text fontSize={20}></Text>
                </YStack>

                <YStack flex={1}>
                    <XStack flexWrap={'wrap'} flexBasis={'auto'} alignContent={'center'} justifyContent={'center'} maxWidth={600} gap={15}>
                        { 
                            pageList.map((page) => pageData.pageName != page.name && page.name !== 'Seperator' && page.name !== 'Logout' ? 
                                <Card 
                                    flex={1} 
                                    key={page.name} 
                                    size={'$10'}
                                    borderRadius={20} 
                                    alignContent={'center'} 
                                    justifyContent={'center'}
                                    width={140}
                                    cursor={'pointer'}
                                    onPress={() => { navigation.navigate(page.route) }}
                                    hoverStyle={{ 
                                        backgroundColor: '$yellow2Light', 
                                        bordered: true, 
                                        borderColor: '$yellow9Light', 
                                        borderWidth: 5,
                                        shadowColor: '$yellow9Light',
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowRadius: 10,
                                    }}
                                    backgroundColor={'$blue3Light'}
                                    bordered={true}
                                    borderStyle={'solid'}
                                    borderWidth={5}
                                    borderColor={'$blue3Light'}
                                >
                                        <Card.Header flex={1} flexDirection={'row'} flexWrap={'wrap'} alignContent={'center'} display={'flex'} gap={10} justifyContent={'center'}>
                                            <page.icon size={'$2'} /> 
                                            <Text fontSize={20} alignContent={'flex-end'}>{ page.name }</Text>
                                        </Card.Header>
                                </Card> : null) 
                        }                    
                    </XStack>
                </YStack>

            </XStack>

        </View>
    )
};

export default HomeScreen;