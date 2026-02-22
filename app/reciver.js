const socket = io();

let pvGeneration;
let gridSensor;
let homeConsumption;
let batteryPVchargeDischarge;
let batteryPVpercentage;
let boilerPower;
// car
let carBatteryPercentge;
let carPlugState;
let wallboxChargePower;
let wallboxPlugState;
let lastUpdatePSA;

// GET HTML DIV //
const houseValuePowerDiv = document.getElementById("unit-house-power");
const carValuePercentageDiv = document.getElementById("unit-car-percentage");
const carValuePercentageDivInModal = document.getElementById("car-percentage-div-in-modal");
const carValuePowerDiv = document.getElementById("unit-car-power");
const carValueLastUpdate = document.getElementById("car-last-update");
const wallboxPlugStateDiv = document.getElementById("prism-plug-state");
const boilerValuePowerDiv = document.getElementById("unit-boiler-power");
hidePageUnitlData();
// });
// socket.on riceve i dati aggiornati secondo le regole del server (ogni 2 secondi) 
socket.on('dati', (data) => {
   //console.log(data);
   //console.log("reciver_mode: ", data['reciver_mode']);
   if (hasError(data)) {
      pvGeneration = "sconosciuto"; //getValueById(data, "sensor.solaredge_potenza_totale_dc"); console.log("pvGeneration: " + pvGeneration);
      gridSensor = "sconosciuto";
      homeConsumption = "sconosciuto";
      batteryPVchargeDischarge = "sconosciuto";
      batteryPVpercentage = "sconosciuto";
      boilerPower = "sconosciuto";
      // car
      carBatteryPercentge = "sconosciuto";
      carPlugState = "sconosciuto";
      wallboxChargePower = "sconosciuto";
      lastUpdatePSA = "sconosciuto";
      // APPARE ALERT CON SCRITTO "IMMPOSSIBILE COMUNICARE CON IL SERVER"
      showConnectionAPIAlert();

   } else {
      hideConnectionAPIAlert();
      // GET VALUE FROM DATA RESPONSE //
      pvGeneration = data['solaredge_potenza_totale_dc'];
      gridSensor = data['prism_sensore_rete'];
      homeConsumption = data['consumo_casa'];
      batteryPVchargeDischarge = data['lg_carica_scarica_istantanea_kw'];
      batteryPVpercentage = data['lg_percentuale_di_carica'];
      boilerPower = data['shelly_consumo_boiler'];
      // car
      carBatteryPercentge = data['car_corsa_energy_level'];
      carPlugState = data['prism_plug_state'];
      wallboxChargePower = data['prism_potenza_di_carica'];
      wallboxPlugState = data['prism_plug_state'];
      lastUpdatePSA = data['car_corsa_last_update'];

      showPageAfterData();
      // SET VALUE IN HTML //
      setRoundValue("fv-value", roundValue(pvGeneration));
      setRoundValue("grid-value", roundValue(gridSensor));
      setRoundValue("grid-value-alert", roundValue(gridSensor));
      setRoundValue("house-value", roundValue(homeConsumption));
      setRoundValue("battery-power-value", roundValue(batteryPVchargeDischarge));
      setBatteryValueSize("battery-percentage-value", batteryPVpercentage);
      
      if (wallboxPlugState === "Scollegata") {
         wallboxPlugStateDiv.style.color = "red"; // Testo in rosso
      } else {
         wallboxPlugStateDiv.style.color = "green"; // Testo in verde
      }

   }

});

function ChangeCarIcon(prismState, prismPower) {
   // console.log("prismState: " + prismState);
   // console.log("prismPower: " + prismPower);
   const carImage = document.getElementById('eletric-car-img');
   const carValuePowerDiv = document.getElementById("unit-car-power");

   const carBlock = document.getElementById('car-div');
   if (prismPower > 0.2) {
      carBlock.style.visibility = 'visible';
   } else {
      carBlock.style.visibility = 'hidden';
   }
}

function boilerIcon(boilerPower) {
   const boilerImage = document.getElementById('boiler-img');
   if (boilerPower > 0.2) {
      boilerImage.style.visibility = 'visible';
   } else {
      boilerImage.style.visibility = 'hidden';
   }
}

function setRoundValue(idHtml, value) {
   const element = document.getElementById(idHtml);
   // NOT VALID VALUES TO SET: small text "sconosciuto" and not show unit
   if (value === "sconosciuto" || value === "non disponibile" || value >= 999) {
      element.textContent = "sconosciuto";
      element.classList.add("unknown-value");

      if (idHtml === "grid-value-alert") {
         const unitEl = document.getElementById("grid-alert-unit");
         if (unitEl) unitEl.style.display = "none";
      } else {
         let sibling = element.nextElementSibling;
         while (sibling) {
            if (sibling.classList.contains("unit-text")) {
               sibling.style.display = "none";
               break;
            }
            sibling = sibling.nextElementSibling;
         }
      }
      return;
   } 
   // VALID VALUE TO SET
   else {
      element.textContent = value; // Set only the value, unit is in a separate span
      element.classList.remove("unknown-value");
      if (idHtml === "grid-value-alert") {
         const unitEl = document.getElementById("grid-alert-unit");
         if (unitEl) unitEl.style.display = "inline";
      } else {
         let sibling = element.nextElementSibling;
         while (sibling) {
            if (sibling.classList.contains("unit-text")) {
               sibling.style.display = "inline";
               break;
            }
            sibling = sibling.nextElementSibling;
         }
      }
   }

}

function roundValue(value) {
   if (value === "sconosciuto" || value === "unavailable") return "sconosciuto";
   let numericValue;
   try {
      numericValue = Number.parseFloat(value);
   } catch (e) {
      console.log("errore nel parsefloat: " + value);
      return;
   }
   return Math.round(numericValue * 10) / 10;
}

function setBatteryValueSize(idHtml, value) {
   const element = document.getElementById(idHtml);
   const block = document.getElementById('battery-level-percentage-value');
   
   if (value === "sconosciuto" || value === "non disponibile") {
      element.textContent = "sconosciuto";
      element.classList.add("unknown-value");
      const unit = document.getElementById("unit-text");
      if (unit) unit.style.display = "none";
   } else {
      element.classList.remove("unknown-value");
      const unit = document.getElementById("unit-text");
      if (unit) unit.style.display = "inline";
      element.textContent = value;
   }

   if (block == 100) {
      block.style.display = 'none';
   } else {
      block.style.display = 'block';
   }
   // element.textContent = value; // Removed as set above
}

function hasError(json) {
   // Verifica se l'oggetto JSON contiene la chiave "error" e se il suo valore non è vuoto
   if (json.hasOwnProperty('error') && json.error !== null && json.error !== undefined && json.error !== '') {
      return true; // Restituisce true se la chiave "error" non è vuota
   } else {
      return false; // Restituisce false altrimenti
   }
}


function hidePageUnitlData() {
   var bodyPage = document.getElementById("bodyPageWithoutAlert");
   if (bodyPage.style.filter !== 'blur(25px)') {
      bodyPage.style.filter = 'blur(25px)';
   }
   bodyPage.style.filter = 'blur(25px)';

}
function showPageAfterData() {
   var bodyPage = document.getElementById("bodyPageWithoutAlert");
   bodyPage.style.filter = 'none';
}

function showConnectionAPIAlert() {
   var bodyPage = document.getElementById("bodyPageWithoutAlert");
   if (bodyPage.style.filter !== 'blur(25px)') {
      bodyPage.style.filter = 'blur(25px)';
   }

   var alert = document.getElementById("internetConnectionAlert");
   alert.style.display = "block";
   if (alert.style.display !== 'block') {
      alert.style.display = 'block';
   }
}

// Funzione per ripristinare la pagina web e nascondere l'alert
function hideConnectionAPIAlert() {
   var avviso = document.getElementById("internetConnectionAlert");
   avviso.style.display = "none";

   var bodyPage = document.getElementById("bodyPageWithoutAlert");
   bodyPage.style.filter = 'none';
}

function ifNotUnavailable(str) {
   // Regex per cercare "unavailable" indipendentemente dal formato
   const regex = /\bunavailable\b/i;
   // Testa la stringa con la regex
   if(regex.test(str))
      return "sconosciuto";
   else
      return str;
}