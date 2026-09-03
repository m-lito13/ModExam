import { SCREEN, type Screen } from '../types';

interface HeaderProps {
  step: Screen;
}

export default function Header({ step }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__mark" aria-hidden="true" />
        <span className="app-header__title">ORDERS</span>
      </div>
      <ol className="app-header__steps">
        <li className={step === SCREEN.SHOPPING ? 'is-active' : 'is-done'}>
          רשימת קניות
        </li>
        <li className={step === SCREEN.SUMMARY ? 'is-active' : step === SCREEN.CONFIRMATION ? 'is-done' : ''}>
          סיכום הזמנה
        </li>
        <li className={step === SCREEN.CONFIRMATION ? 'is-active' : ''}>אישור</li>
      </ol>
    </header>
  );
}
