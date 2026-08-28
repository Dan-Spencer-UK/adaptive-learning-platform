/**
 * CC-05C: renders CC-05A's structured `FormulaExpression` tree as visually
 * rich mathematical notation (fraction bars, superscripts, root signs) --
 * never as a parsed display string. This is the rendering half of design
 * doc §8's split ("Formula rendering is a visual concern. Calculation is
 * an engine concern"); it never computes a result itself.
 *
 * Every node also carries an `accessibilityLabel` built from
 * lib/formula-rendering/format-formula.ts's `describeExpression`, derived
 * from the exact same tree the visual comes from, so the spoken and
 * visual forms can never disagree (design doc §15 -- diagrams/formulae
 * need a semantic equivalent, not just a picture).
 */
import type { FormulaExpression, FormulaOperand } from "@alp/content-schema";
import { StyleSheet, Text, View } from "react-native";

import { color, typography } from "@/lib/tokens";
import {
  describeExpression,
  formatExpressionInline,
  symbolicResolver,
  type SymbolResolver,
} from "@/lib/formula-rendering/format-formula";

export interface FormulaEquationProps {
  readonly target: string;
  readonly targetLabel?: string;
  readonly expression: FormulaExpression;
  readonly resolve?: SymbolResolver;
  readonly unitSymbol?: string;
  readonly testID?: string;
}

/** Renders "target = <expression>" (optionally "= <expression> <unit>" once resolved to numbers), e.g. "I = V / R" or "I = 24 / 6 = 4 A". */
export function FormulaEquation({
  target,
  targetLabel,
  expression,
  resolve = symbolicResolver,
  unitSymbol,
  testID,
}: FormulaEquationProps): React.JSX.Element {
  const spoken = `${targetLabel ?? target} equals ${describeExpression(expression, resolve)}${unitSymbol ? ` ${unitSymbol}` : ""}`;
  return (
    <View
      style={styles.equationRow}
      testID={testID}
      accessible
      accessibilityRole="text"
      accessibilityLabel={spoken}
    >
      <Text style={styles.symbolText}>{target} =</Text>
      <ExpressionNode expression={expression} resolve={resolve} />
      {unitSymbol ? <Text style={styles.symbolText}>{unitSymbol}</Text> : null}
    </View>
  );
}

interface ExpressionNodeProps {
  readonly expression: FormulaExpression;
  readonly resolve: SymbolResolver;
}

function ExpressionNode({ expression, resolve }: ExpressionNodeProps): React.JSX.Element {
  switch (expression.operation) {
    case "multiply":
      return <JoinedRow operands={expression.operands ?? []} joiner="×" resolve={resolve} />;
    case "add":
      return <JoinedRow operands={expression.operands ?? []} joiner="+" resolve={resolve} />;
    case "subtract": {
      const [a, b] = expression.operands ?? [];
      return (
        <View style={styles.row}>
          {a !== undefined ? <OperandNode operand={a} resolve={resolve} /> : null}
          <Text style={styles.symbolText}> − </Text>
          {b !== undefined ? <OperandNode operand={b} resolve={resolve} /> : null}
        </View>
      );
    }
    case "square":
      return (
        <View style={styles.row}>
          <OperandNode operand={expression.operand!} resolve={resolve} />
          <Text style={styles.superscript}>2</Text>
        </View>
      );
    case "power":
      return (
        <View style={styles.row}>
          <OperandNode operand={expression.operand!} resolve={resolve} />
          <Text style={styles.superscript}>{expression.exponent}</Text>
        </View>
      );
    case "sqrt":
      return (
        <View style={styles.row}>
          <Text style={styles.symbolText}>√</Text>
          <View style={styles.rootBar}>
            <OperandNode operand={expression.operand!} resolve={resolve} />
          </View>
        </View>
      );
    case "reciprocal":
      return <Fraction numerator={<Text style={styles.symbolText}>1</Text>} denominator={<OperandNode operand={expression.operand!} resolve={resolve} />} />;
    case "reciprocal_of_sum_of_reciprocals":
      return (
        <Fraction
          numerator={<Text style={styles.symbolText}>1</Text>}
          denominator={
            <JoinedRow
              joiner="+"
              resolve={resolve}
              operands={(expression.operands ?? []).map(
                (o): FormulaOperand => ({ operation: "reciprocal", operand: o }),
              )}
            />
          }
        />
      );
    case "ratio_percentage":
      return (
        <View style={styles.row}>
          <Fraction
            numerator={<OperandNode operand={expression.numerator!} resolve={resolve} />}
            denominator={<OperandNode operand={expression.denominator!} resolve={resolve} />}
          />
          <Text style={styles.symbolText}> × 100%</Text>
        </View>
      );
    case "divide":
      return (
        <Fraction
          numerator={<OperandNode operand={expression.numerator!} resolve={resolve} />}
          denominator={<OperandNode operand={expression.denominator!} resolve={resolve} />}
        />
      );
    default: {
      const exhaustive: never = expression.operation;
      throw new Error(`FormulaExpressionView: unhandled operation "${String(exhaustive)}"`);
    }
  }
}

function OperandNode({ operand, resolve }: { operand: FormulaOperand; resolve: SymbolResolver }): React.JSX.Element {
  if (typeof operand === "number") return <Text style={styles.symbolText}>{operand}</Text>;
  if (typeof operand === "string") {
    return <Text style={styles.symbolText}>{resolve(operand)}</Text>;
  }
  return <ExpressionNode expression={operand} resolve={resolve} />;
}

function JoinedRow({
  operands,
  joiner,
  resolve,
}: {
  operands: readonly FormulaOperand[];
  joiner: string;
  resolve: SymbolResolver;
}): React.JSX.Element {
  return (
    <View style={styles.row}>
      {operands.map((operand, i) => (
        <View key={i} style={styles.row}>
          {i > 0 ? <Text style={styles.symbolText}> {joiner} </Text> : null}
          <OperandNode operand={operand} resolve={resolve} />
        </View>
      ))}
    </View>
  );
}

function Fraction({
  numerator,
  denominator,
}: {
  numerator: React.ReactNode;
  denominator: React.ReactNode;
}): React.JSX.Element {
  return (
    <View style={styles.fraction} importantForAccessibility="no-hide-descendants">
      <View style={styles.fractionPart}>{numerator}</View>
      <View style={styles.fractionBar} />
      <View style={styles.fractionPart}>{denominator}</View>
    </View>
  );
}

/** Compact single-line fallback for contexts that cannot host the fraction-bar layout (e.g. list rows, dev-QA labels). */
export function formulaInlineText(expression: FormulaExpression, resolve: SymbolResolver = symbolicResolver): string {
  return formatExpressionInline(expression, resolve);
}

const styles = StyleSheet.create({
  equationRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  symbolText: { ...typography.body, color: color.text, fontWeight: "600" },
  superscript: { ...typography.caption, color: color.text, fontWeight: "700", marginTop: -8 },
  rootBar: { borderTopWidth: 1.5, borderColor: color.text, paddingHorizontal: 2, paddingTop: 1 },
  fraction: { alignItems: "center", marginHorizontal: 2 },
  fractionPart: { paddingHorizontal: 4 },
  fractionBar: { height: 1.5, backgroundColor: color.text, alignSelf: "stretch", marginVertical: 2 },
});
