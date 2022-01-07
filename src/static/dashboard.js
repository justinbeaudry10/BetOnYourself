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
  let profit = 0.0;
  let tableMarkup;

  data.bets
    .slice()
    .reverse()
    .forEach(function (b) {
      tableMarkup += `<tr>
    <td>${b.book}</td>
    <td>${b.league}</td>
    <td>${b.betEvent}</td>
    <td>${b.selection}</td>
    <td>${parseFloat(b.odds).toFixed(2)}</td>
    <td>${"$" + parseFloat(b.stake).toFixed(2)}</td>
    <td>${
      b.betStatus === "Won"
        ? "$" + parseFloat(b.stake * b.odds).toFixed(2)
        : "$0.00"
    }
    <td>${b.datePlaced.split("T")[0]}</td>
    <td>${b.betStatus}</td>
    </tr>`;

      if (b.betStatus === "Won") {
        profit += b.stake * b.odds - b.stake;
        won++;
      } else if (b.betStatus === "Lost") {
        profit -= b.stake;
        lost++;
      }
    });

  $("#bets-won").text(won);
  $("#bets-lost").text(lost);
  $("#win-percent").text(
    parseFloat((won / (won + lost)) * 100).toFixed(2) + "%"
  );
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

  // Hide add bet form
  $(".btn-cancel").click(function (e) {
    e.preventDefault();
    toggleBetForm();
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

    let newBet = {
      sportsbook: $("#sportsbook").val(),
      league: $("#league option:selected").text(),
      event: $("#event").val(),
      selection: $("#selection").val(),
      odds: odds,
      date: $("#date-placed").val(),
      risk: $("#risk").val(),
      result: $("#result option:selected").text(),
    };

    await AJAX("/addBet", newBet);

    location.reload();
  });
});

/*
window.addEventListener("DOMContentLoaded", (event) => {
  // Data

  const betsData = [];

  // Elements

  const btnAddBet = document.querySelector(".btn-add-bet");
  const btnConfirm = document.querySelector(".btn-confirm-bet");
  const btnCancel = document.querySelector(".btn-cancel");
  const addBetForm = document.querySelector(".add-bet");
  const sportsbook = document.querySelector("#sportsbook");
  const league = document.querySelector("#league");
  const sportEvent = document.querySelector("#event");
  const selection = document.querySelector("#selection");
  const oddsStyle = document.querySelector("#style");
  const odds = document.querySelector("#odds");
  const risk = document.querySelector("#risk");
  const recentBetsTable = document.querySelector("#datatablesSimple");
  let statusSelect = document.getElementsByClassName("status-select");

  // Functions

  function addNewBet(bet) {
    let markup = `
    <tr class="${bet.status}">
      <td>${bet.book}</td>
      <td>${bet.league}</td>
      <td>${bet.event}</td>
      <td>${bet.selection}</td>
      <td>${bet.odds}</td>
      <td>${bet.risk}</td>
      <td></td>
      <td></td>
      <td>
        <select class="status-select">
          <option value="unsettled">Unsettled</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="void">Void</option>
          <option value="cashedOut">Cashed Out</option>
        </select>
      </td>
    </tr>
    `;
    recentBetsTable.insertAdjacentHTML("afterbegin", markup);
    updateStatusArr();
  }

  // Event Listeners

  // Keeps an updated array of rows in the table and adds event listeners to all of them to check their status
  function updateStatusArr() {
    let statusArr = Array.from(statusSelect);

    statusArr.forEach((bet) => {
      bet.addEventListener("change", (e) => {
        e.target.parentElement.parentElement.className = e.target.value;
      });
    });
  }
  updateStatusArr(); // Populates array with initial values already in table

  btnAddBet.addEventListener("click", (e) => {
    addBetForm.classList.remove("d-none");
    btnAddBet.classList.add("d-none");
  });

  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    addBetForm.classList.add("d-none");
    btnAddBet.classList.remove("d-none");
  });

  btnConfirm.addEventListener("click", (e) => {
    e.preventDefault();
    let curBook = sportsbook.value;
    let curLeague = league.options[league.selectedIndex].value;
    let curEvent = sportEvent.value;
    let curSelection = selection.value;
    let curStyle = style.options[style.selectedIndex].value;
    let curOdds = odds.value;
    let curRisk = risk.value;
    const newBet = new Bet(
      curBook,
      curLeague,
      curEvent,
      curSelection,
      curStyle,
      curOdds,
      curRisk
    );
    addNewBet(newBet);
    addBetContainer.classList.add("d-none");
  });

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
});
*/
