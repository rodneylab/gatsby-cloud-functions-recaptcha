import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { H_ELLIPSIS_ENTITY } from '../constants/entities';
import { errorText, formButton } from './ContactForm.module.scss';
import FormikErrorFocus from './FormikErrorFocus';
import TextInputField, { TextAreaField } from './InputField';

const ContactForm = () => {
  const [serverState, setServerState] = useState({ ok: true, message: '' });
  const [showForm, setShowForm] = useState(true);
  const recaptchaSiteKey = process.env.RECAPTCHA_V3_SITE_KEY;

  const submitData = async (values, { setSubmitting, resetForm }, recaptchaToken) => {
    try {
      setSubmitting(true);
      const { 'bot-field': botField, email, message, name } = values;
      await axios({
        url: '/.netlify/functions/submit-comment',
        method: 'POST',
        data: {
          botField,
          email,
          message,
          name,
          recaptchaToken,
        },
      });
      setServerState({
        ok: true,
        message: 'Thanks for your comment! We will review it and should post it shortly.',
      });
      setSubmitting(false);
      resetForm();
      setShowForm(false);
    } catch (error) {
      setServerState({ ok: false, message: error.message });
    }
  };

  const handleSubmit = (values, actions) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(recaptchaSiteKey, { action: 'submit' }).then((token) => {
        submitData(values, actions, token);
      });
    });
  };

  const validEmail = (email) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      email.trim(),
    );

  const validate = (values) => {
    const errors = {};
    if (values.name.trim() === '') {
      errors.name = 'Please enter your name.';
    }
    if (!values.email) {
      errors.email = 'Please enter your email address.';
    } else if (!validEmail(values.email)) {
      errors.email = 'Please check your email address.';
    }
    if (!values.message) {
      errors.message = "Don't forget to write the message!";
    } else if (values.message.trim() === '' || values.message.length > 1024) {
      errors.message = 'Please limit your message to 1000 characters.';
    }
    return errors;
  };

  if (!showForm) {
    return null;
  }

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        message: '',
      }}
      onSubmit={handleSubmit}
      validate={validate}
    >
      {({ isSubmitting }) => (
        <FormikErrorFocus>
          <Form id="contact-form" name="contact">
            <h2>🖋 Write me a short message{H_ELLIPSIS_ENTITY}</h2>
            <TextInputField
              aria-hidden
              id="bot-field"
              name="bot-field"
              placeholder="Bot field"
              label="Bot Field"
              type="hidden"
            />
            <TextInputField
              isRequired
              id="name-contact"
              name="name"
              placeholder="Name"
              label="name"
              title="Name"
              type="text"
            />
            <TextInputField
              isRequired
              id="email-contact"
              name="email"
              placeholder="Email"
              label="email"
              title="Email"
              type="email"
            />
            <TextAreaField
              isRequired
              id="message-contact"
              name="message"
              placeholder="Write your message here..."
              label="message"
              title="Message"
              type="text"
              rows="8"
            />
            <div className={formButton}>
              <input
                type="submit"
                aria-disabled={isSubmitting}
                disabled={isSubmitting}
                value="Submit your message"
              />
              {!serverState.ok && (
                <small className={errorText}>
                  Something is not quite right! Please try again later.
                </small>
              )}
            </div>
          </Form>
        </FormikErrorFocus>
      )}
    </Formik>
  );
};

export { ContactForm as default };
