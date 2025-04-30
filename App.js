// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import FileViewerScreen from './screens/FileViewerScreen';
import EditFileModal from './components/EditFileModal';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'File Manager' }} />
        <Stack.Screen name="FileViewer" component={FileViewerScreen} options={{ title: 'View File' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
