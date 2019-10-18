const SUPPORTED_ENTITIES = ["blind", "light", "media_player"];
const DEBUG_HOST = "10.2.1.217";

const UI_ELEMENTS = {
  integrations: ["intergrations"],
  entities: ["entities"],
  areas: ["areas", "areasArea"],
  advanced: ["configFile"],
  settings: ["settings"],
  profiles: ["ui_config.profiles"],
  groups: ["ui_config.groups"],
  pages: ["ui_config.pages"]
};

let socket;

function wsConnect(url) {
  socket = new WebSocket(url);
  console.log(`Connecting to host: "${host}"`);

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
      getConfig();
    }
    if (messageObj.type && messageObj.type === "config") {
      parseConfigurationJson(messageObj.config);
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

function getConfig() {
  socket.send(`{"type":"getconfig"}`);
}

function setConfig() {
  try {
    let confJson = document.getElementById("configJsonTextBox").value;
    //Try parsing configuration. Fail on error
    let confObj = JSON.parse(confJson);
    socket.send(`{"type":"setconfig", "config":${confJson}}`);
    console.log("Config save requested");
  } catch (e) {
    alert(`Failed to save configuration with error: ${e.message}`);
    console.log(`Failed to save configuration with error: ${e.message}`);
  }
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
  if (confObj.integration) displayIntergrations(confObj.integrations);
  if (confObj.settings) displaySettings(confObj.settings, confObj.ui_config);
  if (confObj.ui_config.groups) displayUiConfigGroups(confObj.ui_config, confObj.entities);
  if (confObj.ui_config.pages) displayUiConfigPages(confObj.ui_config);
  if (confObj.ui_config.profiles) displayUiConfigProfiles(confObj.ui_config, confObj.entities);
}

function setActiveUI(element) {
  const keys = Object.keys(UI_ELEMENTS);
  for (let key of keys) {
    for (let elmnt of UI_ELEMENTS[key]) {
      if (key === element) {
        setVisibilityOfId(elmnt, true);
      } else {
        setVisibilityOfId(elmnt, false);
      }
    }
  }
}

function setVisibilityOfId(id, visibility) {
  let element = document.getElementById(id);
  if (visibility) {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
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
      innerHtml += `<div class="configItem"><div>${entity.area}</div><div>${entity.entity_id}</div><div>${entity.friendly_name}</div><div>${entity.integration}</div>`;
      for (let feature of entity.supported_features) {
        innerHtml += `<div>${feature}</div>`;
      }
      innerHtml += "</div>";
    }
  }
  document.getElementById("entities").innerHTML = innerHtml;
}

function displayIntergrations(intergrations) {
  let innerHtml = "<h3>Configuration Intergration</h3>";

  const keys = Object.keys(intergrations);

  for (let key of keys) {
    for (let intergration of intergrations[key]) {
      for (let endpoint of intergration) {
        innerHtml += `<div class="configItem"><div>${endpoint.friendly_name}</div><div>${endpoint.id}</div><div>${endpoint.plugin}</div><div>${endpoint.type}</div><div>${endpoint.data}</div></div>`;
      }
    }
  }

  document.getElementById("intergrations").innerHTML = innerHtml;
}

function displaySettings(settings, ui_config) {
  let innerHtml = "<h3>Configuration Settings</h3>";

  innerHtml += `<div class="configItem"><div>Dark mode <input type="checkbox" id="ui_config.darkmode" name="darkmode" ${isChecked(ui_config.darkmode)}></div></div>`;
  innerHtml += `<div class="configItem"><div>Auto brightness <input type="checkbox" id="settings.autobrightness" name="autobrightness" ${isChecked(settings.autobrightness)}></div></div>`;
  innerHtml += `<div class="configItem"><div>Bluetooth area <input type="checkbox" id="settings.bluetootharea" name="bluetootharea" ${isChecked(settings.bluetootharea)}></div></div>`;
  innerHtml += `<div class="configItem"><div>Software Updates <input type="checkbox" id="settings.softwareupdate" name="softwareupdate"></div></div>`;
  innerHtml += `<div class="configItem"><div>Language <select id="settings.language" name="language">`;
  innerHtml += `<option value="en_US">en_US</option>`;
  innerHtml += `<option value="nl_NL">nl_NL</option>`;
  innerHtml += `<option value="de_DE">de_DE</option>`;
  innerHtml += `<option value="jp_JS">jp_JS</option>`;
  innerHtml += `</select></div></div>`;
  innerHtml += `<div class="configItem"><div>Proximity <input type="number" id="settings.proximity" name="proximity"min="10" max="250"></div></div>`;
  innerHtml += `<div class="configItem"><div>Shutdowntime <input type="number" id="settings.shutdowntime" name="shutdowntime"min="0" max="36000"></div></div>`;
  innerHtml += `<div class="configItem"><div>WiFi time <input type="number" id="settings.wifitime" name="wifitime"min="0" max="36000"></div></div>`;

  document.getElementById("settings").innerHTML = innerHtml;
  document.getElementById("settings.language").value = settings.language;
  document.getElementById("settings.proximity").value = settings.proximity;
  document.getElementById("settings.shutdowntime").value = settings.shutdowntime;
  document.getElementById("settings.softwareupdate").checked = settings.softwareupdate;
  document.getElementById("settings.wifitime").value = settings.wifitime;
}

function displayUiConfigGroups(uiConfig, entities) {
  let innerHtml = "<h3>Configuration Groups</h3>";
  const keys = Object.keys(uiConfig.groups);

  for (let key of keys) {
    const group = uiConfig.groups[key];
    innerHtml += `<h4>Group: ${group.name}</h4>`;
    innerHtml += `<div class="configItem"><div>UUID: ${key}</div></div>`;
    innerHtml += `<div class="configItem"><div>switch <input type="checkbox" id="groups.${key}.switch" name="groups.${key}.switch" ${isChecked(group.switch)}></div></div>`;
    innerHtml += `<div class="configItem">Assigned entities:`;
    for (let entity of group.entities) {
      const ent = getEntityById(entities, entity);
      if (ent.friendly_name) {
        innerHtml += `<div class="configItem">Favorite: ${ent.friendly_name} at "${ent.area}"</div>`;
      } else {
        innerHtml += `<div class="configItemError"><b> No entity fount with UUID: "${entity}" !</b></div>`;
      }
    }
    innerHtml += `</div>`;
  }

  document.getElementById("ui_config.groups").innerHTML = innerHtml;
}

function isChecked(booli) {
  if (booli) {
    return "checked";
  } else {
    return "";
  }
}

function displayUiConfigPages(uiConfig) {
  let innerHtml = "<h3>Configuration Pages</h3>";
  const keys = Object.keys(uiConfig.pages);

  for (let key of keys) {
    const page = uiConfig.pages[key];
    innerHtml += `<h4>Page: ${page.name}</h4>`;
    innerHtml += `<div class="configItem"><div>UUID: ${key}</div></div>`;
    innerHtml += `<div class="configItem"><div>Image: ${page.image}</div></div>`;
    innerHtml += `<div class="configItem">Assigned groups:`;
    for (let group of page.groups) {
      const grp = uiConfig.groups[group];
      if (grp) {
        innerHtml += `<div class="configItem">Group: ${grp.name}</div>`;
      } else {
        innerHtml += `<div class="configItemError"><b> No group found with UUID: "${group}"</b></div>`;
      }
    }
    innerHtml += `</div>`;
  }
  document.getElementById("ui_config.pages").innerHTML = innerHtml;
}

function displayUiConfigProfiles(uiConfig, entities) {
  let innerHtml = "<h3>Configuration Profiles</h3>";
  const keys = Object.keys(uiConfig.profiles);

  for (let key of keys) {
    const profile = uiConfig.profiles[key];
    innerHtml += `<h4>Profile: ${profile.name}</h4>`;
    innerHtml += `<div class="configItem"><div>UUID: ${key}</div></div>`;

    innerHtml += `<div class="configItem">Assigned favorites:`;
    for (let favorite of profile.favorites) {
      const entity = getEntityById(entities, favorite);
      if (entity.friendly_name) {
        innerHtml += `<div class="configItem">Favorite: ${entity.friendly_name} at "${entity.area}"</div>`;
      } else {
        innerHtml += `<div class="configItemError"><b> No entity fount with UUID: "${favorite}" !</b></div>`;
      }
    }
    innerHtml += `</div>`;

    innerHtml += `<div class="configItem">Assigned pages:`;
    for (let page of profile.pages) {
      if (page === "favorites" || page === "settings") {
        innerHtml += `<div class="configItem"> ${page}</div>`;
      } else {
        const pag = uiConfig.pages[page];
        if (pag) {
          innerHtml += `<div class="configItem">Page: ${pag.name}</div>`;
        } else {
          innerHtml += `<div class="configItemError"><b> No page found with UUID: "${page}"</b></div>`;
        }
      }
    }
    innerHtml += `</div>`;
  }

  document.getElementById("ui_config.profiles").innerHTML = innerHtml;
}

function getEntityById(entities, key) {
  let returnEntity = {};
  for (let type of SUPPORTED_ENTITIES) {
    for (let entity of entities[type]) {
      if (entity.entity_id === key) returnEntity = entity;
    }
  }
  return returnEntity;
}

function downloadConfig() {
  let confJson = document.getElementById("configJsonTextBox").value;
  download("config.json", confJson);
}

function download(filename, text) {
  var pom = document.createElement("a");
  pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  pom.setAttribute("download", filename);

  if (document.createEvent) {
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    pom.dispatchEvent(event);
  } else {
    pom.click();
  }
}

/////////// Start /////////////////
setActiveUI("None");
let host = window.location.hostname;
if (host === "") {
  host = DEBUG_HOST;
  console.log(`::: Using debug host: "${host}" :::`);
}
wsConnect(`ws://${host}:946`);
