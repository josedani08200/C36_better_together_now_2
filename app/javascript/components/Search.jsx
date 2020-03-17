import React, { useState } from "react";
import SmartSearch from "./SmartSearch";
import axios from "axios";

// may seem repetitive but sometimes your value won't be the same as your label
// this is usually true when values are lowered cases or for abbreviations
const LOCATIONS = [
  { value: "Miami", label: "Miami" },
  { value: "New York", label: "New York" }
];

// same comment as above
const CATEGORIES = [
  { value: "Environment", label: "Environment" },
  { value: "Animals", label: "Animals" }
];

const Search = () => {
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState(null);

  const handleSearch = () => {
    const queryParams = [
      ["location", location],
      ["category", category]
    ].reduce((acc, [queryName, { value }]) => {
      if (!value) return acc;

      const query = `${queryName}=${value}`;
      return acc ? `${acc}&${query}` : query;
    }, "");

    const url = queryParams ? `/events?${queryParams}` : "/events";
    Turbolinks.visit(url);
  };

  // please remove if you dont need to load options asynchronously
  const asyncSelectLoadOptionsExample = async _ => {
    const { data } = await axios.get("/SOME_URL_FOR_OPTIONS");

    // options for react-select has to be shaped { value, label }[]
    const options = data.map(item => ({
      value: item.whateverPropertyYouWantToUseAsValue,
      label: item.whateverPropertyYouWantToUseAsLabel
    }));

    return options;
  };

  return (
    <div>
      <SmartSearch
        placeholder="City"
        value={location}
        className="search_form"
        onChange={setLocation}
        options={LOCATIONS}
      />
      <SmartSearch
        placeholder="Type of Event"
        value={category}
        className="search_form"
        onChange={setCategory}
        options={CATEGORIES}
      />
      {/* async example in case you wanted to load options from the backend (component is already built to do so) */}
      {/* 
      <SmartSearch
        async
        placeholder="Whatever"
        value=NEW_STATE_VALUE_HERE
        className="search_form"
        onChange=NEW_STATE_SETTER_HERE
        loadOptions={asyncSelectLoadOptionsExample}
      /> */}
      <input
        onClick={handleSearch}
        type="submit"
        value="Find Events"
        className="search_submit"
      />
    </div>
  );
};

export default Search;
