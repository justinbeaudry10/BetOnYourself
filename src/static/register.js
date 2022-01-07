import { AJAX } from "./helpers.js";

$(document).ready(function () {
  $("#create-account").click(async function (e) {
    e.preventDefault();

    if ($("#password").val() !== $("#confirmPassword").val()) {
      $("#incorrect-msg").removeClass("d-none");
    } else {
      let accInfo = {
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        email: $("#email").val(),
        password: $("#password").val(),
      };

      let result = await AJAX("/signup", accInfo);

      result.success === true
        ? (window.location.href = "login.html")
        : $("#duplicate-email").removeClass("d-none");
    }
  });
});
