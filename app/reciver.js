const socket = io();

// PAIR [value, valid]
// value: valore ottenuto dal server
// valid: 0 se il valore è valido, 1 se è invalido
let pvGeneration = [0, 0];
let gridSensor = [0, 0];
let homeConsumption = [0, 0];
let batteryPVchargeDischarge = [0, 0];
let batteryPVpercentage = [0, 0];
let boilerPower = [0, 0];
// car
let carBatteryPercentge = [0, 0];
let carPlugState = [0, 0];
let wallboxChargePower = [0, 0];
let wallboxPlugState = [0, 0];
let lastUpdatePSA = [0, 0];

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
      pvGeneration = ["sconosciuto", 0]; //getValueById(data, "sensor.solaredge_potenza_totale_dc"); console.log("pvGeneration: " + pvGeneration);
      gridSensor = ["sconosciuto", 0];
      homeConsumption = ["sconosciuto", 0];
      batteryPVchargeDischarge = ["sconosciuto", 0];
      batteryPVpercentage = ["sconosciuto", 0];
      boilerPower = ["sconosciuto", 0];
      // car
      carBatteryPercentge = ["sconosciuto", 0];
      carPlugState = ["sconosciuto", 0];
      wallboxChargePower = ["sconosciuto", 0];
      lastUpdatePSA = ["sconosciuto", 0];
      // APPARE ALERT CON SCRITTO "IMMPOSSIBILE COMUNICARE CON IL SERVER"
      showConnectionAPIAlert();
   } else {
      hideConnectionAPIAlert();
      // GET VALUE FROM DATA RESPONSE //
      // check function: controlla se il valore è valido.
      // Se è undefined, null, o una stringa "unavailable"/"unknown"/"nan" (case insensitive),
      // restituisce una coppia [valore, 1] (invalido). Altrimenti restituisce [valore, 0] (valido).
      const check = (val) => (val === undefined || val === null || /^(unavailable|unknown|nan|sconosciuto)$/i.test(val)) ? [val, 1] : [val, 0];

      pvGeneration = check(data['solaredge_potenza_totale_dc']);
      gridSensor = check(data['prism_sensore_rete']);
      homeConsumption = check(data['consumo_casa']);
      batteryPVchargeDischarge = check(data['lg_carica_scarica_istantanea_kw']);
      batteryPVpercentage = check(data['lg_percentuale_di_carica']);
      boilerPower = check(data['shelly_consumo_boiler']);
      // car
      carBatteryPercentge = check(data['car_corsa_energy_level']);
      carPlugState = check(data['prism_plug_state']);
      wallboxChargePower = check(data['prism_potenza_di_carica']);
      wallboxPlugState = check(data['prism_plug_state']);
      lastUpdatePSA = check(data['car_corsa_last_update']);

      showPageAfterData();

      // SET VALUE IN HTML //
      setRoundValue("fv-value", pvGeneration);
      setRoundValue("grid-value", gridSensor);
      setRoundValue("grid-value-alert", gridSensor);
      setRoundValue("house-value", homeConsumption);
      setRoundValue("battery-power-value", batteryPVchargeDischarge);
      setBatteryValueSize("battery-percentage-value", batteryPVpercentage);
      
      if (wallboxPlugState[0] === "Scollegata") {
         wallboxPlugStateDiv.style.color = "red"; // Testo in rosso
      } else {
         wallboxPlugStateDiv.style.color = "green"; // Testo in verde
      }

      //boiler
      if (boilerPower[1] === 0) {
         boilerValuePowerDiv.textContent = boilerPower[0] + " kw";
      } else {
         boilerValuePowerDiv.textContent = "sconosciuto";
      }

      // MODAL UPDATES
      if (homeConsumption[1] === 0) {
          houseValuePowerDiv.textContent = homeConsumption[0] + " kw";
      } else {
          houseValuePowerDiv.textContent = "sconosciuto";
      }

      if (wallboxPlugState[1] === 0) {
          wallboxPlugStateDiv.textContent = wallboxPlugState[0];
      } else {
          wallboxPlugStateDiv.textContent = "sconosciuto";
      }

      if (carBatteryPercentge[1] === 0) {
          carValuePercentageDivInModal.textContent = Math.floor(Number.parseFloat(carBatteryPercentge[0])) + "%";
      } else {
          carValuePercentageDivInModal.textContent = "sconosciuto";
      }
      
      if (lastUpdatePSA[1] === 0) {
         carValueLastUpdate.textContent = lastUpdatePSA[0];
      } else {
         carValueLastUpdate.textContent = "sconosciuto";
      }

      // CAR UPDATES (MAIN PAGE)
      if (wallboxChargePower[1] === 0) {
         carValuePowerDiv.textContent = wallboxChargePower[0] + " kw";
      } else {
         carValuePowerDiv.textContent = "";
      }

      if (carBatteryPercentge[1] === 0) {
         carValuePercentageDiv.textContent = Math.floor(Number.parseFloat(carBatteryPercentge[0])) + "%";
      } else {
         carValuePercentageDiv.textContent = "";
      }

      updateEnergyBar(pvGeneration);
      ChangeCarIcon(carPlugState, wallboxChargePower);
      boilerIcon(boilerPower);
      updateArrowVisibility(pvGeneration, gridSensor, homeConsumption, batteryPVchargeDischarge);
      updateBatteryLevel(batteryPVpercentage);
      updateWeatherImage(pvGeneration);
      checkForEnergyAlert(gridSensor, wallboxChargePower);
   }

});

function ChangeCarIcon(prismState, prismPower) {
   // console.log("prismState: " + prismState);
   // console.log("prismPower: " + prismPower);
   const carImage = document.getElementById('eletric-car-img');
   const carValuePowerDiv = document.getElementById("unit-car-power");

   const carBlock = document.getElementById('car-div');
   if (prismPower[1] === 0 && prismPower[0] > 0.2) {
      carBlock.style.visibility = 'visible';
   } else {
      carBlock.style.visibility = 'hidden';
   }
}



function boilerIcon(boilerPower) {
   const boilerImage = document.getElementById('boiler-img');
   if (boilerPower[1] === 0 && boilerPower[0] > 0.2) {
      boilerImage.style.visibility = 'visible';
   } else {
      boilerImage.style.visibility = 'hidden';
   }
}

function setRoundValue(idHtml, value) {
   const element = document.getElementById(idHtml);
   // NOT VALID VALUES TO SET: "sconosciuto"
   if (value[1] === 1) {
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
      // Usa value[0] perché value è un array [dato, validità]
      element.textContent = value[0];
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