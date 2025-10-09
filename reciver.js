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
      pvGeneration = "..."; //getValueById(data, "sensor.solaredge_potenza_totale_dc"); console.log("pvGeneration: " + pvGeneration);
      gridSensor = "...";
      homeConsumption = "...";
      batteryPVchargeDischarge = "...";
      batteryPVpercentage = "...";
      boilerPower = "...";
      // car
      carBatteryPercentge = "...";
      carPlugState = "...";
      wallboxChargePower = "...";
      lastUpdatePSA = "...";
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
      //console.log("wallboxChargePower: " + wallboxChargePower);

      showPageAfterData();
      // SET VALUE IN HTML //
      setRoundValue("fv-value", roundValue(pvGeneration));
      setRoundValue("grid-value", roundValue(gridSensor));
      setRoundValue("grid-value-alert", roundValue(gridSensor));
      setRoundValue("house-value", roundValue(homeConsumption));
      setRoundValue("battery-power-value", roundValue(batteryPVchargeDischarge));
      setBatteryValueSize("battery-percentage-value", batteryPVpercentage);

      //house
      houseValuePowerDiv.textContent = roundValue(homeConsumption) + " kw";
      //car
      carValuePercentageDiv.textContent = ifNotUnavailable(carBatteryPercentge + "%");
      carValuePercentageDivInModal.textContent = ifNotUnavailable(carBatteryPercentge + "%");
      carValuePercentageDivInModal.textContent = ifNotUnavailable(carBatteryPercentge + "%");
      carValueLastUpdate.textContent = ifNotUnavailable(lastUpdatePSA);
      carValuePowerDiv.textContent = ifNotUnavailable(wallboxChargePower + " kw");
      wallboxPlugStateDiv.textContent = ifNotUnavailable(wallboxPlugState);
      if (wallboxPlugState === "Scollegata") {
         wallboxPlugStateDiv.style.color = "red"; // Testo in rosso
      } else {
         wallboxPlugStateDiv.style.color = "green"; // Testo in verde
      }

      //boiler
      boilerValuePowerDiv.textContent = boilerPower + " kw";


      updateEnergyBar(roundValue(pvGeneration));
      ChangeCarIcon(carPlugState, wallboxChargePower);
      boilerIcon(boilerPower);
      updateArrowVisibility(roundValue(pvGeneration), roundValue(gridSensor), roundValue(homeConsumption), roundValue(batteryPVchargeDischarge));
      updateBatteryLevel(batteryPVpercentage);
      updateWeatherImage(roundValue(pvGeneration));
      checkForEnergyAlert(roundValue(gridSensor), wallboxChargePower.value);
      // console.log("solar_panel_to_grid: ", solar_panel_to_grid);
      // console.log(solar_panel_to_house);
      // console.log(solar_panel_to_battery);
      // console.log("solar_grid_to_house: ", solar_grid_to_house);
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
   if (value == "NaN" || value == "Undefined" || value == "undefined" || value == "Unavailable" || value == "unavailable" || value == 999) {
      element.textContent = "...";
      console.log("elemento destinato a " + idHtml + " non trovato");
      return;
   } else if (value == "...") {
      element.textContent = "...";
      return;
   } else {
      let numericValue;
      try {
         numericValue = parseFloat(value);
      } catch (e) {
         console.log("errore nel parsefloat: " + value);
         return;
      }
      const roundedValue = Math.round(numericValue * 10) / 10;
      element.textContent = roundedValue;
   }
}

function roundValue(value) {
   //console.log("value dentro roundValue: " + value);
   // if (value == "..." || value == "NaN" || value == "Undefined" || value == "undefined" || value == "Unavailable" || value == "unavailable" || isNaN(value)) {
   //    //console.log("errore letura valore durante il roundValue(): " + value);
   //    //console.log("OFFLINE");
   //    return "...";
   // }
   if (ifNotUnavailable(value) == "non disponible")
      return "non disponible";
   let numericValue;
   try {
      numericValue = parseFloat(value);
   } catch (e) {
      console.log("errore nel parsefloat: " + value);
      return;
   }
   return Math.round(numericValue * 10) / 10;
}

function setBatteryValueSize(idHtml, value) {
   const element = document.getElementById(idHtml);
   const block = document.getElementById('battery-level-percentage-value');
   if (block == 100) {
      block.style.display = 'none';
   } else {
      block.style.display = 'block';
   }
   element.textContent = value;
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
      return "non disponibile";
   else
      return str;
}