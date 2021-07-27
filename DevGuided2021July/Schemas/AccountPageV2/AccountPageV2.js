define("AccountPageV2", [], function() {
	return {
		entitySchemaName: "Account",
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "DATETIME93765e1b-8e9d-4b0d-90d5-cf2251e0b9b1",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "CategoriesControlGroupContainer"
					},
					"bindTo": "UsrClientStartDate",
					"enabled": true
				},
				"parentName": "CategoriesControlGroupContainer",
				"propertyName": "items",
				"index": 3
			}
		]/**SCHEMA_DIFF*/
	};
});
