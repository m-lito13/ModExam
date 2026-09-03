import { useAppSelector } from './app/hooks';
import { selectScreen } from './features/ui/uiSlice';
import Header from './components/Header';
import ShoppingScreen from './components/ShoppingScreen';
import OrderSummaryScreen from './components/OrderSummaryScreen';
import ConfirmationScreen from './components/ConfirmationScreen';

export default function App() {
  const screen = useAppSelector(selectScreen);

  return (
    <div className="app-shell">
      <Header step={screen} />
      <main className="app-main">
        {screen === 'shopping' && <ShoppingScreen />}
        {screen === 'summary' && <OrderSummaryScreen />}
        {screen === 'confirmation' && <ConfirmationScreen />}
      </main>
    </div>
  );
}
