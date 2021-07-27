define("UsrRealtyVisitDetailGrid", [], function() {
	return {
		entitySchemaName: "UsrRealtyVisit",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		messages: {
			"MyMessageCode": {
        		mode: Terrasoft.MessageMode.PTP,
        		direction: Terrasoft.MessageDirectionType.SUBSCRIBE
		    },
		},
		methods: {
			init: function() {
				this.callParent(arguments);
				// Регистрация коллекции сообщений.
				this.sandbox.registerMessages(this.messages);
				this.sandbox.subscribe("MyMessageCode", this.myMessageMethod, this, []);
			},
			myMessageMethod: function() {
				this.console.log("Message subscriber called.");
				this.reloadGridData();
			}
		}
	};
});
