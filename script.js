/////////// BATTERY //////////////////////////

function updateBatteryLevel(batteryPercentageValueDiv) {
    const batteryPercentage = parseFloat(batteryPercentageValueDiv);
    const batteryLevel = document.querySelector('.battery-level');
    const batteryText = document.querySelector('.battery-text');
    batteryLevel.style.height = batteryPercentage + '%';
    batteryText.textContent = batteryPercentage;
    if (batteryPercentage < 20) {
       batteryLevel.style.backgroundColor = 'red';
    } else if (batteryPercentage < 35) {
       batteryLevel.style.backgroundColor = 'yellow';
    } else {
       batteryLevel.style.backgroundColor = '#7CCC9A';
    }
 
    // if (batteryPercentage == 0) {
    //     const percentageValue = document.getElementById('battery-level-percentage-value');
    //     percentageValue.style.display = 'none';
    // }
 }
 
 
 /////// PRODUCTION BAR //////////////////////////
 function updateEnergyBar(pvGeneration) {
 
    const energy = parseFloat(pvGeneration);
    const energyBar = document.querySelector('.energy-bar');
    const energyFill = energyBar.querySelector('.energy-fill');
    const energyValue = energyBar.querySelector('.energy-value');
 
    energyBar.setAttribute('data-energy', energy);
    energyFill.style.width = `${(energy / 7.0) * 100}%`;
 
    energyFill.style.backgroundColor = energy >= 1 ? calculateColor(energy) : '#1f2937';
    energyValue.innerText = `${energy} kw`;
 }
 
 function calculateColor(energy) {
    const minColorDarkGray = [31, 41, 55]; // Grigio scuro
    const minColorDarkGreen = [80, 167, 83]; // Verde chiaro
    const minColorLightGreen = [144, 238, 144]; // Verde molto chiaro
    const minColorYellow = [255, 255, 0]; // Giallo
 
    let color;
    if (energy < 1) {
       color = minColorDarkGray;
    } else if (energy >= 1 && energy <= 2) {
       color = minColorDarkGreen;
    } else if (energy > 2 && energy <= 6.5) {
       color = minColorLightGreen;
    } else {
       color = minColorYellow;
    }
 
    return `rgb(${color.join()})`;
 }
 
 
 ////////////////////////// ARROWS //////////////////////////
 function updateArrowVisibility(fvValue, gridValue, houseValue, batteryValue) {

    const arrowFVtoHouse = document.getElementById('arrowFVtoHouse');
    const arrowFVtoBattery = document.getElementById('arrowFVtoBattery');
    const arrowBatteryToHouse = document.getElementById('arrowBatteryToHouse');
    const arrowGridToHouse = document.getElementById('arrowGridToHouse');
    const arrowFVtoGrid = document.getElementById('arrowFVtoGrid');
    const arrowBatteryToGrid = document.getElementById('arrowBatteryToGrid');
    const arrowGridtoBattery = document.getElementById('arrowGridtoBattery');
   
if (fvValue > 0 && gridValue > 0 && houseValue > 0 && batteryValue < 0) {
    arrowFVtoHouse.style.display = 'block';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'block';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue > 0 && houseValue === 0 && batteryValue > 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'block';
} else if (fvValue > 0 && gridValue === 0 && houseValue > 0 && batteryValue > 0) {
    arrowFVtoHouse.style.display = 'block';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'block';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue === 0 && houseValue > 0 && batteryValue === 0) {
    arrowFVtoHouse.style.display = 'block';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue === 0 && houseValue > 0 && batteryValue < 0) {
    arrowFVtoHouse.style.display = 'block';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'block';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue < 0 && houseValue > 0 && batteryValue > 0) {
    arrowFVtoHouse.style.display = 'block';
    arrowFVtoBattery.style.display = 'block';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'block';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue < 0 && houseValue > 0 && batteryValue === 0) {
    arrowFVtoHouse.style.display = 'block';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'block';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue < 0 && houseValue > 0 && batteryValue < 0) {
    arrowFVtoHouse.style.display = 'block';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'block';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'block';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue < 0 && houseValue === 0 && batteryValue > 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'block';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'block';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'block';
} else if (fvValue > 0 && gridValue < 0 && houseValue === 0 && batteryValue === 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'block';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue < 0 && houseValue === 0 && batteryValue < 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'block';
    arrowBatteryToGrid.style.display = 'block';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue === 0 && gridValue > 0 && houseValue > 0 && batteryValue > 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'block';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'block';
} else if (fvValue === 0 && gridValue > 0 && houseValue > 0 && batteryValue === 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'block';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue === 0 && gridValue > 0 && houseValue > 0 && batteryValue < 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'block';
    arrowGridToHouse.style.display = 'block';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue === 0 && gridValue > 0 && houseValue === 0 && batteryValue > 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'block';
} else if (fvValue === 0 && gridValue === 0 && houseValue > 0 && batteryValue < 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'block';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue === 0 && gridValue < 0 && houseValue > 0 && batteryValue > 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'block';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'block';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue === 0 && gridValue < 0 && houseValue > 0 && batteryValue < 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'block';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'block';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue === 0 && gridValue < 0 && houseValue === 0 && batteryValue < 0) {
    arrowFVtoHouse.style.display = 'none';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'none';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'block';
    arrowGridtoBattery.style.display = 'none';
} else if (fvValue > 0 && gridValue > 0 && houseValue > 0 && batteryValue > 0) {
    arrowFVtoHouse.style.display = 'block';
    arrowFVtoBattery.style.display = 'none';
    arrowBatteryToHouse.style.display = 'none';
    arrowGridToHouse.style.display = 'block';
    arrowFVtoGrid.style.display = 'none';
    arrowBatteryToGrid.style.display = 'none';
    arrowGridtoBattery.style.display = 'block';
//
// --- CASI IMPOSSIBILI ---
//

} else if (fvValue > 0 && gridValue > 0 && houseValue > 0 && batteryValue === 0) {
    console.log("2 Impossibile");
} else if (fvValue > 0 && gridValue > 0 && houseValue === 0 && batteryValue === 0) {
    console.log("3 Impossibile");
} else if (fvValue > 0 && gridValue > 0 && houseValue === 0 && batteryValue < 0) {
    console.log("4 Impossibile");
} else if (fvValue > 0 && gridValue === 0 && houseValue === 0 && batteryValue > 0) {
    console.log("5 Impossibile");
} else if (fvValue > 0 && gridValue === 0 && houseValue === 0 && batteryValue === 0) {
    console.log("6 Impossibile");
} else if (fvValue > 0 && gridValue === 0 && houseValue === 0 && batteryValue < 0) {
    console.log("7 Impossibile");
} else if (fvValue === 0 && gridValue > 0 && houseValue === 0 && batteryValue === 0) {
    console.log("8 Impossibile");
} else if (fvValue === 0 && gridValue > 0 && houseValue === 0 && batteryValue < 0) {
    console.log("9 Impossibile");
} else if (fvValue === 0 && gridValue === 0 && houseValue > 0 && batteryValue > 0) {
    console.log("10 Impossibile");
} else if (fvValue === 0 && gridValue === 0 && houseValue > 0 && batteryValue === 0) {
    console.log("11 Impossibile");
} else if (fvValue === 0 && gridValue === 0 && houseValue === 0 && batteryValue > 0) {
    console.log("12 Impossibile");
} else if (fvValue === 0 && gridValue === 0 && houseValue === 0 && batteryValue === 0) {
    console.log("13 Impossibile");
} else if (fvValue === 0 && gridValue === 0 && houseValue === 0 && batteryValue < 0) {
    console.log("14 Impossibile");
} else if (fvValue === 0 && gridValue < 0 && houseValue > 0 && batteryValue === 0) {
    console.log("15 Impossibile");
} else if (fvValue === 0 && gridValue < 0 && houseValue === 0 && batteryValue > 0) {
    console.log("16 Impossibile");
} else if (fvValue === 0 && gridValue < 0 && houseValue === 0 && batteryValue === 0) {
    console.log("17 Impossibile");
}else {
    console.log("Combinazione non gestita");
}



   if (gridValue > 0 || gridValue < 0) {
       showValueAndUnitByID("grid-value-and-unit");
   } else {
       hideValueAndUnitByID("grid-value-and-unit");
   }

   if (batteryValue > 0 || batteryValue < 0) {
       showValueAndUnitByID("battery-power-value-and-unit");
   } else {
       hideValueAndUnitByID("battery-power-value-and-unit");
   }

   //  if (houseValue > 0 || houseValue < 0) {
   //     showValueAndUnit("house-power-value", "unit-house-power");
   //     hideValueAndUnitByID("house-value-and-unit");
   //  } else {
   //     hideValueAndUnit("house-power-value", "unit-house-power");
   //     hideValueAndUnitByID("house-power-value-and-unit");
   // }
}

 ////////////////////////// change weather icon //////////////////////////
 
 // Function to update the weather image based on fv-value
 function updateWeatherImage(fvValueElement) {
    //console.log("fvValueElement: " + fvValueElement);
    const weatherImageElement = document.getElementById("weather-FVindicator-id");
    // Extract the numerical value from the fv-value element
    //const fvValueText = fvValueElement.innerText;
    //console.log("fvValueText: " + fvValueText);
    const fvValue = parseFloat(fvValueElement);
    //console.log("fvValue: " + fvValue);
    if (!isNaN(fvValue)) {
       if (fvValue >= 3.0) {
          weatherImageElement.src = "img/sun_icon.png";
       } else if (fvValue <= 0.01) {
          weatherImageElement.src = "img/moon_icon.png";
       } else {
          weatherImageElement.src = "img/cloud_icon.png";
       }
    } else {
       weatherImageElement.src = "";
    }
 
 }
 
 
 function hideNumberZoomPicures(idString) {
    let id = idString;
 }
 
 function isZeroValue(valueN) {
    if (valueN == 0 || isNaN(valueN)) {
       return true;
    } else
       return false;
 }
 
 function hideValueAndUnitByID(id) {
    document.getElementById(id).style.display = 'none';
 }
 
 function showValueAndUnitByID(id) {
    if (document.getElementById(id).style.display == "none") {
       document.getElementById(id).style.display = 'block';
    }
 }
 
 function changeSizeBattery() {
    document.getElementById("battery-graphic-container").style.height = '100%';
    document.getElementById('battery-graphic-container').style.top = "0%";
 }
 
 
 function checkForEnergyAlert(gridValue, prismPower) {
    var avviso = document.getElementById("gridLimitAlert");
 
    const audio = new Audio('sounds/alert-sound.mp3');
    if (prismPower > 0) {
       stopAlert(avviso, audio);
    } else {
       if (gridValue <= 4.51 || gridValue >= 15) {
          sessionStorage.removeItem('timestampForAlert');
          stopAlert(avviso, audio);
       } else {
          console.warn("superata soglia di 4.5kw");
          const storedTimestamp = sessionStorage.getItem('timestampForAlert');
          if (!storedTimestamp) {
             const currentTimestamp = new Date().getTime();
             sessionStorage.setItem('timestampForAlert', currentTimestamp);
             stopAlert(avviso, audio);
             return;
          } else {
             const currentTimestamp = new Date().getTime();
             const differenceInSeconds = (currentTimestamp - parseInt(storedTimestamp)) / 1000;
             if (differenceInSeconds >= 12) {
                console.warn("Sono passati più di 12 secondi!");
                displayAlert(avviso)
             } else {
                stopAlert(avviso, audio);
             }
          }
       }
    }
 }
 
 function displayAlert(signal) {
    signal.style.display = "block";
 
    var avviso = document.getElementById("bodyPageWithoutAlert");
    //avviso.style.filter = 'blur(5px)';
    playAlertSound();


 }
 
 function stopAlert(signal, sound) {
    signal.style.display = "none";
 
    var avviso = document.getElementById("bodyPageWithoutAlert");
    avviso.style.filter = 'none';
 
    sound.currentTime = 0;
    sound.pause();
 }
 
 function playAlertSound() {
    if (!audioAlarmPointer) {
       audioAlarmPointer = new Audio('sounds/alert-sound.mp3');
    }
 
    if (audioAlarmPointer.paused) {
       audioAlarmPointer.play();
    } else {
       audioAlarmPointer.pause();
       audioAlarmPointer.currentTime = 0;
    }
 }
 
 
 // Check nodeJs server state
 function checkServerStatus() {
    //console.log("controllo");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/server-status', true);
    xhr.onload = function () {
       if (xhr.status !== 200) {
          showErrorNodeJSAlert();
       } else {
          hideErrorNodeJSAlert();
       }
    };
    xhr.onerror = function () {
       showErrorNodeJSAlert();
    };
    xhr.send();
 }
 
 
 function showErrorNodeJSAlert() {
   //  var avviso = document.getElementById("bodyPageWithoutAlert");
   //  avviso.style.filter = 'blur(25px)';
 
   //  var avviso = document.getElementById("NodeJSAbsentConnectionAlert");
   var avviso = document.getElementById("red-dot-alert");
    avviso.style.display = "block";
 }
 
 // Funzione per ripristinare la pagina web e nascondere l'alert
 function hideErrorNodeJSAlert() {
   //  var avviso = document.getElementById("NodeJSAbsentConnectionAlert");
   //  avviso.style.display = "none";
 
   //  var avviso = document.getElementById("bodyPageWithoutAlert");
   //  avviso.style.filter = 'none';
   var avviso = document.getElementById("red-dot-alert");
   avviso.style.display = "none";
 }
 
 /////////////////        MODAL        ///////////////////////
 document.addEventListener("DOMContentLoaded", function () {
    //////// boiler-modal /////////////
    var boilerModal = document.getElementById("boiler-modal");
    var boilerImg = document.getElementById("boiler-img");
    var closeModalSpanBoiler = document.getElementsByClassName("close")[0];
 
    boilerImg.onclick = function () {
       boilerModal.style.display = "block";
    };
 
 
    //////// house-modal /////////////
    var houseModal = document.getElementById("house-modal");
    var houseImg = document.getElementById("house-img");
    var closeModalSpanHouse = document.getElementsByClassName("close")[1];
 
    houseImg.onclick = function () {
       houseModal.style.display = "block";
    };
 
    ////// CLOSE MODAL ////////
 
    // Function to close the modal by clicking on the “x”
    closeModalSpanBoiler.onclick = function () {
       boilerModal.style.display = "none";
    };
    closeModalSpanHouse.onclick = function () {
       houseModal.style.display = "none";
    };
    // Function to close the modal by clicking out of the modal
    window.onclick = function (event) {
       if (event.target == boilerModal) {
          boilerModal.style.display = "none";
       } else if (event.target == houseModal) {
          houseModal.style.display = "none";
       }
    };
 
 });
 
 
 ///////////////  MAIN  ////////////////////
 let audioAlarmPointer = null;
 setInterval(checkServerStatus, 3000);