/**
 * Das Objekt ChatCockpit.
 * 
 * @param deviceUri
 *            die Uri des Devices
 * @return Eine Instanz des Objekts ChatCockpit
 */
function ChatCockpit() {

	this.$starten = $("#starten");

	/**
	 * Initialisierung ausführen
	 */
	$.ajaxSetup({
		dataType : 'json',
		accepts : {
			json : 'application/json'
		}
	});
	this.initializeHandler();
}

/**
 * Spielt eine Sound ab.
 */
ChatCockpit.prototype.notifySound = function() {
	try {
		window.focus();
		this.audio_notify.play();
	} catch (e) {
	}
};

/**
 * Legt die erforderlichen Click-Handler usw. an.
 */
ChatCockpit.prototype.initializeHandler = function() {
	var that = this;
	this.$starten.click(function() {that.starten();	});
};

/**
 * Fordert eine Videokonferenz an
 */
ChatCockpit.prototype.starten = function() {
    var id = "1";
    
    var that = this;
    $.ajax({
	url : "/api/queue",
	async : true,
	data : {
	    "id" : id
	},
	type : "POST",
	// success : function(res) {
	// that.updateMessages(that.berechneMessages(that.berechneAktivenChat(this.f_device,
	// this.f_chats)));
	// },
	error : function(jqXHR, textStatus, errorThrown) {
	    that.handleErrorXhr(jqXHR);
	}
    });
};



ChatCockpit.prototype.updateNachricht = function(new_nachricht) {
	var old_nachricht = this.f_nachricht;
	if (!this.recursiveCompare(old_nachricht, new_nachricht)) {
		this.f_nachricht = new_nachricht;
		this.fireNachrichtChanged(old_nachricht, new_nachricht);
	}
};

ChatCockpit.prototype.fireAktiverChatChanged = function(old_aktiverChat,
		new_aktiverChat) {

	if (old_aktiverChat == null || new_aktiverChat == null
			|| old_aktiverChat.chat_id != new_aktiverChat.chat_id) {
		this.$nachricht.val("");
		this.updateNachricht(this.$nachricht.val());
	}

	this.refreshAktiverChat(new_aktiverChat);
};


/**
 * Extrahiert die Uhrzeit aus einem RFC3339 Timestamp. Z.B "18:24" aus
 * "2012-06-28T18:24:27.490+02:00"
 */
ChatCockpit.prototype.zeit = function(timestamp) {
	if (timestamp != null && timestamp.length >= 19) {
		return timestamp.substr(11, 5);
	}
	return "??:??";
};


/**
 * Filtert die Chats, für die die Prädikationsfunktion pred true liefert.
 * 
 * @param pred
 *            Eine Funktion mit einem Argmuent. Liefert true, wenn der Chat in
 *            der gefilterten Ergebnis belieben soll.
 * @return Ein Array mit JSON-Repräsentationen der ChatResourcen im Status
 *         'status'
 */
ChatCockpit.prototype.filter = function(array, pred) {
	var result = new Array();
	if (array != null) {
		for ( var i = 0; i < array.length; i++) {
			if (pred(array[i])) {
				result.push(array[i]);
			}
		}
	}
	return result;
};


/**
 * Behandelt den error. Entweder per alert anzeigen oder ignorieren
 */
ChatCockpit.prototype.handleError = function(error) {
	if (this.alertError) {
		alert(error);
	}
};

/**
 * Behandelt den error. Entweder per alert anzeigen oder ignorieren
 */
ChatCockpit.prototype.handleErrorXhr = function(jXHR) {
	
	if (jXHR.responseText)
	{
		alert(JSON.parse(jXHR.responseText).Message);
	}
	
	this.checkSession();
};

/**
 * Führt ein ajax-GET auf die 'uri' aus
 * 
 * @param uri
 *            Die Uri der Resource
 * @return Die JSON-Repäsentation der Ressource
 */
ChatCockpit.prototype.ajax_get = function(uri) {

	if (uri == null) {
		return null;
	}

	var that = this;
	var data = null;
	$.ajax({
		url : uri,
		async : false,
		success : function(res) {
			data = res;
		},
		error : function(jqXHR, textStatus, errorThrown) {
			that.handleErrorXhr(jqXHR);
		}
	});
	return data;
};

/**
 * Vergleicht obj und reference.
 * 
 * @param obj
 * @param reference
 * @return true, falls alle Eigenschaften der Objekte gleich sind. Testet ggf.
 *         rekursiv.
 */
ChatCockpit.prototype.recursiveCompare = function(obj, reference) {
	if (obj === reference)
		return true;
	if (obj == null && reference == null)
		return true;
	if (obj == null && reference != null)
		return false;
	if (obj != null && reference == null)
		return false;
	if (obj.constructor !== reference.constructor)
		return false;
	if (obj instanceof Array) {
		if (obj.length !== reference.length)
			return false;
		for ( var i = 0, len = obj.length; i < len; i++) {
			if (typeof obj[i] == "object" && typeof reference[i] == "object") {
				if (!this.recursiveCompare(obj[i], reference[i]))
					return false;
			} else if (obj[i] !== reference[i])
				return false;
		}
	} else {
		var objListCounter = 0;
		var refListCounter = 0;
		for ( var i in obj) {
			objListCounter++;
			if (typeof obj[i] == "object" && typeof reference[i] == "object") {
				if (!this.recursiveCompare(obj[i], reference[i]))
					return false;
			} else if (obj[i] !== reference[i])
				return false;
		}
		for ( var i in reference)
			refListCounter++;
		if (objListCounter !== refListCounter)
			return false;
	}
	return true; // Every object and array is equal
};
