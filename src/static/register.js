$(document).ready(function () {
  $("#create-account").click(function (e) {
    if ($("#password").val() !== $("#confirmPassword").val()) {
      e.preventDefault();
    }
  });
});
