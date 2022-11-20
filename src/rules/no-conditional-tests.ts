import { TSESTree } from "@typescript-eslint/utils/dist/ts-estree";
import { createEslintRule } from "../utils";

export const RULE_NAME = "no-conditional-tests"
export type MESSAGE_ID = "noConditionalTests"

export default createEslintRule<[], MESSAGE_ID>({
	name: RULE_NAME,
	meta: {
		type: "problem",
		docs: {
			description: "Disallow conditional tests",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			noConditionalTests: "Conditional tests are not allowed.",
		},
	},
	defaultOptions: [],
	create(context) {
		function checkConditionalTest(node: TSESTree.CallExpression) {
			const expression = node.arguments[1];

			if (!("body" in expression) || !("body" in expression.body) || !Array.isArray(expression.body.body)) {
				return;
			}


			// check if the test function contains if statements
			if (expression.body.body.some((statement) => statement.type === "IfStatement")) {
				context.report({
					node,
					messageId: "noConditionalTests",
				});
			}


			// check if test contains switch statements
			if (expression.body.body.some((statement) => statement.type === "SwitchStatement")) {
				context.report({
					node,
					messageId: "noConditionalTests",
				});
			}

			// test if body of function contains a ternary statement
			if (expression.body.body.some((statement) => statement.type === "ExpressionStatement" && statement.expression.type === "Literal")) {
				context.report({
					node,
					messageId: "noConditionalTests",
				});
			}

		}

		return {
			"CallExpression[callee.name=/^(it|test|describe)$/]"(node: TSESTree.CallExpression) {
				checkConditionalTest(node)
			}
		}
	},
});