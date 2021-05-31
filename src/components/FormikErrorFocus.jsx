import { useFormikContext } from 'formik';
import isObject from 'lodash.isobject';
import { useEffect } from 'react';

const getFirstErrorKey = (object, keys = []) => {
  const firstErrorKey = Object.keys(object)[0];
  if (isObject(object[firstErrorKey])) {
    return getFirstErrorKey(object[firstErrorKey], [...keys, firstErrorKey]);
  }
  return [...keys, firstErrorKey].join('.');
};

const FormikErrorFocus = ({ children }) => {
  const formik = useFormikContext();

  useEffect(() => {
    if (!formik.isValid && formik.submitCount > 0) {
      const firstErrorKey = getFirstErrorKey(formik.errors);
      if (global.window.document.getElementsByName(firstErrorKey).length) {
        global.window.document.getElementsByName(firstErrorKey)[0].focus();
      }
    }
  }, [formik.submitCount, formik.isValid, formik.errors]);
  return children;
};

export default FormikErrorFocus;
