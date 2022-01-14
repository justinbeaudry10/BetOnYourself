import { AJAX } from "./helpers.js";

$(document).ready(function () {
  $("#login").click(async function (e) {
    e.preventDefault();

    let loginInfo = {
      email: $("#email").val(),
      password: $("#password").val(),
    };

    let result = await AJAX("/login", loginInfo);
    result.correct === true
      ? (window.location.href = "dashboard.html")
      : $("#incorrect-msg").removeClass("d-none");
  });
});
