import { config} from '@tamagui/config/v3'
import { color, radius, size, space, themes, zIndex } from '@tamagui/themes'


import { createTamagui } from 'tamagui'
const tamaguiConfig = createTamagui(config)
// this makes typescript properly type everything based on the config

type Conf = typeof tamaguiConfig

declare module 'tamagui' {

  interface TamaguiCustomConfig extends Conf {}

}
export default tamaguiConfig