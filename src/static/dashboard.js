/*
 * Start Bootstrap - SB Admin v7.0.3 (https://startbootstrap.com/template/sb-admin)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
 */

// class Bet {
//   constructor(sb, lg, ev, sl, style, odd, risk, status = "Unsettled") {
//     this.book = sb;
//     this.league = lg;
//     this.event = ev;
//     this.selection = sl;
//     this.risk = risk;
//     this.status = status;

//     // Odds are stored in decimal format
//     switch (style) {
//       case "American":
//         let mult = +odd.slice(1, odd.length);
//         if (odd[0] === "+") {
//           this.odds = (mult / 100 + 1).toFixed(2);
//         } else if (odd[0] === "-") {
//           this.odds = (100 / mult + 1).toFixed(2);
//         }
//         break;
//       case "Decimal":
//         this.odds = (+odd).toFixed(2);
//         break;
//       case "Fractional":
//         let nums = odd.split("/");
//         this.odds = (+nums[0] / +nums[1] + 1).toFixed(2);
//         break;
//     }
//   }

//   setStatus(newStatus) {
//     this.status = newStatus;
//   }
// }

let xReq = new XMLHttpRequest();

xReq.onreadystatechange = function () {
  // If the xReq is finished and the status is OK, display the questions
  if (this.readyState == 4 && this.status == 200) {
    // Gets data from server
    let data = JSON.parse(this.responseText);

    $(document).ready(function () {
      console.log(data);
      $("#current-user").text(data.fullName);
    });
  }
};

// GET /questions asynchronously
xReq.open("GET", "/accountInfo", true);

// Send the xReq
xReq.send();

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
