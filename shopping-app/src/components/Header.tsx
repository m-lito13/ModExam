import { SCREEN, type Screen } from '../types';
import { t } from '../i18n/t';

interface HeaderProps {
  step: Screen;
}

export default function Header({ step }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__mark" aria-hidden="true" />
        <span className="app-header__title">{t('header.brand')}</span>
      </div>
      <ol className="app-header__steps">
        <li className={step === SCREEN.SHOPPING ? 'is-active' : 'is-done'}>
          {t('header.stepShopping')}
        </li>
        <li className={step === SCREEN.SUMMARY ? 'is-active' : step === SCREEN.CONFIRMATION ? 'is-done' : ''}>
          {t('header.stepSummary')}
        </li>
        <li className={step === SCREEN.CONFIRMATION ? 'is-active' : ''}>{t('header.stepConfirmation')}</li>
      </ol>
    </header>
  );
}
