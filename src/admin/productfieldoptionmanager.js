"use client";

import { useState, useEffect } from "react";

export default function ProductFieldOptionManager() {
const [options, setOptions] = useState([]);

// =========================
// GET ALL OPTIONS
// =========================
useEffect(() => {
async function loadOptions() {
const response = await fetch(
"http://127.0.0.1:8001/productfieldoption"
);


  const data = await response.json();

  setOptions(data);
}

loadOptions();


}, []);

// =========================
// CREATE OPTION
// =========================
async function createOption(optionData) {
const formData = new FormData();


formData.append("field_id", optionData.field_id);
formData.append("value", optionData.value);

const response = await fetch(
  "http://127.0.0.1:8001/productfieldoption",
  {
    method: "POST",
    body: formData,
  }
);

const data = await response.json();

console.log(data);


}

// =========================
// UPDATE OPTION
// =========================
async function updateOption(optionId, optionData) {
const formData = new FormData();


formData.append("field_id", optionData.field_id);
formData.append("value", optionData.value);

const response = await fetch(
  `http://127.0.0.1:8001/productfieldoption/${optionId}`,
  {
    method: "PATCH",
    body: formData,
  }
);

const data = await response.json();

console.log(data);


}

// =========================
// DELETE OPTION
// =========================
async function deleteOption(optionId) {
const response = await fetch(
`http://127.0.0.1:8001/productfieldoption/${optionId}`,
{
method: "DELETE",
}
);


const data = await response.json();

console.log(data);

}

return ( <section> <h2>Product Field Options</h2>


  {options.map((option) => (
    <div key={option.id}>
      <p>
        <strong>Option:</strong> {option.value}
      </p>

      <p>
        <strong>Field ID:</strong> {option.field_id}
      </p>

      <button
        onClick={() => deleteOption(option.id)}
      >
        Delete
      </button>
    </div>
  ))}
</section>


);
}
