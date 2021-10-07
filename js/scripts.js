/*
 * Start Bootstrap - SB Admin v7.0.3 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */

// Scripts

// Data

const betsData = [];

// Elements

const btnAddBet = document.querySelector(".btn-add-bet");
const btnConfirm = document.querySelector(".btn-confirm-bet");
const btnCancel = document.querySelector(".btn-cancel");
const addBetContainer = document.querySelector(".add-bet-container");
const addBetForm = document.querySelector(".add-bet");
const league = document.querySelector("#league");
const sportEvent = document.querySelector("#event");
const selection = document.querySelector("#selection");
const odds = document.querySelector("#odds");
const risk = document.querySelector("#risk");
const recentBetsTable = document.querySelector("#datatablesSimple");

// Functions

function addNewBet(lg, ev, sl, odd, risk) {
  let markup = `
  <tr>
    <td>${lg}</td>
    <td>${ev}</td>
    <td>${sl}</td>
    <td>${odd}</td>
    <td>${risk}</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  `;
  recentBetsTable.insertAdjacentHTML("afterbegin", markup);
}

// Event Listeners

btnAddBet.addEventListener("click", (e) => {
  addBetContainer.classList.remove("d-none");
});

btnCancel.addEventListener("click", (e) => {
  addBetContainer.classList.add("d-none");
});

btnConfirm.addEventListener("click", (e) => {
  let curLeague = league.options[league.selectedIndex].value;
  let curEvent = sportEvent.value;
  let curSelection = selection.value;
  let curOdds = odds.value;
  let curRisk = risk.value;
  addNewBet(curLeague, curEvent, curSelection, curOdds, curRisk);
  addBetContainer.classList.add("d-none");
  location.reload();
});

window.addEventListener("DOMContentLoaded", (event) => {
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
