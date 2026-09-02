/**
 * CC-19R clean-room TECHNICAL_TRUTH source data.
 *
 * Researched independently of the curriculum/assessment candidates
 * (CC-19R section 4/22) -- these are authoritative metrology/physics
 * sources supplying the ANSWER to a fact already required by explicit
 * curriculum wording (AC2.1/AC2.2) or by a REVIEW_PROPOSED decomposition
 * proposal. A technical source never creates scope by itself (CC-19R
 * section 25).
 *
 * Source hierarchy applied (CC-19R section 23): BIPM (international
 * metrology body) and NIST (government/regulatory technical publication)
 * rank above OpenStax (recognised open academic/open-textbook source),
 * which ranks above any blog/SEO/commercial source (none used).
 */

export interface TechnicalClaim {
  readonly claimKey: string;
  readonly subject: string;
  readonly normalizedClaimValue: string;
  readonly comparisonKind: "BOOLEAN" | "ENUM" | "NUMBER_WITH_UNIT" | "CANONICAL_TEXT";
  readonly sourceRef: string;
  readonly sourceLocator: string;
  readonly sourceExcerpt: string;
  readonly sourceQuality: string;
}

const BIPM_URL = "https://www.bipm.org/documents/20126/41483022/SI-Brochure-9-concise-EN.pdf/2fda4656-e236-0fcb-3867-36ca74eea4e3";
const BIPM_REF = `BIPM, "SI: A concise summary of the International System of Units, SI" (9th edition concise brochure), ${BIPM_URL}`;
const BIPM_QUALITY = "International metrology body (BIPM) -- highest-tier authoritative source for SI unit identity (CC-19R section 23).";

const NIST_URL = "https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes";
const NIST_REF = `NIST, "Guide to the SI", Chapter 4: The Two Classes of SI Units and the SI Prefixes, ${NIST_URL}`;
const NIST_QUALITY = "US government/regulatory metrology publication (NIST SP811) -- authoritative for coherent derived SI units not given a special name (CC-19R section 23).";

const OPENSTAX_QUALITY = "Recognised open academic/open-textbook source (OpenStax, Rice University) -- appropriate device/relationship-specific technical source per CC-19R section 23.";

export const TECHNICAL_CLAIMS: readonly TechnicalClaim[] = [
  // ---- BIPM Table 1 (base units), page 2 ----
  {
    claimKey: "unit202.si-unit.length",
    subject: "length (SI unit)",
    normalizedClaimValue: "metre, symbol m",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 1 \"The seven base units of the SI\", row \"length\", page 2",
    sourceExcerpt: "The metre, symbol m, is the SI unit of length.",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.mass",
    subject: "mass (SI unit)",
    normalizedClaimValue: "kilogram, symbol kg",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 1 \"The seven base units of the SI\", row \"mass\", page 2",
    sourceExcerpt: "The kilogram, symbol kg, is the SI unit of mass.",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.time",
    subject: "time (SI unit)",
    normalizedClaimValue: "second, symbol s",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 1 \"The seven base units of the SI\", row \"time\", page 2",
    sourceExcerpt: "The second, symbol s, is the SI unit of time.",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.temperature",
    subject: "temperature (SI unit)",
    normalizedClaimValue: "kelvin, symbol K",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 1 \"The seven base units of the SI\", row \"thermodynamic temperature\", page 2",
    sourceExcerpt: "The kelvin, symbol K, is the SI unit of thermodynamic temperature.",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.current",
    subject: "current (SI unit)",
    normalizedClaimValue: "ampere, symbol A",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 1 \"The seven base units of the SI\", row \"electric current\", page 2",
    sourceExcerpt: "The ampere, symbol A, is the SI unit of electric current.",
    sourceQuality: BIPM_QUALITY,
  },
  // ---- BIPM Table 2 (derived units with special names), page 2 ----
  {
    claimKey: "unit202.si-unit.frequency",
    subject: "frequency (SI electrical quantity)",
    normalizedClaimValue: "hertz, symbol Hz",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 2 \"Derived units with special names in the SI\", row \"frequency\", page 2",
    sourceExcerpt: "frequency | hertz | Hz | s-1",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.power",
    subject: "power (SI unit)",
    normalizedClaimValue: "watt, symbol W",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 2 \"Derived units with special names in the SI\", row \"power, radiant flux\", page 2",
    sourceExcerpt: "power, radiant flux | watt | W | J/s = kg m2 s-3",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.energy",
    subject: "energy (SI unit)",
    normalizedClaimValue: "joule, symbol J",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 2 \"Derived units with special names in the SI\", row \"energy, work, amount of heat\", page 2",
    sourceExcerpt: "energy, work, amount of heat | joule | J | N m = kg m2 s-2",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.voltage",
    subject: "voltage (SI unit)",
    normalizedClaimValue: "volt, symbol V",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 2 \"Derived units with special names in the SI\", row \"electric potential difference\", page 2",
    sourceExcerpt: "electric potential difference | volt | V | W/A = kg m2 s-3 A-1",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.resistance",
    subject: "resistance (SI unit)",
    normalizedClaimValue: "ohm, symbol Ω",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 2 \"Derived units with special names in the SI\", row \"electric resistance\", page 2",
    sourceExcerpt: "electric resistance | ohm | Ω | V/A = kg m2 s-3 A-2",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.inductance",
    subject: "inductance and inductive reactance (SI unit)",
    normalizedClaimValue: "henry, symbol H (inductance)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 2 \"Derived units with special names in the SI\", row \"inductance\", page 2",
    sourceExcerpt: "inductance | henry | H | Wb/A = kg m2 s-2 A-2",
    sourceQuality: BIPM_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.capacitance",
    subject: "capacitance and capacitive reactance (SI unit)",
    normalizedClaimValue: "farad, symbol F (capacitance)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "Table 2 \"Derived units with special names in the SI\", row \"capacitance\", page 2",
    sourceExcerpt: "capacitance | farad | F | C/V = kg-1 m-2 s4 A2",
    sourceQuality: BIPM_QUALITY,
  },
  // ---- NIST SP811 Chapter 4 Table 2 (coherent derived units, no special name) ----
  {
    claimKey: "unit202.si-unit.area",
    subject: "area (SI unit)",
    normalizedClaimValue: "square metre, symbol m²",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: NIST_REF,
    sourceLocator: "Table 2 \"Examples of SI coherent derived units\", row \"area\"",
    sourceExcerpt: "area | square meter | m2",
    sourceQuality: NIST_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.volume",
    subject: "volume (SI unit)",
    normalizedClaimValue: "cubic metre, symbol m³",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: NIST_REF,
    sourceLocator: "Table 2 \"Examples of SI coherent derived units\", row \"volume\"",
    sourceExcerpt: "volume | cubic meter | m3",
    sourceQuality: NIST_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.velocity",
    subject: "velocity (SI unit)",
    normalizedClaimValue: "metre per second, symbol m/s",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: NIST_REF,
    sourceLocator: "Table 2 \"Examples of SI coherent derived units\", row \"speed, velocity\"",
    sourceExcerpt: "speed, velocity | meter per second | m/s",
    sourceQuality: NIST_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.density",
    subject: "density (SI unit)",
    normalizedClaimValue: "kilogram per cubic metre, symbol kg/m³",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: NIST_REF,
    sourceLocator: "Table 2 \"Examples of SI coherent derived units\", row \"density, mass density\"",
    sourceExcerpt: "density, mass density | kilogram per cubic meter | kg/m3",
    sourceQuality: NIST_QUALITY,
  },
  // ---- OpenStax (device/relationship-specific technical sources) ----
  {
    claimKey: "unit202.si-unit.resistivity",
    subject: "resistivity (SI unit)",
    normalizedClaimValue: "ohm-metre, symbol Ω·m",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §9.3 \"Resistivity and Resistance\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance",
    sourceExcerpt: "The unit of resistivity in SI units is the ohm-meter (Ω·m)",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.inductive-reactance",
    subject: "inductance and inductive reactance (SI unit)",
    normalizedClaimValue: "ohm, symbol Ω (inductive reactance)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, College Physics 2e, §23.11 \"Reactance, Inductive and Capacitive\"",
    sourceLocator: "https://openstax.org/books/college-physics-2e/pages/23-11-reactance-inductive-and-capacitive",
    sourceExcerpt: "XL has units of ohms (1 H = 1 Ω·s, so that frequency times inductance has units of (cycles/s)(Ω·s) = Ω), consistent with its role as an effective resistance.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.capacitive-reactance",
    subject: "capacitance and capacitive reactance (SI unit)",
    normalizedClaimValue: "ohm, symbol Ω (capacitive reactance)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, College Physics 2e, §23.11 \"Reactance, Inductive and Capacitive\"",
    sourceLocator: "https://openstax.org/books/college-physics-2e/pages/23-11-reactance-inductive-and-capacitive",
    sourceExcerpt: "XC has units of ohms (verification left as an exercise for the reader).",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.si-unit.impedance",
    subject: "impedance (SI unit)",
    normalizedClaimValue: "ohm, symbol Ω",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, College Physics 2e, §23.12 \"RLC Series AC Circuits\"",
    sourceLocator: "https://openstax.org/books/college-physics-2e/pages/23-12-rlc-series-ac-circuits",
    sourceExcerpt: "The units of impedance are ohms, and its effect on the circuit is as you might expect: the greater the impedance, the smaller the current.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  // ---- Power factor: LOCKED CC-19R section 19 -- BIPM's generic unit-one
  // statement is NOT sufficient alone; a separate authoritative source
  // establishing power factor's defining relationship is required first. ----
  {
    claimKey: "unit202.si-unit.power-factor.defining-relationship",
    subject: "power factor (SI unit / dimensional status)",
    normalizedClaimValue: "power factor = cos(phi), a trigonometric ratio (equation 15.12)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §15.4 \"Power in an AC Circuit\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/15-4-power-in-an-ac-circuit, equation 15.12",
    sourceExcerpt: "In engineering applications, cosϕ is known as the power factor, which is the amount by which the power delivered in the circuit is less than the theoretical maximum of the circuit due to voltage and current being out of phase.",
    sourceQuality:
      OPENSTAX_QUALITY + " Satisfies CC-19R section 19: a source SEPARATE from BIPM's generic unit-one statement, explicitly establishing power factor's defining relationship (= cos phi). Cosine of an angle is dimensionless as a matter of established mathematical definition, not an inference added by this normalization.",
  },
  {
    claimKey: "unit202.si-unit.power-factor.dimensionless-convention",
    subject: "power factor (SI unit / dimensional status)",
    normalizedClaimValue: "unit one, symbol 1 (not written)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: BIPM_REF,
    sourceLocator: "\"Decimal multiples and sub-multiples of SI units\" section, page 3 (paragraph on quantities with the unit one)",
    sourceExcerpt:
      "There are quantities with the unit one, symbol 1, that are ratios of two quantities of the same kind. ... The unit one is the neutral element of any system of units. ... when expressing the values of quantities with the unit one, the unit symbol 1 is not written.",
    sourceQuality:
      BIPM_QUALITY + " CC-19R section 19: used ONLY to support the generic unit-one convention AFTER the OpenStax claim above already establishes power factor's specific defining relationship -- never used alone to assert power factor is dimensionless.",
  },

  // ================================================================
  // CC-19R section 22: technical truth researched AFTER a REVIEW_PROPOSED
  // fact requirement was proposed from a required curriculum performance
  // (see review-facts-data.ts). These support the REVIEW_PROPOSED
  // decomposition layer -- they do NOT, by themselves, create scope or
  // promote a proposal out of REVIEW_PROPOSED (CC-19R section 25).
  // ================================================================
  {
    claimKey: "unit202.review-fact.mass-definition",
    subject: "mass and weight",
    normalizedClaimValue: "Mass is the quantity of matter in an object and does not vary.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, Physics, §4.3 \"Newton's Second Law of Motion\"",
    sourceLocator: "https://openstax.org/books/physics/pages/4-3-newtons-second-law-of-motion",
    sourceExcerpt: "Mass is the quantity of matter in an object (how much stuff there is, or how hard it is to accelerate it) and does not vary",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.weight-definition",
    subject: "mass and weight",
    normalizedClaimValue: "Weight is the gravitational force on an object, W = mg, and is proportional to the force of gravity.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, Physics, §4.3 \"Newton's Second Law of Motion\"",
    sourceLocator: "https://openstax.org/books/physics/pages/4-3-newtons-second-law-of-motion",
    sourceExcerpt: "Weight is the gravitational force on an object and is proportional to the force of gravity ... W=mg",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.work-formula",
    subject: "work",
    normalizedClaimValue: "W = f d (work equals force times distance)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, Physics, §9.3 \"Simple Machines\"",
    sourceLocator: "https://openstax.org/books/physics/pages/9-3-simple-machines",
    sourceExcerpt: "W = f d",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.kinetic-potential-energy-formula",
    subject: "energy (kinetic and potential)",
    normalizedClaimValue: "KE = 1/2 m v^2; PE = mgh (equation 9.5)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, Physics, §9.2 \"Mechanical Energy and Conservation of Energy\"",
    sourceLocator: "https://openstax.org/books/physics/pages/9-2-mechanical-energy-and-conservation-of-energy, equation 9.5",
    sourceExcerpt: "KE = 1/2 m v^2 ; PE = mgh",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.power-mechanical-formula",
    subject: "power (mechanical)",
    normalizedClaimValue: "P = W/t (equation 7.69); SI unit watt, 1 W = 1 J/s",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, College Physics 2e, §7.7 \"Power\"",
    sourceLocator: "https://openstax.org/books/college-physics-2e/pages/7-7-power, equation 7.69",
    sourceExcerpt: "Power is the rate at which work is done. ... P=W/t ... The SI unit for power is the watt (W), where 1 watt equals 1 joule/second (1 W=1 J/s).",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.efficiency-formula",
    subject: "efficiency",
    normalizedClaimValue: "% efficiency = Wo/Wi x 100 (output work divided by input work, as a percentage)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, Physics, §9.3 \"Simple Machines\"",
    sourceLocator: "https://openstax.org/books/physics/pages/9-3-simple-machines",
    sourceExcerpt: "The efficiency output of a machine is simply the output work divided by the input work, and is usually multiplied by 100 so that it is expressed as a percent.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.ohms-law",
    subject: "resistance and resistivity in relation to electrical circuits",
    normalizedClaimValue: "R = V/I (equation 9.8)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §9.3 \"Resistivity and Resistance\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance, equation 9.8",
    sourceExcerpt: "The ratio of the voltage to the current is defined as the resistance R.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.resistance-resistivity-relation",
    subject: "resistance and resistivity in relation to electrical circuits",
    normalizedClaimValue: "R = rho L / A (equation 9.9)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §9.3 \"Resistivity and Resistance\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance, equation 9.9",
    sourceExcerpt: "R = rho L / A",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.series-resistance",
    subject: "relationship between current, voltage and resistance in parallel and series D.C. circuits",
    normalizedClaimValue: "Rs = R1 + R2 + R3 + ... (equation 21.5)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, College Physics 2e, §21.1 \"Resistors in Series and Parallel\"",
    sourceLocator: "https://openstax.org/books/college-physics-2e/pages/21-1-resistors-in-series-and-parallel, equation 21.5",
    sourceExcerpt: "Rs=R1+R2+R3+...",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.parallel-resistance",
    subject: "relationship between current, voltage and resistance in parallel and series D.C. circuits",
    normalizedClaimValue: "1/Rp = 1/R1 + 1/R2 + 1/R3 + ... (equation 21.20)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, College Physics 2e, §21.1 \"Resistors in Series and Parallel\"",
    sourceLocator: "https://openstax.org/books/college-physics-2e/pages/21-1-resistors-in-series-and-parallel, equation 21.20",
    sourceExcerpt: "1/Rp=1/R1+1/R2+1/R3+...",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.conductor-definition",
    subject: "conductors (good electrical conductor materials)",
    normalizedClaimValue: "A conductor is a substance with free electrons that allows charge to move relatively freely through it.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, College Physics 2e, §18.2 \"Conductors and Insulators\"",
    sourceLocator: "https://openstax.org/books/college-physics-2e/pages/18-2-conductors-and-insulators",
    sourceExcerpt: "Any substance that has free electrons and allows charge to move relatively freely through it is called a conductor.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.insulator-definition",
    subject: "insulators (electrical insulator materials)",
    normalizedClaimValue: "An insulator does not allow charges to move through it (electrons are bound).",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, College Physics 2e, §18.2 \"Conductors and Insulators\"",
    sourceLocator: "https://openstax.org/books/college-physics-2e/pages/18-2-conductors-and-insulators",
    sourceExcerpt: "Other substances, such as glass, do not allow charges to move through them. These are called insulators.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.current-charge-flow",
    subject: "basic principles of electron theory",
    normalizedClaimValue: "Electric current I is the rate at which charge flows.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §9.1 \"Electrical Current\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/9-1-electrical-current",
    sourceExcerpt: "The average electrical current I is the rate at which charge flows",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.conventional-vs-electron-flow",
    subject: "basic principles of electron theory",
    normalizedClaimValue: "Conventional current is defined to flow from positive to negative terminal; in a metal conductor the actual electron flow is from negative to positive (opposite direction).",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §9.1 \"Electrical Current\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/9-1-electrical-current",
    sourceExcerpt:
      "In metal wires, for example, current is carried by electrons -- that is, negative charges move. ... for historical reasons, we consider the positive current flow and the current is shown to flow from the positive terminal of the battery to the negative terminal, [even though] the current flow is due primarily to electrons flowing from the negative material to the positive material.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.thermal-effect",
    subject: "chemical and thermal effects of electric currents",
    normalizedClaimValue: "P = I^2 R = V^2/R (equation 9.13) -- resistive/thermal power dissipated by a resistor.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §9.5 \"Electrical Energy and Power\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power, equation 9.13",
    sourceExcerpt: "The power dissipated by a resistor has the form P=I^2R=V^2/R.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.chemical-effect",
    subject: "chemical and thermal effects of electric currents",
    normalizedClaimValue: "Electrolysis: an external circuit does work on a redox system, imposing a voltage to drive an otherwise nonspontaneous chemical reaction.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, Chemistry 2e, §17.7 \"Electrolysis\"",
    sourceLocator: "https://openstax.org/books/chemistry-2e/pages/17-7-electrolysis",
    sourceExcerpt: "an external circuit does work on a redox system by imposing a voltage sufficient to drive an otherwise nonspontaneous reaction",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.magnetic-attraction-repulsion",
    subject: "attraction and repulsion effects of magnetism",
    normalizedClaimValue: "Like magnetic poles repel; unlike magnetic poles attract.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §11.1 \"Magnetism and Its Historical Discoveries\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/11-1-magnetism-and-its-historical-discoveries",
    sourceExcerpt: "Magnetic poles repel if they are alike (both N or both S), they attract if they are opposite (one N and the other S)",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.flux-vs-flux-density",
    subject: "difference between magnetic flux and flux density",
    normalizedClaimValue: "Magnetic flux (Phi) is measured in weber (Wb); flux density B is flux per unit area, measured in tesla (T), 1 Wb/m^2 = 1 T.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "Engineering LibreTexts, Electromagnetics I (Ellingson), §2.5 \"Magnetic Flux Density\"",
    sourceLocator:
      "https://eng.libretexts.org/Bookshelves/Electrical_Engineering/Electro-Optics/Book:_Electromagnetics_I_(Ellingson)/02:_Electric_and_Magnetic_Fields/2.05:_Magnetic_Flux_Density",
    sourceExcerpt: "Magnetic flux density (B, T or Wb/m2) ... The SI unit for magnetic flux is the weber (Wb), so B has units of Wb/m2, where 1 Wb/m2 = 1 tesla.",
    sourceQuality: "University engineering open-textbook source (Virginia Tech, LibreTexts) -- recognised open academic source per CC-19R section 23.",
  },
  {
    claimKey: "unit202.review-fact.force-on-conductor",
    subject: "force on a current-carrying conductor in a magnetic field",
    normalizedClaimValue: "F = I l x B (equation 11.13, vector cross product)",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §11.4 \"Magnetic Force on a Current-Carrying Conductor\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/11-4-magnetic-force-on-a-current-carrying-conductor, equation 11.13",
    sourceExcerpt: "F(vector) = I l(vector) x B(vector)",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.faradays-law",
    subject: "electromotive force",
    normalizedClaimValue: "epsilon = -N dPhi/dt (equation 13.2) -- induced EMF equals the negative rate of change of magnetic flux.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 2, §13.1 \"Faraday's Law\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-2/pages/13-1-faradays-law, equation 13.2",
    sourceExcerpt: "The emf epsilon induced is the negative change in the magnetic flux Phi_m per unit time.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.diode-definition",
    subject: "diodes",
    normalizedClaimValue: "A diode is a circuit element that allows electric current to flow in only one direction.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 3, §9.7 \"Semiconductor Devices\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-3/pages/9-7-semiconductor-devices",
    sourceExcerpt: "A diode is a circuit element that allows electric current to flow in only one direction, like a one-way valve",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.zener-definition",
    subject: "Zener",
    normalizedClaimValue: "A Zener diode is a reverse-biased diode designed to operate in breakdown, used as a voltage reference.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "Engineering LibreTexts, Introduction to Physical Electronics (Wilson), §1.10 \"Reverse Biased/Breakdown\"",
    sourceLocator:
      "https://eng.libretexts.org/Bookshelves/Electrical_Engineering/Electronics/Introduction_to_Physical_Electronics_(Wilson)/01:_Conductors_Semiconductors_and_Diodes/1.10:_Reverse_Biased_Breakdown",
    sourceExcerpt: "Diodes in breakdown are used as voltage references (the voltage across them is more or less independent of the current running through them) ... Such diodes are called Zener Diodes.",
    sourceQuality: "University engineering open-textbook source (LibreTexts) -- recognised open academic source per CC-19R section 23.",
  },
  {
    claimKey: "unit202.review-fact.led-definition",
    subject: "LED",
    normalizedClaimValue: "An LED is a p-n junction semiconductor device that emits light (a photon) when forward biased, due to electron-hole recombination.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "Engineering LibreTexts, Semiconductors, \"Light Emitting Diodes\"",
    sourceLocator: "https://eng.libretexts.org/Bookshelves/Materials_Science/Supplemental_Modules_(Materials_Science)/Semiconductors/Light_Emitting_Diodes",
    sourceExcerpt: "LEDs are p-n junction devices made from extrinsic semiconductors. An n-type and a p-type semiconductor are put in contact with each other to form a p-n junction diode.",
    sourceQuality: "University materials-science open-textbook source (LibreTexts) -- recognised open academic source per CC-19R section 23.",
  },
  {
    claimKey: "unit202.review-fact.transistor-definition",
    subject: "transistors",
    normalizedClaimValue: "A transistor is a device that can amplify or switch electrical signals.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "OpenStax, University Physics Volume 3, §9.7 \"Semiconductor Devices\"",
    sourceLocator: "https://openstax.org/books/university-physics-volume-3/pages/9-7-semiconductor-devices",
    sourceExcerpt: "The transistor -- a device that can amplify or switch electrical signals -- is the key component.",
    sourceQuality: OPENSTAX_QUALITY,
  },
  {
    claimKey: "unit202.review-fact.thermistor-definition",
    subject: "thermistors",
    normalizedClaimValue: "A thermistor is a semiconducting device whose resistance is very sensitive to temperature.",
    comparisonKind: "CANONICAL_TEXT",
    sourceRef: "Physics LibreTexts, Electricity and Magnetism (Tatum), §4.3 \"Resistance and Temperature\"",
    sourceLocator:
      "https://phys.libretexts.org/Bookshelves/Electricity_and_Magnetism/Electricity_and_Magnetism_(Tatum)/04:_Batteries_Resistors_and_Ohm's_Law/4.03:_Resistance_and_Temperature",
    sourceExcerpt: "A thermistor is a semiconducting device whose resistance is very sensitive to temperature, and it can be used for measuring or controlling temperature.",
    sourceQuality: "University open-textbook source (LibreTexts) -- recognised open academic source per CC-19R section 23.",
  },
];
