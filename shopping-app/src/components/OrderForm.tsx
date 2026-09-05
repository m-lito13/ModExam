import { useState } from 'react';
import type { Customer } from '../types';
import { t } from '../i18n/t';

const initialForm: Customer = { fullName: '', address: '', email: '' };

type FormErrors = Partial<Record<keyof Customer, string>>;

function validate(form: Customer): FormErrors {
  const errors: FormErrors = {};
  if (!form.fullName.trim()) errors.fullName = t('orderForm.requiredField');
  if (!form.address.trim()) errors.address = t('orderForm.requiredField');
  if (!form.email.trim()) {
    errors.email = t('orderForm.requiredField');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('orderForm.invalidEmail');
  }
  return errors;
}

interface OrderFormProps {
  onSubmit: (form: Customer) => void;
  submitting: boolean;
  submitError: string | null;
  disabled?: boolean;
}

export default function OrderForm({ onSubmit, submitting, submitError, disabled }: OrderFormProps) {
  const [form, setForm] = useState<Customer>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof Customer) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const isFormFilled =
    form.fullName.trim() !== '' && form.address.trim() !== '' && form.email.trim() !== '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form);
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field-label" htmlFor="fullName">
          {t('orderForm.fullNameLabel')}
        </label>
        <input
          id="fullName"
          className="input"
          placeholder={t('orderForm.fullNamePlaceholder')}
          value={form.fullName}
          onChange={handleChange('fullName')}
        />
        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="address">
          {t('orderForm.addressLabel')}
        </label>
        <input
          id="address"
          className="input"
          placeholder={t('orderForm.addressPlaceholder')}
          value={form.address}
          onChange={handleChange('address')}
        />
        {errors.address && <span className="error-text">{errors.address}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="email">
          {t('orderForm.emailLabel')}
        </label>
        <input
          id="email"
          type="email"
          className="input"
          placeholder="name@example.com"
          value={form.email}
          onChange={handleChange('email')}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      {submitError && <p className="error-text">{submitError}</p>}

      <button
        type="submit"
        className="btn btn--accent btn--full"
        disabled={submitting || !isFormFilled || disabled}
      >
        {submitting ? t('orderForm.submitting') : submitError ? t('orderForm.retry') : t('orderForm.submit')}
      </button>
    </form>
  );
}
