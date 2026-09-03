import type { Screen } from '../types';

interface HeaderProps {
  step: Screen;
}

export default function Header({ step }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__mark" aria-hidden="true" />
        <span className="app-header__title">ירוקת</span>
      </div>
      <ol className="app-header__steps">
        <li className={step === 'shopping' ? 'is-active' : 'is-done'}>
          רשימת קניות
        </li>
        <li className={step === 'summary' ? 'is-active' : step === 'confirmation' ? 'is-done' : ''}>
          סיכום הזמנה
        </li>
        <li className={step === 'confirmation' ? 'is-active' : ''}>אישור</li>
      </ol>
    </header>
  );
}
