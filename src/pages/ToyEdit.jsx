import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service';
import { toyService } from '../services/toy.service';
import { saveToy } from '../store/actions/toy.actions';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  price: Yup.number().min(1, 'Price must be greater than 0').required('Required'),
});

export function ToyEdit() {
  const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy());

  const { toyId } = useParams();
  const navigate = useNavigate();

  const labels = toyService.getToyLabels();

  useEffect(() => {
    if (!toyId) return;
    loadToy();
  }, [toyId]);

  function loadToy() {
    toyService.getById(toyId)
      .then(setToyToEdit)
      .catch(err => {
        console.log('Had issues in toy edit:', err);
        navigate('/toy');
        showErrorMsg('Toy not found!');
      });
  }

  function handleLabelChange({ target }) {
    const value = target.value;
    setToyToEdit(prevToy => {
      const newLabels = prevToy.labels.includes(value)
        ? prevToy.labels.filter(label => label !== value)
        : [...prevToy.labels, value];
      return { ...prevToy, labels: newLabels };
    });
  }

  const onSaveToy = (values) => {
    saveToy({ ...toyToEdit, ...values }) // merge values with toyToEdit
      .then(() => {
        showSuccessMsg('Toy saved successfully');
        navigate('/toy');
      })
      .catch(err => {
        showErrorMsg('Cannot save toy');
      });
  }

  return (
    <section className="toy-edit">
      <h2>{toyToEdit._id ? 'Edit' : 'Add'} Toy</h2>

      <Formik
        enableReinitialize // Allow Formik to reset its state when `initialValues` changes
        initialValues={{
          name: toyToEdit.name || '',
          price: toyToEdit.price || '',
        }}
        validationSchema={SignupSchema}
        onSubmit={onSaveToy}
      >
        {({ setFieldValue }) => (
          <Form>
            <label htmlFor="name">Name:</label>
            <Field name="name" type="text" required />
            <ErrorMessage name="name" component="div" />

            <label htmlFor="price">Price:</label>
            <Field name="price" type="number" min={1} required />
            <ErrorMessage name="price" component="div" />

            <label>Labels:</label>
            <div className="labels-container">
              {labels.map(label => (
                <div key={label}>
                  <input
                    type="checkbox"
                    id={label}
                    value={label}
                    checked={toyToEdit.labels.includes(label)}
                    onChange={handleLabelChange}
                  />
                  <label htmlFor={label}>{label}</label>
                </div>
              ))}
            </div>

            <button type="submit">{toyToEdit._id ? 'Save' : 'Add'}</button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
