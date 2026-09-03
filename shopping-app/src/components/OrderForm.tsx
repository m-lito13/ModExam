import { useState } from 'react';
import type { Customer } from '../types';

const initialForm: Customer = { firstName: '', lastName: '', address: '', email: '' };

type FormErrors = Partial<Record<keyof Customer, string>>;

function validate(form: Customer): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'שדה חובה';
  if (!form.lastName.trim()) errors.lastName = 'שדה חובה';
  if (!form.address.trim()) errors.address = 'שדה חובה';
  if (!form.email.trim()) {
    errors.email = 'שדה חובה';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'כתובת מייל לא תקינה';
  }
  return errors;
}

interface OrderFormProps {
  onSubmit: (form: Customer) => void;
  submitting: boolean;
  submitError: string | null;
}

export default function OrderForm({ onSubmit, submitting, submitError }: OrderFormProps) {
  const [form, setForm] = useState<Customer>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof Customer) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

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
        <label className="field-label" htmlFor="firstName">
          שם פרטי ומשפחה *
        </label>
        <div className="field-row">
          <input
            id="firstName"
            className="input"
            placeholder="שם פרטי"
            value={form.firstName}
            onChange={handleChange('firstName')}
          />
          <input
            id="lastName"
            className="input"
            placeholder="שם משפחה"
            value={form.lastName}
            onChange={handleChange('lastName')}
          />
        </div>
        {(errors.firstName || errors.lastName) && (
          <span className="error-text">{errors.firstName || errors.lastName}</span>
        )}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="address">
          כתובת מלאה *
        </label>
        <input
          id="address"
          className="input"
          placeholder="רחוב, מספר בית, עיר"
          value={form.address}
          onChange={handleChange('address')}
        />
        {errors.address && <span className="error-text">{errors.address}</span>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="email">
          דוא״ל *
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

      <button type="submit" className="btn btn--accent btn--full" disabled={submitting}>
        {submitting ? 'שולח הזמנה…' : 'אשר הזמנה'}
      </button>
    </form>
  );
}
