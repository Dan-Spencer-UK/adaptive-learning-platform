import { render } from "@testing-library/react-native";

import { WaveformSineDiagram } from "./WaveformSineDiagram";

describe("WaveformSineDiagram", () => {
  it("mentions the peak reference line only when show_peak_line is true", async () => {
    const shown = await render(
      <WaveformSineDiagram
        diagram={{ blueprintId: "graph.waveform_sine", parameters: { show_peak_line: true, show_rms_line: false, show_period_marker: false, cycles_shown: 2 }, labels: [] }}
      />,
    );
    expect(shown.getByLabelText(/peak reference line/)).toBeTruthy();

    const hidden = await render(
      <WaveformSineDiagram
        diagram={{ blueprintId: "graph.waveform_sine", parameters: { show_peak_line: false, show_rms_line: false, show_period_marker: false, cycles_shown: 2 }, labels: [] }}
      />,
    );
    expect(hidden.queryByLabelText(/peak reference line/)).toBeNull();
  });

  it("mentions the RMS line, distinct from the peak line, only when show_rms_line is true", async () => {
    const { getByLabelText } = await render(
      <WaveformSineDiagram
        diagram={{ blueprintId: "graph.waveform_sine", parameters: { show_peak_line: true, show_rms_line: true, show_period_marker: false, cycles_shown: 1 }, labels: [] }}
      />,
    );
    expect(getByLabelText(/RMS reference line sits between the zero axis and the peak line, at about 71 percent/)).toBeTruthy();
  });

  it("mentions a period marker spanning exactly one cycle only when show_period_marker is true", async () => {
    const { getByLabelText } = await render(
      <WaveformSineDiagram
        diagram={{ blueprintId: "graph.waveform_sine", parameters: { show_peak_line: false, show_rms_line: false, show_period_marker: true, cycles_shown: 3 }, labels: [] }}
      />,
    );
    expect(getByLabelText(/period marker spans exactly one full cycle/)).toBeTruthy();
  });

  it("clamps cycles_shown to the governed 1-3 range", async () => {
    const { getByLabelText } = await render(
      <WaveformSineDiagram
        diagram={{ blueprintId: "graph.waveform_sine", parameters: { show_peak_line: false, show_rms_line: false, show_period_marker: false, cycles_shown: 7 }, labels: [] }}
      />,
    );
    expect(getByLabelText(/3 cycles shown/)).toBeTruthy();
  });

  it("CC-11.3: mentions a peak-to-peak bracket whenever the peak line is shown (the contract's own claimed EL-WAVEFORM-PEAK-TO-PEAK-001 linkage)", async () => {
    const shown = await render(
      <WaveformSineDiagram
        diagram={{ blueprintId: "graph.waveform_sine", parameters: { show_peak_line: true, show_rms_line: false, show_period_marker: false, cycles_shown: 2 }, labels: [] }}
      />,
    );
    expect(shown.getByLabelText(/peak-to-peak bracket spans from the peak line to the trough line/)).toBeTruthy();

    const hidden = await render(
      <WaveformSineDiagram
        diagram={{ blueprintId: "graph.waveform_sine", parameters: { show_peak_line: false, show_rms_line: false, show_period_marker: false, cycles_shown: 2 }, labels: [] }}
      />,
    );
    expect(hidden.queryByLabelText(/peak-to-peak/)).toBeNull();
  });

  it("never embeds a numeric peak/RMS value or a non-zero average line", async () => {
    const { getByLabelText } = await render(
      <WaveformSineDiagram
        diagram={{ blueprintId: "graph.waveform_sine", parameters: { show_peak_line: true, show_rms_line: true, show_period_marker: true, cycles_shown: 2 }, labels: [] }}
      />,
    );
    const label = getByLabelText(/Sine waveform/).props.accessibilityLabel as string;
    expect(label).not.toMatch(/\d+\s*(V|A|Hz|volt|amp)/i);
    expect(label).not.toMatch(/average/i);
  });
});
