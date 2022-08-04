import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, FormControl, Button } from "react-bootstrap";
  
const MainForm = (props) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Rquired"),
    email: Yup.string()
      .email("You have enter an invalid email address")
      .required("Rquired"),
    rollno: Yup.number()
      .positive("Invalid roll number")
      .integer("Invalid roll number")
      .required("Rquired"),
  });
  //console.log(props);
  return (
    <div className="form-wrapper">
      <Formik {...props} validationSchema={validationSchema}>
        <Form>
          <FormGroup>
              <label>Name</label>
            <Field name="name" type="text" 
                className="form-control" />
            <ErrorMessage
              name="name"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup>
          {/* <FormGroup>
            <Field name="email" type="text" 
                className="form-control" />
            <ErrorMessage
              name="email"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup>
          <FormGroup>
            <Field name="rollno" type="number" 
                className="form-control" />
            <ErrorMessage
              name="rollno"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup> */}
          <br />
          <div className="form-group">
                    <button type="submit" className="btn btn-primary mr-2">Save</button>
                    <button type="reset" className="btn btn-secondary">Close</button>
                </div>
        </Form>
      </Formik>
    </div>
  );
};
  
export default MainForm;