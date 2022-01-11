/*
 * Start Bootstrap - SB Admin v7.0.3 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */

import { AJAX } from "./helpers.js";

const data = await AJAX("/accountInfo");

function toggleBetForm() {
  $(".btn-add-bet").toggleClass("d-none");
  $(".add-bet").toggleClass("d-none");
}

function toggleParlayForm() {
  $(".btn-add-parlay").toggleClass("d-none");
  $(".add-parlay").toggleClass("d-none");
}

$(document).ready(function () {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }

  $("#current-user").text(data.fullName);

  let won = 0;
  let lost = 0;
  let cashedOut = 0;
  let profit = 0.0;
  let tableMarkup;
  let curLegs = 1;

  data.bets
    .slice()
    .reverse()
    .forEach(function (b) {
      let curBet = b.betNo;
      let leagues = "";
      let events = "";
      let selections = "";

      data.legs.forEach(function (l) {
        if (l.betNo === curBet) {
          leagues += l.league + "<br/>";
          events += l.betEvent + "<br/>";
          selections += l.selection + "<br/>";
        }
      });

      tableMarkup += `<tr>
    <td>${b.book}</td>
    <td>${leagues}</td>
    <td>${events}</td>
    <td>${selections}</td>
    <td>${parseFloat(b.odds).toFixed(2)}</td>
    <td>${"$" + parseFloat(b.stake).toFixed(2)}</td>
    <td>${"$" + parseFloat(b.returnAmt).toFixed(2)}
    <td>${b.datePlaced.split("T")[0]}</td>
    <td>${b.betStatus}</td>
    </tr>`;

      if (b.betStatus === "Won") {
        profit += b.returnAmt - b.stake;
        won++;
      } else if (b.betStatus === "Lost") {
        profit -= b.stake;
        lost++;
      } else if (b.betStatus === "Cashed Out") {
        profit += b.returnAmt - b.stake;
        cashedOut++;
      }
    });

  let percent = parseFloat((won / (won + lost)) * 100).toFixed(2);

  $("#bets-won").text(won);
  $("#bets-lost").text(lost);
  $("#cashed-out").text(cashedOut);
  $("#win-percent").text(won + lost > 0 ? percent + "%" : "N/A");
  $("#profit").text("$" + parseFloat(profit).toFixed(2));
  $("#table-data").html(tableMarkup);

  const datatablesSimple = document.getElementById("datatablesSimple");
  if (datatablesSimple) {
    new simpleDatatables.DataTable(datatablesSimple);
  }

  // Show add bet form
  $(".btn-add-bet").click(function (e) {
    e.preventDefault();
    toggleBetForm();
  });

  // Show add parlay form
  $(".btn-add-parlay").click(function (e) {
    e.preventDefault();
    toggleParlayForm();
    curLegs = 1;
    $("#add-leg-container").append(`<div id="leg${curLegs}">
      <label>League</label>
      <select id="league${curLegs}" required>
          <option disabled selected value>---</option>
          <option value="MLB">MLB</option>
          <option value="NBA">NBA</option>
          <option value="NFL">NFL</option>
          <option value="NHL">NHL</option>
          <option value="MLS">MLS</option>
          <option value="UFC">UFC</option>
          <option value="Other">Other</option>
      </select>
      <label>Event</label>
      <input type="text" id="event${curLegs}" placeholder="GS @ TOR" required>
      <label>Selection</label>
      <input value="" type="text" id="selection${curLegs}" placeholder="Raptors +3.5" required>
    </div>`);
  });

  $("#result").change(function () {
    if ($(this).val() === "cashed-out") {
      $(".cashed-out-input").removeClass("d-none");
    } else {
      $(".cashed-out-input").addClass("d-none");
    }
  });

  // Hide add bet form
  $(".btn-cancel").click(function (e) {
    e.preventDefault();
    toggleBetForm();
  });

  // Hide add parlay form
  $(".btn-cancel-parlay").click(function (e) {
    e.preventDefault();
    toggleParlayForm();
    curLegs = 1;
    $("#add-leg-container").html("");
  });

  // Add bet
  $(".btn-confirm-bet").click(async function (e) {
    e.preventDefault();
    let odds = $("#odds").val();

    // Converts odds to decimal style
    switch ($("#style option:selected").val()) {
      case "American":
        let mult = +odds.slice(1, odds.length);
        if (odds[0] === "+") {
          odds = (mult / 100 + 1).toFixed(3);
        } else if (odds[0] === "-") {
          odds = (100 / mult + 1).toFixed(3);
        }
        break;
      case "Decimal":
        odds = (+odds).toFixed(3);
        break;
      case "Fractional":
        let nums = odds.split("/");
        odds = (+nums[0] / +nums[1] + 1).toFixed(3);
        break;
    }

    let returnAmt;

    switch ($("#result option:selected").val()) {
      case "won":
        returnAmt = $("#stake").val() * odds;
        break;
      case "lost":
        returnAmt = 0.0;
        break;
      case "cashed-out":
        returnAmt = $("#cash-out-amt").val();
        break;
    }

    let newBet = {
      sportsbook: $("#sportsbook").val(),
      league: $("#league option:selected").text(),
      event: $("#event").val(),
      selection: $("#selection").val(),
      odds: odds,
      date: $("#date-placed").val(),
      stake: $("#stake").val(),
      returnAmt: returnAmt,
      result: $("#result option:selected").text(),
    };

    await AJAX("/addBet", newBet);

    location.reload();
  });

  $(".btn-confirm-parlay").click(async function (e) {
    e.preventDefault();
    let odds = $("#parlay-odds").val();

    // Converts odds to decimal style
    switch ($("#parlay-style option:selected").val()) {
      case "American":
        let mult = +odds.slice(1, odds.length);
        if (odds[0] === "+") {
          odds = (mult / 100 + 1).toFixed(3);
        } else if (odds[0] === "-") {
          odds = (100 / mult + 1).toFixed(3);
        }
        break;
      case "Decimal":
        odds = (+odds).toFixed(3);
        break;
      case "Fractional":
        let nums = odds.split("/");
        odds = (+nums[0] / +nums[1] + 1).toFixed(3);
        break;
    }

    let returnAmt;

    switch ($("#parlay-result option:selected").val()) {
      case "won":
        returnAmt = $("#parlay-stake").val() * odds;
        break;
      case "lost":
        returnAmt = 0.0;
        break;
      case "cashed-out":
        returnAmt = $("#parlay-cash-out-amt").val();
        break;
    }

    let leagues = [];
    let events = [];
    let selections = [];

    for (let l = 1; l <= curLegs; l++) {
      leagues.push($(`#league${l} option:selected`).text());
      events.push($(`#event${l}`).val());
      selections.push($(`#selection${l}`).val());
    }

    let newBet = {
      sportsbook: $("#parlay-sportsbook").val(),
      league: leagues.join("<br/>"),
      event: events.join("<br/>"),
      selection: "<b>Parlay</b><br/>" + selections.join("<br/>"),
      odds: odds,
      date: $("#parlay-date-placed").val(),
      stake: $("#parlay-stake").val(),
      returnAmt: returnAmt,
      result: $("#parlay-result option:selected").text(),
    };

    await AJAX("/addBet", newBet);

    location.reload();
  });

  $(".add-leg-btn").click(function (e) {
    e.preventDefault();

    curLegs++;
    let legInput = `<div id="leg${curLegs}">
      <label>League</label>
      <select id="league${curLegs}" required>
          <option disabled selected value>---</option>
          <option value="MLB">MLB</option>
          <option value="NBA">NBA</option>
          <option value="NFL">NFL</option>
          <option value="NHL">NHL</option>
          <option value="MLS">MLS</option>
          <option value="UFC">UFC</option>
          <option value="Other">Other</option>
      </select>
      <label>Event</label>
      <input type="text" id="event${curLegs}" placeholder="GS @ TOR" required>
      <label>Selection</label>
      <input value="" type="text" id="selection${curLegs}" placeholder="Raptors +3.5" required>
    </div>`;

    $("#add-leg-container").append(legInput);
  });

  $(".rem-leg-btn").click(function (e) {
    e.preventDefault();

    if (curLegs > 1) {
      $(`#leg${curLegs}`).remove();
      curLegs--;
    }
  });
});
