const SUPPORTED_ENTITIES = ["blind", "light", "media_player"];

function wsConnect(url) {
  let socket = new WebSocket(url);
  console.log("function wsConnect(url){");

  socket.onopen = function(e) {
    console.log("[open] Connection established");
    console.log("Sending auth request to server");
    socket.send(buildAuthPacket("0"));
  };

  socket.onmessage = function(event) {
    const messageJson = event.data;
    messageObj = JSON.parse(messageJson);
    console.log(`[message] Data received from server`);
    if (messageObj.type && messageObj.type === "auth_ok") {
      console.log("Sending configJson request to server");
      socket.send(`{"type":"getconfig"}`);
    }
    if (messageObj.areas && messageObj.entities) {
      parseConfigurationJson(messageObj);
    }
  };

  socket.onclose = function(event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log("[close] Connection died");
    }
  };

  socket.onerror = function(error) {
    console.log(`[error] ${error.message}`);
  };
}

function buildAuthPacket(token) {
  return `{"type":"auth","token": "${token}"}`;
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}

function parseConfigurationJson(confObj) {
  if (confObj) displayJsonConfigText(confObj);
  if (confObj.areas) displayAreas(confObj.areas);
  if (confObj.entities) displayEntities(confObj.entities);
  if (confObj.integration) displayIntergrations(confObj.integration);
  if (confObj.settings) displaySettings(confObj.settings);
}

function displayJsonConfigText(confObj) {
  let confJson = JSON.stringify(confObj, null, 2);
  document.getElementById("configJsonTextBox").value = confJson;
}

function displayAreas(areas) {
  let innerHtml = "<h3>Configuration Areas</h3>";
  for (let area of areas) {
    innerHtml += `<div class="configItem"><div>${area.area}</div><div>${area.bluetooth}</div></div>`;
  }
  document.getElementById("areas").innerHTML = innerHtml;
}

function displayEntities(entities) {
  let innerHtml = "<h3>Configuration Entities</h3>";

  for (let type of SUPPORTED_ENTITIES) {
    innerHtml += `<h4>${type}</h4>`;
    for (let entity of entities[type]) {
      innerHtml += `<div class="configItem"><div>${entity.area}</div><div>${entity.entity_id}</div><div>${entity.friendly_name}</div><div>${entity.integration}</div><div>${entity.supported_features}</div></div>`;
    }
  }
  document.getElementById("entities").innerHTML = innerHtml;
}

function displayIntergrations(intergrations) {
  let innerHtml = "<h3>Configuration Intergration</h3>";

  for (let intergration of intergrations) {
    innerHtml += `<div class="configItem"><div>${intergration.friendly_name}</div><div>${intergration.id}</div><div>${intergration.plugin}</div><div>${intergration.type}</div><div>${intergration.data}</div></div>`;
  }
  document.getElementById("intergrations").innerHTML = innerHtml;
}

function displaySettings(settings) {
  let innerHtml = "<h3>Configuration Settings</h3>";
  innerHtml += `<div class="configItem"><div>Auto brightness <input type="checkbox" id="settings.autobrightness" name="autobrightness"></div></div>`;
  innerHtml += `<div class="configItem"><div>Bluetooth area <input type="checkbox" id="settings.bluetootharea" name="bluetootharea"></div></div>`;
  innerHtml += '<div class="configItem"><div>Language <select id="settings.language" name="language">';
  innerHtml += '<option value="en_US">en_US</option>';
  innerHtml += '<option value="nl_NL">nl_NL</option>';
  innerHtml += '<option value="de_DE">de_DE</option>';
  innerHtml += '<option value="jp_JS">jp_JS</option>';
  innerHtml += "</select></div></div>";
  innerHtml += '<div class="configItem"><div>Proximity <input type="number" id="settings.proximity" name="proximity"min="10" max="250"></div></div>';
  innerHtml += '<div class="configItem"><div>Shutdowntime <input type="number" id="settings.shutdowntime" name="shutdowntime"min="0" max="36000"></div></div>';
  innerHtml += '<div class="configItem"><div>Software Updates <input type="checkbox" id="settings.softwareupdate" name="softwareupdate"></div></div>';
  innerHtml += '<div class="configItem"><div>WiFi time <input type="number" id="settings.wifitime" name="wifitime"min="0" max="36000"></div></div>';
  document.getElementById("settings").innerHTML = innerHtml;
  document.getElementById("settings.autobrightness").checked = settings.autobrightness;
  document.getElementById("settings.bluetootharea").checked = settings.bluetootharea;
  document.getElementById("settings.language").value = settings.language;
  document.getElementById("settings.proximity").value = settings.proximity;
  document.getElementById("settings.shutdowntime").value = settings.shutdowntime;
  document.getElementById("settings.softwareupdate").checked = settings.softwareupdate;
  document.getElementById("settings.wifitime").value = settings.wifitime;
}

wsConnect("ws://10.2.1.217:946");
