import { ErrorMessage, Field, useField } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { isBrowser } from '../utilities/utilities';
import { container, errorText, field } from './InputField.module.scss';

const TextInputField = ({
  'aria-hidden': ariaHidden,
  className,
  id,
  innerRef,
  isRequired,
  label,
  name,
  placeholder,
  type,
}) => {
  const [, meta] = useField(id, name, placeholder, type);

  return (
    <div className={container}>
      <label htmlFor={id} className="screen-reader-text">
        {label}
      </label>
      <Field
        as="input"
        id={id}
        aria-hidden={ariaHidden}
        aria-invalid={meta.error && meta.touched ? 'true' : null}
        aria-describedby={meta.error && meta.touched ? `${id}-error` : null}
        aria-required={isRequired ? true : null}
        className={`${className} ${field}`}
        name={name}
        placeholder={placeholder}
        type={type}
        innerRef={innerRef}
      />
      <ErrorMessage id={`${id}-error`} className={errorText} name={name} component="small" />
    </div>
  );
};

TextInputField.defaultProps = {
  'aria-hidden': false,
  innerRef: null,
  isRequired: null,
  className: '',
};

TextInputField.propTypes = {
  innerRef: isBrowser
    ? PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
      ])
    : PropTypes.func,
  'aria-hidden': PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export const TextAreaField = ({
  className,
  id,
  innerRef,
  isRequired,
  label,
  name,
  placeholder,
  rows,
  type,
}) => {
  const [, meta] = useField(id, name, placeholder, type);

  return (
    <div className={container}>
      <label htmlFor={id} className="screen-reader-text">
        {label}
      </label>
      <Field
        as="textarea"
        id={id}
        aria-invalid={meta.error && meta.touched ? 'true' : null}
        aria-describedby={meta.error && meta.touched ? `${id}-error` : null}
        aria-required={isRequired ? true : null}
        className={`${className} ${field}`}
        name={name}
        placeholder={placeholder}
        rows={rows}
        type={type}
        innerRef={innerRef}
      />
      <ErrorMessage id={`${id}-error`} className={errorText} name={name} component="small" />
    </div>
  );
};

TextAreaField.defaultProps = {
  innerRef: null,
  className: '',
  isRequired: false,
  label: '',
  rows: '5',
};

TextAreaField.propTypes = {
  innerRef: isBrowser
    ? PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
      ])
    : PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  rows: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default TextInputField;
