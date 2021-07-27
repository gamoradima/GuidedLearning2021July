define("UsrRealty1Page", [], function() {
	return {
		entitySchemaName: "UsrRealty",
		attributes: {			
			"UsrCommissionUSD": {
				dependencies: [
                    {
                        columns: ["UsrPriceUSD", "UsrOfferType"],
                        methodName: "calculateCommissionUSD"
                    }
                ]
			},
			"UsrOfferType": {
				lookupListConfig: {
					columns: ["UsrCommissionCoeff"]
				}
			},
			"TotalRealtyCount": {
				"dataValueType": this.Terrasoft.DataValueType.INTEGER,
				"type": this.Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"value": -123
			}
		},
		messages: {
			"MyMessageCode": {
        		mode: Terrasoft.MessageMode.PTP,
        		direction: Terrasoft.MessageDirectionType.PUBLISH
		    },
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrRealtyFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrRealty"
				}
			},
			"UsrSchemab7c30a44Detail7ad5d081": {
				"schemaName": "UsrRealtyVisitDetailGrid",
				"entitySchemaName": "UsrRealtyVisit",
				"filter": {
					"detailColumn": "UsrRealty",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrPriceUSD": {
				"cd36678a-ba03-4d11-bb42-01360931b625": {
					"uId": "cd36678a-ba03-4d11-bb42-01360931b625",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "UsrType"
							}
						}
					]
				}
			},
			"UsrComment": {
				"616f1cb5-1f19-436b-bfe6-9c5fa7ec5725": {
					"uId": "616f1cb5-1f19-436b-bfe6-9c5fa7ec5725",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 4,
							"leftExpression": {
								"type": 1,
								"attribute": "UsrAreaM2"
							},
							"rightExpression": {
								"type": 0,
								"value": 0,
								"dataValueType": 5
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			init: function() {
 				this.callParent(arguments);
    			// Регистрация коллекции сообщений.
    			this.sandbox.registerMessages(this.messages);
			},
			onEntityInitialized: function() {
				this.callParent(arguments);
				this.calculateCommissionUSD();
			},
			calculateCommissionUSD: function() {
				let price = this.get("UsrPriceUSD");
				if (!price) {
					price = 0;
				}
				let offerTypeObject = this.get("UsrOfferType");
				if (offerTypeObject) {
					var coeff = offerTypeObject.UsrCommissionCoeff
					//var offerTypeId = offerTypeObject.value;
					/*if (offerTypeId == "589c8ae3-4574-4ac0-b659-56d57fe44a00") { // rental
						coeff = 0.5;
					} else {
						coeff = 0.02;
					}*/
					var result = price * coeff;
					this.set("UsrCommissionUSD", result);
					this.set("MyVar", 123123123);
				}
			},
			onMyButtonClick: function() {
				var t = this.get("MyVar");
				
				this.console.log("Message published.");
				this.sandbox.publish("MyMessageCode", null, []);
			},
			getMyButtonEnabled: function() {
				var name = this.get("UsrName");
				let result = false;
				if (name) {
					result = true;
				}
				return result;
			},
			positiveValueValidator: function(value, column) {
				var msg = "";
				if (value < 0) {
					msg = this.get("Resources.Strings.ValueMustBePositive");
				}				
				return {
					invalidMessage: msg
				}
			},
            setValidationConfig: function() {
                // Вызывает инициализацию валидаторов родительской модели представления.
                this.callParent(arguments);
                // Для колонки [UsrPriceUSD] добавляется метод-валидатор positiveValueValidator().
                this.addColumnValidator("UsrPriceUSD", this.positiveValueValidator);
                this.addColumnValidator("UsrAreaM2", this.positiveValueValidator);
            },
			
			asyncValidate: function(callback, scope) {
				this.callParent([
						function(response) {
					if (!this.validateResponse(response)) {
						return;
					}
					this.validateRealtyData(function(response) {
						if (!this.validateResponse(response)) {
							return;
						}
						callback.call(scope, response);
					}, this);
				}, this]);
			},

			validateRealtyData: function(callback, scope) {
				// create query for server side
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "UsrRealty"
				});
				esq.addAggregationSchemaColumn("UsrPriceUSD", Terrasoft.AggregationType.SUM, "PriceSum");
				var saleOfferTypeId = "b3f92266-d561-4e8d-bbc9-5100d1c63b4c";
				var saleFilter = esq.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,
							"UsrOfferType", saleOfferTypeId);
				esq.filters.addItem(saleFilter);
				// run query
				esq.getEntityCollection(function(response) {
					if (response.success && response.collection) {
						var sum = 0;
						var items = response.collection.getItems();
						if (items.length > 0) {
							sum = items[0].get("PriceSum");
						}
						var max = 10000000;
						if (sum > max) {
							if (callback) {
								callback.call(this, {
									success: false,
									message: "You cannot save, because sum = " + sum + " is bigger than " + max
								});
							}
						} else
						if (callback) {
							callback.call(scope, {
								success: true
							});
						}
					}
				}, this);
			},

		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName81a203c0-d522-465f-8385-2814b0f25969",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FLOAT52491d6d-4da5-4030-b648-7d3999ada31d",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrPriceUSD",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "FLOATcadbd589-0d51-4451-b265-06be08d9fdaa",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrAreaM2",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "MyButton",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.MyButtonCaption"
					},
					"click": {
						"bindTo": "onMyButtonClick"
					},
					"enabled": {
						"bindTo": "getMyButtonEnabled"
					},
					"style": "blue",
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 5,
						"layoutName": "ProfileContainer"
					}
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 6
			},
			{
				"operation": "insert",
				"name": "FLOATa51da373-7f16-4e92-b5ac-fb5be792f89e",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrCommissionUSD",
					"enabled": false
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "TotalRealtyCountDivName",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "TotalRealtyCount",
					"enabled": false,
					"caption": "Всего записей недвижимости"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 5
			},			
			{
				"operation": "insert",
				"name": "LOOKUPe409491c-943d-4ac1-9a5e-a4e8cea84780",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "LOOKUP1c96d05c-9153-4a92-93d7-2a2818db05d2",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrOfferType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "STRING9e763747-9088-42bc-8dfb-f33dcecf73a9",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 2,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "Tab5487ee52TabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab5487ee52TabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSchemab7c30a44Detail7ad5d081",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tab5487ee52TabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
