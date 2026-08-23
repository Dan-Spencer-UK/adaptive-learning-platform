/**
 * CC-11 (Workstream C): execution for the `electrical.electronic_components`
 * question blueprints (LO6, AC6.1/AC6.2) -- the family already existed in
 * CC-05A/CC-09B as `assessmentRequirement: "teaching_only"` (real governed
 * assertions, zero blueprints); this file is the first pedagogy-layer
 * authoring against it.
 *
 * Per the task brief for this package ("do not turn this into
 * semiconductor engineering... teach exactly the governed Level-2
 * operating principles and applications") there is no numeric calculation
 * here at all -- every executor is a categorical recognition/identification
 * question, following the exact `pick` + `assembleInstance` + `exact()`
 * pattern `../families/magnetism.ts`'s `recogniseConcept` /
 * `comparePermanentElectromagnet` / `compareMotorGenerator` and
 * `../families/resistivity.ts`'s `recognise` already establish for
 * no-diagram multiple_choice recognition questions. No new diagram
 * blueprint is introduced (out of scope, a cross-workstream SVG-renderer
 * dependency) -- every question is plain text, matching the several
 * existing no-diagram magnetism/resistivity blueprints.
 *
 * Atomicity (task brief section 21, CC-09I precedent): every executor
 * below generates ONE clue describing ONE component (or one specific
 * functional role within one application), with a single correct answer
 * among 2-4 options. A learner's correct answer therefore evidences
 * recognition of that ONE described fact only -- never establishes
 * mastery of the other listed terms/roles in the same option set. This
 * mirrors `magnetism.recognise_concept` (2-3 assertionIdentifiers listed
 * on the blueprint's evidence target, but any single generated instance
 * only tests one of the 2 pick-options) and `electronics.identify_application`
 * below deliberately splits the two-component security-alarm and
 * telephone-master-socket application assertions into separate role-clues
 * (transistor's break-detection role vs thyristor's latching role;
 * capacitor's ringing-coupling role vs resistor's test-load role) rather
 * than ever asking "which TWO components does this application use" as a
 * single compound answer.
 *
 * Every clue string below is a close paraphrase of its governed assertion
 * statement (scripts/content/data/cc04-unit202-electrical-science.ts) with
 * the component/application term itself withheld -- the same
 * "governed-statement-derived clue, answer word withheld" pattern CC-10
 * introduced for `resistivity.recognise` (see that file's own
 * `RECOGNISE_CLUES` comment) to avoid templating a parameter that IS the
 * correct answer.
 */

import { pick } from "../seed.ts";
import { assembleInstance, type QuestionExecutor } from "./shared.ts";

// ---------------------------------------------------------------------
// cap.electronic_components.recognise_principle
// ---------------------------------------------------------------------

// electronics.recognise_capacitor_behaviour -- EL-COMPONENT-CAPACITOR-TRANSIENT-001:
// "A capacitor opposes a sudden change in the voltage across it: connected
// in a circuit with resistance, it charges and discharges exponentially
// over time (governed by the time constant tau = R times C) rather than
// the voltage across it changing instantaneously." The assertion itself
// names both the correct behaviour and the contrasting (incorrect)
// "instantaneous" behaviour, so contrasting them as the two MC options
// introduces no invented content. `scenario` (charging/discharging) is
// governed variety, not a second independent fact -- the correct answer
// is the same exponential-change principle either way.
const CAPACITOR_TRANSIENT_SCENARIOS = ["charging", "discharging"] as const;
type CapacitorTransientScenario = (typeof CAPACITOR_TRANSIENT_SCENARIOS)[number];

const recogniseCapacitorBehaviour: QuestionExecutor = (ctx) => {
  const scenario = pick<CapacitorTransientScenario>(ctx.rng, CAPACITOR_TRANSIENT_SCENARIOS);
  return assembleInstance(ctx, { scenario }, {}, { answer: ctx.blueprint.answer, value: "gradual_exponential_change" });
};

// electronics.recognise_thermistor_type -- NTC (EL-COMPONENT-THERMISTOR-001)
// vs PTC (EL-COMPONENT-THERMISTOR-PTC-001) thermistor, the same binary
// "governed clue, term withheld" pattern `resistivity.recognise` uses.
const THERMISTOR_TYPES = ["ntc_thermistor", "ptc_thermistor"] as const;
type ThermistorType = (typeof THERMISTOR_TYPES)[number];

const THERMISTOR_TYPE_CLUES: Readonly<Record<ThermistorType, string>> = {
  ntc_thermistor: "its electrical resistance decreases as its temperature increases",
  ptc_thermistor: "its electrical resistance increases as its temperature increases, the opposite of the other thermistor type",
};

const recogniseThermistorType: QuestionExecutor = (ctx) => {
  const thermistorType = pick<ThermistorType>(ctx.rng, THERMISTOR_TYPES);
  return assembleInstance(
    ctx,
    { thermistor_type_clue: THERMISTOR_TYPE_CLUES[thermistorType] },
    {},
    { answer: ctx.blueprint.answer, value: thermistorType },
  );
};

// electronics.recognise_rectifier_type -- distinguishes half-wave
// rectification (EL-COMPONENT-RECTIFIER-HALF-WAVE-001), full-wave bridge
// rectification (EL-COMPONENT-RECTIFIER-FULL-WAVE-001) and the inverter
// (EL-COMPONENT-INVERTER-001), the genuine DC-to-AC contrast to a
// rectifier's AC-to-DC conversion.
const RECTIFIER_TYPES = ["half_wave_rectifier", "full_wave_rectifier", "inverter"] as const;
type RectifierType = (typeof RECTIFIER_TYPES)[number];

const RECTIFIER_TYPE_CLUES: Readonly<Record<RectifierType, string>> = {
  half_wave_rectifier:
    "uses a single diode to allow only one half-cycle of an AC waveform through to the load, blocking the other half-cycle, producing a pulsating DC output",
  full_wave_rectifier:
    "uses four diodes arranged so that both half-cycles of an AC waveform are converted to the same output polarity, producing a pulsating DC output with less ripple than using only one diode",
  inverter:
    "converts a direct-current supply into an alternating-current output, by using electronic switching circuits to switch the DC input in a controlled sequence",
};

const recogniseRectifierType: QuestionExecutor = (ctx) => {
  const rectifierType = pick<RectifierType>(ctx.rng, RECTIFIER_TYPES);
  return assembleInstance(
    ctx,
    { rectifier_type_clue: RECTIFIER_TYPE_CLUES[rectifierType] },
    {},
    { answer: ctx.blueprint.answer, value: rectifierType },
  );
};

// electronics.recognise_diode_family -- diode (EL-COMPONENT-DIODE-001),
// Zener diode (EL-COMPONENT-ZENER-DIODE-001), LED (EL-COMPONENT-LED-001),
// photodiode (EL-COMPONENT-PHOTODIODE-001).
const DIODE_FAMILY_TERMS = ["diode", "zener_diode", "led", "photodiode"] as const;
type DiodeFamilyTerm = (typeof DIODE_FAMILY_TERMS)[number];

const DIODE_FAMILY_CLUES: Readonly<Record<DiodeFamilyTerm, string>> = {
  diode: "conducts current easily in one direction (forward bias) and blocks current in the other direction (reverse bias)",
  zener_diode:
    "is designed to be operated in reverse breakdown at a well-defined breakdown voltage without damage, so it maintains a substantially constant voltage across itself and can be used to regulate voltage",
  led: "produces light by electroluminescence: when forward-biased, recombination of electrons and holes at the junction releases energy as photons",
  photodiode: "is optimised to generate a photocurrent in response to incident light falling on its junction, allowing it to detect or measure light",
};

const recogniseDiodeFamily: QuestionExecutor = (ctx) => {
  const term = pick<DiodeFamilyTerm>(ctx.rng, DIODE_FAMILY_TERMS);
  return assembleInstance(ctx, { diode_family_clue: DIODE_FAMILY_CLUES[term] }, {}, { answer: ctx.blueprint.answer, value: term });
};

// electronics.recognise_switching_family -- DIAC (EL-COMPONENT-DIAC-001),
// TRIAC (EL-COMPONENT-TRIAC-001), thyristor/SCR
// (EL-COMPONENT-THYRISTOR-SCR-001), transistor (EL-COMPONENT-TRANSISTOR-001).
const SWITCHING_FAMILY_TERMS = ["diac", "triac", "thyristor_scr", "transistor"] as const;
type SwitchingFamilyTerm = (typeof SWITCHING_FAMILY_TERMS)[number];

const SWITCHING_FAMILY_CLUES: Readonly<Record<SwitchingFamilyTerm, string>> = {
  diac:
    "remains a high-impedance, non-conducting device until the voltage across it exceeds its breakover voltage, at which point it switches into conduction in either direction; it is almost never used alone, but to trigger other thyristor devices",
  triac:
    "acts much like two silicon-controlled rectifiers connected back-to-back, allowing it to conduct current in both directions once triggered by gate current, making it suitable for controlling alternating current",
  thyristor_scr:
    "conducts current in one direction only once a sufficient gate current triggers it into conduction, and continues conducting until the current through it falls below the device's holding current",
  transistor:
    "is a three-terminal device whose collector-emitter current is controlled by a much smaller base current, allowing it to act as an electrically controlled switch or as an amplifier",
};

const recogniseSwitchingFamily: QuestionExecutor = (ctx) => {
  const term = pick<SwitchingFamilyTerm>(ctx.rng, SWITCHING_FAMILY_TERMS);
  return assembleInstance(ctx, { switching_family_clue: SWITCHING_FAMILY_CLUES[term] }, {}, { answer: ctx.blueprint.answer, value: term });
};

// ---------------------------------------------------------------------
// cap.electronic_components.identify_application
// ---------------------------------------------------------------------

// electronics.identify_application -- each scenario key names ONE
// specific functional role from ONE governed application assertion, and
// maps to exactly one correct component. The two multi-component
// application assertions (security alarm; telephone master socket) are
// deliberately split into their two independent roles (see the atomicity
// note at the top of this file) rather than combined into one clue.
const APPLICATION_SCENARIOS = [
  "dimmer_switch",
  "motor_control",
  "heating_boiler_control",
  "security_alarm_break_detection",
  "security_alarm_latch",
  "telephone_ringing_coupling",
  "telephone_test_load",
] as const;
type ApplicationScenario = (typeof APPLICATION_SCENARIOS)[number];

type ApplicationComponent = "triac" | "thyristor_scr" | "thermistor" | "transistor" | "capacitor" | "resistor";

const APPLICATION_SCENARIO_CLUES: Readonly<Record<ApplicationScenario, string>> = {
  dimmer_switch:
    "A household dimmer switch needs a component that can control the average power delivered to a lamp by switching on at a controlled phase angle within each AC half-cycle. Which component is typically used?",
  motor_control:
    "A motor-control circuit needs a component that, once triggered by a gate current, controls the electrical power delivered to the motor. Which component is typically used?",
  heating_boiler_control:
    "A central-heating/boiler control circuit needs a temperature-sensing component that provides a feedback signal so a thermostat can switch the heating load on or off at set temperatures. Which component is typically used?",
  security_alarm_break_detection:
    "In a simple electronic security-alarm circuit, which component detects a break in a normally-closed sensor loop?",
  security_alarm_latch:
    "In a simple electronic security-alarm circuit, once triggered, which component latches on and continues to power the sounder even if the loop is reclosed, until the circuit is deliberately reset?",
  telephone_ringing_coupling:
    "The traditional UK master telephone socket contains a component that couples the AC ringing signal to the line while blocking the line's DC. Which component is this?",
  telephone_test_load:
    "The traditional UK master telephone socket contains a component that provides a defined test load for line testing when no telephone is connected. Which component is this?",
};

const APPLICATION_SCENARIO_ANSWER: Readonly<Record<ApplicationScenario, ApplicationComponent>> = {
  dimmer_switch: "triac",
  motor_control: "thyristor_scr",
  heating_boiler_control: "thermistor",
  security_alarm_break_detection: "transistor",
  security_alarm_latch: "thyristor_scr",
  telephone_ringing_coupling: "capacitor",
  telephone_test_load: "resistor",
};

const identifyApplication: QuestionExecutor = (ctx) => {
  const scenario = pick<ApplicationScenario>(ctx.rng, APPLICATION_SCENARIOS);
  return assembleInstance(
    ctx,
    { application_clue: APPLICATION_SCENARIO_CLUES[scenario] },
    {},
    { answer: ctx.blueprint.answer, value: APPLICATION_SCENARIO_ANSWER[scenario] },
  );
};

export const electronicComponentsExecutors: Readonly<Record<string, QuestionExecutor>> = {
  "electronics.recognise_capacitor_behaviour": recogniseCapacitorBehaviour,
  "electronics.recognise_thermistor_type": recogniseThermistorType,
  "electronics.recognise_rectifier_type": recogniseRectifierType,
  "electronics.recognise_diode_family": recogniseDiodeFamily,
  "electronics.recognise_switching_family": recogniseSwitchingFamily,
  "electronics.identify_application": identifyApplication,
};

export const __internal = {
  THERMISTOR_TYPE_CLUES,
  RECTIFIER_TYPE_CLUES,
  DIODE_FAMILY_CLUES,
  SWITCHING_FAMILY_CLUES,
  APPLICATION_SCENARIO_ANSWER,
};
