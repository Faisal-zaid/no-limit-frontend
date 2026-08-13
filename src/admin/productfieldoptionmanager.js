"use client";

import { useState, useEffect } from "react";

export default function ProductFieldOptionManager() {
  const [options, setOptions] = useState([]);
  const [productFields, setProductFields] = useState([]);

  const [fieldId, setFieldId] = useState("");
  const [value, setValue] = useState("");

  const [editingOption, setEditingOption] = useState(null);
  const [editValue, setEditValue] = useState("");

  // =========================
  // GET PRODUCT FIELDS
  // =========================

  useEffect(() => {
    async function loadProductFields() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8001/productfield"
        );

        if (!response.ok) {
          throw new Error("Failed to load product fields");
        }

        const data = await response.json();

        setProductFields(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadProductFields();
  }, []);

  // =========================
  // GET OPTIONS
  // =========================

  async function loadOptions() {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/productfieldoption"
      );

      if (!response.ok) {
        throw new Error("Failed to load options");
      }

      const data = await response.json();

      setOptions(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  // =========================
  // CREATE OPTION
  // =========================

  async function createOption(e) {
    e.preventDefault();

    if (!fieldId || !value.trim()) {
      alert("Select a field and enter an option");
      return;
    }

    const formData = new FormData();

    formData.append("field_id", fieldId);
    formData.append("value", value);

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/productfieldoption",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      console.log(data);

      // Refresh options
      await loadOptions();

      // Clear form
      setValue("");
      setFieldId("");
    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // START EDITING
  // =========================

  function startEditing(option) {
    setEditingOption(option.id);
    setEditValue(option.value);
  }

  // =========================
  // UPDATE OPTION
  // =========================

  async function updateOption(optionId, option) {
    const formData = new FormData();

    formData.append("field_id", option.field_id);
    formData.append("value", editValue);

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/productfieldoption/${optionId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      console.log(data);

      await loadOptions();

      setEditingOption(null);
      setEditValue("");
    } catch (error) {
      console.error(error);
    }
  }

  // =========================
  // DELETE OPTION
  // =========================

  async function deleteOption(optionId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this option?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8001/productfieldoption/${optionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      console.log(data);

      await loadOptions();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Product Field Options
      </h2>

      {/* =========================
          CREATE OPTION
      ========================= */}

      <form
        onSubmit={createOption}
        className="flex flex-col gap-4 mb-10 max-w-md"
      >

        <h3 className="text-xl font-semibold">
          Add Option
        </h3>

        {/* Select field */}

        <select
          value={fieldId}
          onChange={(e) => setFieldId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">
            Select Product Field
          </option>

          {productFields.map((field) => (
            <option
              key={field.id}
              value={field.id}
            >
              {field.label}
            </option>
          ))}
        </select>

        {/* Option value */}

        <input
          type="text"
          placeholder="Option value e.g. Small"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white p-2 rounded"
        >
          Add Option
        </button>

      </form>

      {/* =========================
          EXISTING OPTIONS
      ========================= */}

      <div className="space-y-4">

        {options.map((option) => {

          const field = productFields.find(
            (field) => field.id === option.field_id
          );

          return (
            <div
              key={option.id}
              className="border p-4 rounded"
            >

              <p>
                <strong>Field:</strong>{" "}
                {field ? field.label : `Field ${option.field_id}`}
              </p>

              {editingOption === option.id ? (

                <div className="flex gap-2 mt-2">

                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) =>
                      setEditValue(e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <button
                    onClick={() =>
                      updateOption(option.id, option)
                    }
                    className="bg-green-600 text-white px-3 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditingOption(null);
                      setEditValue("");
                    }}
                    className="bg-gray-500 text-white px-3 rounded"
                  >
                    Cancel
                  </button>

                </div>

              ) : (

                <div className="flex items-center justify-between mt-2">

                  <p>
                    <strong>Option:</strong>{" "}
                    {option.value}
                  </p>

                  <div className="flex gap-2">

                    <button
                      onClick={() => startEditing(option)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteOption(option.id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )}

            </div>
          );
        })}

      </div>

    </section>
  );
}