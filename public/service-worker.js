self.addEventListener("push", function () {
  // const data = event.data.json();
  self.registration.showNotification("got push event", {
    body: "Here is the body",
  });
});
