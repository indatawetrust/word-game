import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

const storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,

    storageBackend: AsyncStorage,

    defaultExpires: 100000 * 3600 * 24,

    enableCache: true,

    sync : {
    }
})

export default storage
