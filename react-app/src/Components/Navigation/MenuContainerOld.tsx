import { Button, XStack, YStack, Popover, Adapt } from 'tamagui';
import { Home, Menu } from '@tamagui/lucide-icons';
import styles from '../../Styles/Sheet';

const MenuContainer = ({ navigation, pageName }) => {
    
    const pages = [
        { name: 'Home', icon: Home },
    ];

    return (
        <XStack
            position="absolute"
            top={5}
            left={5}
            backgroundColor="transparent"
        >      
            <Popover size='$5'>
                <Popover.Trigger asChild><Button style={ styles.menuButton } icon={<Menu size={'$2'} />}></Button></Popover.Trigger>

                <Adapt when="sm" platform="touch">
                    <Popover.Sheet modal dismissOnSnapToBottom>
                    <Popover.Sheet.Frame padding="$4">
                        <Adapt.Contents />
                    </Popover.Sheet.Frame>
                    <Popover.Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                    </Popover.Sheet>
                </Adapt>

                <Popover.Content
                    borderWidth={1}
                    borderColor="$borderColor"
                    enterStyle={{ x: -50, opacity: 0 }}
                    exitStyle={{ x: -50, opacity: 0 }}
                    elevate
                    animation={[
                        'medium',
                        {
                        opacity: {
                            overshootClamping: true,
                        },
                        },
                    ]}
                >
                    <Popover.Arrow borderWidth={1} borderColor="$borderColor" />

                    <Popover.Close asChild>
                    
                        <YStack>
                            <XStack
                                flex={1}
                                flexDirection='column'
                                flexWrap='wrap'
                                backgroundColor={'#ffffff'}
                                position='relative'

                                $gtSm={{
                                    flexDirection: 'column',
                                    flexWrap: 'nowrap'
                                }}
                            >
                                { pages.map((page) => pageName != page.name ? <YStack key={page.name}><Button style={styles.menuItemButton} icon={page.icon} onPress={() => navigation.navigate(page.name)}>{page.name}</Button></YStack> : null) }

                            </XStack>
                        </YStack>
                    </Popover.Close>

                </Popover.Content>
            </Popover>
        </XStack>
    );
};

export default MenuContainer;
