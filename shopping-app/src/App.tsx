import { useAppSelector } from './app/hooks';
import { selectScreen } from './features/ui/uiSlice';
import Header from './components/Header';
import ShoppingScreen from './components/ShoppingScreen';
import OrderSummaryScreen from './components/OrderSummaryScreen';
import ConfirmationScreen from './components/ConfirmationScreen';
import { SCREEN } from './types';

export default function App() {
  const screen = useAppSelector(selectScreen);

  return (
    <div className="app-shell">
      <Header step={screen} />
      <main className="app-main">
        {screen === SCREEN.SHOPPING && <ShoppingScreen />}
        {screen === SCREEN.SUMMARY && <OrderSummaryScreen />}
        {screen === SCREEN.CONFIRMATION && <ConfirmationScreen />}
      </main>
    </div>
  );
}
