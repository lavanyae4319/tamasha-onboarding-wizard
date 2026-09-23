import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Current step
  const [step, setStep] = useState(1);

  // Main form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    track: "",
    experience: "",
    techStack: [],
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Draft saved message
  const [draftSaved, setDraftSaved] = useState(false);

  // Technology options based on selected track
  const techOptions = {
    Frontend: [
      "React",
      "Vue",
      "TypeScript",
      "CSS Modules",
    ],

    Backend: [
      "Node.js",
      "Python/Django",
      "PostgreSQL",
      "Redis",
    ],

    "UI/UX Design": [
      "Figma",
      "Storybook",
      "Design Systems",
    ],
  };

  // --------------------------------------------------
  // RESTORE SAVED DATA FROM LOCAL STORAGE
  // --------------------------------------------------

  useEffect(() => {
    const savedData = localStorage.getItem(
      "tamasha-onboarding-draft"
    );

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        setFormData({
          name: parsedData.name || "",
          email: parsedData.email || "",
          portfolio: parsedData.portfolio || "",
          track: parsedData.track || "",
          experience: parsedData.experience || "",
          techStack: parsedData.techStack || [],
        });
      } catch (error) {
        console.log("Could not restore saved draft");
      }
    }
  }, []);

  // --------------------------------------------------
  // DEBOUNCED AUTO SAVE
  // --------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        "tamasha-onboarding-draft",
        JSON.stringify(formData)
      );

      setDraftSaved(true);

      const messageTimer = setTimeout(() => {
        setDraftSaved(false);
      }, 1500);

      return () => clearTimeout(messageTimer);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData]);

  // --------------------------------------------------
  // HANDLE INPUT CHANGES
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If track changes, clear previous tech selections
    if (name === "track") {
      setFormData((previousData) => ({
        ...previousData,
        track: value,
        techStack: [],
      }));
    } else {
      setFormData((previousData) => ({
        ...previousData,
        [name]: value,
      }));
    }

    // Remove error for this field
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  // --------------------------------------------------
  // HANDLE TECH STACK CHECKBOX
  // --------------------------------------------------

  const handleTechChange = (tech) => {
    setFormData((previousData) => {
      const alreadySelected =
        previousData.techStack.includes(tech);

      if (alreadySelected) {
        return {
          ...previousData,
          techStack: previousData.techStack.filter(
            (item) => item !== tech
          ),
        };
      }

      return {
        ...previousData,
        techStack: [
          ...previousData.techStack,
          tech,
        ],
      };
    });
  };

  // --------------------------------------------------
  // STEP 1 VALIDATION
  // --------------------------------------------------

  const validateStep1 = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // STEP 2 VALIDATION
  // --------------------------------------------------

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.track) {
      newErrors.track = "Please select a primary track";
    }

    if (!formData.experience) {
      newErrors.experience =
        "Please select your experience level";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // VALIDATE CURRENT STEP
  // --------------------------------------------------

  const validateCurrentStep = () => {
    if (step === 1) {
      return validateStep1();
    }

    if (step === 2) {
      return validateStep2();
    }

    return true;
  };

  // --------------------------------------------------
  // NEXT BUTTON
  // --------------------------------------------------

  const nextStep = () => {
    const isValid = validateCurrentStep();

    if (!isValid) {
      return;
    }

    if (step < 4) {
      setStep((previousStep) => previousStep + 1);
    }
  };

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------

  const previousStep = () => {
    if (step > 1) {
      setStep((previousStep) => previousStep - 1);
    }
  };

  // --------------------------------------------------
  // BLUR VALIDATION
  // --------------------------------------------------

  const handleBlur = (field) => {
    if (field === "name") {
      if (!formData.name.trim()) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          name: "Name is required",
        }));
      }
    }

    if (field === "email") {
      if (!formData.email.trim()) {
        setErrors((previousErrors) => ({
          ...previousErrors,
          email: "Email is required",
        }));
      } else {
        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email)) {
          setErrors((previousErrors) => ({
            ...previousErrors,
            email: "Enter a valid email address",
          }));
        }
      }
    }
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = () => {
    alert("Onboarding submitted successfully!");
  };

  return (
    <div className="app">

      {/* PAGE TITLE */}
      <h1>Onboarding Wizard</h1>

      {/* STEP INDICATOR */}
      <div className="steps">

        <span
          className={step === 1 ? "active" : ""}
        >
          1. Personal
        </span>

        <span
          className={step === 2 ? "active" : ""}
        >
          2. Preferences
        </span>

        <span
          className={step === 3 ? "active" : ""}
        >
          3. Tech Stack
        </span>

        <span
          className={step === 4 ? "active" : ""}
        >
          4. Review
        </span>

      </div>

      {/* DRAFT SAVED MESSAGE */}
      {draftSaved && (
        <div className="saved-message">
          ✓ Draft Saved
        </div>
      )}

      {/* MAIN CARD */}
      <div className="card">

        {/* ==========================================
            STEP 1 - PERSONAL INFORMATION
        ========================================== */}

        {step === 1 && (
          <div>

            <h2>Personal Information</h2>

            {/* NAME */}
            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              placeholder="Enter your name"
            />

            {errors.name && (
              <p className="error">
                {errors.name}
              </p>
            )}

            {/* EMAIL */}
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="error">
                {errors.email}
              </p>
            )}

            {/* PORTFOLIO */}
            <label>
              Portfolio / GitHub URL
            </label>

            <input
              type="text"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />

          </div>
        )}

        {/* ==========================================
            STEP 2 - PREFERENCES
        ========================================== */}

        {step === 2 && (
          <div>

            <h2>Preferences</h2>

            {/* PRIMARY TRACK */}
            <label>Primary Track</label>

            <select
              name="track"
              value={formData.track}
              onChange={handleChange}
            >

              <option value="">
                Select Track
              </option>

              <option value="Frontend">
                Frontend
              </option>

              <option value="Backend">
                Backend
              </option>

              <option value="Fullstack">
                Fullstack
              </option>

              <option value="UI/UX Design">
                UI/UX Design
              </option>

            </select>

            {errors.track && (
              <p className="error">
                {errors.track}
              </p>
            )}

            {/* EXPERIENCE */}
            <label>Experience</label>

            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            >

              <option value="">
                Select Experience
              </option>

              <option value="Junior">
                Junior
              </option>

              <option value="Mid">
                Mid
              </option>

              <option value="Senior">
                Senior
              </option>

            </select>

            {errors.experience && (
              <p className="error">
                {errors.experience}
              </p>
            )}

          </div>
        )}

        {/* ==========================================
            STEP 3 - TECH STACK
        ========================================== */}

        {step === 3 && (
          <div>

            <h2>Tech Stack</h2>

            <p>
              Select the technologies you are
              comfortable with.
            </p>

            {/* NO TRACK SELECTED */}
            {!formData.track && (
              <p className="error">
                Please select a track first.
              </p>
            )}

            {/* FULLSTACK */}
            {formData.track === "Fullstack" && (
              <div>
                <p>
                  No Fullstack technology options
                  are specified in the assessment.
                </p>
              </div>
            )}

            {/* TECHNOLOGY OPTIONS */}
            {techOptions[formData.track]?.map(
              (tech) => (
                <label
                  className="checkbox-label"
                  key={tech}
                >

                  <input
                    type="checkbox"
                    checked={formData.techStack.includes(
                      tech
                    )}
                    onChange={() =>
                      handleTechChange(tech)
                    }
                  />

                  {tech}

                </label>
              )
            )}

            {/* SELECTED TECHNOLOGIES */}
            {formData.techStack.length > 0 && (
              <div className="selected-tech">

                <strong>
                  Selected:
                </strong>{" "}

                {formData.techStack.join(", ")}

              </div>
            )}

          </div>
        )}

        {/* ==========================================
            STEP 4 - REVIEW
        ========================================== */}

        {step === 4 && (
          <div>

            <h2>Review & Submit</h2>

            {/* PERSONAL INFORMATION */}
            <div className="review-section">

              <div className="review-header">

                <h3>
                  Personal Information
                </h3>

                <button
                  className="edit-button"
                  onClick={() => setStep(1)}
                >
                  Edit
                </button>

              </div>

              <p>
                <strong>Name:</strong>{" "}
                {formData.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {formData.email}
              </p>

              <p>
                <strong>Portfolio:</strong>{" "}
                {formData.portfolio ||
                  "Not provided"}
              </p>

            </div>

            {/* PREFERENCES */}
            <div className="review-section">

              <div className="review-header">

                <h3>
                  Preferences
                </h3>

                <button
                  className="edit-button"
                  onClick={() => setStep(2)}
                >
                  Edit
                </button>

              </div>

              <p>
                <strong>Track:</strong>{" "}
                {formData.track}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {formData.experience}
              </p>

            </div>

            {/* TECH STACK */}
            <div className="review-section">

              <div className="review-header">

                <h3>
                  Tech Stack
                </h3>

                <button
                  className="edit-button"
                  onClick={() => setStep(3)}
                >
                  Edit
                </button>

              </div>

              <p>
                <strong>Selected:</strong>{" "}

                {formData.techStack.length > 0
                  ? formData.techStack.join(", ")
                  : "None selected"}

              </p>

            </div>

            {/* SUBMIT */}
            <button
              className="submit-button"
              onClick={handleSubmit}
            >
              Submit
            </button>

          </div>
        )}

        {/* ==========================================
            NAVIGATION BUTTONS
        ========================================== */}

        <div className="buttons">

          {step > 1 && (
            <button onClick={previousStep}>
              Back
            </button>
          )}

          {step < 4 && (
            <button onClick={nextStep}>
              Next
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default App;