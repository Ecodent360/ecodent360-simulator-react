// src/App.jsx
import { useState, useMemo } from "react";
import "./styles.css";
import {
  INVESTOR_CONSTANTS,
  PRESETS,
  DENTIST_CONSTANTS,
  DENTIST_WORKFLOW,
} from "./constants";

function formatEuro(value) {
  const rounded = Math.round(value || 0);
  return rounded.toLocaleString("fr-FR") + " €";
}

function App() {
  // ---- STATE ----
  const [role, setRole] = useState("dentist");      // 'dentist' | 'investor'
  const [region, setRegion] = useState("dubai");    // 'dubai' | 'paris'
  const [casesPerMonth, setCasesPerMonth] = useState(20);
  const [patientFee, setPatientFee] = useState(2800);
  const [ecodentCost, setEcodentCost] = useState(800);
  const [initialInvestment, setInitialInvestment] = useState(150000);

  // ---- DERIVED VALUES (auto recalculation) ----
  const {
    incomePerCase,
    monthlyIncome,
    yearlyIncome,
    paybackMonths,
    hoursSavedPerMonth,
  } = useMemo(() => {
    let incomePerCase = 0;

    if (role === "dentist") {
      if (region === "dubai") {
        // Dubai: 50/50 model
        incomePerCase = patientFee * 0.5;
      } else {
        // Paris: dentist fee - fee paid to Ecodent360
        incomePerCase = patientFee - ecodentCost;
      }
    } else {
      // Investor (Ecodent360 side)
      if (region === "dubai") {
        const revPerCase = patientFee * INVESTOR_CONSTANTS.dubai.sharePct;
        const profitPerCase = revPerCase - INVESTOR_CONSTANTS.dubai.costPerCase;
        incomePerCase = profitPerCase;
      } else {
        const revPerCase = INVESTOR_CONSTANTS.paris.revenuePerCase;
        const profitPerCase =
          revPerCase - INVESTOR_CONSTANTS.paris.costPerCase;
        incomePerCase = profitPerCase;
      }
    }

    const monthly = incomePerCase * casesPerMonth;
    const yearly = monthly * 12;

    const payback =
      role === "investor" && monthly > 0 && initialInvestment > 0
        ? initialInvestment / monthly
        : null;

    const hoursSaved =
      role === "dentist"
        ? casesPerMonth * DENTIST_CONSTANTS.timeSavedPerCaseHours
        : 0;

    return {
      incomePerCase,
      monthlyIncome: monthly,
      yearlyIncome: yearly,
      paybackMonths: payback,
      hoursSavedPerMonth: hoursSaved,
    };
  }, [role, region, patientFee, ecodentCost, casesPerMonth, initialInvestment]);

  // ---- HANDLERS ----
  const applyPreset = (presetKey) => {
    const preset = PRESETS[region][presetKey];
    setCasesPerMonth(preset.cases);
    setPatientFee(preset.fee);
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    const preset = PRESETS[newRegion].realistic;
    setCasesPerMonth(preset.cases);
    setPatientFee(preset.fee);
  };

  // ---- UI ----
  return (
    <main className="page">
      {/* A – Header & Vision */}
      <header className="page-header">
        <div className="logo-wrap">
          <img
            src="/ecodent360-logo.png"
            alt="Ecodent360 logo"
            className="logo-img"
          />
          <div className="logo-text-group">
            <h1 className="page-title">Ecodent360 Simulator</h1>
            <p className="page-subtitle">
              Compare Dentist vs Investor scenarios in Paris and Dubai.
            </p>
            <p className="page-metasub">
              A: Live financial &amp; workflow simulation – not a contract, just a
              vision.
            </p>
          </div>
        </div>
      </header>

      <section className="simulator-layout">
        {/* LEFT COLUMN */}
        <div className="column column-left">
          {/* B – Step 1 */}
          <div className="card">
            <h2 className="card-title">B — Step 1: Who Are You?</h2>
            <p className="card-hint">
              Choose your profile to see income, savings and workflow adapted to
              you.
            </p>
            <label className="radio">
              <input
                type="radio"
                name="role"
                value="dentist"
                checked={role === "dentist"}
                onChange={() => setRole("dentist")}
              />
              <span>I am a Dentist</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="role"
                value="investor"
                checked={role === "investor"}
                onChange={() => setRole("investor")}
              />
              <span>I am an Investor</span>
            </label>
          </div>

          {/* C – Step 2 */}
          <div className="card">
            <h2 className="card-title">C — Step 2: Choose Region / Model</h2>
            <label className="radio">
              <input
                type="radio"
                name="region"
                value="dubai"
                checked={region === "dubai"}
                onChange={() => handleRegionChange("dubai")}
              />
              <span>Dubai / GCC — 50/50 model (zero investment)</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="region"
                value="paris"
                checked={region === "paris"}
                onChange={() => handleRegionChange("paris")}
              />
              <span>Paris / France — Pay-per-case</span>
            </label>

            <div className="preset-group">
              <p className="preset-label">
                Presets ({region === "dubai" ? "Dubai" : "Paris"}):
              </p>
              <button
                className="btn preset-btn"
                onClick={() => applyPreset("conservative")}
              >
                Conservative
              </button>
              <button
                className="btn preset-btn"
                onClick={() => applyPreset("realistic")}
              >
                Realistic
              </button>
              <button
                className="btn preset-btn"
                onClick={() => applyPreset("ambitious")}
              >
                Ambitious
              </button>
            </div>
          </div>

          {/* D – Step 3 */}
          <div className="card">
            <h2 className="card-title">D — Step 3: Your Monthly Activity</h2>

            <label className="field-label" htmlFor="casesPerMonth">
              Cases per month
            </label>
            <input
              id="casesPerMonth"
              type="range"
              min="0"
              max="200"
              value={casesPerMonth}
              onChange={(e) => setCasesPerMonth(Number(e.target.value))}
            />
            <div className="range-scale">
              <span>0</span>
              <span>10</span>
              <span>30</span>
              <span>60</span>
              <span>120</span>
              <span>200</span>
            </div>

            <div className="field-inline">
              <label className="field-label" htmlFor="casesInput">
                Cases (exact number)
              </label>
              <input
                id="casesInput"
                type="number"
                min="0"
                max="200"
                value={casesPerMonth}
                onChange={(e) =>
                  setCasesPerMonth(
                    Math.min(200, Math.max(0, Number(e.target.value) || 0))
                  )
                }
              />
            </div>

            <div className="field-inline">
              <label className="field-label" htmlFor="patientFee">
                Average patient fee per case
              </label>
              <div className="field-money">
                <input
                  id="patientFee"
                  type="number"
                  value={patientFee}
                  onChange={(e) =>
                    setPatientFee(Math.max(0, Number(e.target.value) || 0))
                  }
                />
                <span className="currency">€</span>
              </div>
            </div>

            {region === "paris" && (
              <div className="field-inline">
                <label className="field-label" htmlFor="ecodentCost">
                  Cost per case paid to Ecodent360 (France)
                </label>
                <div className="field-money">
                  <input
                    id="ecodentCost"
                    type="number"
                    value={ecodentCost}
                    onChange={(e) =>
                      setEcodentCost(Math.max(0, Number(e.target.value) || 0))
                    }
                  />
                  <span className="currency">€</span>
                </div>
              </div>
            )}

            {role === "investor" && (
              <div className="field-inline">
                <label className="field-label" htmlFor="initialInvestment">
                  Initial investment (center setup, equipment, etc.)
                </label>
                <div className="field-money">
                  <input
                    id="initialInvestment"
                    type="number"
                    value={initialInvestment}
                    onChange={(e) =>
                      setInitialInvestment(
                        Math.max(0, Number(e.target.value) || 0)
                      )
                    }
                  />
                  <span className="currency">€</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="column column-right">
          {/* E – Result Summary + Print */}
          <div className="card card-summary">
            <h2 className="card-title">
              E — {role === "dentist"
                ? "Dentist Result Summary"
                : "Investor Result Summary"}
            </h2>
            <p>
              <strong>Location:</strong>{" "}
              {region === "dubai" ? "Dubai / GCC" : "Paris / France"}
            </p>
            <p>
              <strong>Role:</strong> {role === "dentist" ? "Dentist" : "Investor"}
            </p>
            <p>
              <strong>Cases per month:</strong> {casesPerMonth}
            </p>
            <p>
              <strong>Income per case:</strong> {formatEuro(incomePerCase)}
            </p>
            <p>
              <strong>Monthly income:</strong> {formatEuro(monthlyIncome)}
            </p>
            <p>
              <strong>Yearly income:</strong> {formatEuro(yearlyIncome)}
            </p>
            {role === "investor" && paybackMonths && (
              <p>
                <strong>Estimated payback:</strong>{" "}
                {paybackMonths.toFixed(1)} months
              </p>
            )}
            {role === "dentist" && (
              <p>
                <strong>Hours saved per month:</strong>{" "}
                {hoursSavedPerMonth.toFixed(1)} h
              </p>
            )}
            <button
              className="btn"
              style={{ marginTop: "8px" }}
              onClick={() => window.print()}
            >
              Print / Save this scenario as PDF
            </button>
          </div>

          {/* F – What you get & Zero cost */}
          <div className="card">
            <h2 className="card-title">F — What You Get With Ecodent360</h2>
            <ul className="list-two-columns">
              <li>CBCT + IOS processing</li>
              <li>3D implant planning</li>
              <li>Guided surgery design</li>
              <li>Surgical guides & drills</li>
              <li>MSI France implants</li>
              <li>Abutments, scan bodies, Ti-base</li>
              <li>STL & CAD files for crowns</li>
              <li>Lab workflows managed for you</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="card-title">Zero Cost — Full Support</h2>
            <ul>
              <li>No CBCT to buy</li>
              <li>No scanner to buy</li>
              <li>No software licenses</li>
              <li>No digital planning time</li>
              <li>No lab communication workload</li>
              <li>No hidden costs</li>
            </ul>
            <p className="highlight">
              Total avoided investment:&nbsp;
              {DENTIST_CONSTANTS.avoidedInvestmentMin.toLocaleString("fr-FR")}{" "}
              –{" "}
              {DENTIST_CONSTANTS.avoidedInvestmentMax.toLocaleString("fr-FR")} €
            </p>
          </div>

          {/* G – Workflow / Process */}
          <div className="card">
            <h2 className="card-title">G — How the Ecodent360 Process Works</h2>
            <ol className="workflow-list">
              {DENTIST_WORKFLOW.map((step) => (
                <li key={step.id} className="workflow-step">
                  <strong>{step.title}</strong>
                  <ul>
                    {step.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
