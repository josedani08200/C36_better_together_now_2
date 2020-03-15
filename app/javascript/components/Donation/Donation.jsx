import React, { useState, useEffect } from "react";
import axios from "axios";
import PaymentForm from "./PaymentForm";

const Organizations = () => {
  const INITIAL_STATE = {
    firstName: "",
    lastName: "",
    donation: ""
  };
  const [results, setResults] = useState(null);
  const [term, setTerm] = useState("");
  const [formData, setFormData] = useState(INITIAL_STATE);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = () => {
    axios
      .get(`/donations.json`)
      .then(response => {
        setResults(response.data);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  const handleInputChange = field => e => {
    setFormData({ ...formData, [field]: e.target.value });
    console.log(formData);
  };

  const handleChange = event => {
    const fieldTerm = event.target.value.trim();
    setTerm(fieldTerm);
    console.log(term);
  };
  return (
    <>
      <PaymentForm />
      <div>
        <label htmlFor="term">Search</label>
        <br />
        <input type="search" name="term" value={term} onChange={handleChange} />
        <br />
        <div>
          <h3>Results</h3>
          {results &&
            results
              .filter(result =>
                result.name.toLowerCase().includes(term.toLowerCase())
              )
              .map((result, i) => {
                return (
                  <p key={i}>
                    <h1>{result.name}</h1>
                  </p>
                );
              })}
        </div>
      </div>
    </>
  );
};

export default Organizations;
